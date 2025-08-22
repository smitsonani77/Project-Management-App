"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/tasks");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return null; 
}
