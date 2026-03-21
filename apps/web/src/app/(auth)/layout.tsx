import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="hidden w-1/2 medical-gradient lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <Heart className="h-16 w-16 text-white/90" />
        <h1 className="mt-6 text-3xl font-bold text-white">MediBook</h1>
        <p className="mt-3 max-w-sm text-center text-lg text-white/80">
          Your trusted partner in healthcare management. Book appointments, track records, and stay healthy.
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-7 w-7 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">MediBook</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
