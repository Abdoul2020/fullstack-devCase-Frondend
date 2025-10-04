"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  PlusCircleIcon,
  RefreshCwIcon,
  Search,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CommentsDataTable from "./data-table";

export default function UserList() {
  const router = useRouter();

  return (
    <Card className="gap-10 p-[30px]">
      <div className="flex justify-between items-center gap-2">
        <p className="flex-1 font-bold text-xl">All Users</p>
        <div className="relative hidden md:block">
          <Input placeholder="Search here" className="pl-10 py-2!" />
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-px top-px p-[12px] [&_svg]:size-5!"
          >
            <Search />
          </Button>
        </div>
        <Button size="icon" variant="ghost" className="border md:hidden">
          <SearchIcon />
        </Button>
        <Button size="icon" variant="ghost" className="border hidden md:flex">
          <RefreshCwIcon />
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
        <Button>
          <PlusCircleIcon /> Add New User
        </Button>
      </div>
      <CommentsDataTable
        data={[
          {
            id: 1,
            fullName: "Jane Cooper",
            email: "jane.cooper@example.com",
            avatarUrl: "https://i.pravatar.cc/100?img=1",
            role: "admin",
            isActive: true,
            createdAt: new Date().toISOString(),
            children: [
              {
                id: 11,
                fullName: "Robert Fox",
                email: "robert.fox@example.com",
                avatarUrl: "https://i.pravatar.cc/100?img=11",
                role: "manager",
                isActive: true,
                createdAt: new Date().toISOString(),
              },
              {
                id: 12,
                fullName: "Jacob Jones",
                email: "jacob.jones@example.com",
                avatarUrl: "https://i.pravatar.cc/100?img=12",
                role: "staff",
                isActive: false,
                createdAt: new Date().toISOString(),
              },
            ],
          },
          {
            id: 2,
            fullName: "Cody Fisher",
            email: "cody.fisher@example.com",
            avatarUrl: "https://i.pravatar.cc/100?img=2",
            role: "manager",
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        ]}
        pagination={{
          page: 1,
          totalPages: 1,
          totalItems: 1,
          limit: 20,
        }}
        onPaginationChange={(pageIndex) => {
          router.push(`/dashboard?page=${pageIndex + 1}`);
        }}
        onSortingChange={(sorting) => {
          console.log(sorting);
        }}
        sorting={[]}
      />
    </Card>
  );
}
