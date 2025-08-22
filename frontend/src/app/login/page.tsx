import GuestRoute from "@/components/GuestRoute";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <GuestRoute>
      <div className="card">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <LoginForm />
      </div>
    </GuestRoute>
  );
}