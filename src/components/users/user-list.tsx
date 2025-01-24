"use client";

import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { getColumns } from "./columns";
import useSWR from "swr";
import { fetchUsers } from "@/actions/users";
import { UserSheet } from "./user-sheet";
import { User, UserRole } from "@/types/auth";
import { useAuthStore } from "@/hooks/use-auth";

export function UserList() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user } = useAuthStore();

  const {
    data: users,
    isLoading,
    mutate: refreshUsers,
  } = useSWR("users", () => fetchUsers(), {
    onError: (err) => {
      console.error("Failed to fetch users:", err);
    },
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setSheetOpen(true);
  };

  const isAdmin = user?.role === UserRole.ADMIN;
  const columns = getColumns({ onEdit: handleEdit, isAdmin });

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={users || []}
        config={{
          enableSorting: true,
          enableFiltering: true,
          enablePagination: true,
          showToolbar: true,
          searchColumn: "full_name",
          searchPlaceholder: "Search users...",
          isLoading: isLoading,
          emptyState: "No users found.",
          facetedFilters: [
            {
              column: "status",
              title: "Status",
              options: statusOptions,
            },
            {
              column: "role",
              title: "Role",
              options: [
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
              ],
            },
          ],
        }}
      />

      <UserSheet open={sheetOpen} onOpenChange={setSheetOpen} user={selectedUser} onSuccess={() => refreshUsers()} />
    </>
  );
}
