import { Badge } from "@/components/ui/badge";

const STATUS_VARIANTS = {
  DONE: "secondary",
  IN_PROGRESS: "outline",
  TODO: "default",
} as const;

export function TaskStatusBadge({
  status,
}: {
  status: keyof typeof STATUS_VARIANTS;
}) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      {status.toLowerCase().replace("_", " ")}
    </Badge>
  );
}
