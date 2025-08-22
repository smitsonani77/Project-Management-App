import GuestRoute from "@/components/GuestRoute";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <GuestRoute>
      <div className="card">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <RegisterForm />
      </div>
    </GuestRoute>
  );
}