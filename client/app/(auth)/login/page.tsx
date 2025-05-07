import { LoginForm } from '@/components/forms/login-form';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/90"
            >
              create a new account
            </Link>
          </p>
        </div>

        <LoginForm />

        <div className="text-center">
          <Link
            href="/forgot-password"
            className="font-medium text-primary hover:text-primary/90"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
} 