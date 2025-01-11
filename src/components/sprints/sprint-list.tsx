"use client";

import useSWR from "swr";
import { getSprintsAsync } from "@/actions/sprints";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { SprintStatus } from "@/types/sprints";
import { Calendar, ChevronRight } from "lucide-react";

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
    <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
      {sprints.map((sprint) => (
        <Card
          key={sprint.id}
          className='group relative backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-gray-200 dark:border-gray-800'
        >
          <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity' />

          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-xl font-semibold tracking-tight group-hover:text-primary transition-colors'>
                {sprint.name}
              </h3>
              <Badge
                variant={sprint.status === SprintStatus.ACTIVE ? "default" : "secondary"}
                className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider
                  ${
                    sprint.status === SprintStatus.ACTIVE
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  }`}
              >
                {sprint.status}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className='w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500'
                style={{ width: "65%" }}
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className='space-y-4'>
              {/* Sprint Details */}
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div className='flex items-center space-x-2 text-muted-foreground'>
                  <Calendar className='h-4 w-4' />
                  <span>{formatDate(sprint.start_date)}</span>
                </div>
                <div className='flex items-center space-x-2 text-muted-foreground'>
                  <Calendar className='h-4 w-4' />
                  <span>{formatDate(sprint.end_date)}</span>
                </div>
              </div>

              {/* Sprint Stats */}
              <div className='grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-gray-800'>
                <div className='text-center'>
                  <div className='text-xs text-muted-foreground mb-1'>Tasks</div>
                  <div className='text-sm font-semibold'>12</div>
                </div>
                <div className='text-center border-l border-r border-gray-100 dark:border-gray-800'>
                  <div className='text-xs text-muted-foreground mb-1'>Complete</div>
                  <div className='text-sm font-semibold'>8</div>
                </div>
                <div className='text-center'>
                  <div className='text-xs text-muted-foreground mb-1'>Members</div>
                  <div className='text-sm font-semibold'>5</div>
                </div>
              </div>
            </div>

            {/* Hover Action Indicator */}
            <div className='absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity'>
              <ChevronRight className='h-5 w-5 text-primary' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
