import { Star } from "lucide-react";
import { reviews } from "../services/demoData";

export function Reviews() {
  return (
    <section className="section-block reviews-section">
      <div className="section-heading centered">
        <span className="eyebrow">
          <Star size={16} />
          Student reviews
        </span>
        <h2>Learners like the project-first approach.</h2>
      </div>
      <div className="review-grid">
        {reviews.map(([name, role, quote]) => (
          <article className="review-card" key={name}>
            <div className="stars">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star size={16} fill="currentColor" key={index} />
              ))}
            </div>
            <p>{quote}</p>
            <div>
              <strong>{name}</strong>
              <span>{role}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
