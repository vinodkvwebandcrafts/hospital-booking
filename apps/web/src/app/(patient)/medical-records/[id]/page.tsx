'use client';

import { use } from 'react';
import { FileText, Pill, TestTube, Paperclip } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useRecord } from '@/hooks/use-medical-records';
import { formatDate } from '@/lib/utils';

interface RecordDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RecordDetailPage({ params }: RecordDetailPageProps) {
  const { id } = use(params);
  const { data: record, isLoading } = useRecord(id);

  if (isLoading) return <Spinner className="py-20" />;

  if (!record) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Record not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <PageHeader
        title="Medical Record"
        breadcrumbs={[
          { label: 'Medical Records', href: '/medical-records' },
          { label: record.diagnosis },
        ]}
      />

      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-600" />
                Overview
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{formatDate(record.createdAt)}</span>
                {record.isConfidential && <Badge variant="warning">Confidential</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Symptoms</h4>
              <p className="mt-1 text-gray-700">{record.symptoms}</p>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium text-gray-500">Diagnosis</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">{record.diagnosis}</p>
            </div>

            {record.treatmentPlan && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Treatment Plan</h4>
                  <p className="mt-1 whitespace-pre-wrap text-gray-700">{record.treatmentPlan}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Prescriptions */}
        {record.prescriptions && record.prescriptions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary-600" />
                Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left font-medium text-gray-500">Medication</th>
                      <th className="pb-3 text-left font-medium text-gray-500">Dosage</th>
                      <th className="pb-3 text-left font-medium text-gray-500">Frequency</th>
                      <th className="pb-3 text-left font-medium text-gray-500">Duration</th>
                      <th className="pb-3 text-left font-medium text-gray-500">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {record.prescriptions.map((rx, i) => (
                      <tr key={i}>
                        <td className="py-3 font-medium text-gray-900">{rx.medication}</td>
                        <td className="py-3 text-gray-700">{rx.dosage}</td>
                        <td className="py-3 text-gray-700">{rx.frequency}</td>
                        <td className="py-3 text-gray-700">{rx.duration}</td>
                        <td className="py-3 text-gray-500">{rx.notes ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lab Results */}
        {record.labResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-primary-600" />
                Lab Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{record.labResults}</p>
            </CardContent>
          </Card>
        )}

        {/* Attachments */}
        {record.attachmentUrls && record.attachmentUrls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-primary-600" />
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {record.attachmentUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm text-primary-600 hover:bg-gray-50"
                  >
                    <Paperclip className="h-4 w-4" />
                    Attachment {i + 1}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
