import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
      <p className="mt-1 text-sm text-gray-500">
        Join thousands of patients managing their health online
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
