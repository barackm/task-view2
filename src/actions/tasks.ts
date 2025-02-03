"use server";

import { createClient } from "@/utils/supabase/server";
import { Task, CreateTaskInput } from "@/types/tasks";
import { revalidatePath } from "next/cache";
import { User } from "@/types/auth";
import { safeJSONParse } from "@/utils/json";
import axios from "axios";

const BASE_URL = process.env.BACKEND_URL;

export async function getTasksAsync(): Promise<Task[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      assignee:assignee_id(*),
      creator:created_by(*)
    `,
    )
    .order("updated_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getTaskByIdAsync(taskId: string): Promise<Task | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      assignee:assignee_id(*),
      creator:created_by(*)
    `,
    )
    .eq("id", taskId)
    .single();

  if (error) throw error;
  return data;
}

export async function createTaskAsync(task: CreateTaskInput) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").insert(task);

  if (error) throw error;
  revalidatePath("/tasks");
}

export async function updateTaskAssigneeAsync(taskId: string, assigneeId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").update({ assignee_id: assigneeId }).eq("id", taskId);

  console.log({ error });

  if (error) throw error;
  revalidatePath("/tasks");
}

export async function updateTaskAsync(taskId: string, task: Partial<Task>) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").update(task).eq("id", taskId);

  if (error) throw error;
  revalidatePath("/tasks");
}

export async function deleteTaskAsync(taskId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) throw error;
  revalidatePath("/tasks");
}

interface UserTask {
  title: string;
  priority: string;
}

interface TaskData {
  title: string;
  description: string;
  priority: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  skills: string[];
  tasks: UserTask[];
}

interface TaskAssigneeMatchRequest {
  task_data: TaskData;
  users: UserProfile[];
}

export async function fetchAssigneeCandidates(taskId: string): Promise<User[]> {
  const supabase = await createClient();

  const { data: task, error } = await supabase.from("tasks").select("*").eq("id", taskId).single();
  if (error) throw error;

  const { data: users, error: usersError } = await supabase.from("profiles").select(`
      *,
      tasks!tasks_assignee_id_fkey(*)
    `);
  if (usersError) throw usersError;

  const body: TaskAssigneeMatchRequest = {
    task_data: {
      title: task.title,
      description: task.description,
      priority: task.priority,
    },
    users: users.map((user) => ({
      id: user.id,
      full_name: user.full_name,
      skills:
        typeof user.skills === "string"
          ? user.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      tasks:
        user.tasks?.map((t) => ({
          title: t.title,
          priority: t.priority,
        })) || [],
    })),
  };

  try {
    const response = await axios.post(`${BASE_URL}/assignee-candidates`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = response.data;

    let suggestions = [];

    console.log({ responseData });
    if (responseData.raw && typeof responseData.raw === "string") {
      const parsedRaw = safeJSONParse(responseData.raw, { suggestions: [] });
      console.log({ parsedRaw });
      suggestions = parsedRaw.suggestions || [];
    }

    return suggestions
      .map((suggestion: any) => {
        const matchedUser = users.find((user) => user.id === suggestion.user_id);
        if (!matchedUser) return null;

        return matchedUser;
      })
      .filter((user: User | null): user is User => user !== null);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch assignee candidates: ${error.message}`);
    }
    throw error;
  }
}

interface SuggestDescriptionResponse {
  description: string;
}

export async function suggestDescriptionAsync(title: string): Promise<string> {
  try {
    const response = await axios.post<SuggestDescriptionResponse>(
      `${BASE_URL}/suggest-description`,
      { title },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.description;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to get description suggestion: ${error.message}`);
    }
    throw error;
  }
}

interface SuggestDurationResponse {
  duration: string;
  explanation: string;
}

export async function suggestDurationAsync(taskId: string): Promise<SuggestDurationResponse> {
  const task = await getTaskByIdAsync(taskId);
  if (!task || !task.assignee) {
    throw new Error("Task must have an assignee to suggest duration");
  }

  try {
    const response = await axios.post<SuggestDurationResponse>(
      `${BASE_URL}/suggest-duration`,
      {
        title: task.title,
        description: task.description,
        assignee: {
          id: task.assignee.id,
          full_name: task.assignee.full_name,
          skills: task.assignee.skills?.split(",").map((s) => s.trim()),
          tasks: task.assignee.tasks?.map((t) => ({
            title: t.title,
            priority: t.priority,
          })),
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to get duration suggestion: ${error.message}`);
    }
    throw error;
  }
}

export async function updateTaskEstimateAsync(taskId: string, estimate: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ original_estimate: estimate }).eq("id", taskId);

  if (error) throw error;
  revalidatePath("/tasks");
}
