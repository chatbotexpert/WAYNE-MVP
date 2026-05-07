const express = require('express');
const { createNvqMetric, getNvqMetrics, deleteNvqMetric } = require('../controllers/nvqController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/', protect, authorize('Admin'), createNvqMetric);
router.get('/', protect, authorize('Admin', 'Supervisor', 'Training_Manager'), getNvqMetrics);
router.delete('/:id', protect, authorize('Admin'), deleteNvqMetric);

module.exports = router;
