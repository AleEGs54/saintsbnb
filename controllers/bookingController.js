const Booking = require('../models/bookingModel');

exports.createBooking = async (req, res, next) => {
    try {
        const newBooking = new Booking(req.body);
        const saved = await newBooking.save();
        return res.status(201).json(saved);
    } catch (err) {
        return next(err);
    }
};

exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate(
            'post_id user_id',
        );
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        return res.status(200).json(booking);
    } catch (err) {
        return next(err);
    }
};

exports.getBookingsByUser = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            user_id: req.params.userId,
        }).populate('post_id');
        return res.status(200).json(bookings);
    } catch (err) {
        return next(err);
    }
};

exports.getBookingsByHousing = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            post_id: req.params.housingId,
        }).populate('user_id');
        return res.status(200).json(bookings);
    } catch (err) {
        return next(err);
    }
};

exports.updateBooking = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Authentication required to update a booking.',
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message:
                    'Forbidden: You do not have permission to update this booking.',
            });
        }

        const { status, start_date, end_date, total_price } = req.body;

        const updated = await Booking.findByIdAndUpdate(
            req.params.id,
            { status, start_date, end_date, total_price },
            { new: true, runValidators: true },
        );
        if (!updated) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        return res.status(200).json(updated);
    } catch (err) {
        return next(err);
    }
};

exports.deleteBooking = async (req, res, next) => {
    try {
        const deleted = await Booking.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        return res.status(200).json({ message: 'Booking deleted' });
    } catch (err) {
        return next(err);
    }
};
