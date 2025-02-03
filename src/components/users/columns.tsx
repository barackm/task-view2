"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { User } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import { Button } from "@/components/ui/button";
import { UserNameCell } from "./user-name-cell";

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
        return <UserNameCell user={user} />;
      },
    },
    {
      accessorKey: "skills",
      header: ({ column }) => <DataTableColumnHeader column={column} title='Skills' />,
      cell: ({ row }) => {
        const skills = row.original.skills?.split(",").map((skill) => skill.trim()) || [];
        return (
          <div className='flex flex-wrap gap-1'>
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <Badge key={index} variant='outline' className='text-xs'>
                  {skill}
                </Badge>
              ))
            ) : (
              <span className='text-muted-foreground text-sm'>No skills listed</span>
            )}
          </div>
        );
      },
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
