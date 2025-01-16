import { TaskDetails } from "@/components/tasks/task-details";

export default function TaskPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-6 space-y-6">
      <TaskDetails taskId={params.id} />
    </div>
  );
}
