const express = require('express');
const { createWorkforce, getWorkforces, deleteWorkforce } = require('../controllers/workforceController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/', protect, authorize('Admin'), createWorkforce);
router.get('/', protect, authorize('Admin', 'Supervisor', 'Training_Manager'), getWorkforces);
router.delete('/:id', protect, authorize('Admin'), deleteWorkforce);

module.exports = router;
