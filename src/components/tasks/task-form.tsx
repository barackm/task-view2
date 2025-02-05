"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, TaskFormValues } from "@/lib/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, addDays } from "date-fns";
import { Task, TaskPriority, TaskStatus } from "@/types/tasks";
import { cn } from "@/lib/utils";
import { Loader2, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { suggestDescriptionAsync } from "@/actions/tasks";
import { toast } from "sonner";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function TaskForm({ task, onSubmit, isSubmitting }: TaskFormProps) {
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description ?? undefined,
          priority: task.priority,
          status: task.status,
          due_date: task.due_date ? new Date(task.due_date) : undefined,
          assignee_id: task.assignee_id ?? undefined,
          sprint_id: task.sprint_id ?? undefined,
        }
      : {
          priority: TaskPriority.MEDIUM,
          status: TaskStatus.TODO,
          due_date: addDays(new Date(), 3),
        },
  });

  const handleGetSuggestion = async () => {
    const title = form.getValues("title");
    if (!title) {
      toast.error("Please enter a title first");
      return;
    }

    try {
      setIsLoadingSuggestion(true);
      const suggestion = await suggestDescriptionAsync(title);
      form.setValue("description", suggestion);
    } catch (error) {
      toast.error("Failed to get description suggestion");
      console.error(error);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Task title...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center justify-between'>
                <span>Description</span>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleGetSuggestion}
                  disabled={isLoadingSuggestion}
                >
                  {isLoadingSuggestion ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <SparklesIcon className='h-4 w-4' />
                  )}
                  <span className='ml-2'>Suggest</span>
                </Button>
              </FormLabel>
              <FormControl>
                <Textarea placeholder='Task description...' className='min-h-[100px]' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TaskStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='priority'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select priority' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TaskPriority).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='due_date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      //   initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' className='w-full' disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : task ? "Update Task" : "Create Task"}
        </Button>
      </form>
    </Form>
  );
}
