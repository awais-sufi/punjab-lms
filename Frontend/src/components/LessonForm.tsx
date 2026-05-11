import { useLms } from "../context/LmsContext";

export function LessonForm() {
  const { lessonForm, managedCourses, setLessonForm } = useLms();

  return (
    <div className="mini-form">
      <select
        value={lessonForm.courseId}
        onChange={(event) =>
          setLessonForm({ ...lessonForm, courseId: event.target.value })
        }
      >
        {managedCourses.map((course) => (
          <option value={course._id} key={course._id}>
            {course.title}
          </option>
        ))}
      </select>
      <input
        value={lessonForm.title}
        onChange={(event) =>
          setLessonForm({ ...lessonForm, title: event.target.value })
        }
        placeholder="Lesson title"
      />
      <input
        value={lessonForm.duration}
        onChange={(event) =>
          setLessonForm({ ...lessonForm, duration: event.target.value })
        }
        placeholder="Duration"
      />
      <textarea
        value={lessonForm.content}
        onChange={(event) =>
          setLessonForm({ ...lessonForm, content: event.target.value })
        }
        placeholder="Lesson content"
      />
    </div>
  );
}
