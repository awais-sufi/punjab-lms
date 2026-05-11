import { ArrowRight, BookOpen } from "lucide-react";
import { useLms } from "../context/LmsContext";

export function CourseDetailPage() {
  const { activeCourse, enrollInCourse } = useLms();

  return (
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
}
