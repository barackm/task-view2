"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/types/auth";
import { UserForm } from "./user-form";
import { UserFormValues } from "@/lib/schema";
import { updateUserAsync } from "@/actions/users";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";

interface UserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UserDialog({ user, open, onOpenChange, onSuccess }: UserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshUser } = useAuth();

  async function onSubmit(data: UserFormValues) {
    try {
      setIsSubmitting(true);

      await updateUserAsync(user.id, {
        full_name: data.full_name,
        avatar: data.avatar || null,
        skills: data.skills || null,
      });

      await refreshUser();

      toast.success("Profile updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <UserForm user={user} onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
