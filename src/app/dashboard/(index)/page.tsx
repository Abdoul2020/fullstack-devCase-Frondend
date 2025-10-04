"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import UserListRedux from "./components/user-list-redux";
import LoginForm from "@/components/login-form";
import { AuthService } from "@/lib/api/auth";
import { useAppSelector } from "@/lib/store/hooks";
import { selectAllUsers } from "@/lib/store/slices/usersSlice";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const allUsers = useAppSelector(selectAllUsers);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Calculate active users count
  const activeUsersCount = allUsers.filter(user => {
    const userIsActive = user.isActive === true || user.isActive === "true" || user.isActive === 1 || user.isActive === "1";
    return userIsActive;
  }).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <Header />
      <div className="grid gap-[30px] sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
        <CardItem title="Active Users" value={activeUsersCount} />
      </div>
      <UserListRedux />
    </>
  );
}

function CardItem({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <Card className="gap-4 py-5 px-6">
      <p className="text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold">{formatNumber(value)}</p>
    </Card>
  );
}
