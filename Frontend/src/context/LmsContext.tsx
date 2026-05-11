/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useToast } from "../ToastSystem";
import { apiRequest } from "../services/api";
import {
  demoUsers,
  fallbackCourses,
  fallbackDashboard,
} from "../services/demoData";
import {
  getInitialPath,
  normalizePath,
  pageToPath,
  routeToPage,
} from "../routes/appRoutes";
import type {
  Course,
  CourseForm,
  Dashboard,
  Enrollment,
  LessonForm,
  LmsContextValue,
  Page,
  Role,
  User,
} from "../types/lms";

const LmsContext = createContext<LmsContextValue | undefined>(undefined);

const defaultCourseForm: CourseForm = {
  title: "New MERN Course",
  category: "Web Development",
  level: "Beginner",
  price: 5000,
  description: "A practical LMS course with lessons, assignments, and quizzes.",
};

const defaultLessonForm: LessonForm = {
  courseId: fallbackCourses[0]._id,
  title: "New lesson",
  duration: "30 min",
  content: "Lesson content",
};

export function LmsProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState(getInitialPath);
  const [token, setToken] = useState(localStorage.getItem("lms_token") || "");
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("lms_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [courses, setCourses] = useState<Course[]>(fallbackCourses);
  const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course>(
    fallbackCourses[0],
  );
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [users, setUsers] = useState<User[]>(demoUsers);
  const [dashboard, setDashboard] = useState<Dashboard>(fallbackDashboard);
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState("");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "student@lms.com",
    password: "password123",
    role: "student" as Role,
  });
  const [courseForm, setCourseForm] = useState<CourseForm>(defaultCourseForm);
  const [lessonForm, setLessonForm] = useState<LessonForm>(defaultLessonForm);

  const page = routeToPage(currentPath);
  const managedCourses =
    user?.role === "instructor" ? instructorCourses : courses;
  const { success, error: toastError, warning, info } = useToast();

  const apiFetch = useCallback(
    async <T = unknown,>(path: string, options = {}) =>
      apiRequest<T>(path, token, options),
    [token],
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    let ignore = false;

    apiFetch<Course[]>("/courses")
      .then((data) => {
        if (ignore) return;
        setCourses(data.length ? data : fallbackCourses);
        setSelectedCourse(data[0] || fallbackCourses[0]);
      })
      .catch(() => {
        if (!ignore) info("Using demo course data. Backend not available.");
      });

    return () => {
      ignore = true;
    };
  }, [apiFetch, info]);

  useEffect(() => {
    if (!user || !token) return undefined;

    let ignore = false;

    const loadDashboardData = async () => {
      try {
        if (user.role === "student") {
          const data = await apiFetch<Enrollment[]>("/enrollments/mine");
          if (!ignore) setEnrollments(data);
        }
        if (user.role === "instructor" || user.role === "admin") {
          const data = await apiFetch<Dashboard>("/dashboard");
          if (!ignore) setDashboard(data);
        }
        if (user.role === "instructor") {
          const data = await apiFetch<Course[]>("/courses/mine");
          if (!ignore) {
            setInstructorCourses(data);
            setLessonForm((current) => ({
              ...current,
              courseId: data[0]?._id || current.courseId,
            }));
          }
        }
        if (user.role === "admin") {
          const data = await apiFetch<User[]>("/users");
          if (!ignore) setUsers(data);
        }
      } catch (error) {
        if (!ignore)
          toastError(
            error instanceof Error
              ? error.message
              : "Failed to load dashboard data.",
          );
      }
    };

    loadDashboardData();

    return () => {
      ignore = true;
    };
  }, [apiFetch, token, user, toastError]);

  const filteredCourses = useMemo(() => {
    const term = query.toLowerCase();
    return courses.filter((course) =>
      [course.title, course.category, course.level, course.description].some(
        (value) => value.toLowerCase().includes(term),
      ),
    );
  }, [courses, query]);

  const activeCourse = useMemo(() => {
    if (!currentPath.startsWith("/courses/")) return selectedCourse;

    const courseId = decodeURIComponent(currentPath.replace("/courses/", ""));
    return courses.find((course) => course._id === courseId) || selectedCourse;
  }, [courses, currentPath, selectedCourse]);

  const navigate = (nextPage: Page, path = pageToPath(nextPage)) => {
    const cleanPath = normalizePath(path);
    window.history.pushState({}, "", cleanPath);
    setCurrentPath(cleanPath);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const viewCourse = (course: Course) => {
    setSelectedCourse(course);
    navigate("detail", `/courses/${encodeURIComponent(course._id)}`);
  };

  const handleAuth = async (mode: "login" | "register") => {
    try {
      const body =
        mode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;
      const data = await apiFetch<{ user: User; token: string }>(
        `/auth/${mode}`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );
      localStorage.setItem("lms_token", data.token);
      localStorage.setItem("lms_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      success(`Welcome, ${data.user.name}.`);
      navigate("dashboard");
    } catch (error) {
      const demo = demoUsers.find(
        (account) => account.email === authForm.email,
      );
      if (demo) {
        setUser(demo);
        localStorage.setItem("lms_user", JSON.stringify(demo));
        info(
          `Demo ${demo.role} dashboard opened. Use backend login for live data.`,
        );
        navigate("dashboard");
        return;
      }
      toastError(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    }
  };

  const signOut = () => {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
    setToken("");
    setUser(null);
    setEnrollments([]);
    info("Signed out successfully.");
    navigate("home");
  };

  const enrollInCourse = async (course: Course) => {
    if (!user) {
      warning(`Sign in as a student to enroll in ${course.title}.`);
      navigate("login", "/signin");
      return;
    }
    if (user.role !== "student") {
      warning("Only students can enroll in courses.");
      return;
    }

    try {
      const enrollment = token
        ? await apiFetch<Enrollment>(`/enrollments/${course._id}`, {
            method: "POST",
          })
        : { _id: `demo-${course._id}`, course, progress: 0, status: "active" };
      setEnrollments((current) => [
        enrollment,
        ...current.filter((item) => item.course._id !== course._id),
      ]);
      success(`Enrolled in ${course.title}.`);
      navigate("dashboard");
    } catch (error) {
      toastError(error instanceof Error ? error.message : "Enrollment failed.");
    }
  };

  const resetCourseForm = () => {
    setEditingCourseId("");
    setCourseForm(defaultCourseForm);
  };

  const createCourse = async () => {
    if (!user || !["admin", "instructor"].includes(user.role)) return;
    const payload = { ...courseForm, lessons: [], published: true };
    try {
      const course = token
        ? await apiFetch<Course>("/courses", {
            method: "POST",
            body: JSON.stringify(payload),
          })
        : {
            ...payload,
            _id: `demo-course-${courses.length + instructorCourses.length + 1}`,
            instructor: {
              _id: user._id || user.id,
              name: user.name,
              email: user.email,
            },
            lessons: [],
          };
      setCourses((current) => [course, ...current]);
      if (user.role === "instructor") {
        setInstructorCourses((current) => [course, ...current]);
        setLessonForm((current) => ({ ...current, courseId: course._id }));
      }
      success("Course created successfully.");
      resetCourseForm();
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Course creation failed.",
      );
    }
  };

  const editCourse = (course: Course) => {
    setEditingCourseId(course._id);
    setCourseForm({
      title: course.title,
      category: course.category,
      level: course.level,
      price: course.price,
      description: course.description,
    });
    info(`Editing ${course.title}.`);
  };

  const updateCourse = async () => {
    if (!editingCourseId) return;
    const payload = { ...courseForm };

    try {
      const updatedCourse =
        token && !editingCourseId.startsWith("course-")
          ? await apiFetch<Course>(`/courses/${editingCourseId}`, {
              method: "PUT",
              body: JSON.stringify(payload),
            })
          : {
              ...(managedCourses.find(
                (course) => course._id === editingCourseId,
              ) || fallbackCourses[0]),
              ...payload,
            };

      setCourses((current) =>
        current.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course,
        ),
      );
      setInstructorCourses((current) =>
        current.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course,
        ),
      );
      success("Course updated successfully.");
      resetCourseForm();
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Course update failed.",
      );
    }
  };

  const deleteCourse = async (course: Course) => {
    try {
      if (token && !course._id.startsWith("course-")) {
        await apiFetch(`/courses/${course._id}`, { method: "DELETE" });
      }
      setCourses((current) =>
        current.filter((item) => item._id !== course._id),
      );
      setInstructorCourses((current) =>
        current.filter((item) => item._id !== course._id),
      );
      if (editingCourseId === course._id) resetCourseForm();
      success("Course deleted successfully.");
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Course delete failed.",
      );
    }
  };

  const uploadLesson = async () => {
    const targetCourse = managedCourses.find(
      (course) => course._id === lessonForm.courseId,
    );
    if (!targetCourse) return;

    const lesson = {
      _id: `lesson-${targetCourse.lessons.length + 1}`,
      title: lessonForm.title,
      duration: lessonForm.duration,
      content: lessonForm.content,
    };
    try {
      const updatedCourse =
        token && !targetCourse._id.startsWith("course-")
          ? await apiFetch<Course>(`/courses/${targetCourse._id}/lessons`, {
              method: "POST",
              body: JSON.stringify(lessonForm),
            })
          : { ...targetCourse, lessons: [...targetCourse.lessons, lesson] };
      setCourses((current) =>
        current.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course,
        ),
      );
      setInstructorCourses((current) =>
        current.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course,
        ),
      );
      success("Lesson uploaded successfully.");
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Lesson upload failed.",
      );
    }
  };

  const deleteUser = async (targetUser: User) => {
    const id = targetUser._id || targetUser.id;
    if (!id) return;
    try {
      if (token && !id.includes("demo")) {
        await apiFetch(`/users/${id}`, { method: "DELETE" });
      }
      setUsers((current) =>
        current.filter((item) => (item._id || item.id) !== id),
      );
      success("User deleted successfully.");
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "User delete failed.",
      );
    }
  };

  const value: LmsContextValue = {
    page,
    user,
    courses,
    instructorCourses,
    managedCourses,
    filteredCourses,
    activeCourse,
    enrollments,
    users,
    dashboard,
    query,
    mobileNavOpen,
    showPassword,
    editingCourseId,
    authForm,
    courseForm,
    lessonForm,
    setQuery,
    setMobileNavOpen,
    setShowPassword,
    setAuthForm,
    setCourseForm,
    setLessonForm,
    navigate,
    viewCourse,
    handleAuth,
    signOut,
    enrollInCourse,
    createCourse,
    editCourse,
    updateCourse,
    resetCourseForm,
    deleteCourse,
    uploadLesson,
    deleteUser,
  };

  return <LmsContext.Provider value={value}>{children}</LmsContext.Provider>;
}

export function useLms() {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error("useLms must be used within an LmsProvider");
  }
  return context;
}
