const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const {
    calendarValidationRules,
    validate,
} = require('../utilities/validation');
const { isAuthenticated } = require('../auth/authenticate');

// Create a new calendar entry
router.post(
    '/',
    isAuthenticated,
    calendarValidationRules,
    validate,
    calendarController.createCalendarEntry,
);

// Get all calendar entries for a specific housing post
router.get('/post/:postId', calendarController.getCalendarByPost);

// Update a calendar entry by ID
router.put(
    '/:id',
    isAuthenticated,
    calendarValidationRules,
    validate,
    calendarController.updateCalendarEntry,
);

// Delete a calendar entry by ID
router.delete('/:id', isAuthenticated, calendarController.deleteCalendarEntry);

module.exports = router;
