const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { isAuthenticated, handleValidation } = require('../utilities/auth');

// Public routes (no authentication needed)
router.get('/', handleValidation, userController.getAll);
router.get('/:id', handleValidation, userController.getById);

// Protected routes (authentication required)
router.post('/', isAuthenticated, handleValidation, userController.createUser);
router.put('/:id', isAuthenticated, handleValidation, userController.updateUser);
router.delete('/:id', isAuthenticated, handleValidation, userController.deleteUser);
router.patch('/:id/toggle-admin', isAuthenticated, handleValidation, userController.toggleAdmin);

module.exports = router;