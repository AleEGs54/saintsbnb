const Reservation = require('../models/reservation');
const reservationController = {};

reservationController.getReservation = async (req, res) => {
    try {
        const result = await Reservation.find();

        if (!result.length === 0) {
            res.status(200).json(result);
            return;
        }
        res.status(404).json({ message: 'Reservation/booking not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching reservation/booking',
            error: err.message,
        });
    }
};

reservationController.getById = async (req, res) => {
    try {
        const result = await Reservation.findById(req.params.id);

        if (result.length > 0) {
            res.status(200).json(result);
            return;
        }
        res.status(404).json({ message: 'Reservation/booking not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching reservation/booking',
            error: err.message,
        });
    }
};

reservationController.createReservation = async (req, res) => {
    try {
        const newReservation = await Reservation.create(req.body);
        res.status(201).json(newReservation);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to book reservation/booking',
            error: err.message,
        });
    }
};

reservationController.updateReservation = async (req, res) => {
    try {
        const updatedReservation = await Reservation.replaceOne(
            { _id: req.params.id },
            req.body,
        );

        if (!updatedReservation.acknowledged) {
            res.status(404).json({ message: 'Reservation/booking not found' });
            return;
        }

        res.status(200).json(updatedReservation);
    } catch (err) {
        res.status(500).json({
            message: 'Error updating reservation/booking',
            error: err.message,
        });
    }
};

reservationController.deleteReservation = async (req, res) => {
    try {
        const deletedReservation = await Reservation.deleteOne({
            _id: req.params.id,
        });

        if (!deletedReservation.acknowledged) {
            res.status(404).json({ message: 'Reservation/booking not found' });
            return;
        }
        res.status(200).json(deletedReservation);
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting Reservation/booking',
            error: err.message,
        });
    }
};

module.exports = reservationController;
