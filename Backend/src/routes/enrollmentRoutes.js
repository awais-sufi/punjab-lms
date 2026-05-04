const express = require('express');
const { enrollInCourse, myEnrollments, updateProgress } = require('../controllers/enrollmentController');
const { authorize, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/mine', protect, authorize('student'), myEnrollments);
router.post('/:courseId', protect, authorize('student'), enrollInCourse);
router.patch('/:id/progress', protect, authorize('student'), updateProgress);

module.exports = router;
