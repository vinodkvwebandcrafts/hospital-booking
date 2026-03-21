import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
      <p className="mt-1 text-sm text-gray-500">
        Sign in to your account to continue
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
