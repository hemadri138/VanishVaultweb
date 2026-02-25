'use client';

import { motion } from 'framer-motion';

type SuccessModalProps = {
  open: boolean;
  link: string;
  onCopy: (link: string) => void;
  onClose: () => void;
};

export function SuccessModal({ open, link, onCopy, onClose }: SuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <h3 className="text-lg font-semibold">Share Link Generated</h3>
        <p className="mt-1 text-sm text-fg/70">This link respects your expiry and self-destruct settings.</p>
        <div className="mt-4 rounded-xl bg-muted p-3 text-xs break-all">{link}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => onCopy(link)}
            className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Copy Link
          </button>
          <button onClick={onClose} className="rounded-xl bg-primary px-4 py-2 text-sm text-white">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
