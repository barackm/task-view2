"use client";

import { Task } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { fetchAssigneeCandidates, updateTaskAssigneeAsync } from "@/actions/tasks";
import { fetchUsers } from "@/actions/users";
import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSWR from "swr";
import { SparklesIcon, Loader2, InfoIcon } from "lucide-react";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import { User } from "@/types/auth";

interface AssigneeCellProps {
  row: Row<Task>;
}

const LoadingMenuItem = () => (
  <div className='flex items-center px-2 py-2 text-sm opacity-50'>
    <div className='h-6 w-6 mr-2 rounded-full bg-muted animate-pulse' />
    <div className='h-4 w-24 bg-muted animate-pulse rounded' />
  </div>
);

export function AssigneeCell({ row }: AssigneeCellProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<User[]>([]);
  const [loadingAiSuggestions, setLoadingAiSuggestions] = useState(false);
  const task = row.original;
  const assignee = task.assignee;

  const { data: profiles = [] } = useSWR(!showAiSuggestions ? "profiles" : null, fetchUsers);

  const handleFetchSuggestions = async () => {
    setLoadingAiSuggestions(true);
    try {
      const suggestions = await fetchAssigneeCandidates(task.id);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setLoadingAiSuggestions(false);
    }
  };

  const candidates = showAiSuggestions ? aiSuggestions : profiles;
  const isLoadingCandidates = showAiSuggestions ? loadingAiSuggestions : false;

  const handleToggleAiSuggestions = async () => {
    const newShowAiSuggestions = !showAiSuggestions;
    setShowAiSuggestions(newShowAiSuggestions);
    if (newShowAiSuggestions) {
      await handleFetchSuggestions();
    }
  };

  const handleAssign = async (assigneeId: string) => {
    try {
      setIsLoading(true);
      await updateTaskAssigneeAsync(task.id, assigneeId);
    } catch (error) {
      console.error("Failed to assign task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-1'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 flex-1 px-2'>
            <div className='flex items-center gap-2 w-full'>
              {" "}
              {assignee ? (
                <>
                  <Avatar className='h-6 w-6 shrink-0'>
                    {" "}
                    <AvatarImage src={assignee.avatar!} />
                    <AvatarFallback>{assignee.full_name![0]}</AvatarFallback>
                  </Avatar>
                  <span className='truncate'>{assignee.full_name}</span>
                </>
              ) : (
                "Unassigned"
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={(e) => {
              e.preventDefault();
              handleToggleAiSuggestions();
            }}
            onSelect={(e) => {
              e.preventDefault();
            }}
            disabled={isLoadingCandidates}
          >
            {isLoadingCandidates && showAiSuggestions ? (
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            ) : (
              <SparklesIcon className='h-4 w-4 mr-2' />
            )}
            {showAiSuggestions ? "Show all profiles" : "Get AI suggestions"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>{showAiSuggestions ? "AI Suggested Assignees" : "Select manually"}</DropdownMenuLabel>
          {isLoadingCandidates ? (
            <>
              <LoadingMenuItem />
              <LoadingMenuItem />
              <LoadingMenuItem />
            </>
          ) : (
            candidates?.map((candidate) => (
              <DropdownMenuItem
                key={candidate.id}
                onClick={(e) => {
                  e.preventDefault();
                  handleAssign(candidate.id);
                }}
                disabled={isLoading}
                className='flex items-center'
              >
                <Avatar className='h-6 w-6 mr-2'>
                  <AvatarImage src={candidate.avatar!} />
                  <AvatarFallback>{candidate.full_name![0]}</AvatarFallback>
                </Avatar>
                <span className='flex-1'>{candidate.full_name}</span>
                {isLoading && <Loader2 className='h-4 w-4 animate-spin ml-2' />}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {assignee && (
        <Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => setShowProfile(true)}>
          <InfoIcon className='h-4 w-4' />
        </Button>
      )}

      <ProfileDialog isOpen={showProfile} onOpenChange={setShowProfile} profile={assignee} />
    </div>
  );
}
