'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validators';
import { toast } from 'sonner';
import { useState } from 'react';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      setSubmitted(true);
    } catch {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>

      <h2 className="text-2xl font-bold text-gray-900">Forgot your password?</h2>
      <p className="mt-1 text-sm text-gray-500">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <h3 className="font-semibold text-green-800">Check your email</h3>
          <p className="mt-2 text-sm text-green-600">
            If an account exists with that email, we&apos;ve sent password reset instructions.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-4">
              Return to login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send Reset Link
          </Button>
        </form>
      )}
    </div>
  );
}
