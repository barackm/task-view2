"use client";
import { User } from "@/types/auth";
import { create } from "zustand";

export type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
