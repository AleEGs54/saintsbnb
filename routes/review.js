const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');
const { isAuthenticated, handleValidation } = require('../utilities/auth');

// Public routes (no authentication needed)
router.get('/', handleValidation, reviewController.getAll);
router.get('/:id', handleValidation, reviewController.getById);

// Protected routes (authentication required)
router.post('/', isAuthenticated, handleValidation, reviewController.createReview);
router.put('/:id', isAuthenticated, handleValidation, reviewController.updateReview);
router.delete('/:id', isAuthenticated, handleValidation, reviewController.deleteReview);

module.exports = router;