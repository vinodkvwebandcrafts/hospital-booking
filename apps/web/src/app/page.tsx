import Link from 'next/link';
import { CalendarCheck, FileText, Bell, Heart, ArrowRight, Shield, Clock, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Heart className="h-7 w-7 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">MediBook</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="medical-gradient absolute inset-0 -skew-y-2 origin-top-left" style={{ top: '50%' }} />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Your Health,{' '}
                <span className="text-primary-600">Our Priority</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                Book appointments with top healthcare professionals in minutes.
                Access your medical records, get timely reminders, and manage
                your health journey all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-colors"
                >
                  Book an Appointment
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Create Account
                </Link>
              </div>
              <div className="mt-10 flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-primary-600">500+</p>
                  <p className="text-sm text-gray-500">Doctors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600">50k+</p>
                  <p className="text-sm text-gray-500">Patients</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600">100k+</p>
                  <p className="text-sm text-gray-500">Appointments</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 p-8">
                <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white/80 shadow-lg backdrop-blur-sm">
                  <Heart className="h-24 w-24 text-primary-600" />
                  <p className="mt-4 text-xl font-bold text-gray-900">Healthcare Made Simple</p>
                  <p className="mt-2 text-sm text-gray-500">Book. Visit. Recover.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-500">
              Manage your healthcare experience seamlessly with our comprehensive platform.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<CalendarCheck className="h-6 w-6" />}
              title="Book Appointments"
              description="Find and book appointments with qualified doctors. Choose your preferred date, time, and consultation type."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="View Records"
              description="Access your complete medical history including diagnoses, prescriptions, and treatment plans in one secure place."
            />
            <FeatureCard
              icon={<Bell className="h-6 w-6" />}
              title="Get Reminders"
              description="Never miss an appointment with timely notifications and reminders sent directly to your device."
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary-100 p-2.5">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure & Private</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your health data is encrypted and stored securely following HIPAA standards.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary-100 p-2.5">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">24/7 Availability</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Book appointments anytime, anywhere. Our platform is always available for you.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary-100 p-2.5">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Expert Doctors</h3>
                <p className="mt-1 text-sm text-gray-500">
                  All our doctors are verified professionals with proven track records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary-600" />
              <span className="font-bold text-gray-900">MediBook</span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; 2026 Hospital Booking System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
      <div className="mb-4 inline-flex rounded-lg bg-primary-100 p-3 text-primary-600">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}
