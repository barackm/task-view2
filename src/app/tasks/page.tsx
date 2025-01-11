import { TaskList } from "@/components/tasks/task-list";

export default function TasksPage() {
  return (
    <div className='container py-8 space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
            Tasks
          </h1>
          <p className='text-muted-foreground'>Manage and track your project tasks</p>
        </div>
      </div>
      <TaskList />
    </div>
  );
}
