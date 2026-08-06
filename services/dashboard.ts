import { api } from "@/lib/api-client";
import type {
  AdminDashboard,
  InstructorDashboard,
  LearnerDashboard,
} from "@/types/dashboard";

/** Dashboard API service — one endpoint per role. */
export const dashboardService = {
  admin: () => api.get<AdminDashboard>("/dashboard/admin"),
  instructor: () => api.get<InstructorDashboard>("/dashboard/instructor"),
  learner: () => api.get<LearnerDashboard>("/dashboard/learner"),
};
