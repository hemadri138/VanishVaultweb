import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';

export default function SignupPage({ searchParams }: { searchParams: { redirect?: string } }) {
  return (
    <div className="grid min-h-screen place-items-center px-4 pt-20">
      <div className="w-full max-w-md">
        <AuthForm mode="signup" redirectTo={searchParams.redirect} />
        <p className="mt-3 text-center text-sm text-fg/70">
          Have an account? <Link href="/login" className="text-primary">Login</Link>
        </p>
      </div>
    </div>
  );
}
