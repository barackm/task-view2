import { Badge } from "@/components/ui/badge";

const PRIORITY_VARIANTS = {
  HIGH: "destructive",
  MEDIUM: "secondary",
  LOW: "default",
} as const;

export function TaskPriorityBadge({
  priority,
}: {
  priority: keyof typeof PRIORITY_VARIANTS;
}) {
  return (
    <Badge variant={PRIORITY_VARIANTS[priority]}>
      {priority.toLowerCase()}
    </Badge>
  );
}
