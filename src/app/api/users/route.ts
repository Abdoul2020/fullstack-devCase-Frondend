import { NextRequest, NextResponse } from 'next/server';
import { User, UsersResponse, UserFilters, UserSorting } from '@/lib/types/users';

// Mock data for development
const mockUsers: User[] = [
  {
    id: 1,
    fullName: "Jane Cooper",
    email: "jane.cooper@example.com",
    avatarUrl: "https://i.pravatar.cc/100?img=1",
    role: "admin",
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    fullName: "Cody Fisher",
    email: "cody.fisher@example.com",
    avatarUrl: "https://i.pravatar.cc/100?img=2",
    role: "manager",
    isActive: true,
    createdAt: "2024-01-16T14:20:00Z",
  },
  {
    id: 3,
    fullName: "Esther Howard",
    email: "esther.howard@example.com",
    avatarUrl: "https://i.pravatar.cc/100?img=3",
    role: "staff",
    isActive: true,
    createdAt: "2024-01-17T09:15:00Z",
  },
  {
    id: 4,
    fullName: "Jenny Wilson",
    email: "jenny.wilson@example.com",
    avatarUrl: "https://i.pravatar.cc/100?img=4",
    role: "viewer",
    isActive: false,
    createdAt: "2024-01-18T16:45:00Z",
  },
  {
    id: 11,
    fullName: "Robert Fox",
    email: "robert.fox@example.com",
    avatarUrl: "https://i.pravatar.cc/100?img=11",
    role: "manager",
    isActive: true,
    createdAt: "2024-01-19T11:30:00Z",
    parentId: 1,
  },
  {
    id: 12,
    fullName: "Jacob Jones",
    email: "jacob.jones@example.com",
    avatarUrl: "https://i.pravatar.cc/100?img=12",
    role: "staff",
    isActive: false,
    createdAt: "2024-01-20T13:20:00Z",
    parentId: 1,
  },
  {
    id: 21,
    fullName: "Albert Flores",
    email: "albert.flores@example.com",
    avatarUrl: "https://i.pravatar.cc/100?img=21",
    role: "staff",
    isActive: true,
    createdAt: "2024-01-21T08:10:00Z",
    parentId: 2,
  },
  {
    id: 22,
    fullName: "Ralph Edwards",
    email: "ralph.edwards@example.com",
    avatarUrl: "https://i.pravatar.cc/100?img=22",
    role: "viewer",
    isActive: true,
    createdAt: "2024-01-22T15:35:00Z",
    parentId: 2,
  },
];

// Helper functions (same as in slice)
const filterUsers = (users: User[], filters: UserFilters): User[] => {
  let filtered = [...users];

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(user => 
      user.fullName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.role) {
    filtered = filtered.filter(user => user.role === filters.role);
  }

  if (filters.isActive !== undefined) {
    filtered = filtered.filter(user => user.isActive === filters.isActive);
  }

  return filtered;
};

const sortUsers = (users: User[], sorting?: UserSorting): User[] => {
  if (!sorting) {
    return users;
  }

  return [...users].sort((a, b) => {
    let aValue: string | number | boolean | Date;
    let bValue: string | number | boolean | Date;

    switch (sorting.field) {
      case 'user':
        aValue = a.fullName;
        bValue = b.fullName;
        break;
      case 'role':
        aValue = a.role;
        bValue = b.role;
        break;
      case 'isActive':
        aValue = a.isActive;
        bValue = b.isActive;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sorting.direction === 'desc' ? 1 : -1;
    if (aValue > bValue) return sorting.direction === 'desc' ? -1 : 1;
    return 0;
  });
};

const paginateUsers = (users: User[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return users.slice(startIndex, endIndex);
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const sortBy = searchParams.get('sortBy') || '';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc';
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const isActiveParam = searchParams.get('isActive');
    const isActive = isActiveParam ? isActiveParam === 'true' : undefined;

    const filters: UserFilters = {};
    if (search) filters.search = search;
    if (role) filters.role = role;
    if (isActive !== undefined) filters.isActive = isActive;

    const sorting: UserSorting | undefined = sortBy ? {
      field: sortBy,
      direction: sortOrder,
    } : undefined;

    let filteredUsers = filterUsers(mockUsers, filters);
    filteredUsers = sortUsers(filteredUsers, sorting);

    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedUsers = paginateUsers(filteredUsers, page, limit);

    const response: UsersResponse = {
      message: "Users retrieved successfully",
      status: "success",
      currentPage: page,
      totalPages,
      totalItems,
      data: paginatedUsers,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
