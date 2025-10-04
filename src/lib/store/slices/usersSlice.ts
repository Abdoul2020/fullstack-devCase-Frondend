import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { 
  User, 
  UserWithChildren, 
  UserFilters, 
  UserSorting, 
  UserApiParams,
  UsersResponse 
} from '../../types/users';
import { UsersService } from '../../api/users';



// Helper function to build hierarchy based on current user and createdBy
const buildHierarchy = (users: User[], currentUser: User | null): UserWithChildren[] => {
  const userMap = new Map<number, UserWithChildren>();
  const rootUsers: UserWithChildren[] = [];

  // Create user objects with children array
  users.forEach(user => {
    userMap.set(user.id, { ...user, children: [] });
  });

  // Add current user to the map if not already present
  if (currentUser && !userMap.has(currentUser.id)) {
    userMap.set(currentUser.id, { ...currentUser, children: [] });
  }

  // Build hierarchy based on createdBy (creator relationship)
  users.forEach(user => {
    const userWithChildren = userMap.get(user.id);
    if (userWithChildren) {
      if (user.createdBy === currentUser?.id) {
        // This user was created by the current user, add as child
        const currentUserWithChildren = userMap.get(currentUser.id);
        if (currentUserWithChildren) {
          currentUserWithChildren.children?.push(userWithChildren);
        }
      } else if (user.createdBy && user.createdBy !== currentUser?.id) {
        // This user was created by someone else, add as child to their creator if present
        const creator = userMap.get(user.createdBy);
        if (creator) {
          creator.children?.push(userWithChildren);
        } else {
          // Creator not found in current dataset, treat as root
          rootUsers.push(userWithChildren);
        }
      } else {
        // No creator, this is a root user (but not the current user)
        if (user.id !== currentUser?.id) {
          rootUsers.push(userWithChildren);
        }
      }
    }
  });

  // If we have a current user, add them as the first root user
  if (currentUser && userMap.has(currentUser.id)) {
    const currentUserWithChildren = userMap.get(currentUser.id);
    if (currentUserWithChildren) {
      rootUsers.unshift(currentUserWithChildren);
    }
  }

  // Ensure all users are included - add any missing users as root
  users.forEach(user => {
    const isIncluded = rootUsers.some(root => 
      root.id === user.id || 
      root.children?.some(child => child.id === user.id)
    );
    if (!isIncluded) {
      const userWithChildren = userMap.get(user.id);
      if (userWithChildren) {
        rootUsers.push(userWithChildren);
      }
    }
  });

  return rootUsers;
};

// Helper function to filter users
const filterUsers = (users: User[], filters: UserFilters): User[] => {
  let filtered = [...users];

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(user => 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.userType) {
    filtered = filtered.filter(user => user.userType === filters.userType);
  }

  if (filters.isActive !== undefined) {
    filtered = filtered.filter(user => user.isActive === filters.isActive);
  }

  return filtered;
};

// Helper function to sort users
const sortUsers = (users: User[], sorting?: UserSorting): User[] => {
  if (!sorting) {
    return users;
  }

  return [...users].sort((a, b) => {
    let aValue: string | number | boolean | Date;
    let bValue: string | number | boolean | Date;

    switch (sorting.field) {
      case 'user':
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
        break;
      case 'userType':
        aValue = a.userType;
        bValue = b.userType;
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

// Helper function to paginate users
const paginateUsers = (users: User[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return users.slice(startIndex, endIndex);
};


// Async thunk for fetching current user
export const fetchCurrentUser = createAsyncThunk(
  'users/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await UsersService.fetchCurrentUser();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch current user');
    }
  }
);

// Async thunk for creating a new user
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: any, { rejectWithValue, getState }) => {
    try {
      console.log('🚀 Redux: Creating user with data:', userData);
      const response = await UsersService.createUser(userData);
      
      // Get current state to refresh the user list
      const state = getState() as { users: UsersState };
      const { pagination, filters, sorting } = state.users;
      
      // Return both the created user and the parameters to refresh the list
      return {
        user: response.data,
        refreshParams: {
          pagination,
          filters,
          sorting,
        },
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create user');
    }
  }
);

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: UserApiParams, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { users: UsersState };
      const { allUsers, lastFetchParams, currentUser } = state.users;
      
      // Always fetch from API to ensure we get the latest data and all users
      const response = await UsersService.fetchUsers(params);
      let usersToProcess = response.data.users;
      
      // Apply client-side filtering
      let filteredUsers = usersToProcess;
      
      if (params.filters) {
        // Apply search filter
        if (params.filters.search) {
          const searchTerm = params.filters.search.toLowerCase();
          filteredUsers = filteredUsers.filter(user => 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
          );
        }
        
        // Apply userType filter
        if (params.filters.userType) {
          filteredUsers = filteredUsers.filter(user => user.userType === params.filters!.userType);
        }
        
        // Apply isActive filter
        if (params.filters.isActive !== undefined) {
          filteredUsers = filteredUsers.filter(user => {
            const userIsActive = Boolean(user.isActive);
            return userIsActive === Boolean(params.filters!.isActive);
          });
        }
      }
      
      // Apply client-side sorting
      if (params.sorting) {
        filteredUsers = sortUsers(filteredUsers, params.sorting);
      }
      
      // For now, let's show all users without pagination to ensure all are visible
      // Calculate pagination info but don't slice the data
      const totalItems = filteredUsers.length;
      const totalPages = Math.ceil(totalItems / params.pagination.limit);
      
      // Return all filtered users without pagination
      return {
        status: "success",
        data: {
          users: filteredUsers, // Show all users, not paginated
          totalCount: totalItems,
          currentPage: params.pagination.page,
          totalPages,
        },
        allUsers: usersToProcess,
        params,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }
);

// Initial state interface
interface UsersState {
  data: UserWithChildren[];
  flatData: User[]; // Flat array for hierarchy building
  allUsers: User[]; // Cached raw data from API
  currentUser: User | null; // Current logged in user
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
  filters: UserFilters;
  sorting?: UserSorting;
  isLoading: boolean;
  error: string | null;
  expandedRows: number[]; // Track which rows are expanded (serializable)
  lastFetchParams?: UserApiParams; // Track last API fetch parameters
}

// Initial state
const initialState: UsersState = {
  data: [],
  flatData: [],
  allUsers: [],
  currentUser: null,
  pagination: {
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 20,
  },
  filters: {},
  sorting: undefined,
  isLoading: false,
  error: null,
  expandedRows: [],
  lastFetchParams: undefined,
};

// Users slice
export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Set pagination
    setPagination: (state, action: PayloadAction<{ page: number; limit?: number }>) => {
      state.pagination.page = action.payload.page;
      if (action.payload.limit) {
        state.pagination.limit = action.payload.limit;
      }
    },
    
    // Set filters
    setFilters: (state, action: PayloadAction<UserFilters>) => {
      state.filters = action.payload;
      state.pagination.page = 1; // Reset to first page when filters change
    },
    
    // Set sorting
    setSorting: (state, action: PayloadAction<UserSorting | undefined>) => {
      state.sorting = action.payload;
    },
    
    // Toggle row expansion
    toggleRowExpansion: (state, action: PayloadAction<number>) => {
      const rowId = action.payload;
      const index = state.expandedRows.indexOf(rowId);
      if (index > -1) {
        // Remove from array
        state.expandedRows.splice(index, 1);
      } else {
        // Add to array
        state.expandedRows.push(rowId);
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset state
    resetUsers: (state) => {
      state.data = [];
      state.flatData = [];
      state.allUsers = [];
      state.pagination = initialState.pagination;
      state.filters = {};
      state.sorting = undefined;
      state.error = null;
      state.expandedRows = [];
      state.lastFetchParams = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch current user';
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Add the new user to the allUsers array and rebuild hierarchy
        if (action.payload.user) {
          state.allUsers.push(action.payload.user);
          // Rebuild hierarchy with the new user included
          state.data = buildHierarchy(state.allUsers, state.currentUser);
          // Update pagination to include the new user
          state.pagination.totalItems += 1;
          state.pagination.totalPages = Math.ceil(state.pagination.totalItems / state.pagination.limit);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to create user';
      })
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.flatData = action.payload.data.users;
        const hierarchy = buildHierarchy(action.payload.data.users, state.currentUser);
        state.data = hierarchy;
        state.allUsers = action.payload.allUsers;
        state.lastFetchParams = action.payload.params;
        state.pagination = {
          page: action.payload.data.currentPage,
          totalPages: action.payload.data.totalPages,
          totalItems: action.payload.data.totalCount,
          limit: state.pagination.limit,
        };
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch users';
      });
  },
});

// Export actions
export const {
  setPagination,
  setFilters,
  setSorting,
  toggleRowExpansion,
  clearError,
  resetUsers,
} = usersSlice.actions;

// Selectors
export const selectUsers = (state: { users: UsersState }) => state.users.data;
export const selectUsersFlat = (state: { users: UsersState }) => state.users.flatData;
export const selectAllUsers = (state: { users: UsersState }) => state.users.allUsers;
export const selectCurrentUser = (state: { users: UsersState }) => state.users.currentUser;
export const selectPagination = (state: { users: UsersState }) => state.users.pagination;
export const selectFilters = (state: { users: UsersState }) => state.users.filters;
export const selectSorting = (state: { users: UsersState }) => state.users.sorting;
export const selectIsLoading = (state: { users: UsersState }) => state.users.isLoading;
export const selectError = (state: { users: UsersState }) => state.users.error;
export const selectExpandedRows = (state: { users: UsersState }) => state.users.expandedRows;
export const selectExpandedRowsSet = createSelector(
  [selectExpandedRows],
  (expandedRows) => new Set(expandedRows)
);

// Combined selector for API parameters (memoized to prevent unnecessary re-renders)
export const selectApiParams = createSelector(
  [selectPagination, selectSorting, selectFilters],
  (pagination, sorting, filters): UserApiParams => ({
    pagination,
    sorting,
    filters,
  })
);
