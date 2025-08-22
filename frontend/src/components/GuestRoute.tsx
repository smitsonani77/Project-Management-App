"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/tasks");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null; // prevent flicker
  return <>{children}</>;
}
