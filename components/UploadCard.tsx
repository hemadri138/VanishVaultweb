'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FileText, UploadCloud } from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { ExpirySelector } from '@/components/ExpirySelector';
import { inferFileType } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

type UploadCardProps = {
  onUploadComplete: (link: string) => void;
};

export function UploadCard({ onUploadComplete }: UploadCardProps) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [expiryValue, setExpiryValue] = useState<'10m' | '1h' | '24h' | 'custom'>('1h');
  const [customDateTime, setCustomDateTime] = useState('');
  const [resolvedDate, setResolvedDate] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [selfDestructAfterView, setSelfDestructAfterView] = useState(false);
  const [selfDestructAfter10Sec, setSelfDestructAfter10Sec] = useState(false);
  const [emailsText, setEmailsText] = useState('');
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      'image/*': [],
      'video/*': [],
      'application/pdf': []
    },
    onDrop: (files) => {
      if (!files[0]) return;
      setFile(files[0]);
    }
  });

  useEffect(() => {
    if (!file) return;

    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl(nextPreview);

    return () => URL.revokeObjectURL(nextPreview);
  }, [file]);

  const allowedEmails = useMemo(
    () =>
      emailsText
        .split(',')
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean),
    [emailsText]
  );

  const handleUpload = async () => {
    if (!file || !user) {
      toast.error('Select a file and ensure you are logged in.');
      return;
    }

    try {
      setUploading(true);
      const fileId = crypto.randomUUID();
      const path = `uploads/${user.uid}/${fileId}`;
      const storageRef = ref(storage, path);

      await uploadBytes(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          ownerId: user.uid
        }
      });

      await setDoc(doc(db, 'files', fileId), {
        id: fileId,
        ownerId: user.uid,
        fileUrl: path,
        fileName: file.name,
        fileType: inferFileType(file),
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(resolvedDate),
        allowedEmails,
        selfDestructAfterView,
        selfDestructAfter10Sec,
        views: 0
      });

      const link = `${window.location.origin}/view/${fileId}`;
      onUploadComplete(link);
      toast.success('File uploaded and secured.');
      setFile(null);
      setPreviewUrl(null);
      setEmailsText('');
      setSelfDestructAfter10Sec(false);
      setSelfDestructAfterView(false);
    } catch (error) {
      console.error(error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-5 shadow-soft">
      <h2 className="mb-4 text-lg font-semibold">Upload Media</h2>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border border-dashed p-6 text-center transition ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/30'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto mb-2 text-primary" />
        <p className="text-sm">Drag & drop image, video, or PDF here</p>
      </div>

      {file && (
        <div className="mt-4 rounded-xl bg-muted p-3 text-sm">
          <p className="font-medium">{file.name}</p>
          {previewUrl && file.type.startsWith('image/') && (
            <Image
              src={previewUrl}
              alt="Preview"
              width={640}
              height={240}
              unoptimized
              className="mt-3 h-auto max-h-[70vh] w-full rounded-lg object-contain bg-black/10"
            />
          )}
          {previewUrl && file.type.startsWith('video/') && (
            <video src={previewUrl} className="mt-3 h-auto max-h-[70vh] w-full rounded-lg object-contain bg-black/10" controls />
          )}
          {previewUrl && file.type === 'application/pdf' && (
            <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-fg/70">
                <FileText size={14} />
                PDF Preview
              </div>
              <object
                data={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                type="application/pdf"
                className="h-[60vh] w-full"
              >
                <div className="flex h-40 items-center justify-center text-sm text-fg/70">
                  PDF preview unavailable in this browser.
                </div>
              </object>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 space-y-4">
        <ExpirySelector
          value={expiryValue}
          customDateTime={customDateTime}
          onValueChange={setExpiryValue}
          onCustomChange={setCustomDateTime}
          onDateResolved={setResolvedDate}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">Restrict by email (comma separated)</label>
          <input
            type="text"
            placeholder="alice@mail.com,bob@mail.com"
            value={emailsText}
            onChange={(e) => setEmailsText(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selfDestructAfterView}
              onChange={(e) => setSelfDestructAfterView(e.target.checked)}
            />
            Self-destruct after first view
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selfDestructAfter10Sec}
              onChange={(e) => setSelfDestructAfter10Sec(e.target.checked)}
            />
            Self-destruct after 10 seconds
          </label>
        </div>

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {uploading ? 'Uploading...' : 'Upload & Generate Link'}
        </button>
      </div>
    </div>
  );
}
