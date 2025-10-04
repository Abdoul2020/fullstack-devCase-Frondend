"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CalendarIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  PlusCircleIcon,
  RefreshCwIcon,
  Search,
  SearchIcon,
} from "lucide-react";
import { UserFilters } from "@/lib/types/users";
import AddUserModal, { CreateUserData } from "@/components/add-user-modal";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { createUser, selectIsLoading } from "@/lib/store/slices/usersSlice";

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function UserFiltersComponent({
  filters,
  onFiltersChange,
  onRefresh,
  isLoading = false,
}: UserFiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const isCreatingUser = useAppSelector(selectIsLoading);

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
    });
  };

  const handleUserTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      userType: value === "all" ? undefined : value,
    });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      isActive: value === "all" ? undefined : value === "active",
    });
  };

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await dispatch(createUser(userData)).unwrap();
      console.log('User created successfully!');
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  };

  return (
    <div className="flex justify-between items-center gap-2">
      <p className="flex-1 font-bold text-xl">All Users</p>
      
      {/* Search Input */}
      <div className="relative hidden md:block">
        <Input 
          placeholder="Search users..." 
          className="pl-10 py-2 w-64"
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute left-px top-px p-[12px] [&_svg]:size-5!"
        >
          <Search />
        </Button>
      </div>
      
      {/* Mobile Search Button */}
      <Button size="icon" variant="ghost" className="border md:hidden">
        <SearchIcon />
      </Button>

      {/* User Type Filter */}
      <Select value={filters.userType || "all"} onValueChange={handleUserTypeChange}>
        <SelectTrigger className="w-32 hidden md:flex">
          <SelectValue placeholder="User Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="1">Type 1</SelectItem>
          <SelectItem value="2">Type 2</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select 
        value={filters.isActive === undefined ? "all" : filters.isActive ? "active" : "inactive"} 
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-32 hidden md:flex">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {/* Action Buttons */}
      <Button 
        size="icon" 
        variant="ghost" 
        className="border hidden md:flex"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
      
      <Button size="icon" variant="ghost" className="border hidden md:flex">
        <CalendarIcon />
      </Button>
      
      <Button size="icon" variant="ghost" className="border hidden md:flex">
        <FunnelIcon />
      </Button>
      
      <Button size="icon" variant="ghost" className="border">
        <EllipsisVerticalIcon />
      </Button>
      
      <Button onClick={() => setIsModalOpen(true)}>
        <PlusCircleIcon /> Add New User
      </Button>
      
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
        isLoading={isCreatingUser}
      />
    </div>
  );
}
