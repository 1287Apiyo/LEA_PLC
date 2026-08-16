import { notFound } from "next/navigation";
import { CoursePlayer } from "@/components/learner/course-player";

export const dynamic = "force-dynamic";

/** Learner course player — lessons, videos and the connected coding workspace. */
export default async function LearnerCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();
  return <CoursePlayer courseId={id} />;
}
