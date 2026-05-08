const express = require('express');
const { addEmployee, getEmployeesByCompany, getAllEmployees, updatePermissions } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/employee', protect, authorize('Admin', 'Super_Admin'), addEmployee);
router.get('/employees', protect, authorize('Admin', 'Super_Admin'), getEmployeesByCompany);
router.get('/', protect, authorize('Admin', 'Super_Admin'), getAllEmployees);
router.put('/:id/permissions', protect, authorize('Super_Admin'), updatePermissions);

module.exports = router;
