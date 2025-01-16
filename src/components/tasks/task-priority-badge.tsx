import { Badge } from "@/components/ui/badge";
import { PRIORITY_VARIANTS } from "@/lib/utils";

export function TaskPriorityBadge({
  priority,
}: {
  priority: keyof typeof PRIORITY_VARIANTS;
}) {
  return (
    <Badge variant={PRIORITY_VARIANTS[priority]} className="capitalize">
      {priority.toLowerCase()}
    </Badge>
  );
}
