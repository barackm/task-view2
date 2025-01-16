"use server";

import { createClient } from "@/utils/supabase/server";
import { Task, CreateTaskInput } from "@/types/tasks";
import { revalidatePath } from "next/cache";
import { User } from "@/types/auth";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchAssigneeCandidates(taskId: string): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: "1",
      full_name: "John Doe",
      email: "johndoe@gmail.com",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      about:
        "Experienced software engineer with a strong focus on backend development.",
      skills: "JavaScript, Node.js, Express, MongoDB, Docker",
    },
    {
      id: "2",
      full_name: "Jane Smith",
      email: "janesmith@gmail.com",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      about:
        "Creative frontend developer specializing in UI/UX design and React applications.",
      skills: "HTML, CSS, JavaScript, React, TailwindCSS, Figma",
    },
    {
      id: "3",
      full_name: "Mike Johnson",
      email: "mikej@gmail.com",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      about:
        "DevOps engineer with expertise in CI/CD pipelines and cloud infrastructure.",
      skills: "AWS, Kubernetes, Jenkins, Terraform, Ansible",
    },
    {
      id: "4",
      full_name: "Sarah Wilson",
      email: "sarahw@gmail.com",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      about:
        "Data analyst passionate about transforming data into actionable insights.",
      skills: "Python, SQL, Tableau, Power BI, Pandas, NumPy",
    },
    {
      id: "5",
      full_name: "David Brown",
      email: "davidb@gmail.com",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      about:
        "Full-stack developer with a strong foundation in modern web technologies.",
      skills: "JavaScript, TypeScript, React, Next.js, Node.js, GraphQL",
    },
  ];
}
