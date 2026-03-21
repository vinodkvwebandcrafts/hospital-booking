import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

const prescriptionSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  notes: z.string().optional(),
  medications: z
    .array(
      z.object({
        medication: z.string().min(1, 'Medication name is required'),
        dosage: z.string().min(1, 'Dosage is required'),
        frequency: z.string().min(1, 'Frequency is required'),
        duration: z.string().min(1, 'Duration is required'),
        notes: z.string().optional(),
      }),
    )
    .min(1, 'At least one medication is required'),
});

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

const frequencyOptions = [
  { value: 'Once daily', label: 'Once daily' },
  { value: 'Twice daily', label: 'Twice daily' },
  { value: 'Three times daily', label: 'Three times daily' },
  { value: 'Four times daily', label: 'Four times daily' },
  { value: 'Every 8 hours', label: 'Every 8 hours' },
  { value: 'Every 12 hours', label: 'Every 12 hours' },
  { value: 'As needed', label: 'As needed' },
  { value: 'Before meals', label: 'Before meals' },
  { value: 'After meals', label: 'After meals' },
];

const durationOptions = [
  { value: '3 days', label: '3 days' },
  { value: '5 days', label: '5 days' },
  { value: '7 days', label: '7 days' },
  { value: '10 days', label: '10 days' },
  { value: '14 days', label: '14 days' },
  { value: '21 days', label: '21 days' },
  { value: '30 days', label: '30 days' },
  { value: '60 days', label: '60 days' },
  { value: '90 days', label: '90 days' },
  { value: 'Ongoing', label: 'Ongoing' },
];

interface PrescriptionFormProps {
  patients: { value: string; label: string }[];
  onSubmit: (data: PrescriptionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PrescriptionForm({
  patients,
  onSubmit,
  onCancel,
  isLoading,
}: PrescriptionFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medications: [{ medication: '', dosage: '', frequency: '', duration: '', notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Patient</label>
          <Select
            {...register('patientId')}
            options={patients}
            placeholder="Select patient"
          />
          {errors.patientId && (
            <p className="mt-1 text-xs text-red-600">{errors.patientId.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Diagnosis</label>
          <Input {...register('diagnosis')} placeholder="Enter diagnosis" />
          {errors.diagnosis && (
            <p className="mt-1 text-xs text-red-600">{errors.diagnosis.message}</p>
          )}
        </div>
      </div>

      {/* Medications */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">Medications</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ medication: '', dosage: '', frequency: '', duration: '', notes: '' })
            }
          >
            <Plus className="mr-1 h-4 w-4" /> Add Medication
          </Button>
        </div>
        {errors.medications?.root && (
          <p className="mb-2 text-xs text-red-600">{errors.medications.root.message}</p>
        )}
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Medication {index + 1}
                </span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Input
                    {...register(`medications.${index}.medication`)}
                    placeholder="Medication name"
                  />
                  {errors.medications?.[index]?.medication && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.medications[index]?.medication?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...register(`medications.${index}.dosage`)}
                    placeholder="e.g. 500mg"
                  />
                  {errors.medications?.[index]?.dosage && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.medications[index]?.dosage?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Select
                    {...register(`medications.${index}.frequency`)}
                    options={frequencyOptions}
                    placeholder="Frequency"
                  />
                  {errors.medications?.[index]?.frequency && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.medications[index]?.frequency?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Select
                    {...register(`medications.${index}.duration`)}
                    options={durationOptions}
                    placeholder="Duration"
                  />
                  {errors.medications?.[index]?.duration && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.medications[index]?.duration?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <Input
                  {...register(`medications.${index}.notes`)}
                  placeholder="Additional notes (optional)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Additional Notes
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Any additional instructions..."
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Prescription'}
        </Button>
      </div>
    </form>
  );
}
