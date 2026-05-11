import { useLms } from "../context/LmsContext";
import { AboutPage } from "../pages/AboutPage";
import { AuthPage } from "../pages/AuthPage";
import { CourseDetailPage } from "../pages/CourseDetailPage";
import { CoursesPage } from "../pages/CoursesPage";
import { DashboardPage } from "../pages/DashboardPage";
import { HomePage } from "../pages/HomePage";

export function AppRoutes() {
  const { page } = useLms();

  return (
    <>
      {page === "home" && <HomePage />}
      {page === "about" && <AboutPage />}
      {page === "courses" && <CoursesPage />}
      {page === "detail" && <CourseDetailPage />}
      {page === "login" && <AuthPage mode="login" />}
      {page === "register" && <AuthPage mode="register" />}
      {page === "dashboard" && <DashboardPage />}
    </>
  );
}
