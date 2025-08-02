// routes/housingRoutes.js
const express = require('express');
const router = express.Router();
const housingController = require('../controllers/housingController');
const { housingValidationRules, validate } = require('../utilities/validation');
const { isAuthenticated } = require('../auth/authenticate'); //

// GET all housing posts (publicly accessible or with optional authentication)
router.get('/', housingController.getAllHousing);

// GET a single housing post by ID
router.get('/:id', housingController.getHousingById);

// POST a new housing post (requires authentication)
router.post(
    '/',
    isAuthenticated, // Only authenticated users can create posts
    housingValidationRules, // Validation middleware
    validate, // Validation result handler
    housingController.createHousing,
);

// PUT update an existing housing post by ID (requires authentication and ownership)
router.put(
    '/:id',
    isAuthenticated, // Only authenticated users can update posts
    housingValidationRules, // Validation middleware
    validate, // Validation result handler
    housingController.updateHousing,
);

// DELETE a housing post by ID (requires authentication and ownership)
router.delete(
    '/:id',
    isAuthenticated, // Only authenticated users can delete posts
    housingController.deleteHousing,
);

module.exports = router;
