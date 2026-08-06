"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";

export const DASHBOARD_KEYS = {
  admin: ["dashboard", "admin"] as const,
  instructor: ["dashboard", "instructor"] as const,
  learner: ["dashboard", "learner"] as const,
};

export function useAdminDashboard() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.admin,
    queryFn: () => dashboardService.admin(),
    staleTime: 60 * 1000,
  });
}

export function useInstructorDashboard() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.instructor,
    queryFn: () => dashboardService.instructor(),
    staleTime: 60 * 1000,
  });
}

export function useLearnerDashboard() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.learner,
    queryFn: () => dashboardService.learner(),
    staleTime: 60 * 1000,
  });
}
