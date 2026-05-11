import { BookOpen, Search } from "lucide-react";
import { CourseCards } from "../components/CourseCards";
import { useLms } from "../context/LmsContext";

export function CoursesPage() {
  const { query, setQuery } = useLms();

  return (
    <section className="page-block">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <BookOpen size={16} />
            Course listing
          </span>
          <h1>Browse available courses.</h1>
        </div>
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses"
          />
        </label>
      </div>
      <CourseCards />
    </section>
  );
}
