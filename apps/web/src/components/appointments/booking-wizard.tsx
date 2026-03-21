'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, addDays } from 'date-fns';
import { Calendar, Clock, FileText, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import type { Doctor, ConsultationType } from '@hospital-booking/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { TimeSlotSelector } from './time-slot-selector';
import { useDoctorSlots } from '@/hooks/use-doctors';
import { useCreateAppointment } from '@/hooks/use-appointments';
import { cn, formatCurrency } from '@/lib/utils';
import { CONSULTATION_TYPES } from '@/lib/constants';

interface BookingWizardProps {
  doctor: Doctor;
}

const steps = [
  { id: 1, label: 'Select Date', icon: Calendar },
  { id: 2, label: 'Select Time', icon: Clock },
  { id: 3, label: 'Details', icon: FileText },
  { id: 4, label: 'Confirm', icon: CheckCircle },
];

export function BookingWizard({ doctor }: BookingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [consultationType, setConsultationType] = useState<ConsultationType>('IN_PERSON' as ConsultationType);

  const { data: slots, isLoading: slotsLoading } = useDoctorSlots(doctor.id, selectedDate);
  const createAppointment = useCreateAppointment();

  const dates = Array.from({ length: 14 }).map((_, i) => {
    const date = addDays(new Date(), i + 1);
    return {
      value: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEE'),
      dayNum: format(date, 'd'),
      month: format(date, 'MMM'),
    };
  });

  const doctorName = doctor.user
    ? `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`
    : 'Doctor';

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) return;

    await createAppointment.mutateAsync({
      doctorId: doctor.id,
      appointmentDateTime: `${selectedDate}T${selectedSlot}:00`,
      reason: reason || undefined,
      consultationType,
    });

    router.push('/appointments');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedDate;
      case 2: return !!selectedSlot;
      case 3: return !!reason;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                    isActive
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : isCompleted
                        ? 'border-primary-600 bg-primary-100 text-primary-600'
                        : 'border-gray-300 bg-white text-gray-400',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    'mt-1.5 text-xs font-medium',
                    isActive ? 'text-primary-600' : 'text-gray-400',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 w-12 sm:w-20',
                    isCompleted ? 'bg-primary-600' : 'bg-gray-200',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Select a Date</h3>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {dates.map((date) => (
                  <button
                    key={date.value}
                    onClick={() => {
                      setSelectedDate(date.value);
                      setSelectedSlot(null);
                    }}
                    className={cn(
                      'flex flex-col items-center rounded-lg border p-3 transition-colors',
                      selectedDate === date.value
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50',
                    )}
                  >
                    <span className="text-xs text-gray-500">{date.dayName}</span>
                    <span className="text-lg font-bold">{date.dayNum}</span>
                    <span className="text-xs text-gray-500">{date.month}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Select a Time Slot
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Available slots for{' '}
                <span className="font-medium text-gray-700">{selectedDate}</span>
              </p>
              {slotsLoading ? (
                <Spinner className="py-8" />
              ) : (
                <TimeSlotSelector
                  slots={slots ?? []}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />
              )}
              <div className="mt-4 flex gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-green-100 border border-green-300" />
                  Available
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-gray-100 border border-gray-200" />
                  Booked
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-yellow-50 border border-yellow-300" />
                  Pending
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Reason for Visit *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe your symptoms or reason for visiting..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-gray-400">{reason.length}/500</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Consultation Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.entries(CONSULTATION_TYPES) as [string, { label: string }][]).map(
                    ([key, val]) => (
                      <button
                        key={key}
                        onClick={() => setConsultationType(key as ConsultationType)}
                        className={cn(
                          'rounded-lg border p-3 text-center text-sm font-medium transition-colors',
                          consultationType === key
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300',
                        )}
                      >
                        {val.label}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h3 className="mb-6 text-lg font-semibold text-gray-900">
                Confirm Your Appointment
              </h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Doctor</span>
                  <span className="text-sm font-medium text-gray-900">{doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Specialization</span>
                  <span className="text-sm font-medium text-gray-900">
                    {doctor.specialization}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-sm font-medium text-gray-900">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="text-sm font-medium text-gray-900">{selectedSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Consultation</span>
                  <Badge variant="outline">
                    {CONSULTATION_TYPES[consultationType]?.label}
                  </Badge>
                </div>
                {doctor.consultationFee != null && (
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <span className="text-sm font-medium text-gray-700">Fee</span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatCurrency(doctor.consultationFee)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-500">Reason</span>
                  <p className="mt-1 text-sm text-gray-700">{reason}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {currentStep < 4 ? (
          <Button onClick={() => setCurrentStep((s) => s + 1)} disabled={!canProceed()}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleConfirm}
            isLoading={createAppointment.isPending}
            disabled={!canProceed()}
          >
            Confirm Booking
          </Button>
        )}
      </div>
    </div>
  );
}
