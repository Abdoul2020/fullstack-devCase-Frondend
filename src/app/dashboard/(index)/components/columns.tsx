"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XCircleIcon,
} from "lucide-react";
import Image from "next/image";
type RowUser = User & { children?: User[] };
export default function usersColumns(): ColumnDef<RowUser>[] {
  return [
    {
      id: "select",
      size: 10,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(checked) => table.toggleAllRowsSelected(!!checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(!!checked)}
          aria-label="Select row"
        />
      ),
    },
    {
      id: "expander",
      header: "",
      size: 24,
      cell: ({ row }) => {
        const canExpand =
          row.getCanExpand?.() ??
          Boolean((row.original as RowUser).children?.length);
        if (!canExpand) return null;
        return (
          <Button
            size="icon"
            variant="ghost"
            onClick={row.getToggleExpandedHandler?.()}
            className="p-0 h-6 w-6"
            aria-label={row.getIsExpanded?.() ? "Collapse" : "Expand"}
          >
            {row.getIsExpanded?.() ? (
              <ChevronDownIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "user",
      header: "User",
      minSize: 300,
      cell: ({ row }) => {
        return (
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: (row.depth ?? 0) * 16 }}
          >
            <Image
              src={row.original.avatarUrl}
              alt={row.original.fullName}
              width={48}
              height={48}
              className="rounded-full size-12 object-cover"
            />
            <div>
              <p className="font-bold">{row.original.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {row.original.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => row.original.role,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        return row.original.isActive ? (
          <Badge
            className="w-30 py-2 font-semibold text-sm bg-[#89D2331A] text-[#89D233]"
            variant="default"
          >
            <CheckCircleIcon className="size-4!" />
            Active
          </Badge>
        ) : (
          <Badge
            className="w-30 py-2 font-semibold text-sm bg-[#F272771A] text-[#F27277]"
            variant="destructive"
          >
            <XCircleIcon className="size-4!" />
            Inactive
          </Badge>
        );
      },
    },
  ];
}
