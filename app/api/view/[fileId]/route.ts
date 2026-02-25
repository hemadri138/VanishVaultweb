import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAdminDb, getAdminStorage } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  context: { params: { fileId: string } }
) {
  const { fileId } = context.params;

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  let viewerEmail: string | null = null;
  let viewerUid: string | null = null;

  if (token) {
    try {
      const decoded = await getAuth().verifyIdToken(token);
      viewerEmail = decoded.email ?? null;
      viewerUid = decoded.uid;
    } catch {
      viewerEmail = null;
      viewerUid = null;
    }
  }

  const adminDb = getAdminDb();
  const adminStorage = getAdminStorage();
  const docRef = adminDb.collection('files').doc(fileId);
  const fileDoc = await docRef.get();

  if (!fileDoc.exists) {
    return NextResponse.json({ ok: false, reason: 'destroyed' }, { status: 404 });
  }

  const data = fileDoc.data();
  if (!data) {
    return NextResponse.json({ ok: false, reason: 'destroyed' }, { status: 404 });
  }

  const expiresAt = (data.expiresAt as Timestamp).toDate();
  if (expiresAt.getTime() <= Date.now()) {
    return NextResponse.json({ ok: false, reason: 'expired' }, { status: 403 });
  }

  const allowedEmails = (data.allowedEmails ?? []) as string[];
  const ownerId = data.ownerId as string;
  // Access is granted if the owner opens it, the link is public, or a restricted email matches.
  const canAccess =
    viewerUid === ownerId ||
    allowedEmails.length === 0 ||
    (viewerEmail !== null && allowedEmails.includes(viewerEmail.toLowerCase()));

  if (!canAccess) {
    return NextResponse.json({ ok: false, reason: 'restricted', needsAuth: true }, { status: 403 });
  }

  if (data.selfDestructAfterView && (data.views ?? 0) > 0) {
    return NextResponse.json({ ok: false, reason: 'destroyed' }, { status: 410 });
  }

  const viewerIdentity = viewerEmail?.toLowerCase() ?? 'public-link';
  // Views are incremented server-side to avoid trusting client-provided counters.
  await docRef.update({
    views: FieldValue.increment(1),
    viewedBy: FieldValue.arrayUnion(viewerIdentity)
  });

  const [signedUrl] = await adminStorage
    .bucket()
    .file(data.fileUrl as string)
    .getSignedUrl({
      action: 'read',
      expires: Date.now() + 2 * 60 * 1000,
      version: 'v4'
    });

  return NextResponse.json({
    ok: true,
    file: {
      id: data.id,
      fileType: data.fileType,
      signedUrl,
      selfDestructAfterView: Boolean(data.selfDestructAfterView),
      selfDestructAfter10Sec: Boolean(data.selfDestructAfter10Sec),
      views: (data.views ?? 0) + 1,
      expiresAt: expiresAt.toISOString()
    }
  });
}
