const Calendar = require('../models/calendarModel');

exports.createCalendarEntry = async (req, res, next) => {
    try {
        const { housingId, checkInDate, checkOutDate } = req.body;
        const entryData = { housingId, checkInDate, checkOutDate };
        const entry = new Calendar(entryData);
        const saved = await entry.save();
        return res.status(201).json(saved);
    } catch (err) {
        return next(err);
    }
};

exports.getCalendarByHousing = async (req, res, next) => {
    try {
        const entries = await Calendar.find({ housingId: req.params.housingId });
        return res.status(200).json(entries);
    } catch (err) {
        return next(err);
    }
};

exports.updateCalendarEntry = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Authentication required to update a calendar entry.',
            });
        }

        const entry = await Calendar.findById(req.params.id);

        if (!entry) {
            return res
                .status(404)
                .json({ message: 'Calendar entry not found' });
        }

        const housing = await Housing.findById(entry.housingId);

        if (!housing) {
            return res
                .status(404)
                .json({ message: 'Associated housing post not found.' });
        }

        if (housing.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message:
                    'Forbidden: You do not have permission to update this calendar entry.',
            });
        }

        const { checkInDate, checkOutDate } = req.body;
        const updated = await Calendar.findByIdAndUpdate(
            req.params.id,
            { checkInDate, checkOutDate },
            { new: true, runValidators: true },
        );
        if (!updated) {
            return res
                .status(404)
                .json({ message: 'Calendar entry not found' });
        }
        return res.status(200).json(updated);
    } catch (err) {
        return next(err);
    }
};

exports.deleteCalendarEntry = async (req, res, next) => {
    try {
        const deleted = await Calendar.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res
                .status(404)
                .json({ message: 'Calendar entry not found' });
        }
        return res.status(200).json({ message: 'Calendar entry deleted' });
    } catch (err) {
        return next(err);
    }
};
