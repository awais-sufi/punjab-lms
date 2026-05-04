const express = require('express');
const {
  attemptQuiz,
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  listMyCourses,
  submitAssignment,
  updateCourse,
  uploadLesson,
} = require('../controllers/courseController');
const { authorize, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listCourses);
router.post('/', protect, authorize('admin', 'instructor'), createCourse);
router.get('/mine', protect, authorize('admin', 'instructor'), listMyCourses);
router.get('/:id', getCourse);
router.put('/:id', protect, authorize('admin', 'instructor'), updateCourse);
router.delete('/:id', protect, authorize('admin', 'instructor'), deleteCourse);
router.post('/:id/lessons', protect, authorize('admin', 'instructor'), uploadLesson);
router.post('/:id/assignments/:assignmentId/submissions', protect, authorize('student'), submitAssignment);
router.post('/:id/quizzes/:quizId/attempts', protect, authorize('student'), attemptQuiz);

module.exports = router;
