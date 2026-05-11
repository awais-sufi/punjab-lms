import { GraduationCap, Menu, ShieldCheck, X } from "lucide-react";
import { useLms } from "../context/LmsContext";

export function Header() {
  const { user, mobileNavOpen, setMobileNavOpen, navigate, signOut } = useLms();

  return (
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
}
