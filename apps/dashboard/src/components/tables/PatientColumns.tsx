import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '@hospital-booking/shared-types';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';

interface PatientColumnsOptions {
  onView: (patient: User) => void;
}

export function getPatientColumns({ onView }: PatientColumnsOptions): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'firstName',
      header: 'Patient',
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar fallback={getInitials(patient.firstName, patient.lastName)} size="sm" />
            <div>
              <p className="font-medium text-gray-900">
                {patient.firstName} {patient.lastName}
              </p>
              <p className="text-xs text-gray-500">{patient.email}</p>
            </div>
          </div>
        );
      },
      filterFn: (row, _id, filterValue: string) => {
        const p = row.original;
        const name = `${p.firstName} ${p.lastName}`.toLowerCase();
        return name.includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ getValue }) => getValue<string>() || '-',
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ getValue }) => {
        const gender = getValue<string>();
        return gender ? (
          <Badge variant="secondary" className="capitalize">
            {gender}
          </Badge>
        ) : (
          '-'
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ getValue }) => {
        const active = getValue<boolean>();
        return (
          <Badge variant={active ? 'success' : 'destructive'}>
            {active ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return date ? format(new Date(date), 'MMM d, yyyy') : '-';
      },
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => onView(row.original)}>
          <Eye className="mr-1 h-4 w-4" /> View
        </Button>
      ),
    },
  ];
}
