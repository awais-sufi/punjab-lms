import { CheckCircle2, GraduationCap } from "lucide-react";

export function AboutPage() {
  return (
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
}
