import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const doctorSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  licenseNumber: z.string().optional(),
  bio: z.string().optional(),
  consultationFee: z.coerce.number().min(0).optional(),
  appointmentDurationMinutes: z.coerce.number().min(10).max(120).optional(),
  clinicName: z.string().optional(),
  clinicAddress: z.string().optional(),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;

const specializations = [
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Dermatology', label: 'Dermatology' },
  { value: 'Endocrinology', label: 'Endocrinology' },
  { value: 'Gastroenterology', label: 'Gastroenterology' },
  { value: 'General Practice', label: 'General Practice' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Oncology', label: 'Oncology' },
  { value: 'Ophthalmology', label: 'Ophthalmology' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Psychiatry', label: 'Psychiatry' },
  { value: 'Pulmonology', label: 'Pulmonology' },
  { value: 'Urology', label: 'Urology' },
];

interface DoctorFormProps {
  defaultValues?: Partial<DoctorFormData>;
  onSubmit: (data: DoctorFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function DoctorForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: DoctorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      appointmentDurationMinutes: 30,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">First Name</label>
          <Input {...register('firstName')} placeholder="John" disabled={isEdit} />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Last Name</label>
          <Input {...register('lastName')} placeholder="Doe" disabled={isEdit} />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
          <Input {...register('email')} type="email" placeholder="john@hospital.com" disabled={isEdit} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
          <Input {...register('phone')} placeholder="+1 234 567 890" disabled={isEdit} />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Specialization</label>
        <Select
          {...register('specialization')}
          options={specializations}
          placeholder="Select specialization"
        />
        {errors.specialization && (
          <p className="mt-1 text-xs text-red-600">{errors.specialization.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">License Number</label>
          <Input {...register('licenseNumber')} placeholder="LIC-123456" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Consultation Fee ($)
          </label>
          <Input {...register('consultationFee')} type="number" placeholder="150" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Appointment Duration (min)
          </label>
          <Input {...register('appointmentDurationMinutes')} type="number" placeholder="30" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Clinic Name</label>
          <Input {...register('clinicName')} placeholder="City Hospital" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Clinic Address</label>
        <Input {...register('clinicAddress')} placeholder="123 Medical St, City" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          {...register('bio')}
          rows={3}
          placeholder="Brief bio about the doctor..."
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEdit ? 'Update Doctor' : 'Add Doctor'}
        </Button>
      </div>
    </form>
  );
}
