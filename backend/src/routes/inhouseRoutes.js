const express = require('express');
const { createInhouseMetric, getInhouseMetrics, deleteInhouseMetric } = require('../controllers/inhouseController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/', protect, authorize('Admin'), createInhouseMetric);
router.get('/', protect, authorize('Admin', 'Supervisor', 'Training_Manager'), getInhouseMetrics);
router.delete('/:id', protect, authorize('Admin'), deleteInhouseMetric);

module.exports = router;
