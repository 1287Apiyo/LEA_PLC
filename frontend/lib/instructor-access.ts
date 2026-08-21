import { getDb } from "@/lib/firebase/admin";

type Row = Record<string, unknown>;

export interface InstructorScope {
  courseIds: Set<string>;
  /** Courses assigned without a learner target, such as a group class or an instructor profile assignment. */
  courseWideIds: Set<string>;
  learnerIds: Set<string>;
  classIds: Set<string>;
  tutorRequestIds: Set<string>;
}

const INSTRUCTOR_FIELDS = [
  "instructorId",
  "instructor_id",
  "trainerId",
  "trainer_id",
  "assignedInstructorId",
  "assigned_instructor_id",
  "tutorId",
  "tutor_id",
  "mentorId",
  "mentor_id",
  "instructorIds",
  "instructor_ids",
  "assignedInstructorIds",
  "assigned_instructor_ids",
];

const COURSE_FIELDS = [
  "courseId",
  "course_id",
  "courseIds",
  "course_ids",
  "assignedCourseId",
  "assigned_course_id",
  "assignedCourses",
  "assigned_courses",
  "teachingCourses",
  "teaching_courses",
];

const LEARNER_FIELDS = [
  "learnerId",
  "learner_id",
  "learnerIds",
  "learner_ids",
  "assignedLearnerId",
  "assigned_learner_id",
  "assignedLearnerIds",
  "assigned_learner_ids",
  "assignedLearners",
  "assigned_learners",
  "studentId",
  "student_id",
  "studentIds",
  "student_ids",
  "menteeId",
  "mentee_id",
  "menteeIds",
  "mentee_ids",
];

const PROFILE_COURSE_FIELDS = ["courseIds", "course_ids", "assignedCourses", "assigned_courses", "teachingCourses", "teaching_courses"];
const PROFILE_LEARNER_FIELDS = ["learnerIds", "learner_ids", "assignedLearners", "assigned_learners", "studentIds", "student_ids", "mentees", "menteeIds", "mentee_ids"];
const ASSIGNMENT_COLLECTIONS = [
  "classes",
  "assignments",
  "tutor_requests",
  "instructor_assignments",
  "instructor_course_assignments",
  "course_assignments",
  "class_assignments",
  "learner_assignments",
  "teaching_assignments",
];

function idsFrom(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(idsFrom);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  if (value && typeof value === "object") {
    const object = value as Row;
    return [object.id, object.userId, object.user_id, object.learnerId, object.learner_id, object.courseId, object.course_id]
      .flatMap((item) => typeof item === "string" ? [item.trim()] : []);
  }
  return [];
}

function valuesFrom(row: Row, fields: string[]) {
  return fields.flatMap((field) => idsFrom(row[field]));
}

function hasInstructor(row: Row, instructorId: string) {
  return valuesFrom(row, INSTRUCTOR_FIELDS).includes(instructorId);
}

function addAll(target: Set<string>, values: string[]) {
  values.map((value) => value.trim()).filter(Boolean).forEach((value) => target.add(value));
}

function collectAssignment(scope: InstructorScope, row: Row, collection: string) {
  const courses = valuesFrom(row, COURSE_FIELDS);
  const learners = valuesFrom(row, LEARNER_FIELDS);
  const classIds = idsFrom(row.classId ?? row.class_id ?? row.classIds ?? row.class_ids);
  const requestId = String(row.id ?? "").trim();

  addAll(scope.courseIds, courses);
  addAll(scope.learnerIds, learners);
  addAll(scope.classIds, classIds);
  if (collection === "tutor_requests" && requestId) scope.tutorRequestIds.add(requestId);

  // A course assignment without a learner target represents a group/class teaching scope.
  // A tutor request or learner assignment with a learner target remains learner-specific.
  if (courses.length && !learners.length) addAll(scope.courseWideIds, courses);
}

function collectProfile(scope: InstructorScope, row: Row) {
  const courses = PROFILE_COURSE_FIELDS.flatMap((field) => idsFrom(row[field]));
  const learners = PROFILE_LEARNER_FIELDS.flatMap((field) => idsFrom(row[field]));
  addAll(scope.courseIds, courses);
  addAll(scope.courseWideIds, courses);
  addAll(scope.learnerIds, learners);
}

/** Resolve all course, class, and learner scopes an instructor may teach or review. */
export async function getInstructorScope(instructorId: string): Promise<InstructorScope> {
  const db = getDb();
  const scope: InstructorScope = {
    courseIds: new Set<string>(),
    courseWideIds: new Set<string>(),
    learnerIds: new Set<string>(),
    classIds: new Set<string>(),
    tutorRequestIds: new Set<string>(),
  };
  const normalizedId = String(instructorId ?? "").trim();
  if (!normalizedId) return scope;

  const snapshots = await Promise.all([
    ...ASSIGNMENT_COLLECTIONS.map((collection) => db.collection(collection).limit(3000).get()),
    db.collection("users").limit(3000).get(),
    db.collection("instructors").limit(1000).get(),
    db.collection("instructor_profiles").limit(1000).get(),
  ]);

  ASSIGNMENT_COLLECTIONS.forEach((collection, index) => {
    snapshots[index].docs.forEach((doc) => {
      const row = doc.data() as Row;
      const withId = { id: doc.id, ...row };
      if (hasInstructor(withId, normalizedId)) collectAssignment(scope, withId, collection);
    });
  });

  const profileSnapshots = snapshots.slice(ASSIGNMENT_COLLECTIONS.length);
  profileSnapshots[0].docs.forEach((doc) => {
    const row: Row = { id: doc.id, ...(doc.data() as Row) };
    if (doc.id === normalizedId || hasInstructor(row, normalizedId)) collectProfile(scope, row);

    // Some admin flows store the assigned instructor on the learner's profile rather than
    // in a separate assignment document. Preserve that explicit learner relationship.
    const role = String(row.role ?? "").toLowerCase();
    if (role === "learner" && hasInstructor(row, normalizedId)) {
      scope.learnerIds.add(doc.id);
      addAll(scope.courseIds, valuesFrom(row, COURSE_FIELDS));
    }
  });
  profileSnapshots.slice(1).forEach((snapshot) => snapshot.docs.forEach((doc) => {
    const row: Row = { id: doc.id, ...(doc.data() as Row) };
    if (doc.id === normalizedId || hasInstructor(row, normalizedId)) collectProfile(scope, row);
  }));

  return scope;
}

/** Backwards-compatible course-only access used by existing instructor APIs. */
export async function getInstructorCourseIds(instructorId: string) {
  return (await getInstructorScope(instructorId)).courseIds;
}

export async function getInstructorLearnerIds(instructorId: string) {
  return (await getInstructorScope(instructorId)).learnerIds;
}

export function instructorCanAccessCourse(scope: InstructorScope, courseId: string) {
  return scope.courseIds.has(String(courseId ?? "").trim());
}

export function instructorCanAccessLearner(scope: InstructorScope, learnerId: string, courseId?: string) {
  const learner = String(learnerId ?? "").trim();
  const course = String(courseId ?? "").trim();
  return Boolean(learner && (scope.learnerIds.has(learner) || (course && scope.courseWideIds.has(course))));
}

export async function instructorCanAccessCourseById(instructorId: string, courseId: string) {
  return instructorCanAccessCourse(await getInstructorScope(instructorId), courseId);
}

export async function instructorCanAccessLearnerById(instructorId: string, learnerId: string, courseId?: string) {
  return instructorCanAccessLearner(await getInstructorScope(instructorId), learnerId, courseId);
}

/** Find instructors explicitly assigned to a learner/course for notifications and discussion routing. */
export async function getInstructorIdsForLearnerCourse(courseId: string, learnerId?: string) {
  const db = getDb();
  const normalizedCourseId = String(courseId ?? "").trim();
  const normalizedLearnerId = String(learnerId ?? "").trim();
  const result = new Set<string>();
  if (!normalizedCourseId) return result;

  const assignmentSnapshots = await Promise.all(
    ASSIGNMENT_COLLECTIONS.map((collection) => db.collection(collection).limit(3000).get()),
  );
  assignmentSnapshots.forEach((snapshot) => snapshot.docs.forEach((doc) => {
    const row: Row = { id: doc.id, ...(doc.data() as Row) };
    const courses = valuesFrom(row, COURSE_FIELDS);
    if (!courses.includes(normalizedCourseId)) return;
    const learners = valuesFrom(row, LEARNER_FIELDS);
    if (normalizedLearnerId && learners.length && !learners.includes(normalizedLearnerId)) return;
    addAll(result, valuesFrom(row, INSTRUCTOR_FIELDS));
  }));

  const profileSnapshots = await Promise.all([
    db.collection("users").limit(3000).get(),
    db.collection("instructors").limit(1000).get(),
    db.collection("instructor_profiles").limit(1000).get(),
  ]);
  profileSnapshots.forEach((snapshot) => snapshot.docs.forEach((doc) => {
    const row: Row = { id: doc.id, ...(doc.data() as Row) };
    const role = String(row.role ?? "").toLowerCase();
    const courses = PROFILE_COURSE_FIELDS.flatMap((field) => idsFrom(row[field]));
    const learners = PROFILE_LEARNER_FIELDS.flatMap((field) => idsFrom(row[field]));
    if (["instructor", "tutor"].includes(role) && courses.includes(normalizedCourseId) && (!normalizedLearnerId || !learners.length || learners.includes(normalizedLearnerId))) {
      result.add(doc.id);
      addAll(result, valuesFrom(row, INSTRUCTOR_FIELDS));
    }
    if (normalizedLearnerId && doc.id === normalizedLearnerId && courses.includes(normalizedCourseId)) {
      addAll(result, valuesFrom(row, INSTRUCTOR_FIELDS));
    }
  }));

  return result;
}
