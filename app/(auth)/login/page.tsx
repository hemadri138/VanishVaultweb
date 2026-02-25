import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';

export default function LoginPage({ searchParams }: { searchParams: { redirect?: string } }) {
  return (
    <div className="grid min-h-screen place-items-center px-4 pt-20">
      <div className="w-full max-w-md">
        <AuthForm mode="login" redirectTo={searchParams.redirect} />
        <p className="mt-3 text-center text-sm text-fg/70">
          No account? <Link href="/signup" className="text-primary">Create one</Link>
        </p>
      </div>
    </div>
  );
}
