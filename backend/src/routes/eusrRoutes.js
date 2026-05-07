const express = require('express');
const { createEusrMetric, getEusrMetrics, deleteEusrMetric } = require('../controllers/eusrController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/', protect, authorize('Admin'), createEusrMetric);
router.get('/', protect, authorize('Admin', 'Supervisor', 'Training_Manager'), getEusrMetrics);
router.delete('/:id', protect, authorize('Admin'), deleteEusrMetric);

module.exports = router;
