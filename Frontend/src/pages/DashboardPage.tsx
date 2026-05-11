import {
  BarChart3,
  Edit3,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { CourseForm } from "../components/CourseForm";
import { LessonForm } from "../components/LessonForm";
import { useLms } from "../context/LmsContext";
import { AuthPage } from "./AuthPage";

function StudentDashboard() {
  const { enrollments, user } = useLms();

  return (
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
}

function InstructorDashboard() {
  const {
    editingCourseId,
    instructorCourses,
    createCourse,
    editCourse,
    updateCourse,
    resetCourseForm,
    deleteCourse,
    uploadLesson,
  } = useLms();

  return (
    <div className="dashboard-grid">
      <section className="dashboard-card">
        <h2>{editingCourseId ? "Edit Course" : "Create Course"}</h2>
        <CourseForm />
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
        <LessonForm />
        <button type="button" onClick={uploadLesson}>
          <Upload size={16} />
          Upload lesson
        </button>
      </section>
    </div>
  );
}

function AdminDashboard() {
  const {
    editingCourseId,
    users,
    courses,
    dashboard,
    createCourse,
    editCourse,
    updateCourse,
    resetCourseForm,
    deleteCourse,
    deleteUser,
  } = useLms();

  return (
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
        <CourseForm />
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
}

export function DashboardPage() {
  const { user } = useLms();

  if (!user) return <AuthPage mode="login" />;

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
      {user.role === "student" && <StudentDashboard />}
      {user.role === "instructor" && <InstructorDashboard />}
      {user.role === "admin" && <AdminDashboard />}
    </section>
  );
}
