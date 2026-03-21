import type { ColumnDef } from '@tanstack/react-table';
import type { Doctor } from '@hospital-booking/shared-types';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownItem, DropdownSeparator } from '@/components/ui/dropdown-menu';
import { getInitials, formatCurrency } from '@/lib/utils';
import { MoreHorizontal, Pencil, Trash2, Star } from 'lucide-react';

interface DoctorColumnsOptions {
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

export function getDoctorColumns({ onEdit, onDelete }: DoctorColumnsOptions): ColumnDef<Doctor>[] {
  return [
    {
      accessorKey: 'user',
      header: 'Doctor',
      enableSorting: false,
      cell: ({ row }) => {
        const doctor = row.original;
        const user = doctor.user;
        return (
          <div className="flex items-center gap-3">
            <Avatar
              fallback={user ? getInitials(user.firstName, user.lastName) : 'DR'}
              size="sm"
            />
            <div>
              <p className="font-medium text-gray-900">
                {user ? `Dr. ${user.firstName} ${user.lastName}` : 'Unknown'}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        );
      },
      filterFn: (row, _id, filterValue: string) => {
        const user = row.original.user;
        if (!user) return false;
        const name = `${user.firstName} ${user.lastName}`.toLowerCase();
        return name.includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: 'specialization',
      header: 'Specialty',
      cell: ({ getValue }) => (
        <Badge variant="default">{getValue<string>()}</Badge>
      ),
    },
    {
      accessorKey: 'averageRating',
      header: 'Rating',
      cell: ({ getValue }) => {
        const rating = getValue<number>();
        return (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{parseFloat(String(rating)).toFixed(1)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'consultationFee',
      header: 'Fee',
      cell: ({ getValue }) => {
        const fee = getValue<number>();
        return fee ? formatCurrency(parseFloat(String(fee))) : '-';
      },
    },
    {
      accessorKey: 'isAvailable',
      header: 'Status',
      cell: ({ getValue }) => {
        const available = getValue<boolean>();
        return (
          <Badge variant={available ? 'success' : 'secondary'}>
            {available ? 'Available' : 'Unavailable'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => {
        const doctor = row.original;
        return (
          <DropdownMenu
            trigger={
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          >
            <DropdownItem onClick={() => onEdit(doctor)}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem destructive onClick={() => onDelete(doctor)}>
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownItem>
          </DropdownMenu>
        );
      },
    },
  ];
}
