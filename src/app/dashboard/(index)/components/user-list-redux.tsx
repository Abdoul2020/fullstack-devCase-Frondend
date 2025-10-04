"use client";

import { useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import CommentsDataTable from "./data-table";
import UserFiltersComponent from "./user-filters";
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { 
  fetchUsers,
  fetchCurrentUser,
  setPagination,
  setFilters,
  setSorting,
  clearError,
  selectUsers,
  selectPagination,
  selectFilters,
  selectSorting,
  selectIsLoading,
  selectError,
  selectApiParams,
  selectCurrentUser,
} from '@/lib/store/slices/usersSlice';
import { useUrlSync } from '@/hooks/use-url-sync';
import { SortingState } from '@tanstack/react-table';
import { UserSorting } from '@/lib/types/users';

export default function UserListRedux() {
  const dispatch = useAppDispatch();
  
  const users = useAppSelector(selectUsers);
  const currentUser = useAppSelector(selectCurrentUser);
  const pagination = useAppSelector(selectPagination);
  const filters = useAppSelector(selectFilters);
  const sorting = useAppSelector(selectSorting);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const apiParams = useAppSelector(selectApiParams);

  const { updateURL } = useUrlSync();

  // Fetch current user first, then fetch users
  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, currentUser]);

  // Fetch users when parameters change
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUsers(apiParams));
    }
  }, [dispatch, pagination.page, pagination.limit, sorting, filters, currentUser]);

  // Update URL when state changes (only when user interacts)
  const handleStateChange = useCallback(() => {
    updateURL();
  }, [updateURL]);

  // Pagination change handler
  const handlePaginationChange = useCallback((pageIndex: number, pageSize: number) => {
    dispatch(setPagination({ page: pageIndex + 1, limit: pageSize }));
    handleStateChange();
  }, [dispatch, handleStateChange]);

  // Sorting change handler
  const handleSortingChange = useCallback((newSorting: SortingState) => {
    const userSorting: UserSorting | undefined = newSorting.length > 0 ? {
      field: newSorting[0].id,
      direction: newSorting[0].desc ? 'desc' : 'asc',
    } : undefined;
    
    dispatch(setSorting(userSorting));
    handleStateChange();
  }, [dispatch, handleStateChange]);

  // Filters change handler
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    dispatch(setFilters(newFilters));
    handleStateChange();
  }, [dispatch, handleStateChange]);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    dispatch(clearError());
    dispatch(fetchUsers(apiParams));
  }, [dispatch, apiParams]);

  // Convert sorting to table format
  const tableSorting: SortingState = sorting ? [{
    id: sorting.field,
    desc: sorting.direction === 'desc',
  }] : [];

  return (
    <Card className="gap-10 p-[30px]">
      <UserFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      
      <CommentsDataTable
        data={users}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onSortingChange={handleSortingChange}
        sorting={tableSorting}
        isLoading={isLoading}
        error={error}
        onRetry={handleRefresh}
      />
    </Card>
  );
}
