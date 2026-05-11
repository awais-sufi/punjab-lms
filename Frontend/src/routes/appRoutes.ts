import type { Page } from "../types/lms";

export const normalizePath = (path: string) => {
  if (path === "/") return "/";
  return path.replace(/\/+$/, "");
};

export const routeToPage = (path: string): Page => {
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

export const pageToPath = (page: Page) => {
  if (page === "home") return "/";
  if (page === "detail") return "/courses";
  return `/${page}`;
};

export const getInitialPath = () => {
  if (window.location.hash === "#courses") {
    window.history.replaceState({}, "", "/courses");
    return "/courses";
  }

  return normalizePath(window.location.pathname);
};
