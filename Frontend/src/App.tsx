import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  EyeOff,
  GraduationCap,
  Layers3,
  Lock,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import heroImg from "./assets/hero.png";
import { ToastContainer, useToast } from "./ToastSystem";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type Role = "admin" | "instructor" | "student";
type Page =
  | "home"
  | "about"
  | "courses"
  | "detail"
  | "login"
  | "register"
  | "dashboard";

type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
};

type Course = {
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

type Enrollment = {
  _id: string;
  progress: number;
  status: string;
  course: Course;
};

type Dashboard = {
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

const demoUsers: User[] = [
  {
    _id: "admin-demo",
    name: "Admin User",
    email: "admin@lms.com",
    role: "admin",
    isActive: true,
  },
  {
    _id: "instructor-demo",
    name: "Sara Instructor",
    email: "instructor@lms.com",
    role: "instructor",
    isActive: true,
  },
  {
    _id: "student-demo",
    name: "Ali Student",
    email: "student@lms.com",
    role: "student",
    isActive: true,
  },
];

const fallbackCourses: Course[] = [
  {
    _id: "course-1",
    title: "MERN Stack Foundations",
    category: "Web Development",
    level: "Beginner",
    description:
      "Build full-stack LMS features with React, Express, MongoDB, JWT auth, REST APIs, and clean project architecture.",
    price: 12000,
    instructor: {
      _id: "instructor-demo",
      name: "Sara Instructor",
      email: "instructor@lms.com",
    },
    lessons: [
      {
        _id: "l1",
        title: "Project architecture",
        duration: "42 min",
        isPreview: true,
      },
      { _id: "l2", title: "JWT authentication", duration: "55 min" },
      {
        _id: "l3",
        title: "Course APIs and MongoDB relations",
        duration: "48 min",
      },
    ],
    assignments: [{ _id: "a1", title: "Create an Express API", maxMarks: 100 }],
    quizzes: [{ _id: "q1", title: "MERN Basics Quiz", totalMarks: 20 }],
  },
  {
    _id: "course-2",
    title: "Advanced React LMS UI",
    category: "Frontend",
    level: "Intermediate",
    description:
      "Design dashboards, catalogs, enrollment states, and learning progress screens for a real LMS workflow.",
    price: 9000,
    instructor: {
      _id: "instructor-demo",
      name: "Sara Instructor",
      email: "instructor@lms.com",
    },
    lessons: [
      {
        _id: "l4",
        title: "Dashboard layouts",
        duration: "35 min",
        isPreview: true,
      },
      { _id: "l5", title: "API integration patterns", duration: "50 min" },
    ],
    assignments: [{ _id: "a2", title: "React course catalog", maxMarks: 80 }],
    quizzes: [{ _id: "q2", title: "React Workflow Quiz", totalMarks: 15 }],
  },
  {
    _id: "course-3",
    title: "MongoDB for LMS Data",
    category: "Database",
    level: "Advanced",
    description:
      "Model users, courses, lessons, quizzes, enrollments, submissions, and reporting data with Mongoose.",
    price: 10000,
    instructor: {
      _id: "instructor-demo",
      name: "Sara Instructor",
      email: "instructor@lms.com",
    },
    lessons: [
      {
        _id: "l6",
        title: "Schema design",
        duration: "44 min",
        isPreview: true,
      },
      { _id: "l7", title: "Indexes and relationships", duration: "39 min" },
    ],
  },
];

const fallbackDashboard: Dashboard = {
  totals: {
    students: 1,
    instructors: 1,
    courses: 3,
    enrollments: 1,
    submissions: 0,
    quizAttempts: 0,
  },
  recentCourses: fallbackCourses,
};

const reviews = [
  [
    "Ayesha Khan",
    "Frontend Student",
    "The public course flow and project modules made MERN feel practical.",
  ],
  [
    "Hamza Ali",
    "Junior Developer",
    "The LMS structure helped me understand dashboards, APIs, auth, and database relations.",
  ],
  [
    "Maira Shah",
    "CS Student",
    "I could browse first, then sign in and continue from my dashboard. That flow feels natural.",
  ],
];

const normalizePath = (path: string) => {
  if (path === "/") return "/";
  return path.replace(/\/+$/, "");
};

const routeToPage = (path: string): Page => {
  const cleanPath = normalizePath(path);
  if (cleanPath === "/about") return "about";
  if (cleanPath === "/courses") return "courses";
  if (cleanPath.startsWith("/courses/")) return "detail";
  if (
    cleanPath === "/login" ||
    cleanPath === "/signin" ||
    cleanPath === "/sign-in"
  )
    return "login";
  if (
    cleanPath === "/register" ||
    cleanPath === "/signup" ||
    cleanPath === "/sign-up"
  )
    return "register";
  if (cleanPath === "/dashboard") return "dashboard";
  return "home";
};

const pageToPath = (page: Page) => {
  if (page === "home") return "/";
  if (page === "detail") return "/courses";
  return `/${page}`;
};

const getInitialPath = () => {
  if (window.location.hash === "#courses") {
    window.history.replaceState({}, "", "/courses");
    return "/courses";
  }

  return normalizePath(window.location.pathname);
};

function App() {
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
  const [courseForm, setCourseForm] = useState({
    title: "New MERN Course",
    category: "Web Development",
    level: "Beginner",
    price: 5000,
    description:
      "A practical LMS course with lessons, assignments, and quizzes.",
  });
  const [lessonForm, setLessonForm] = useState({
    courseId: fallbackCourses[0]._id,
    title: "New lesson",
    duration: "30 min",
    content: "Lesson content",
  });

  const page = routeToPage(currentPath);
  const managedCourses =
    user?.role === "instructor" ? instructorCourses : courses;
  const { success, error: toastError, warning, info } = useToast();

  const apiFetch = useCallback(
    async <T = unknown,>(path: string, options: any = {}): Promise<T> => {
      const response = await axios<T>({
        url: `${API_URL}${path}`,
        method: options.method || "GET",
        data: options.body ?? undefined,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      });
      return response.data;
    },
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

  const resetCourseForm = () => {
    setEditingCourseId("");
    setCourseForm({
      title: "New MERN Course",
      category: "Web Development",
      level: "Beginner",
      price: 5000,
      description:
        "A practical LMS course with lessons, assignments, and quizzes.",
    });
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

  const renderHeader = () => (
    <header className="site-header">
      <button
        className="brand plain-button"
        type="button"
        onClick={() => navigate("home")}
        aria-label="Punjab LMS home"
      >
        <span className="brand-mark">
          <GraduationCap size={26} />
        </span>
        <span>
          <strong>Punjab LMS</strong>
          <small>MERN learning platform</small>
        </span>
      </button>
      <button
        className="icon-button menu-button"
        type="button"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav
        className={mobileNavOpen ? "site-nav open" : "site-nav"}
        aria-label="Primary navigation"
      >
        <button type="button" onClick={() => navigate("home")}>
          Home
        </button>
        <button type="button" onClick={() => navigate("about")}>
          About
        </button>
        <button type="button" onClick={() => navigate("courses")}>
          Courses
        </button>
        {user && (
          <button type="button" onClick={() => navigate("dashboard")}>
            Dashboard
          </button>
        )}
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            <span className="user-pill">
              <ShieldCheck size={16} />
              {user.name} - {user.role}
            </span>
            <button className="ghost-button" type="button" onClick={signOut}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="ghost-button"
              type="button"
              onClick={() => navigate("login", "/signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => navigate("register", "/signup")}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );

  const renderCourseCards = (items = filteredCourses) => (
    <div className="course-grid">
      {items.map((course) => (
        <article className="course-card" key={course._id}>
          <div className="course-topline">
            <span>{course.category}</span>
            <span>{course.level}</span>
          </div>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <div className="course-details">
            <span>
              <Clock3 size={16} />
              {course.lessons.length} lessons
            </span>
            <span>
              <Users size={16} />
              {course.instructor?.name || "Instructor"}
            </span>
          </div>
          <div className="course-footer">
            <strong>Rs {course.price.toLocaleString()}</strong>
            <button type="button" onClick={() => viewCourse(course)}>
              View details
            </button>
          </div>
        </article>
      ))}
    </div>
  );

  const renderHome = () => (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={16} />
            Full stack final project ready
          </span>
          <h1>Learn MERN by building a real LMS from start to finish.</h1>
          <p>
            Browse courses publicly, inspect the course details, then register
            or login from the header when you are ready to continue.
          </p>
          <div className="hero-actions">
            <button type="button" onClick={() => navigate("courses")}>
              Explore courses <ArrowRight size={18} />
            </button>
            <button
              className="ghost-button light"
              type="button"
              onClick={() => navigate("register", "/signup")}
            >
              Create account
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <img src={heroImg} alt="LMS dashboard preview" />
          <div className="floating-card progress-card">
            <span>Course progress</span>
            <strong>62%</strong>
            <div className="progress-track">
              <span />
            </div>
          </div>
          <div className="floating-card lesson-card">
            <BookOpen size={20} />
            <span>Lessons, quizzes, assignments</span>
          </div>
        </div>
      </section>
      <section className="stats-strip">
        {[
          "3 user roles",
          "Public course pages",
          "Role dashboards",
          "Analytics reports",
        ].map((item) => (
          <div key={item}>
            <strong>{item.split(" ")[0]}</strong>
            <span>{item.replace(item.split(" ")[0], "").trim()}</span>
          </div>
        ))}
      </section>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <BookOpen size={16} />
              Featured courses
            </span>
            <h2>Start with a course that matches your goal.</h2>
          </div>
        </div>
        {renderCourseCards(courses.slice(0, 3))}
      </section>
      <section className="feature-band">
        <div className="feature-copy">
          <span className="eyebrow">
            <Layers3 size={16} />
            Platform flow
          </span>
          <h2>Public browsing first. Role dashboard after login.</h2>
          <p>
            The app supports admin, instructor, and student workflows without
            hiding the course catalog behind authentication.
          </p>
        </div>
        <div className="step-list">
          {[
            "Browse courses",
            "Open course detail",
            "Login or register",
            "Use role dashboard",
          ].map((step, index) => (
            <article key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{step}</h3>
                <p>Designed as a clear LMS user journey.</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      {renderReviews()}
    </>
  );

  const renderAbout = () => (
    <section className="page-block">
      <span className="eyebrow">
        <GraduationCap size={16} />
        About Punjab LMS
      </span>
      <h1>Built for a complete MERN final project presentation.</h1>
      <p className="lead">
        Punjab LMS demonstrates public pages, protected role dashboards,
        authentication, course management, enrollment, lessons, users, and
        analytics in one project structure.
      </p>
      <div className="benefit-grid">
        {[
          [
            "Admin control",
            "View and delete users, manage courses, and inspect analytics.",
          ],
          [
            "Instructor tools",
            "Create, edit, delete courses, and upload lessons.",
          ],
          [
            "Student learning",
            "Register, login, browse courses, enroll, and view enrolled courses.",
          ],
        ].map(([title, text]) => (
          <article className="benefit-card" key={title}>
            <CheckCircle2 size={22} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );

  const renderCoursesPage = () => (
    <section className="page-block">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <BookOpen size={16} />
            Course listing
          </span>
          <h1>Browse available courses.</h1>
        </div>
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses"
          />
        </label>
      </div>
      {renderCourseCards()}
    </section>
  );

  const renderCourseDetail = () => (
    <section className="page-block detail-layout">
      <article className="detail-main">
        <span className="eyebrow">
          <BookOpen size={16} />
          Course detail
        </span>
        <h1>{activeCourse.title}</h1>
        <p className="lead">{activeCourse.description}</p>
        <div className="detail-meta">
          <span>{activeCourse.category}</span>
          <span>{activeCourse.level}</span>
          <span>Rs {activeCourse.price.toLocaleString()}</span>
        </div>
        <h2>Lessons</h2>
        <div className="lesson-list">
          {activeCourse.lessons.map((lesson, index) => (
            <div className="lesson-item" key={lesson._id}>
              <span>{index + 1}</span>
              <div>
                <strong>{lesson.title}</strong>
                <small>{lesson.duration}</small>
              </div>
            </div>
          ))}
        </div>
      </article>
      <aside className="detail-side">
        <h2>Ready to start?</h2>
        <p>Enroll to add this course into your student dashboard.</p>
        <button type="button" onClick={() => enrollInCourse(activeCourse)}>
          Enroll in course <ArrowRight size={18} />
        </button>
      </aside>
    </section>
  );

  const renderAuthPage = (mode: "login" | "register") => (
    <section className="auth-page">
      <div className="auth-card inline-auth">
        <span className="eyebrow">
          <Lock size={16} />
          {mode === "login" ? "Login page" : "Register page"}
        </span>
        <h1>{mode === "login" ? "Welcome back." : "Create your account."}</h1>
        <div className="auth-form">
          {mode === "register" && (
            <input
              value={authForm.name}
              onChange={(event) =>
                setAuthForm({ ...authForm, name: event.target.value })
              }
              placeholder="Full name"
            />
          )}
          <input
            value={authForm.email}
            onChange={(event) =>
              setAuthForm({ ...authForm, email: event.target.value })
            }
            placeholder="Email"
            type="email"
          />
          <label className="password-field">
            <input
              value={authForm.password}
              onChange={(event) =>
                setAuthForm({ ...authForm, password: event.target.value })
              }
              placeholder="Password"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </label>
          {mode === "register" && (
            <select
              value={authForm.role}
              onChange={(event) =>
                setAuthForm({ ...authForm, role: event.target.value as Role })
              }
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          )}
          <button type="button" onClick={() => handleAuth(mode)}>
            {mode === "login" ? "Login" : "Register"} <ArrowRight size={18} />
          </button>
        </div>
        <p className="demo-hint">
          Demo accounts: admin@lms.com, instructor@lms.com, student@lms.com /
          password123
        </p>
      </div>
    </section>
  );

  const renderStudentDashboard = () => (
    <div className="dashboard-grid">
      <section className="dashboard-card wide">
        <h2>My Courses</h2>
        {enrollments.length ? (
          enrollments.map((item) => (
            <div className="table-row" key={item._id}>
              <strong>{item.course.title}</strong>
              <span>{item.progress}% complete</span>
            </div>
          ))
        ) : (
          <p>No enrollments yet. Browse courses and enroll.</p>
        )}
      </section>
      <section className="dashboard-card">
        <h2>Profile Page</h2>
        <p>
          <strong>{user?.name}</strong>
        </p>
        <p>{user?.email}</p>
        <p>{user?.role}</p>
      </section>
    </div>
  );

  const renderInstructorDashboard = () => (
    <div className="dashboard-grid">
      <section className="dashboard-card">
        <h2>{editingCourseId ? "Edit Course" : "Create Course"}</h2>
        {renderCourseForm()}
        <div className="button-row">
          <button
            type="button"
            onClick={editingCourseId ? updateCourse : createCourse}
          >
            {editingCourseId ? <Edit3 size={16} /> : <Plus size={16} />}
            {editingCourseId ? "Update course" : "Create course"}
          </button>
          {editingCourseId && (
            <button
              className="ghost-button"
              type="button"
              onClick={resetCourseForm}
            >
              Cancel
            </button>
          )}
        </div>
      </section>
      <section className="dashboard-card wide">
        <h2>Manage My Courses</h2>
        {instructorCourses.length ? (
          instructorCourses.map((course) => (
            <div className="table-row" key={course._id}>
              <strong>{course.title}</strong>
              <span>{course.lessons.length} lessons</span>
              <button type="button" onClick={() => editCourse(course)}>
                <Edit3 size={16} />
                Edit
              </button>
              <button
                className="danger-button"
                type="button"
                onClick={() => deleteCourse(course)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>You have not created any courses yet.</p>
        )}
      </section>
      <section className="dashboard-card wide">
        <h2>Upload Lessons</h2>
        {renderLessonForm()}
        <button type="button" onClick={uploadLesson}>
          <Upload size={16} />
          Upload lesson
        </button>
      </section>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="dashboard-grid">
      <section className="dashboard-card wide">
        <h2>Manage Users</h2>
        {users.map((item) => (
          <div className="table-row" key={item._id || item.id}>
            <strong>{item.name}</strong>
            <span>{item.email}</span>
            <span>{item.role}</span>
            <button
              className="danger-button"
              type="button"
              onClick={() => deleteUser(item)}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        ))}
      </section>
      <section className="dashboard-card">
        <h2>{editingCourseId ? "Edit Course" : "Create Course"}</h2>
        {renderCourseForm()}
        <div className="button-row">
          <button
            type="button"
            onClick={editingCourseId ? updateCourse : createCourse}
          >
            {editingCourseId ? <Edit3 size={16} /> : <Plus size={16} />}
            {editingCourseId ? "Update course" : "Create course"}
          </button>
          {editingCourseId && (
            <button
              className="ghost-button"
              type="button"
              onClick={resetCourseForm}
            >
              Cancel
            </button>
          )}
        </div>
      </section>
      <section className="dashboard-card wide">
        <h2>Manage Courses</h2>
        {courses.map((course) => (
          <div className="table-row" key={course._id}>
            <strong>{course.title}</strong>
            <span>Rs {course.price.toLocaleString()}</span>
            <button type="button" onClick={() => editCourse(course)}>
              <Edit3 size={16} />
              Edit
            </button>
            <button
              className="danger-button"
              type="button"
              onClick={() => deleteCourse(course)}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        ))}
      </section>
      <section className="dashboard-card wide">
        <h2>Reports / Analytics</h2>
        <div className="analytics-grid">
          {Object.entries(dashboard.totals).map(([label, value]) => (
            <article key={label}>
              <BarChart3 size={20} />
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );

  const renderCourseForm = () => (
    <div className="mini-form">
      <input
        value={courseForm.title}
        onChange={(event) =>
          setCourseForm({ ...courseForm, title: event.target.value })
        }
        placeholder="Course title"
      />
      <input
        value={courseForm.category}
        onChange={(event) =>
          setCourseForm({ ...courseForm, category: event.target.value })
        }
        placeholder="Category"
      />
      <select
        value={courseForm.level}
        onChange={(event) =>
          setCourseForm({ ...courseForm, level: event.target.value })
        }
      >
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
      <input
        value={courseForm.price}
        onChange={(event) =>
          setCourseForm({ ...courseForm, price: Number(event.target.value) })
        }
        placeholder="Price"
        type="number"
      />
      <textarea
        value={courseForm.description}
        onChange={(event) =>
          setCourseForm({ ...courseForm, description: event.target.value })
        }
        placeholder="Description"
      />
    </div>
  );

  const renderLessonForm = () => (
    <div className="mini-form">
      <select
        value={lessonForm.courseId}
        onChange={(event) =>
          setLessonForm({ ...lessonForm, courseId: event.target.value })
        }
      >
        {managedCourses.map((course) => (
          <option value={course._id} key={course._id}>
            {course.title}
          </option>
        ))}
      </select>
      <input
        value={lessonForm.title}
        onChange={(event) =>
          setLessonForm({ ...lessonForm, title: event.target.value })
        }
        placeholder="Lesson title"
      />
      <input
        value={lessonForm.duration}
        onChange={(event) =>
          setLessonForm({ ...lessonForm, duration: event.target.value })
        }
        placeholder="Duration"
      />
      <textarea
        value={lessonForm.content}
        onChange={(event) =>
          setLessonForm({ ...lessonForm, content: event.target.value })
        }
        placeholder="Lesson content"
      />
    </div>
  );

  const renderDashboard = () => {
    if (!user) return renderAuthPage("login");
    return (
      <section className="page-block dashboard-page">
        <span className="eyebrow">
          <ShieldCheck size={16} />
          {user.role} dashboard
        </span>
        <h1>
          {user.role === "student"
            ? "Student Dashboard"
            : user.role === "instructor"
              ? "Instructor Dashboard"
              : "Admin Dashboard"}
        </h1>
        <p className="lead">
          Manage your courses, lessons, enrollments, and student progress all in
          one place.
        </p>
        {user.role === "student" && renderStudentDashboard()}
        {user.role === "instructor" && renderInstructorDashboard()}
        {user.role === "admin" && renderAdminDashboard()}
      </section>
    );
  };

  const renderReviews = () => (
    <section className="section-block reviews-section">
      <div className="section-heading centered">
        <span className="eyebrow">
          <Star size={16} />
          Student reviews
        </span>
        <h2>Learners like the project-first approach.</h2>
      </div>
      <div className="review-grid">
        {reviews.map(([name, role, quote]) => (
          <article className="review-card" key={name}>
            <div className="stars">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star size={16} fill="currentColor" key={index} />
              ))}
            </div>
            <p>{quote}</p>
            <div>
              <strong>{name}</strong>
              <span>{role}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderFooter = () => (
    <footer className="site-footer">
      <div>
        <button
          className="brand footer-brand plain-button"
          type="button"
          onClick={() => navigate("home")}
        >
          <span className="brand-mark">
            <GraduationCap size={24} />
          </span>
          <span>
            <strong>Punjab LMS</strong>
            <small>Full stack MERN learning</small>
          </span>
        </button>
        <p>
          Public pages plus protected role dashboards for a complete LMS final
          project.
        </p>
      </div>
      <div className="footer-links">
        <button type="button" onClick={() => navigate("about")}>
          About
        </button>
        <button type="button" onClick={() => navigate("courses")}>
          Courses
        </button>
        <button type="button" onClick={() => navigate("login", "/signin")}>
          Sign in
        </button>
      </div>
    </footer>
  );

  return (
    <main className="site-shell">
      {renderHeader()}
      {page === "home" && renderHome()}
      {page === "about" && renderAbout()}
      {page === "courses" && renderCoursesPage()}
      {page === "detail" && renderCourseDetail()}
      {page === "login" && renderAuthPage("login")}
      {page === "register" && renderAuthPage("register")}
      {page === "dashboard" && renderDashboard()}
      <section className="cta-band">
        <div>
          <span className="eyebrow">
            <Lock size={16} />
            Next action
          </span>
          <h2>
            {user
              ? "Continue from your dashboard."
              : "Sign up or sign in when a course looks good."}
          </h2>
        </div>
        <button
          type="button"
          onClick={() =>
            navigate(
              user ? "dashboard" : "register",
              user ? "/dashboard" : "/signup",
            )
          }
        >
          {user ? "Open dashboard" : "Create account"} <ArrowRight size={18} />
        </button>
      </section>
      {renderFooter()}
      <ToastContainer />
    </main>
  );
}

export default App;
