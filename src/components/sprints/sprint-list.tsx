"use client";

import useSWR from "swr";
import { getSprintsAsync } from "@/actions/sprints";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { SprintStatus } from "@/types/sprints";

export function SprintList() {
  const {
    data: sprints,
    error,
    isLoading,
  } = useSWR("sprints", getSprintsAsync, {
    onError: (err) => {
      console.error("Failed to fetch sprints:", err);
    },
  });

  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardHeader className='space-y-2'>
              <div className='h-4 w-3/4 bg-muted rounded' />
              <div className='h-3 w-1/4 bg-muted rounded' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='h-3 w-full bg-muted rounded' />
              <div className='h-3 w-full bg-muted rounded' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-lg border border-destructive p-4 text-destructive'>
        <p>Failed to load sprints. Please try again later.</p>
      </div>
    );
  }

  if (!sprints?.length) {
    return (
      <div className='rounded-lg border border-muted p-4 text-muted-foreground'>
        <p>No sprints found. Create your first sprint to get started.</p>
      </div>
    );
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {sprints.map((sprint) => (
        <Card key={sprint.id}>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold'>{sprint.name}</h3>
              <Badge variant={sprint.status === SprintStatus.ACTIVE ? "default" : "secondary"}>{sprint.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Start Date:</span>
                <span>{formatDate(sprint.start_date)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>End Date:</span>
                <span>{formatDate(sprint.end_date)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
