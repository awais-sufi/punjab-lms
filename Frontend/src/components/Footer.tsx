import { GraduationCap } from "lucide-react";
import { useLms } from "../context/LmsContext";

export function Footer() {
  const { navigate } = useLms();

  return (
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
}
