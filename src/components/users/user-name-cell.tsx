"use client";

import { useState } from "react";
import { User } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import { Button } from "@/components/ui/button";

interface UserNameCellProps {
  user: User;
}

export function UserNameCell({ user }: UserNameCellProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className='flex items-center gap-2'>
        <Avatar className='h-8 w-8'>
          <AvatarImage src={user.avatar || undefined} />
          <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <Button variant='link' className='p-0 h-auto font-normal' onClick={() => setIsProfileOpen(true)}>
          {user.full_name}
        </Button>
      </div>
      <ProfileDialog isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} profile={user} />
    </>
  );
}
