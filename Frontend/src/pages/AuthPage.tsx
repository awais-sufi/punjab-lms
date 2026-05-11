import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
import { useLms } from "../context/LmsContext";
import type { Role } from "../types/lms";

type AuthPageProps = {
  mode: "login" | "register";
};

export function AuthPage({ mode }: AuthPageProps) {
  const {
    authForm,
    showPassword,
    setAuthForm,
    setShowPassword,
    handleAuth,
  } = useLms();

  return (
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
}
