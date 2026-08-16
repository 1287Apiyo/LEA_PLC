import { api } from "@/lib/api-client";

export interface CourseCatalogItem {
  id: string;
  title: string;
  description: string;
  programme: string;
  lessons_count: number;
  total_minutes: number;
  coding: boolean;
  playground_language: string | null;
  workspace_type: "scratch" | "code" | null;
  status: string;
  enrolled: boolean;
  progress: number | null;
  enrolment_id: string | null;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration_minutes: number;
  video_url: string;
  description: string;
  notes: string;
  assignment: string;
  order: number;
}

export interface CourseEnrolment {
  id: string;
  progress: number;
  completed_lessons: string[];
  next_lesson: string | null;
  enrolled_at: string;
}

export interface CourseDetail {
  id: string;
  title: string;
  description: string;
  programme: string;
  coding: boolean;
  playground_language: string | null;
  workspace_type: "scratch" | "code" | null;
  status: string;
  lessons: CourseLesson[];
  enrolment: CourseEnrolment | null;
}

/** Course lifecycle API — catalog, detail, enroll and lesson completion. */
export const courseService = {
  catalog: () => api.get<{ data: CourseCatalogItem[]; meta: { total: number } }>("/courses"),
  detail: (id: string) => api.get<{ data: CourseDetail }>(`/courses/${id}`),
  enroll: (id: string) => api.post<{ data: CourseEnrolment }>(`/courses/${id}/enroll`),
  completeLesson: (courseId: string, lessonId: string) =>
    api.post<{
      data: { progress: number; completed_lessons: string[]; next_lesson: string | null };
    }>(`/courses/${courseId}/lessons/${lessonId}/complete`),
};
