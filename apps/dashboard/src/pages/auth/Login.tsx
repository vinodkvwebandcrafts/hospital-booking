import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserRole } from '@hospital-booking/shared-types';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Activity, Lock, Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      const stored = localStorage.getItem('dashboard_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user.role === UserRole.ADMIN) {
          navigate('/admin/dashboard');
        } else if (user.role === UserRole.DOCTOR) {
          navigate('/doctor/dashboard');
        } else {
          toast.error('Access denied. Only admin and doctor accounts can access the dashboard.');
          localStorage.clear();
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 shadow-lg shadow-primary-600/30">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">MedBooking</h1>
          <p className="mt-1 text-sm text-slate-400">Admin & Doctor Dashboard</p>
        </div>

        <Card className="border-slate-700/50 bg-white/5 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-white">Sign in to your account</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="admin@hospital.com"
                    className="border-slate-600 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500 focus:border-primary-500"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...register('password')}
                    type="password"
                    placeholder="Enter your password"
                    className="border-slate-600 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500 focus:border-primary-500"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Role indicators */}
            <div className="mt-6 rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                Access Roles
              </p>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 rounded-md bg-blue-500/10 px-3 py-1.5">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <span className="text-xs font-medium text-blue-300">Admin</span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-1.5">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-xs font-medium text-green-300">Doctor</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
