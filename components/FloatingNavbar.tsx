'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Shield } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ThemeToggle';

export function FloatingNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  if (isAuthPage) return null;

  return (
    <header className="fixed inset-x-0 top-4 z-40 mx-auto w-[95%] max-w-6xl rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-soft backdrop-blur">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Shield size={18} className="text-primary" />
          VanishVault
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/" className="rounded-xl px-3 py-1.5 text-sm hover:bg-muted">
            Home
          </Link>
          <Link href="/dashboard" className="rounded-xl px-3 py-1.5 text-sm hover:bg-muted">
            Vault
          </Link>
          <Link href="/privacy-policy" className="rounded-xl px-3 py-1.5 text-sm hover:bg-muted">
            Privacy
          </Link>
          {!user ? (
            <Link href="/login" className="rounded-xl bg-primary px-4 py-1.5 text-sm font-medium text-white">
              Login
            </Link>
          ) : (
            <button
              onClick={() => signOut(auth)}
              className="rounded-xl p-2 text-fg transition hover:bg-muted"
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
