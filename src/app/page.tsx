"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/login-form";
import { AuthService } from "@/lib/api/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated();
      if (authenticated) {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [router]);

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
}
