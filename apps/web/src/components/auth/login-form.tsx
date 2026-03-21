'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { useLogin } from '@/hooks/use-auth';

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await loginMutation.mutateAsync(data);
    if (result) {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" className="rounded border-gray-300" />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Create one
        </Link>
      </p>
    </form>
  );
}
