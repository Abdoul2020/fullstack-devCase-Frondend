"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  BellIcon,
  ChevronDownIcon,
  GlobeIcon,
  LogOutIcon,
  MailIcon,
  Menu,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { AuthService } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/slices/usersSlice";
import SafeImage from "./ui/safe-image";

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    AuthService.logout();
    router.push('/');
    router.refresh();
  };

  return (
    <Card className="-mt-6 lg:my-0 -mx-[30px] lg:mx-0 rounded-none lg:rounded-xl py-[30px]! lg:py-6! shadow-none p-6 flex-row items-center justify-center">
      <picture>
        <img
          src="/images/logo-icon.svg"
          alt="master POS"
          className="md:hidden"
        />
      </picture>
      <div className="flex-1 lg:hidden block" />
      <div className="hidden flex-1 lg:flex flex-col">
        <p className="text-2xl font-bold">Users</p>
        <p className="text-muted-foreground">Manage your users</p>
      </div>
      
      <div className="hidden lg:block w-px h-full bg-border" />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="px-2! py-2 h-auto hover:bg-input hover:text-inherit"
          >
            <div className="flex items-center gap-3">
              <SafeImage
                src={currentUser?.avatarUrl || null}
                alt={`${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`}
                width={48}
                height={48}
                className="rounded-full size-12 object-cover"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Loading...'}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentUser ? `User Type ${currentUser.userType}` : 'Loading...'}
                </span>
              </div>
            </div>
            <ChevronDownIcon className="ml-3 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
          <DropdownMenuItem onClick={handleLogout}>
            <LogOutIcon className="size-5" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        size="icon"
        variant="ghost"
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="size-7" />
      </Button>
    </Card>
  );
}
