const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { isAuthenticated, handleValidation } = require('../utilities/auth');

router.get('/', handleValidation, userController.getAll);
router.get('/:id', handleValidation, userController.getById);
router.post('/', isAuthenticated, handleValidation, userController.createUser);
router.put('/:id', isAuthenticated, handleValidation, userController.updateUser);
router.delete('/:id', isAuthenticated, handleValidation, userController.deleteUser);
router.patch('/:id/toggle-admin', isAuthenticated, handleValidation, userController.toggleAdmin);

module.exports = router;