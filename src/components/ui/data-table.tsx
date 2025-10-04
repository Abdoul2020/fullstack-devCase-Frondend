"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { TableLoadingState, TableEmptyState, TableErrorState } from "./table-states";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  manualPagination?: boolean;
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  manualSorting?: boolean;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  total: number;
  getSubRows?: (row: TData) => TData[] | undefined;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  manualPagination = false,
  pageCount,
  pageIndex = 0,
  pageSize = 20,
  onPaginationChange,
  manualSorting = false,
  onSortingChange,
  sorting,
  total,
  getSubRows,
  isLoading = false,
  error = null,
  onRetry,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    manualPagination,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex,
          pageSize,
        });
        onPaginationChange?.(newState.pageIndex, newState.pageSize);
      } else {
        onPaginationChange?.(updater.pageIndex, updater.pageSize);
      }
    },
    manualSorting,
    onSortingChange: (updater) => {
      if (onSortingChange) {
        if (typeof updater === "function") {
          onSortingChange(updater(sorting ?? []));
        } else {
          onSortingChange(updater);
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getSubRows,
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                      width: header.column.columnDef.size,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        {isLoading ? (
          <TableLoadingState columns={columns.length} />
        ) : error ? (
          <TableErrorState 
            columns={columns.length} 
            error={error} 
            onRetry={onRetry || (() => {})} 
          />
        ) : table.getRowModel().rows?.length ? (
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableEmptyState columns={columns.length} />
        )}
      </Table>
      <DataTablePagination table={table} total={total} />
    </div>
  );
}
