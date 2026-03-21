import type { User } from '@hospital-booking/shared-types';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { format } from 'date-fns';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface PatientFormProps {
  patient: User;
}

export function PatientForm({ patient }: PatientFormProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar
          fallback={getInitials(patient.firstName, patient.lastName)}
          size="lg"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {patient.firstName} {patient.lastName}
          </h3>
          <Badge variant={patient.isActive ? 'success' : 'destructive'}>
            {patient.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <Mail className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium text-gray-900">{patient.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <Phone className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm font-medium text-gray-900">{patient.phone || 'Not provided'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Date of Birth</p>
            <p className="text-sm font-medium text-gray-900">
              {patient.dateOfBirth
                ? format(new Date(patient.dateOfBirth), 'MMMM d, yyyy')
                : 'Not provided'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <MapPin className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Address</p>
            <p className="text-sm font-medium text-gray-900">
              {[patient.address, patient.city, patient.country].filter(Boolean).join(', ') ||
                'Not provided'}
            </p>
          </div>
        </div>
      </div>

      {/* Additional info */}
      <div className="rounded-lg border border-gray-200 p-4">
        <h4 className="mb-2 text-sm font-semibold text-gray-700">Account Details</h4>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <p className="text-gray-500">Gender</p>
          <p className="capitalize text-gray-900">{patient.gender || 'Not specified'}</p>
          <p className="text-gray-500">Member since</p>
          <p className="text-gray-900">{format(new Date(patient.createdAt), 'MMM d, yyyy')}</p>
          <p className="text-gray-500">Last updated</p>
          <p className="text-gray-900">{format(new Date(patient.updatedAt), 'MMM d, yyyy')}</p>
        </div>
      </div>
    </div>
  );
}
