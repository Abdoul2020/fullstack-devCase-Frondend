"use client";

import { DataTable } from "@/components/ui/data-table";
import { SortingState } from "@tanstack/react-table";
import usersColumns from "./columns";

export default function CommentsDataTable({
  data,
  pagination,
  onPaginationChange,
  onSortingChange,
  sorting,
}: {
  data: (User & { children?: User[] })[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
  onSortingChange: (sorting: SortingState) => void;
  sorting: SortingState;
}) {
  return (
    <DataTable
      columns={usersColumns()}
      data={data}
      getSubRows={(row) => (row as User & { children?: User[] }).children}
      manualPagination
      pageCount={pagination.totalPages}
      pageIndex={pagination.page - 1}
      onPaginationChange={onPaginationChange}
      manualSorting
      onSortingChange={onSortingChange}
      sorting={sorting}
      total={pagination.totalItems}
    />
  );
}
