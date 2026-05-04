const express = require('express');
const { deleteUser, listUsers, updateUserRole } = require('../controllers/userController');
const { authorize, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin'), listUsers);
router.patch('/:id', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
