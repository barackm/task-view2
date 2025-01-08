export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  name: string;
};

export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
