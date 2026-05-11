import type { Dispatch, SetStateAction } from "react";

export type Role = "admin" | "instructor" | "student";

export type Page =
  | "home"
  | "about"
  | "courses"
  | "detail"
  | "login"
  | "register"
  | "dashboard";

export type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
};

export type Course = {
  _id: string;
  title: string;
  category: string;
  level: string;
  description: string;
  price: number;
  instructor: { _id?: string; name: string; email: string };
  lessons: {
    _id: string;
    title: string;
    duration: string;
    content?: string;
    isPreview?: boolean;
  }[];
  assignments?: { _id: string; title: string; maxMarks: number }[];
  quizzes?: { _id: string; title: string; totalMarks: number }[];
};

export type Enrollment = {
  _id: string;
  progress: number;
  status: string;
  course: Course;
};

export type Dashboard = {
  totals: {
    students: number;
    instructors: number;
    courses: number;
    enrollments: number;
    submissions: number;
    quizAttempts: number;
  };
  recentCourses: Course[];
};

export type AuthForm = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type CourseForm = {
  title: string;
  category: string;
  level: string;
  price: number;
  description: string;
};

export type LessonForm = {
  courseId: string;
  title: string;
  duration: string;
  content: string;
};

export type LmsContextValue = {
  page: Page;
  user: User | null;
  courses: Course[];
  instructorCourses: Course[];
  managedCourses: Course[];
  filteredCourses: Course[];
  activeCourse: Course;
  enrollments: Enrollment[];
  users: User[];
  dashboard: Dashboard;
  query: string;
  mobileNavOpen: boolean;
  showPassword: boolean;
  editingCourseId: string;
  authForm: AuthForm;
  courseForm: CourseForm;
  lessonForm: LessonForm;
  setQuery: Dispatch<SetStateAction<string>>;
  setMobileNavOpen: Dispatch<SetStateAction<boolean>>;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  setAuthForm: Dispatch<SetStateAction<AuthForm>>;
  setCourseForm: Dispatch<SetStateAction<CourseForm>>;
  setLessonForm: Dispatch<SetStateAction<LessonForm>>;
  navigate: (nextPage: Page, path?: string) => void;
  viewCourse: (course: Course) => void;
  handleAuth: (mode: "login" | "register") => Promise<void>;
  signOut: () => void;
  enrollInCourse: (course: Course) => Promise<void>;
  createCourse: () => Promise<void>;
  editCourse: (course: Course) => void;
  updateCourse: () => Promise<void>;
  resetCourseForm: () => void;
  deleteCourse: (course: Course) => Promise<void>;
  uploadLesson: () => Promise<void>;
  deleteUser: (targetUser: User) => Promise<void>;
};
