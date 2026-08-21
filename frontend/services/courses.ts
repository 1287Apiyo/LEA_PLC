import { api } from "@/lib/api-client";
import type { LessonContent } from "@/components/learner/lesson-notes";

export interface CourseCatalogItem {
  id: string;
  title: string;
  description: string;
  summary: string;
  programme_id: string;
  programme: string;
  programme_order: number;
  sequence: number;
  level: string;
  track: string;
  outcomes: string[];
  skills: string[];
  deliverable: string;
  project: string;
  trend_tags: string[];
  lessons_count: number;
  total_minutes: number;
  duration_weeks: number;
  resource_count?: number;
  video_count?: number;
  coding: boolean;

  playground_language: string | null;
  workspace_type: "scratch" | "code" | null;
  status: string;
  enrolled: boolean;
  progress: number | null;
  enrolment_id: string | null;
}

export interface CourseResource {
  id: string;
  title: string;
  type: string;
  url: string;
  download_url?: string;
  description?: string;
}

export type SubmissionStatus = "submitted" | "graded" | "approved" | "revision_requested";

export interface SubmissionVersion {
  version: number;
  response_text: string;
  evidence_url?: string | null;
  submitted_at: string;
  status: SubmissionStatus;
}

export interface CourseAssignmentSubmission {
  id: string;
  course_id: string;
  lesson_id: string;
  response_text: string;
  evidence_url?: string | null;
  status: SubmissionStatus;
  submitted_at: string;
  submission_count?: number;
  last_edited_at?: string;
  versions?: SubmissionVersion[];
  grade?: number | null;
  feedback?: string;
  graded_at?: string;
  graded_by?: string;
  rubric?: Record<string, number>;
  resubmission_requested?: boolean;
} 

export interface LessonQuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface LessonQuiz {
  pass_percent: number;
  questions: LessonQuizQuestion[];
}

export interface QuizExplanation {
  question_id: string;
  selected_index: string | null;
  correct_index: number;
  correct: boolean;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  course_id: string;
  lesson_id: string;
  score: number;
  passed: boolean;
  pass_percent: number;
  correct_count: number;
  question_count: number;
  attempt_number: number;
  submitted_at: string;
  explanations?: QuizExplanation[];
}

export interface CourseLesson {
  id: string;
  title: string;
  duration_minutes: number;
  video_url: string;
  video_source?: string;
  description: string;
  notes: string;
  lesson_content?: LessonContent | null;
  assignment: string;
  resources?: CourseResource[];
  quiz?: LessonQuiz;
  mastery?: {
    passed: boolean;
    best_score: number | null;
    attempts: number;
    latest: QuizAttempt | null;
  };
  submission?: CourseAssignmentSubmission | null;
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
  summary?: string;
  programme: string;
  programme_id?: string;
  sequence?: number;
  level?: string;
  track?: string;
  outcomes?: string[];
  skills?: string[];
  deliverable?: string;
  project?: string;
  trend_tags?: string[];
  duration_weeks?: number;
  resource_count?: number;
  video_count?: number;
  resources?: CourseResource[];
  course_materials?: CourseResource[];

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
  submitAssignment: (
    courseId: string,
    lessonId: string,
    payload: { response_text: string; evidence_url?: string }
  ) =>
    api.post<{ data: CourseAssignmentSubmission }>(
      `/courses/${courseId}/lessons/${lessonId}/submission`,
      payload
    ),
  submitQuiz: (
    courseId: string,
    lessonId: string,
    answers: Record<string, string>,
  ) =>
    api.post<{ data: QuizAttempt }>(
      `/courses/${courseId}/lessons/${lessonId}/quiz`,
      { answers },
    ),
};
