const express = require('express');
const { addEmployee, getEmployeesByCompany, getAllEmployees } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/employee', protect, authorize('Admin'), addEmployee);
router.get('/employees', protect, authorize('Admin'), getEmployeesByCompany);
router.get('/', protect, authorize('Admin'), getAllEmployees);

module.exports = router;
