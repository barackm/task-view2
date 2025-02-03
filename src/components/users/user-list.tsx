"use client";

import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { getColumns } from "./columns";
import useSWR from "swr";
import { fetchUsers } from "@/actions/users";
import { User, UserRole } from "@/types/auth";
import { UserSheet } from "./user-sheet";
import { Button } from "@/components/ui/button";
import { RotateCwIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/hooks/use-auth";

export function UserList() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshUsers();
      toast.success("Users refreshed");
    } catch {
      toast.error("Failed to refresh users");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setSheetOpen(true);
  };

  const isAdmin = user?.role === UserRole.ADMIN;
  const columns = getColumns({ onEdit: handleEdit, isAdmin });

  // Sort users by updated_at in descending order
  const sortedUsers = users?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()) || [];

  return (
    <>
      <div className='flex justify-end mb-4'>
        <Button variant='outline' size='icon' onClick={handleRefresh} disabled={isRefreshing}>
          <RotateCwIcon className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={sortedUsers}
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
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
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
