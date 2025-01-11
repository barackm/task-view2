import { SprintList } from "@/components/sprints/sprint-list";
import { CreateSprintModal } from "@/components/sprints/create-sprint-modal";

export default function SprintsPage() {
  return (
    <div className='container py-8 space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
            Sprints
          </h1>
          <p className='text-muted-foreground'>Manage and track your sprint cycles</p>
        </div>
        <CreateSprintModal />
      </div>
      <div className='relative'>
        <SprintList />
      </div>
    </div>
  );
}
