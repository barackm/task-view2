export enum SprintStatus {
  ACTIVE = "Active",
  COMPLETED = "Completed",
  ARCHIVED = "Archived",
}

export interface Sprint {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: SprintStatus;
  created_by: string;
  created_at: string;
}

export type CreateSprintData = Omit<Sprint, "id" | "created_by" | "created_at">;
export type UpdateSprintData = Partial<CreateSprintData>;
