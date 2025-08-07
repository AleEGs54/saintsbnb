const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const {isAuthenticated, handleValidation} = require('../utilities/auth');

// Public routes (no authentication needed)
router.get('/', handleValidation, postController.getAll);
router.get('/:id', handleValidation, postController.getById);
router.get('/location/:location', handleValidation, postController.getByLocation);

// Protected routes (authentication required)
router.post('/', isAuthenticated, handleValidation, postController.createPost);
router.put('/:id', isAuthenticated, handleValidation, postController.updatePost);
router.delete('/:id', isAuthenticated, handleValidation, postController.deletePost);

module.exports = router;