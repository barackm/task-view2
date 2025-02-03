"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SparklesIcon, Loader2 } from "lucide-react";
import { suggestDurationAsync, updateTaskEstimateAsync } from "@/actions/tasks";
import { toast } from "sonner";
import { z } from "zod";

const estimateSchema = z.object({
  value: z.number().positive(),
  unit: z.enum(["minutes", "hours", "days"]),
});

interface EstimateCellProps {
  task: Task;
}

export function EstimateCell({ task }: EstimateCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [estimate, setEstimate] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");

  // Reset estimate when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setEstimate(task.original_estimate || "");
    }
  }, [isOpen, task.original_estimate]);

  const handleSuggest = async () => {
    if (!task.assignee) {
      toast.error("Task must have an assignee to get AI suggestions");
      return;
    }

    try {
      setIsLoadingSuggestion(true);
      const { duration, explanation } = await suggestDurationAsync(task.id);
      setEstimate(duration);
      setExplanation(explanation);
    } catch {
      toast.error("Failed to get estimate suggestion");
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const [value, unit] = estimate.split(" ");
      const parsed = estimateSchema.parse({
        value: Number(value),
        unit: unit.toLowerCase(),
      });

      await updateTaskEstimateAsync(task.id, `${parsed.value} ${parsed.unit}`);
      setIsOpen(false);
      toast.success("Estimate updated successfully");
    } catch {
      toast.error("Invalid estimate format. Use format: '2 days', '4 hours', or '30 minutes'");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button variant='ghost' size='sm' className='flex items-center gap-2' onClick={() => setIsOpen(true)}>
        {task.original_estimate || "Set estimate"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Estimate</DialogTitle>
            <DialogDescription>
              {task.assignee
                ? "Set the estimated duration for this task. Use AI to get a suggestion based on the assignee's skills."
                : "Set the estimated duration for this task. Assign someone to enable AI suggestions."}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Input
                value={estimate}
                onChange={(e) => setEstimate(e.target.value)}
                placeholder='e.g., 2 days, 4 hours, 30 minutes'
                disabled={isSaving}
              />
              <Button
                variant='outline'
                size='icon'
                onClick={handleSuggest}
                disabled={isLoadingSuggestion || !task.assignee || isSaving}
                title={!task.assignee ? "Assign someone to enable AI suggestions" : "Get AI suggestion"}
              >
                {isLoadingSuggestion ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <SparklesIcon className='h-4 w-4' />
                )}
              </Button>
            </div>

            {explanation && <p className='text-sm text-muted-foreground'>{explanation}</p>}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setIsOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!estimate.trim() || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
