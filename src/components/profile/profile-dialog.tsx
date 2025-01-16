import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  profile?: User;
}

export function ProfileDialog({
  isOpen,
  onOpenChange,
  profile,
}: ProfileDialogProps) {
  if (!profile) return null;

  const skills = profile.skills?.split(",").map((skill) => skill.trim());

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar!} />
            <AvatarFallback>{profile.full_name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center">
            <h3 className="font-semibold text-lg">{profile.full_name}</h3>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>

          {profile.about && (
            <div className="w-full space-y-2">
              <h4 className="font-semibold text-sm">About</h4>
              <p className="text-sm text-muted-foreground">{profile.about}</p>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div className="w-full space-y-2">
              <h4 className="font-semibold text-sm">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
