'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User, Lock } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  profileSchema,
  changePasswordSchema,
  type ProfileFormData,
  type ChangePasswordFormData,
} from '@/lib/validators';
import { useAuthStore } from '@/hooks/use-auth';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
      dateOfBirth: user?.dateOfBirth ?? '',
      gender: user?.gender ?? '',
      address: user?.address ?? '',
      city: user?.city ?? '',
      country: user?.country ?? '',
      postalCode: user?.postalCode ?? '',
    },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const res = await api.patch('/users/me', data);
      return res.data.data;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(['currentUser'], data);
      toast.success('Profile updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update profile.');
    },
  });

  const updatePassword = useMutation({
    mutationFn: async (data: ChangePasswordFormData) => {
      await api.patch('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      passwordForm.reset();
      toast.success('Password changed successfully!');
    },
    onError: () => {
      toast.error('Failed to change password. Check your current password.');
    },
  });

  const genderOptions = [
    { value: '', label: 'Prefer not to say' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <PageHeader title="My Profile" description="Manage your personal information and account settings." />

      {/* Profile Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit((data) => updateProfile.mutate(data))}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                error={profileForm.formState.errors.firstName?.message}
                {...profileForm.register('firstName')}
              />
              <Input
                label="Last Name"
                error={profileForm.formState.errors.lastName?.message}
                {...profileForm.register('lastName')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Email"
                type="email"
                value={user?.email ?? ''}
                disabled
                className="bg-gray-50"
              />
              <Input
                label="Phone"
                error={profileForm.formState.errors.phone?.message}
                {...profileForm.register('phone')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Date of Birth"
                type="date"
                error={profileForm.formState.errors.dateOfBirth?.message}
                {...profileForm.register('dateOfBirth')}
              />
              <Select
                label="Gender"
                options={genderOptions}
                error={profileForm.formState.errors.gender?.message}
                {...profileForm.register('gender')}
              />
            </div>

            <Input
              label="Address"
              error={profileForm.formState.errors.address?.message}
              {...profileForm.register('address')}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="City"
                error={profileForm.formState.errors.city?.message}
                {...profileForm.register('city')}
              />
              <Input
                label="Country"
                error={profileForm.formState.errors.country?.message}
                {...profileForm.register('country')}
              />
              <Input
                label="Postal Code"
                error={profileForm.formState.errors.postalCode?.message}
                {...profileForm.register('postalCode')}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={updateProfile.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary-600" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit((data) => updatePassword.mutate(data))}
            className="space-y-4"
          >
            <Input
              label="Current Password"
              type="password"
              error={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register('currentPassword')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="New Password"
                type="password"
                error={passwordForm.formState.errors.newPassword?.message}
                {...passwordForm.register('newPassword')}
              />
              <Input
                label="Confirm New Password"
                type="password"
                error={passwordForm.formState.errors.confirmNewPassword?.message}
                {...passwordForm.register('confirmNewPassword')}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={updatePassword.isPending}>
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
