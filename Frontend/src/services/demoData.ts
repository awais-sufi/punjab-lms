import type { Course, Dashboard, User } from "../types/lms";

export const demoUsers: User[] = [
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

export const fallbackCourses: Course[] = [
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

export const fallbackDashboard: Dashboard = {
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

export const reviews = [
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
