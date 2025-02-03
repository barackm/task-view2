import { Task } from "./tasks";

export interface LoginResponse {
  access_token: string;
  token_type: string;
}
export enum UserRole {
  ADMIN = "Admin",
  USER = "User",
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar: string | null;
  skills: string | null;
  about: string;
  role: UserRole;
  status: UserStatus;
  tasks?: Task[];
  updated_at: string;
}

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export type UpdateUserInput = Pick<User, "full_name" | "avatar" | "skills">;

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  names: string;
};
