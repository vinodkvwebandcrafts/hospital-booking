'use client';

import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import type { Doctor } from '@hospital-booking/shared-types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { getInitials, formatCurrency } from '@/lib/utils';

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const name = doctor.user
    ? `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`
    : 'Doctor';
  const initials = doctor.user
    ? getInitials(doctor.user.firstName, doctor.user.lastName)
    : 'DR';

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar fallback={initials} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
            <Badge variant="default" className="mt-1">
              {doctor.specialization}
            </Badge>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(doctor.averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-gray-500">
              ({doctor.totalReviews})
            </span>
          </div>

          {doctor.clinicName && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{doctor.clinicName}</span>
            </div>
          )}

          {doctor.consultationFee != null && (
            <p className="text-sm font-medium text-gray-700">
              {formatCurrency(doctor.consultationFee)} / visit
            </p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Link href={`/doctors/${doctor.id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              View Profile
            </Button>
          </Link>
          <Link href={`/book/${doctor.id}`} className="flex-1">
            <Button className="w-full" size="sm">
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
