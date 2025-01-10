import { SprintList } from "@/components/sprints/sprint-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SprintsPage() {
  return (
    <div className='container py-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Sprints</h1>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          New Sprint
        </Button>
      </div>
      <div className='mt-6'>
        <SprintList />
      </div>
    </div>
  );
}
