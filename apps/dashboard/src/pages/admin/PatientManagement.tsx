import { useMemo, useState } from 'react';
import type { User } from '@hospital-booking/shared-types';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { getPatientColumns } from '@/components/tables/PatientColumns';
import { PatientForm } from '@/components/forms/PatientForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { usePatients } from '@/hooks/usePatients';
import { Search } from 'lucide-react';
import { UserRole } from '@hospital-booking/shared-types';

const mockPatients: User[] = [
  { id: 'p1', email: 'sarah.johnson@email.com', firstName: 'Sarah', lastName: 'Johnson', phone: '+1234567800', role: UserRole.PATIENT, isActive: true, gender: 'female', dateOfBirth: '1990-05-15', address: '456 Oak St', city: 'New York', country: 'USA', postalCode: '10001', createdAt: '2025-06-10', updatedAt: '2026-03-10' },
  { id: 'p2', email: 'james.wilson@email.com', firstName: 'James', lastName: 'Wilson', phone: '+1234567801', role: UserRole.PATIENT, isActive: true, gender: 'male', dateOfBirth: '1985-11-22', address: '789 Pine Ave', city: 'Los Angeles', country: 'USA', postalCode: '90001', createdAt: '2025-07-20', updatedAt: '2026-03-10' },
  { id: 'p3', email: 'maria.garcia@email.com', firstName: 'Maria', lastName: 'Garcia', phone: '+1234567802', role: UserRole.PATIENT, isActive: true, gender: 'female', dateOfBirth: '1992-03-08', address: '321 Elm Dr', city: 'Chicago', country: 'USA', postalCode: '60601', createdAt: '2025-08-05', updatedAt: '2026-03-10' },
  { id: 'p4', email: 'robert.davis@email.com', firstName: 'Robert', lastName: 'Davis', phone: '+1234567803', role: UserRole.PATIENT, isActive: false, gender: 'male', dateOfBirth: '1978-09-30', address: '654 Maple Ln', city: 'Houston', country: 'USA', postalCode: '77001', createdAt: '2025-09-15', updatedAt: '2026-03-10' },
  { id: 'p5', email: 'anna.miller@email.com', firstName: 'Anna', lastName: 'Miller', phone: '+1234567804', role: UserRole.PATIENT, isActive: true, gender: 'female', dateOfBirth: '1995-01-12', address: '987 Cedar Ct', city: 'Phoenix', country: 'USA', postalCode: '85001', createdAt: '2025-10-01', updatedAt: '2026-03-10' },
  { id: 'p6', email: 'tom.martinez@email.com', firstName: 'Tom', lastName: 'Martinez', phone: '+1234567805', role: UserRole.PATIENT, isActive: true, gender: 'male', dateOfBirth: '1988-07-19', address: '147 Birch Rd', city: 'Philadelphia', country: 'USA', postalCode: '19101', createdAt: '2025-11-11', updatedAt: '2026-03-10' },
];

export default function PatientManagement() {
  const [search, setSearch] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

  const { data: patientsData, isLoading } = usePatients({
    search: search || undefined,
  });

  const patients = patientsData?.data ?? mockPatients;

  const columns = useMemo(
    () =>
      getPatientColumns({
        onView: (patient) => {
          setSelectedPatient(patient);
          setViewDialogOpen(true);
        },
      }),
    [],
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Patient Management" description="View and manage all patients" />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={patients}
        searchColumn="firstName"
        searchValue={search}
      />

      {/* View Patient Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg" onClose={() => setViewDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && <PatientForm patient={selectedPatient} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
