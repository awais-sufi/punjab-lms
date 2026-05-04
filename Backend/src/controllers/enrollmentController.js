const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');

const myEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({ path: 'course', populate: { path: 'instructor', select: 'name email' } })
    .sort({ updatedAt: -1 });
  res.json(enrollments);
});

const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course || !course.published) {
    const error = new Error('Course is not available');
    error.statusCode = 404;
    throw error;
  }

   const enrollment = await Enrollment.findOneAndUpdate(
     { student: req.user._id, course: course._id },
     { $setOnInsert: { progress: 0, status: 'active' } },
     { returnDocument: 'after', upsert: true, runValidators: true },
   ).populate('course');

  res.status(201).json(enrollment);
});

const updateProgress = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({ _id: req.params.id, student: req.user._id });
  if (!enrollment) {
    const error = new Error('Enrollment not found');
    error.statusCode = 404;
    throw error;
  }

  enrollment.progress = req.body.progress;
  enrollment.status = req.body.progress >= 100 ? 'completed' : 'active';
  await enrollment.save();

  res.json(enrollment);
});

module.exports = { enrollInCourse, myEnrollments, updateProgress };
