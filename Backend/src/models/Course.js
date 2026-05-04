const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: String, default: '30 min' },
    videoUrl: { type: String, default: '' },
    content: { type: String, default: '' },
    isPreview: { type: Boolean, default: false },
  },
  { _id: true },
);

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    maxMarks: { type: Number, default: 100 },
    instructions: { type: String, default: '' },
  },
  { _id: true },
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    totalMarks: { type: Number, default: 20 },
    questions: [
      {
        prompt: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOption: { type: Number, required: true },
      },
    ],
  },
  { _id: true },
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    description: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    price: { type: Number, default: 0 },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lessons: [lessonSchema],
    assignments: [assignmentSchema],
    quizzes: [quizSchema],
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Course', courseSchema);
