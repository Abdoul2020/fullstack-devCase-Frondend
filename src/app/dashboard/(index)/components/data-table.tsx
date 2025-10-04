"use client";

import { DataTable } from "@/components/ui/data-table";
import { SortingState } from "@tanstack/react-table";
import { UserWithChildren } from "@/lib/types/users";
import usersColumns from "./columns";

export default function CommentsDataTable({
  data,
  pagination,
  onPaginationChange,
  onSortingChange,
  sorting,
  isLoading = false,
  error = null,
  onRetry,
}: {
  data: UserWithChildren[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
  onSortingChange: (sorting: SortingState) => void;
  sorting: SortingState;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  return (
    <DataTable
      columns={usersColumns()}
      data={data}
      getSubRows={(row) => (row as UserWithChildren).children}
      manualPagination
      pageCount={pagination.totalPages}
      pageIndex={pagination.page - 1}
      pageSize={pagination.limit}
      onPaginationChange={onPaginationChange}
      manualSorting
      onSortingChange={onSortingChange}
      sorting={sorting}
      total={pagination.totalItems}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
    />
  );
}
