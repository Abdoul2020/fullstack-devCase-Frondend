// User interface for individual user items
export interface User {
  id: number;
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdBy: number | null;
  createdAt: string; 
  updatedAt: string; 
  creator: any | null;
  parentId?: number;
}

// Extended user interface with children for hierarchical display
export interface UserWithChildren extends User {
  children?: UserWithChildren[];
}

// Response interface for the API response
export interface UsersResponse {
  status: string;
  data: {
    users: User[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

// Filter interface
export interface UserFilters {
  search?: string;
  userType?: string;
  isActive?: boolean;
}

// Sorting interface
export interface UserSorting {
  field: string;
  direction: 'asc' | 'desc';
}

// Pagination interface
export interface UserPagination {
  page: number;
  limit: number;
}

// API parameters interface
export interface UserApiParams {
  pagination: UserPagination;
  sorting?: UserSorting;
  filters?: UserFilters;
}

// Authentication interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
}
