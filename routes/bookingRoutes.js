const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { bookingValidationRules, validate } = require('../utilities/validation');
const { isAuthenticated } = require('../auth/authenticate');

// Create a new booking
router.post(
    '/',
    isAuthenticated,
    bookingValidationRules,
    validate,
    bookingController.createBooking,
);

// Get a booking by its ID
router.get('/:id', isAuthenticated, bookingController.getBookingById);

// Get all bookings for a specific user
router.get(
    '/user/:userId',
    isAuthenticated,
    bookingController.getBookingsByUser,
);

// Get all bookings for a specific housing listing
router.get(
    '/housing/:housingId',
    isAuthenticated,
    bookingController.getBookingsByHousing,
);

// Update a booking by ID
router.put(
    '/:id',
    isAuthenticated,
    bookingValidationRules,
    validate,
    bookingController.updateBooking,
);

// Delete (cancel) a booking by ID
router.delete('/:id', isAuthenticated, bookingController.deleteBooking);

module.exports = router;
