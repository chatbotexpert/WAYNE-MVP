const express = require('express');
const { createNrswaMetric, getNrswaMetrics, deleteNrswaMetric } = require('../controllers/nrswaController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/', protect, authorize('Admin'), createNrswaMetric);
router.get('/', protect, authorize('Admin', 'Supervisor', 'Training_Manager'), getNrswaMetrics);
router.delete('/:id', protect, authorize('Admin'), deleteNrswaMetric);

module.exports = router;
