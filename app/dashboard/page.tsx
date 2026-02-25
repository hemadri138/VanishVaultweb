'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import toast from 'react-hot-toast';
import { UploadCard } from '@/components/UploadCard';
import { FileCard } from '@/components/FileCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { SuccessModal } from '@/components/SuccessModal';
import { useAuth } from '@/hooks/useAuth';
import { db, storage } from '@/lib/firebase';
import { VaultFile } from '@/lib/types';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [generatedLink, setGeneratedLink] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    if (!user) return;

    const q = query(collection(db, 'files'), where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(q, (snapshot) => {
      const nextFiles = snapshot.docs.map((item) => {
        const data = item.data();
        return {
          id: data.id,
          ownerId: data.ownerId,
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileType: data.fileType,
          createdAt: data.createdAt.toDate(),
          expiresAt: data.expiresAt.toDate(),
          allowedEmails: data.allowedEmails ?? [],
          selfDestructAfterView: Boolean(data.selfDestructAfterView),
          selfDestructAfter10Sec: Boolean(data.selfDestructAfter10Sec),
          views: data.views ?? 0
        } as VaultFile;
      });

      setFiles(nextFiles);
      setDataLoading(false);
    });

    return () => unsub();
  }, [loading, router, user]);

  const activeCount = useMemo(() => files.filter((file) => file.expiresAt.getTime() > Date.now()).length, [files]);

  const handleDelete = async (file: VaultFile) => {
    try {
      await deleteObject(ref(storage, file.fileUrl));
    } catch (error) {
      console.error('Storage delete warning', error);
    }

    await deleteDoc(doc(db, 'files', file.id));
    toast.success('File deleted.');
  };

  const copyLink = async (link: string) => {
    await navigator.clipboard.writeText(link);
    toast.success('Link copied.');
  };

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-28">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28">
      <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-fg/70">{activeCount} active file(s), {files.length} total uploads.</p>
      </div>

      <UploadCard
        onUploadComplete={(link) => {
          setGeneratedLink(link);
          setModalOpen(true);
        }}
      />

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {dataLoading && [1, 2].map((value) => <LoadingSkeleton key={value} />)}
        {!dataLoading && files.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-fg/70">No uploads yet.</div>
        )}
        {files.map((file) => (
          <FileCard key={file.id} file={file} onDelete={handleDelete} onCopy={copyLink} />
        ))}
      </section>

      <SuccessModal
        open={modalOpen}
        link={generatedLink}
        onCopy={copyLink}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
