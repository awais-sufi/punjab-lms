import { Clock3, Users } from "lucide-react";
import { useLms } from "../context/LmsContext";
import type { Course } from "../types/lms";

type CourseCardsProps = {
  items?: Course[];
};

export function CourseCards({ items }: CourseCardsProps) {
  const { filteredCourses, viewCourse } = useLms();
  const courses = items || filteredCourses;

  return (
    <div className="course-grid">
      {courses.map((course) => (
        <article className="course-card" key={course._id}>
          <div className="course-topline">
            <span>{course.category}</span>
            <span>{course.level}</span>
          </div>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <div className="course-details">
            <span>
              <Clock3 size={16} />
              {course.lessons.length} lessons
            </span>
            <span>
              <Users size={16} />
              {course.instructor?.name || "Instructor"}
            </span>
          </div>
          <div className="course-footer">
            <strong>Rs {course.price.toLocaleString()}</strong>
            <button type="button" onClick={() => viewCourse(course)}>
              View details
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
