const express = require('express');
const { getDashboard } = require('../controllers/dashboardController');
const { authorize, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin', 'instructor'), getDashboard);

module.exports = router;
