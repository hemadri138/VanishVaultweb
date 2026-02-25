import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { FloatingNavbar } from '@/components/FloatingNavbar';
import { PageTransition } from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'VanishVault',
  description: 'Private, expiring media sharing with enforced secure viewing.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <FloatingNavbar />
          <PageTransition>{children}</PageTransition>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'rounded-xl border border-border bg-card text-fg',
              style: { boxShadow: '0 10px 30px -12px rgba(15, 23, 42, 0.3)' }
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
