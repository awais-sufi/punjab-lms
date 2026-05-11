import { useLms } from "../context/LmsContext";

export function CourseForm() {
  const { courseForm, setCourseForm } = useLms();

  return (
    <div className="mini-form">
      <input
        value={courseForm.title}
        onChange={(event) =>
          setCourseForm({ ...courseForm, title: event.target.value })
        }
        placeholder="Course title"
      />
      <input
        value={courseForm.category}
        onChange={(event) =>
          setCourseForm({ ...courseForm, category: event.target.value })
        }
        placeholder="Category"
      />
      <select
        value={courseForm.level}
        onChange={(event) =>
          setCourseForm({ ...courseForm, level: event.target.value })
        }
      >
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
      <input
        value={courseForm.price}
        onChange={(event) =>
          setCourseForm({ ...courseForm, price: Number(event.target.value) })
        }
        placeholder="Price"
        type="number"
      />
      <textarea
        value={courseForm.description}
        onChange={(event) =>
          setCourseForm({ ...courseForm, description: event.target.value })
        }
        placeholder="Description"
      />
    </div>
  );
}
