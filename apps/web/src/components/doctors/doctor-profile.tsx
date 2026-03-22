'use client';

import Link from 'next/link';
import { Star, MapPin, Clock, DollarSign, Stethoscope } from 'lucide-react';
import type { Doctor } from '@hospital-booking/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getInitials, formatCurrency } from '@/lib/utils';

interface DoctorProfileProps {
  doctor: Doctor;
}

const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function DoctorProfile({ doctor }: DoctorProfileProps) {
  const name = doctor.user
    ? `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`
    : 'Doctor';
  const initials = doctor.user
    ? getInitials(doctor.user.firstName, doctor.user.lastName)
    : 'DR';

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar fallback={initials} size="xl" />
              <h2 className="mt-4 text-xl font-bold text-gray-900">{name}</h2>
              <Badge variant="default" className="mt-2">
                {doctor.specialization}
              </Badge>

              <div className="mt-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(Number(doctor.averageRating) || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-gray-500">
                  {(Number(doctor.averageRating) || 0).toFixed(1)} ({doctor.totalReviews} reviews)
                </span>
              </div>

              <Badge
                variant={doctor.isAvailable ? 'success' : 'destructive'}
                className="mt-3"
              >
                {doctor.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 text-sm">
              {doctor.clinicName && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700">{doctor.clinicName}</p>
                    {doctor.clinicAddress && (
                      <p className="text-gray-500">{doctor.clinicAddress}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">
                  {doctor.appointmentDurationMinutes} min appointments
                </span>
              </div>

              {doctor.consultationFee != null && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">
                    {formatCurrency(doctor.consultationFee)} per visit
                  </span>
                </div>
              )}
            </div>

            <Link href={`/book/${doctor.id}`} className="mt-6 block">
              <Button className="w-full" size="lg">
                Book Appointment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {doctor.bio && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary-600" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              Available Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doctor.availabilities && doctor.availabilities.length > 0 ? (
              <div className="space-y-2">
                {doctor.availabilities
                  .filter((a) => a.isActive)
                  .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                  .map((avail) => (
                    <div
                      key={avail.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5"
                    >
                      <span className="font-medium text-gray-700">
                        {dayLabels[avail.dayOfWeek]}
                      </span>
                      <span className="text-sm text-gray-500">
                        {avail.startTime} - {avail.endTime}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">No schedule information available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
