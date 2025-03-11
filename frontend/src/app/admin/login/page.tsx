import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}