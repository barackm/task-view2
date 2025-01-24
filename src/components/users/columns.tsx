"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { User } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ColumnsProps {
  onEdit: (user: User) => void;
  isAdmin: boolean;
}

export function getColumns({ onEdit, isAdmin }: ColumnsProps): ColumnDef<User>[] {
  return [
    {
      accessorKey: "full_name",
      header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className='flex items-center gap-2'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{user.full_name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    },
    {
      accessorKey: "role",
      header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return <Badge variant='outline'>{role}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={status === "active" ? "success" : "secondary"}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return isAdmin ? (
          <DataTableRowActions
            row={row}
            actions={[
              {
                label: "Edit Status",
                onClick: () => onEdit(user),
              },
            ]}
          />
        ) : null;
      },
    },
  ];
}
