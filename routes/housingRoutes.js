// routes/housingRoutes.js
const express = require('express');
const router = express.Router();
const housingController = require('../controllers/housingController');
const { housingValidationRules, validate } = require('../utilities/validation');
const utilities = require('../utilities/errorHandling');
const { isAuthenticated } = require('../auth/authenticate'); // Assuming this handles role checks as well or you'll add them later

//#swagger.tags = ['Housing']; // Tag for Swagger documentation

// GET all housing posts (publicly accessible or with optional authentication)
router.get('/', utilities.handleErrors(housingController.getAllHousing));

// GET a single housing post by ID
router.get('/:id', utilities.handleErrors(housingController.getHousingById));

// POST a new housing post (requires authentication)
router.post(
    '/',
    isAuthenticated, // Only authenticated users can create posts
    housingValidationRules, // Validation middleware
    validate, // Validation result handler
    utilities.handleErrors(housingController.createHousing),
);

// PUT update an existing housing post by ID (requires authentication and ownership)
router.put(
    '/:id',
    isAuthenticated, // Only authenticated users can update posts
    housingValidationRules, // Validation middleware
    validate, // Validation result handler
    utilities.handleErrors(housingController.updateHousing),
);

// DELETE a housing post by ID (requires authentication and ownership)
router.delete(
    '/:id',
    isAuthenticated, // Only authenticated users can delete posts
    utilities.handleErrors(housingController.deleteHousing),
);

module.exports = router;
