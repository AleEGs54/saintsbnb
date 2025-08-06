const Booking = require('../models/bookingModel');

exports.createBooking = async (req, res, next) => {
    try {
        const newBooking = new Booking(req.body);
        const saved = await newBooking.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('post_id user_id');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (err) {
        next(err);
    }
};

exports.getBookingsByUser = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user_id: req.params.userId }).populate('post_id');
        res.status(200).json(bookings);
    } catch (err) {
        next(err);
    }
};

exports.getBookingsByPost = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ post_id: req.params.postId }).populate('user_id');
        res.status(200).json(bookings);
    } catch (err) {
        next(err);
    }
};

exports.updateBooking = async (req, res, next) => {
    try {
        const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteBooking = async (req, res, next) => {
    try {
        const deleted = await Booking.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted' });
    } catch (err) {
        next(err);
    }
};