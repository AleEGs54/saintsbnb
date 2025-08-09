const express = require('express');
const router = express.Router();
const housingController = require('../controllers/housingController');
const { housingValidationRules, validate } = require('../utilities/validation');
const { isAuthenticated } = require('../auth/authenticate');

// GET all housing listings
router.get('/', housingController.getAllHousing);

// GET a single housing listing by ID
router.get('/:id', housingController.getHousingById);

// POST a new housing listing (requires authentication)
router.post(
    '/',
    isAuthenticated,
    housingValidationRules,
    validate,
    housingController.createHousing,
);

// PUT update an existing housing listing by ID (requires authentication and ownership)
router.put(
    '/:id',
    isAuthenticated,
    housingValidationRules,
    validate,
    housingController.updateHousing,
);

// DELETE a housing listing by ID (requires authentication and ownership)
router.delete('/:id', isAuthenticated, housingController.deleteHousing);

module.exports = router;
