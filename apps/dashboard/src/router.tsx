import { lazy, Suspense } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { UserRole } from '@hospital-booking/shared-types';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Spinner } from '@/components/ui/spinner';

// Lazy-loaded pages
const Login = lazy(() => import('@/pages/auth/Login'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const DoctorManagement = lazy(() => import('@/pages/admin/DoctorManagement'));
const PatientManagement = lazy(() => import('@/pages/admin/PatientManagement'));
const AppointmentsOverview = lazy(() => import('@/pages/admin/AppointmentsOverview'));
const Analytics = lazy(() => import('@/pages/admin/Analytics'));
const DoctorDashboard = lazy(() => import('@/pages/doctor/Dashboard'));
const MyAppointments = lazy(() => import('@/pages/doctor/MyAppointments'));
const MyPatients = lazy(() => import('@/pages/doctor/MyPatients'));
const Schedule = lazy(() => import('@/pages/doctor/Schedule'));
const Prescriptions = lazy(() => import('@/pages/doctor/Prescriptions'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <SuspenseWrapper>{children}</SuspenseWrapper>
    </ProtectedRoute>
  );
}

function DoctorRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.DOCTOR]}>
      <SuspenseWrapper>{children}</SuspenseWrapper>
    </ProtectedRoute>
  );
}

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <Login />
      </SuspenseWrapper>
    ),
  },
  // Admin routes
  {
    path: '/admin/dashboard',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/doctors',
    element: (
      <AdminRoute>
        <DoctorManagement />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/patients',
    element: (
      <AdminRoute>
        <PatientManagement />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/appointments',
    element: (
      <AdminRoute>
        <AppointmentsOverview />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/analytics',
    element: (
      <AdminRoute>
        <Analytics />
      </AdminRoute>
    ),
  },
  // Doctor routes
  {
    path: '/doctor/dashboard',
    element: (
      <DoctorRoute>
        <DoctorDashboard />
      </DoctorRoute>
    ),
  },
  {
    path: '/doctor/appointments',
    element: (
      <DoctorRoute>
        <MyAppointments />
      </DoctorRoute>
    ),
  },
  {
    path: '/doctor/patients',
    element: (
      <DoctorRoute>
        <MyPatients />
      </DoctorRoute>
    ),
  },
  {
    path: '/doctor/schedule',
    element: (
      <DoctorRoute>
        <Schedule />
      </DoctorRoute>
    ),
  },
  {
    path: '/doctor/prescriptions',
    element: (
      <DoctorRoute>
        <Prescriptions />
      </DoctorRoute>
    ),
  },
  // Default redirect
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];
