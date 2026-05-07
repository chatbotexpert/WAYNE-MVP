const express = require('express');
const { recordMetric, getMetrics, getMetricData } = require('../controllers/metricController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.get('/', protect, authorize('Admin', 'Supervisor', 'Training_Manager'), getMetrics);
router.post('/record', protect, authorize('Admin', 'Training_Manager'), recordMetric);
router.get('/data', protect, authorize('Admin', 'Supervisor', 'Training_Manager'), getMetricData);

module.exports = router;
