"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // Already logged in → redirect to tasks
      router.replace("/tasks");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    // Prevent flicker of login form while redirecting
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* ✅ Only shows if NOT logged in */}
      <h1 className="text-xl font-bold">Login</h1>
      {/* login form goes here */}
    </div>
  );
}
