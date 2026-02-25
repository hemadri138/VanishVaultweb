'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

type AuthFormProps = {
  mode: 'login' | 'signup';
  redirectTo?: string;
};

export function AuthForm({ mode, redirectTo = '/dashboard' }: AuthFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      if (!isFirebaseConfigured) {
        throw new Error('Firebase config is missing. Add NEXT_PUBLIC_* values to .env.local.');
      }
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      toast.success(mode === 'login' ? 'Welcome back' : 'Account created');
      router.push(redirectTo);
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) {
        toast.error(error.code.replace('auth/', '').replaceAll('-', ' '));
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h1 className="mb-5 text-xl font-semibold">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
      <div className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        />
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary py-2 font-medium text-white">
          {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Sign up'}
        </button>
      </div>
    </form>
  );
}
