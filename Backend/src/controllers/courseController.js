const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const QuizAttempt = require('../models/QuizAttempt');
const Submission = require('../models/Submission');
const asyncHandler = require('../utils/asyncHandler');

const listCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ published: true }).populate('instructor', 'name email').sort({ createdAt: -1 });
  res.json(courses);
});

const listMyCourses = asyncHandler(async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { instructor: req.user._id };
  const courses = await Course.find(query).populate('instructor', 'name email').sort({ createdAt: -1 });
  res.json(courses);
});

const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name email');
  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  res.json(course);
});

const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create({
    ...req.body,
    slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    instructor: req.user.role === 'admin' && req.body.instructor ? req.body.instructor : req.user._id,
  });

  res.status(201).json(course);
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  if (req.user.role !== 'admin' && String(course.instructor) !== String(req.user._id)) {
    const error = new Error('Only the course instructor can update this course');
    error.statusCode = 403;
    throw error;
  }

  Object.assign(course, req.body);
  await course.save();
  res.json(course);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  if (req.user.role !== 'admin' && String(course.instructor) !== String(req.user._id)) {
    const error = new Error('Only the course instructor can delete this course');
    error.statusCode = 403;
    throw error;
  }

  await course.deleteOne();
  await Enrollment.deleteMany({ course: req.params.id });
  res.json({ message: 'Course deleted successfully' });
});

const uploadLesson = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  if (req.user.role !== 'admin' && String(course.instructor) !== String(req.user._id)) {
    const error = new Error('Only the course instructor can upload lessons');
    error.statusCode = 403;
    throw error;
  }

  course.lessons.push({
    title: req.body.title,
    duration: req.body.duration,
    videoUrl: req.body.videoUrl,
    content: req.body.content,
    isPreview: req.body.isPreview,
  });

  await course.save();
  res.status(201).json(course);
});

const submitAssignment = asyncHandler(async (req, res) => {
  const submission = await Submission.create({
    student: req.user._id,
    course: req.params.id,
    assignmentId: req.params.assignmentId,
    answer: req.body.answer,
  });

  res.status(201).json(submission);
});

const attemptQuiz = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  const quiz = course?.quizzes.id(req.params.quizId);
  if (!quiz) {
    const error = new Error('Quiz not found');
    error.statusCode = 404;
    throw error;
  }

  const scorePerQuestion = quiz.questions.length ? quiz.totalMarks / quiz.questions.length : 0;
  const score = quiz.questions.reduce((total, question) => {
    const answer = req.body.answers.find((item) => String(item.questionId) === String(question._id));
    return total + (answer?.selectedOption === question.correctOption ? scorePerQuestion : 0);
  }, 0);

  const attempt = await QuizAttempt.create({
    student: req.user._id,
    course: course._id,
    quizId: quiz._id,
    answers: req.body.answers,
    score: Math.round(score),
    totalMarks: quiz.totalMarks,
  });

  res.status(201).json(attempt);
});

module.exports = {
  attemptQuiz,
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  listMyCourses,
  submitAssignment,
  updateCourse,
  uploadLesson,
};
