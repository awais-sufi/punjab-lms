const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const QuizAttempt = require('../models/QuizAttempt');
const Submission = require('../models/Submission');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const [students, instructors, courses, enrollments, submissions, quizAttempts] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'instructor' }),
    Course.countDocuments(req.user.role === 'instructor' ? { instructor: req.user._id } : {}),
    Enrollment.countDocuments(),
    Submission.countDocuments(),
    QuizAttempt.countDocuments(),
  ]);

  const recentCourses = await Course.find(req.user.role === 'instructor' ? { instructor: req.user._id } : {})
    .populate('instructor', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totals: { students, instructors, courses, enrollments, submissions, quizAttempts },
    recentCourses,
  });
});

module.exports = { getDashboard };
