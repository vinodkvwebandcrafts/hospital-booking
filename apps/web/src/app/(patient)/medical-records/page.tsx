'use client';

import Link from 'next/link';
import { FileText, Calendar, User } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { useMyRecords } from '@/hooks/use-medical-records';
import { formatDate } from '@/lib/utils';

export default function MedicalRecordsPage() {
  const { data, isLoading } = useMyRecords();
  const records = data?.data ?? [];

  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <PageHeader
        title="Medical Records"
        description="View your medical history, diagnoses, and treatment plans."
      />

      {isLoading ? (
        <Spinner className="py-16" />
      ) : records.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8 text-gray-400" />}
          title="No medical records"
          description="Your medical records from completed appointments will appear here."
        />
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <Link key={record.id} href={`/medical-records/${record.id}`}>
              <Card className="transition-shadow hover:shadow-md cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary-50 p-2.5">
                        <FileText className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {record.diagnosis}
                        </h4>
                        <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(record.createdAt)}
                          </span>
                        </div>
                        {record.symptoms && (
                          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                            {record.symptoms}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {record.isConfidential && (
                        <Badge variant="warning">Confidential</Badge>
                      )}
                      {record.prescriptions && record.prescriptions.length > 0 && (
                        <Badge variant="default">
                          {record.prescriptions.length} Prescription{record.prescriptions.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
