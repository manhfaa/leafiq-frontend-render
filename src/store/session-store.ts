"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { PlanTier, UserProfile } from "@/types";

interface SessionState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (payload: { name: string; email: string; plan: PlanTier }) => void;
  logout: () => void;
  setPlan: (plan: PlanTier) => void;
  updateProfile: (payload: { name: string; email: string }) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: ({ name, email, plan }) =>
        set({
          user: {
            name,
            email,
            avatar: "/avatars/user-demo.svg",
            currentPlan: plan,
          },
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
      setPlan: (plan) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                currentPlan: plan,
              }
            : null,
        })),
      updateProfile: ({ name, email }) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                name,
                email,
              }
            : null,
        })),
    }),
    {
      name: "leafiq-session",
    },
  ),
);
