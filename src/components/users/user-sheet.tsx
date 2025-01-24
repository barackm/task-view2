"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { User } from "@/types/auth";
import { useState } from "react";
import { toast } from "sonner";
import { updateUserStatusAsync } from "@/actions/users";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UserSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onSuccess?: () => void;
}

export function UserSheet({ open, onOpenChange, user, onSuccess }: UserSheetProps) {
  const [status, setStatus] = useState(user?.status || "active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit() {
    if (!user) return;

    try {
      setIsSubmitting(true);
      await updateUserStatusAsync(user.id, status);
      toast.success("User status updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user status");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='sm:max-w-[400px]'>
        <SheetHeader>
          <SheetTitle>Edit User Status</SheetTitle>
        </SheetHeader>
        <div className='mt-8 space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Status</label>
            <Select value={status} onValueChange={setStatus} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className='w-full' onClick={onSubmit} disabled={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
