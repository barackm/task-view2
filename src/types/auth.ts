export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar: string | null;
  skills: string;
  about: string;
}

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  names: string;
};

export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
