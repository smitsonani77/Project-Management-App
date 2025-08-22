// app/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/tasks"); // logged in → go to tasks
    } else {
      router.replace("/login"); // not logged in → go to login
    }
  }, [isAuthenticated, router]);

  return null;
}
