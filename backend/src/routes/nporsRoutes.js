const express = require('express');
const { createNporsMetric, getNporsMetrics, deleteNporsMetric } = require('../controllers/nporsController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/', protect, authorize('Admin'), createNporsMetric);
router.get('/', protect, authorize('Admin', 'Supervisor', 'Training_Manager'), getNporsMetrics);
router.delete('/:id', protect, authorize('Admin'), deleteNporsMetric);

module.exports = router;
