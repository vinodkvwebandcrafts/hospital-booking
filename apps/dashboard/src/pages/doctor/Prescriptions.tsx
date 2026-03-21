import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { PrescriptionForm, type PrescriptionFormData } from '@/components/forms/PrescriptionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Plus, FileText, Pill } from 'lucide-react';

const mockPatientOptions = [
  { value: 'p1', label: 'Sarah Johnson' },
  { value: 'p2', label: 'James Wilson' },
  { value: 'p3', label: 'Maria Garcia' },
  { value: 'p4', label: 'Robert Davis' },
  { value: 'p5', label: 'Anna Miller' },
];

interface PrescriptionRecord {
  id: string;
  patientName: string;
  diagnosis: string;
  date: string;
  medications: { medication: string; dosage: string; frequency: string; duration: string }[];
}

const prescriptionHistory: PrescriptionRecord[] = [
  {
    id: 'rx1',
    patientName: 'Sarah Johnson',
    diagnosis: 'Hypertension',
    date: '2026-03-18',
    medications: [
      { medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
      { medication: 'Hydrochlorothiazide', dosage: '25mg', frequency: 'Once daily', duration: '30 days' },
    ],
  },
  {
    id: 'rx2',
    patientName: 'James Wilson',
    diagnosis: 'Type 2 Diabetes',
    date: '2026-03-10',
    medications: [
      { medication: 'Metformin', dosage: '1000mg', frequency: 'Twice daily', duration: '90 days' },
    ],
  },
  {
    id: 'rx3',
    patientName: 'Robert Davis',
    diagnosis: 'Arrhythmia',
    date: '2026-03-15',
    medications: [
      { medication: 'Amiodarone', dosage: '200mg', frequency: 'Once daily', duration: '60 days' },
      { medication: 'Aspirin', dosage: '81mg', frequency: 'Once daily', duration: 'Ongoing' },
    ],
  },
  {
    id: 'rx4',
    patientName: 'Maria Garcia',
    diagnosis: 'Migraine',
    date: '2026-02-28',
    medications: [
      { medication: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '30 days' },
      { medication: 'Topiramate', dosage: '25mg', frequency: 'Once daily', duration: '30 days' },
    ],
  },
];

export default function Prescriptions() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = (data: PrescriptionFormData) => {
    console.log('Prescription created:', data);
    toast.success('Prescription created successfully');
    setDialogOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Prescriptions"
        description="Create and manage patient prescriptions"
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Prescription
          </Button>
        }
      />

      {/* Prescription History */}
      <div className="space-y-4">
        {prescriptionHistory.map((rx) => {
          const isExpanded = expandedId === rx.id;
          return (
            <Card key={rx.id}>
              <CardContent className="p-4">
                <div
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => setExpandedId(isExpanded ? null : rx.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{rx.patientName}</p>
                      <p className="text-sm text-gray-500">{rx.diagnosis}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">
                      {rx.medications.length} medication{rx.medications.length > 1 ? 's' : ''}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {format(new Date(rx.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Pill className="h-4 w-4" /> Medications
                    </h4>
                    <div className="space-y-2">
                      {rx.medications.map((med, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-4 gap-4 rounded-lg bg-gray-50 p-3 text-sm"
                        >
                          <div>
                            <p className="text-xs text-gray-400">Medication</p>
                            <p className="font-medium text-gray-900">{med.medication}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Dosage</p>
                            <p className="text-gray-700">{med.dosage}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Frequency</p>
                            <p className="text-gray-700">{med.frequency}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Duration</p>
                            <p className="text-gray-700">{med.duration}</p>
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
      </div>

      {/* Create Prescription Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create Prescription</DialogTitle>
          </DialogHeader>
          <PrescriptionForm
            patients={mockPatientOptions}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
