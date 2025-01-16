import { Badge } from "@/components/ui/badge";
import { STATUS_VARIANTS } from "@/lib/utils";
import { TaskStatus } from "@/types/tasks";

type TaskStatusBadgeProps = {
  status: TaskStatus;
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} className="capitalize">
      {status.toLowerCase().replace("_", " ")}
    </Badge>
  );
}
