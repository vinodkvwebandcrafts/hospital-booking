'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerSchema, type RegisterFormData } from '@/lib/validators';
import { useRegister } from '@/hooks/use-auth';

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword: _, ...registerData } = data;
    const result = await registerMutation.mutateAsync(registerData);
    if (result) {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="John"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Last Name"
          placeholder="Doe"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 000-0000"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Minimum 8 characters"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </form>
  );
}
