'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CloudUpload, EyeOff, ShieldCheck, TimerReset } from 'lucide-react';
import { Footer } from '@/components/Footer';

const features = [
  {
    icon: ShieldCheck,
    title: 'Private by Default',
    text: 'Every file is protected with expiry checks, access controls, and private storage paths.'
  },
  {
    icon: TimerReset,
    title: 'True Self-Destruct',
    text: 'Destroy media after first view or after 10 seconds to eliminate residual access.'
  },
  {
    icon: EyeOff,
    title: 'Secure Viewing',
    text: 'Watermarked, view-only rendering with blocked right-click and shortcut protections.'
  },
  {
    icon: CloudUpload,
    title: 'Fast Upload Flow',
    text: 'Drag and drop files, set privacy rules, and share a secure link instantly.'
  }
];

export default function HomePage() {
  return (
    <div className="pt-28">
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="mx-auto mb-3 w-fit rounded-full border border-border bg-card/80 px-4 py-1 text-xs uppercase tracking-[0.2em] text-fg/70">
            Secure Private Sharing
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            VanishVault keeps your media private and temporary.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-fg/70">
            Upload, restrict access, add expiry, and share content that disappears when it should.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/signup" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white">
              Start Free
            </Link>
            <Link href="/dashboard" className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm">
              Open Vault
            </Link>
          </div>
        </motion.div>
      </section>

      <section id="features" className="mx-auto grid max-w-6xl gap-4 px-4 pb-24 md:grid-cols-2">
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <feature.icon className="mb-3 text-primary" />
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-fg/70">{feature.text}</p>
          </motion.article>
        ))}
      </section>

      <Footer />
    </div>
  );
}
