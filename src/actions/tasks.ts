"use server";

import { createClient } from "@/utils/supabase/server";
import { Task, CreateTaskInput } from "@/types/tasks";
import { revalidatePath } from "next/cache";
import { User } from "@/types/auth";

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
    `
    )
    .order("created_at", { ascending: false });

  console.log({ error });

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
    `
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

export async function updateTaskAssigneeAsync(
  taskId: string,
  assigneeId: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .update({ assignee_id: assigneeId })
    .eq("id", taskId);

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
  required_skills: string[];
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

  const { data: task, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();
  if (error) throw error;

  const { data: users, error: usersError } = await supabase.from("profiles")
    .select(`
      *,
      tasks!tasks_assignee_id_fkey(*)
    `);
  if (usersError) throw usersError;

  const body: TaskAssigneeMatchRequest = {
    task_data: {
      title: task.title,
      description: task.description,
      required_skills: task.required_skills || [],
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

  const response = await fetch(`${BASE_URL}/assignee-candidates`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch assignee candidates");
  }

  const responseData = await response.json();

  let suggestions = [];
  if (responseData.raw) {
    try {
      const parsedRaw = JSON.parse(responseData.raw);
      suggestions = parsedRaw.suggestions || [];
    } catch (error) {
      console.error("Error parsing raw response:", error);
      suggestions = [];
    }
  }

  return suggestions
    .map((suggestion: any) => {
      const matchedUser = users.find((user) => user.id === suggestion.user_id);
      if (!matchedUser) return null;

      return matchedUser;
    })
    .filter((user: User | null): user is User => user !== null);
}
