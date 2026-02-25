'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { CountdownTimer } from '@/components/CountdownTimer';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { SecureViewer } from '@/components/SecureViewer';

type AccessResponse = {
  ok: boolean;
  reason?: string;
  needsAuth?: boolean;
  file?: {
    id: string;
    fileType: 'image' | 'video' | 'pdf';
    signedUrl: string;
    selfDestructAfterView: boolean;
    selfDestructAfter10Sec: boolean;
    requiresConsume: boolean;
    views: number;
    expiresAt: string;
  };
};

export default function ViewFilePage({ params }: { params: { fileId: string } }) {
  const { user, loading } = useAuth();
  const [data, setData] = useState<AccessResponse['file'] | null>(null);
  const [unlockedForView, setUnlockedForView] = useState(false);
  const [status, setStatus] = useState<'loading' | 'expired' | 'blocked' | 'destroyed' | 'ready'>('loading');

  const fetchAccess = useCallback(async (intent: 'preview' | 'consume' = 'preview') => {
    const token = user ? await user.getIdToken() : null;
    const response = await fetch(`/api/view/${params.fileId}?intent=${intent}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    const payload = (await response.json()) as AccessResponse;

    if (!payload.ok || !payload.file) {
      if (payload.reason === 'expired') setStatus('expired');
      else if (payload.reason === 'destroyed') setStatus('destroyed');
      else if (payload.needsAuth) setStatus('blocked');
      else setStatus('blocked');
      return;
    }

    setData(payload.file);
    setUnlockedForView(intent === 'consume' || !payload.file.requiresConsume);
    setStatus('ready');
  }, [params.fileId, user]);

  const destroyNow = useCallback(async () => {
    const token = user ? await user.getIdToken() : null;
    await fetch('/api/destroy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ fileId: params.fileId })
    });
    setStatus('destroyed');
  }, [params.fileId, user]);

  useEffect(() => {
    if (loading) return;
    fetchAccess().catch(() => {
      setStatus('blocked');
    });
  }, [fetchAccess, loading]);

  const viewerLabel = useMemo(() => user?.email ?? 'guest-viewer', [user?.email]);

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-28">
        <LoadingSkeleton />
      </div>
    );
  }

  if (status === 'blocked') {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Access Denied</h1>
          <p className="mt-2 text-fg/70">You are not allowed to access this file.</p>
          <Link href={`/login?redirect=/view/${params.fileId}`} className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-white">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8">
          <h1 className="text-2xl font-semibold text-rose-400">This file has expired</h1>
          <p className="mt-2 text-sm text-rose-300/80">The owner-configured expiry time has passed.</p>
        </div>
      </div>
    );
  }

  if (status === 'destroyed' || !data) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="text-2xl font-semibold">This file has been destroyed</h1>
          <p className="mt-2 text-fg/70">The self-destruct rule was triggered for this file.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="no-select px-4 pb-10 pt-28">
      <div className="mx-auto mb-4 flex max-w-5xl items-center justify-between">
        <h1 className="text-lg font-semibold">Secure Viewer</h1>
        {data.selfDestructAfter10Sec && unlockedForView && <CountdownTimer seconds={10} onComplete={destroyNow} />}
      </div>
      {data.selfDestructAfterView && data.requiresConsume && !unlockedForView ? (
        <div className="mx-auto max-w-3xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
          <h2 className="text-lg font-semibold text-amber-300">One-time secure view</h2>
          <p className="mt-2 text-sm text-amber-200/85">
            This file is set to self-destruct after first view. Click below to open it once.
          </p>
          <button
            type="button"
            onClick={() =>
              fetchAccess('consume').catch(() => {
                toast.error('Unable to open secure file.');
              })
            }
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            View Once
          </button>
        </div>
      ) : (
        <SecureViewer fileType={data.fileType} src={data.signedUrl} viewerLabel={viewerLabel} />
      )}
    </div>
  );
}
