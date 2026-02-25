import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getAdminDb, getAdminStorage } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
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

  const body = await request.json();
  const fileId = body.fileId as string;

  if (!fileId) {
    return NextResponse.json({ ok: false, reason: 'missing-file-id' }, { status: 400 });
  }

  const adminDb = getAdminDb();
  const adminStorage = getAdminStorage();
  const docRef = adminDb.collection('files').doc(fileId);
  const fileDoc = await docRef.get();

  if (!fileDoc.exists) {
    return NextResponse.json({ ok: true });
  }

  const data = fileDoc.data();
  if (!data) {
    return NextResponse.json({ ok: true });
  }

  const allowedEmails = (data.allowedEmails ?? []) as string[];
  const ownerId = data.ownerId as string;

  // Deletion is only permitted for participants already authorized to view or owner actions.
  const canDestroy =
    viewerUid === ownerId ||
    data.selfDestructAfter10Sec ||
    data.selfDestructAfterView ||
    allowedEmails.length === 0 ||
    (viewerEmail !== null && allowedEmails.includes(viewerEmail.toLowerCase()));

  if (!canDestroy) {
    return NextResponse.json({ ok: false, reason: 'forbidden' }, { status: 403 });
  }

  await adminStorage.bucket().file(data.fileUrl as string).delete({ ignoreNotFound: true });
  await docRef.delete();

  return NextResponse.json({ ok: true });
}
