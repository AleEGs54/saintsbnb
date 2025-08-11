const Reservation = require('../models/reservationModel');

const reservationController = {};

// Get all reservations
reservationController.getReservation = async (req, res) => {
    // #swagger.tags = ['Reservations']
    // #swagger.description = 'Retrieve a list of all reservations/bookings.'
    // #swagger.summary = 'Get all reservations'
    try {
        const result = await Reservation.find();

        if (result.length === 0) {
            return res.status(404).json({ message: 'No reservations/bookings found' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching reservation/booking',
            error: err.message,
        });
    }
};

// Get reservation by ID
reservationController.getById = async (req, res) => {
    // #swagger.tags = ['Reservations']
    // #swagger.description = 'Retrieve a specific reservation/booking by its ID.'
    // #swagger.summary = 'Get reservation by ID'
    try {
        const result = await Reservation.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ message: 'Reservation/booking not found' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching reservation/booking',
            error: err.message,
        });
    }
};

// Create new reservation
reservationController.createReservation = async (req, res) => {
    // #swagger.tags = ['Reservations']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    // #swagger.description = 'Create a new reservation/booking.'
    // #swagger.summary = 'Create a new reservation'
    try {
        const newReservation = await Reservation.create(
            {
                post_id: req.body.post_id,
                user_id: req.body.user_id,
                check_in_date: req.body.check_in_date,
                check_out_date: req.body.check_out_date,
                status: req.body.status,
                total_price: req.body.total_price
            });
        res.status(201).json(newReservation);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to create reservation/booking',
            error: err.message,
        });
    }
};

// Update reservation
reservationController.updateReservation = async (req, res) => {
    // #swagger.tags = ['Reservations']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    // #swagger.description = 'Update an existing reservation/booking by ID.'
    // #swagger.summary = 'Update reservation by ID'
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            {
                post_id: req.body.post_id,
                user_id: req.body.user_id,
                check_in_date: req.body.check_in_date,
                check_out_date: req.body.check_out_date,
                status: req.body.status,
                total_price: req.body.total_price
            },
            { new: true, runValidators: true }
        );

        if (!updatedReservation) {
            return res.status(404).json({ message: 'Reservation/booking not found' });
        }

        res.status(200).json(updatedReservation);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error updating reservation/booking',
            error: err.message,
        });
    }
};


// DELETE reservation
reservationController.deleteReservation = async (req, res) => {
    // #swagger.tags = ['Reservations']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    // #swagger.description = 'Delete a reservation/booking by ID.'
    // #swagger.summary = 'Delete reservation by ID'
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);

        if (!deletedReservation) {
            return res.status(404).json({ message: 'Reservation/booking not found' });
        }

        res.status(200).json({
            message: 'Reservation/booking deleted successfully',
            deletedReservation
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error deleting reservation/booking',
            error: err.message,
        });
    }
};

module.exports = reservationController;