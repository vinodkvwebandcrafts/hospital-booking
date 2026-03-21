import { useState } from 'react';
import { UserRole, type User } from '@hospital-booking/shared-types';
import { PageHeader } from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { format } from 'date-fns';
import { Search, ChevronDown, ChevronUp, FileText, Calendar } from 'lucide-react';

interface PatientWithHistory extends User {
  totalVisits: number;
  lastVisit: string;
  medicalHistory: {
    date: string;
    diagnosis: string;
    treatment: string;
  }[];
}

const mockPatients: PatientWithHistory[] = [
  {
    id: 'p1', email: 'sarah@email.com', firstName: 'Sarah', lastName: 'Johnson',
    phone: '+1234567800', role: UserRole.PATIENT, isActive: true, gender: 'female',
    dateOfBirth: '1990-05-15', createdAt: '2025-06-10', updatedAt: '2026-03-10',
    totalVisits: 8, lastVisit: '2026-03-18',
    medicalHistory: [
      { date: '2026-03-18', diagnosis: 'Hypertension', treatment: 'Lisinopril 10mg daily' },
      { date: '2026-01-15', diagnosis: 'Common cold', treatment: 'Rest and fluids' },
      { date: '2025-11-20', diagnosis: 'Annual checkup', treatment: 'All vitals normal' },
    ],
  },
  {
    id: 'p2', email: 'james@email.com', firstName: 'James', lastName: 'Wilson',
    phone: '+1234567801', role: UserRole.PATIENT, isActive: true, gender: 'male',
    dateOfBirth: '1985-11-22', createdAt: '2025-07-20', updatedAt: '2026-03-10',
    totalVisits: 5, lastVisit: '2026-03-10',
    medicalHistory: [
      { date: '2026-03-10', diagnosis: 'Type 2 Diabetes follow-up', treatment: 'Metformin adjusted to 1000mg' },
      { date: '2025-12-05', diagnosis: 'Blood sugar review', treatment: 'Continue current medication' },
    ],
  },
  {
    id: 'p3', email: 'maria@email.com', firstName: 'Maria', lastName: 'Garcia',
    phone: '+1234567802', role: UserRole.PATIENT, isActive: true, gender: 'female',
    dateOfBirth: '1992-03-08', createdAt: '2025-08-05', updatedAt: '2026-03-10',
    totalVisits: 3, lastVisit: '2026-02-28',
    medicalHistory: [
      { date: '2026-02-28', diagnosis: 'Migraine', treatment: 'Sumatriptan as needed' },
    ],
  },
  {
    id: 'p4', email: 'robert@email.com', firstName: 'Robert', lastName: 'Davis',
    phone: '+1234567803', role: UserRole.PATIENT, isActive: true, gender: 'male',
    dateOfBirth: '1978-09-30', createdAt: '2025-09-15', updatedAt: '2026-03-10',
    totalVisits: 12, lastVisit: '2026-03-15',
    medicalHistory: [
      { date: '2026-03-15', diagnosis: 'Arrhythmia follow-up', treatment: 'ECG normal. Continue Amiodarone.' },
      { date: '2026-02-01', diagnosis: 'Chest pain', treatment: 'Stress test ordered' },
      { date: '2025-12-20', diagnosis: 'Arrhythmia diagnosed', treatment: 'Amiodarone 200mg daily' },
    ],
  },
];

export default function MyPatients() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockPatients.filter((p) => {
    const name = `${p.firstName} ${p.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div>
      <PageHeader
        title="My Patients"
        description="View your patients and their medical history"
      />

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

      <div className="space-y-3">
        {filtered.map((patient) => {
          const isExpanded = expandedId === patient.id;
          return (
            <Card key={patient.id}>
              <CardContent className="p-4">
                {/* Patient row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar
                      fallback={getInitials(patient.firstName, patient.lastName)}
                      size="md"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                        <span>{patient.email}</span>
                        <span>{patient.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium">{patient.totalVisits} visits</p>
                      <p className="text-xs text-gray-500">
                        Last: {format(new Date(patient.lastVisit), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setExpandedId(isExpanded ? null : patient.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded medical history */}
                {isExpanded && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="mb-3 text-sm font-semibold text-gray-700">Medical History</h4>
                    <div className="space-y-3">
                      {patient.medicalHistory.map((record, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 rounded-lg bg-gray-50 p-3"
                        >
                          <div className="shrink-0">
                            <Badge variant="secondary" className="text-xs">
                              {format(new Date(record.date), 'MMM d, yyyy')}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {record.diagnosis}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">{record.treatment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500">No patients found.</div>
        )}
      </div>
    </div>
  );
}
