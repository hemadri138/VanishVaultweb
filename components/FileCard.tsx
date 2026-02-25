'use client';

import { Copy, Trash2 } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { VaultFile } from '@/lib/types';

type FileCardProps = {
  file: VaultFile;
  onDelete: (file: VaultFile) => void;
  onCopy: (link: string) => void;
};

export function FileCard({ file, onDelete, onCopy }: FileCardProps) {
  const expired = file.expiresAt.getTime() <= Date.now();

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">{file.fileName}</h3>
          <p className="text-xs uppercase tracking-wide text-fg/60">{file.fileType}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onCopy(`${window.location.origin}/view/${file.id}`)}
            className="rounded-lg p-2 hover:bg-muted"
            aria-label="Copy link"
          >
            <Copy size={16} />
          </button>
          <button onClick={() => onDelete(file)} className="rounded-lg p-2 hover:bg-muted" aria-label="Delete file">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className={`rounded-lg px-2 py-1 ${expired ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
          {expired ? 'Expired' : `Expires ${formatDistanceToNowStrict(file.expiresAt, { addSuffix: true })}`}
        </span>
        <span className="rounded-lg bg-muted px-2 py-1 text-fg/70">Views: {file.views}</span>
      </div>
    </div>
  );
}
