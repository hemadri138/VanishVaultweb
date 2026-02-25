'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);

      if (!isFirebaseConfigured) {
        throw new Error('Firebase config is missing. Add NEXT_PUBLIC_* values to .env.local.');
      }

      await sendPasswordResetEmail(auth, email.trim());
      toast.success('Password reset email sent. Check your inbox.');
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) {
        toast.error(error.code.replace('auth/', '').replaceAll('-', ' '));
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Unable to send reset email.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h1 className="mb-2 text-xl font-semibold">Forgot password</h1>
      <p className="mb-5 text-sm text-fg/70">Enter your account email to receive a password reset link.</p>
      <div className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        />
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary py-2 font-medium text-white">
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-fg/70">
        Remembered it?{' '}
        <Link href="/login" className="text-primary">
          Back to login
        </Link>
      </p>
    </form>
  );
}
