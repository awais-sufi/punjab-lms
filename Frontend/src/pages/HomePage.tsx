import { ArrowRight, BookOpen, Layers3, Sparkles } from "lucide-react";
import { CourseCards } from "../components/CourseCards";
import { Reviews } from "../components/Reviews";
import { useLms } from "../context/LmsContext";

export function HomePage() {
  const { courses, navigate } = useLms();

  return (
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
        <CourseCards items={courses.slice(0, 3)} />
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
      <Reviews />
    </>
  );
}
