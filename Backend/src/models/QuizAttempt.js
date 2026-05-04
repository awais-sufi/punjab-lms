const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, required: true },
    answers: [{ questionId: mongoose.Schema.Types.ObjectId, selectedOption: Number }],
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
