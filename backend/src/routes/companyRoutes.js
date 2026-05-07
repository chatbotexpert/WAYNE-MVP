const express = require('express');
const { createCompany, getCompanies, deleteCompany } = require('../controllers/companyController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/', protect, authorize('Admin'), createCompany);
router.get('/', protect, authorize('Admin'), getCompanies);
router.delete('/:id', protect, authorize('Admin'), deleteCompany);

module.exports = router;
