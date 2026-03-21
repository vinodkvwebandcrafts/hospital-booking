import { useMemo, useState } from 'react';
import type { Doctor } from '@hospital-booking/shared-types';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { getDoctorColumns } from '@/components/tables/DoctorColumns';
import { DoctorForm, type DoctorFormData } from '@/components/forms/DoctorForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useDoctors, useDeleteDoctor } from '@/hooks/useDoctors';
import { toast } from 'sonner';
import { Plus, Search } from 'lucide-react';

const specialtyFilterOptions = [
  { value: '', label: 'All Specialties' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Dermatology', label: 'Dermatology' },
  { value: 'General Practice', label: 'General Practice' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'Pediatrics', label: 'Pediatrics' },
];

// Mock data for display
const mockDoctors: Doctor[] = [
  {
    id: '1', userId: 'u1', specialization: 'Cardiology', averageRating: 4.8, totalReviews: 124,
    appointmentDurationMinutes: 30, consultationFee: 200, isAvailable: true,
    clinicName: 'Heart Care Center', clinicAddress: '123 Medical St',
    createdAt: '2025-01-15', updatedAt: '2026-03-10',
    user: { id: 'u1', email: 'michael.chen@hospital.com', firstName: 'Michael', lastName: 'Chen', phone: '+1234567890', role: 'DOCTOR' as never, isActive: true, createdAt: '2025-01-15', updatedAt: '2026-03-10' },
  },
  {
    id: '2', userId: 'u2', specialization: 'Dermatology', averageRating: 4.6, totalReviews: 89,
    appointmentDurationMinutes: 20, consultationFee: 150, isAvailable: true,
    clinicName: 'Skin Health Clinic', clinicAddress: '456 Wellness Ave',
    createdAt: '2025-02-20', updatedAt: '2026-03-10',
    user: { id: 'u2', email: 'emily.brown@hospital.com', firstName: 'Emily', lastName: 'Brown', phone: '+1234567891', role: 'DOCTOR' as never, isActive: true, createdAt: '2025-02-20', updatedAt: '2026-03-10' },
  },
  {
    id: '3', userId: 'u3', specialization: 'Neurology', averageRating: 4.9, totalReviews: 156,
    appointmentDurationMinutes: 45, consultationFee: 250, isAvailable: false,
    clinicName: 'Neuro Center', clinicAddress: '789 Brain Blvd',
    createdAt: '2025-03-10', updatedAt: '2026-03-10',
    user: { id: 'u3', email: 'david.kim@hospital.com', firstName: 'David', lastName: 'Kim', phone: '+1234567892', role: 'DOCTOR' as never, isActive: true, createdAt: '2025-03-10', updatedAt: '2026-03-10' },
  },
  {
    id: '4', userId: 'u4', specialization: 'Pediatrics', averageRating: 4.7, totalReviews: 201,
    appointmentDurationMinutes: 30, consultationFee: 120, isAvailable: true,
    clinicName: 'Kids Health', clinicAddress: '321 Children Way',
    createdAt: '2025-04-05', updatedAt: '2026-03-10',
    user: { id: 'u4', email: 'lisa.wang@hospital.com', firstName: 'Lisa', lastName: 'Wang', phone: '+1234567893', role: 'DOCTOR' as never, isActive: true, createdAt: '2025-04-05', updatedAt: '2026-03-10' },
  },
  {
    id: '5', userId: 'u5', specialization: 'Orthopedics', averageRating: 4.5, totalReviews: 78,
    appointmentDurationMinutes: 30, consultationFee: 180, isAvailable: true,
    clinicName: 'Bone & Joint Clinic', clinicAddress: '567 Ortho Lane',
    createdAt: '2025-05-12', updatedAt: '2026-03-10',
    user: { id: 'u5', email: 'james.patel@hospital.com', firstName: 'James', lastName: 'Patel', phone: '+1234567894', role: 'DOCTOR' as never, isActive: true, createdAt: '2025-05-12', updatedAt: '2026-03-10' },
  },
];

export default function DoctorManagement() {
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const { data: doctorsData, isLoading } = useDoctors({
    specialization: specialtyFilter || undefined,
    search: search || undefined,
  });

  const deleteDoctor = useDeleteDoctor();

  const doctors = doctorsData?.data ?? mockDoctors;
  const filteredDoctors = specialtyFilter
    ? doctors.filter((d) => d.specialization === specialtyFilter)
    : doctors;

  const columns = useMemo(
    () =>
      getDoctorColumns({
        onEdit: (doctor) => {
          setSelectedDoctor(doctor);
          setDialogOpen(true);
        },
        onDelete: (doctor) => {
          setSelectedDoctor(doctor);
          setDeleteDialogOpen(true);
        },
      }),
    [],
  );

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setDialogOpen(true);
  };

  const handleFormSubmit = (_data: DoctorFormData) => {
    toast.success(
      selectedDoctor ? 'Doctor updated successfully' : 'Doctor added successfully',
    );
    setDialogOpen(false);
    setSelectedDoctor(null);
  };

  const handleDelete = async () => {
    if (!selectedDoctor) return;
    try {
      await deleteDoctor.mutateAsync(selectedDoctor.id);
      toast.success('Doctor deleted successfully');
    } catch {
      toast.error('Failed to delete doctor');
    }
    setDeleteDialogOpen(false);
    setSelectedDoctor(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Doctor Management"
        description="Manage all doctors in the system"
        action={
          <Button onClick={handleAddDoctor}>
            <Plus className="mr-2 h-4 w-4" /> Add Doctor
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          options={specialtyFilterOptions}
          className="w-full sm:w-48"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredDoctors}
        searchColumn="user"
        searchValue={search}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl" onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>{selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
            <DialogDescription>
              {selectedDoctor
                ? 'Update the doctor information below.'
                : 'Fill in the details to add a new doctor.'}
            </DialogDescription>
          </DialogHeader>
          <DoctorForm
            defaultValues={
              selectedDoctor
                ? {
                    firstName: selectedDoctor.user?.firstName,
                    lastName: selectedDoctor.user?.lastName,
                    email: selectedDoctor.user?.email,
                    phone: selectedDoctor.user?.phone,
                    specialization: selectedDoctor.specialization,
                    licenseNumber: selectedDoctor.licenseNumber ?? '',
                    consultationFee: selectedDoctor.consultationFee ?? undefined,
                    appointmentDurationMinutes: selectedDoctor.appointmentDurationMinutes,
                    clinicName: selectedDoctor.clinicName ?? '',
                    clinicAddress: selectedDoctor.clinicAddress ?? '',
                    bio: selectedDoctor.bio ?? '',
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            onCancel={() => setDialogOpen(false)}
            isEdit={!!selectedDoctor}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent onClose={() => setDeleteDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Delete Doctor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong>
                Dr. {selectedDoctor?.user?.firstName} {selectedDoctor?.user?.lastName}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
