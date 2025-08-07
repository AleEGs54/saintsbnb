const Calendar = require('../models/calendarModel');

exports.createCalendarEntry = async (req, res, next) => {
    try {
        const { post_id, start_date, end_date } = req.body;
        const entryData = { post_id, start_date, end_date };
        const entry = new Calendar(entryData);
        const saved = await entry.save();
        return res.status(201).json(saved);
    } catch (err) {
        return next(err);
    }
};

exports.getCalendarByHousing = async (req, res, next) => {
    try {
        const entries = await Calendar.find({ post_id: req.params.housingId });
        return res.status(200).json(entries);
    } catch (err) {
        return next(err);
    }
};

exports.updateCalendarEntry = async (req, res, next) => {
    try {
        const updateData = {};
        const allowedFields = ['start_date', 'end_date'];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        const updated = await Calendar.findByIdAndUpdate(
            req.params.id,
            updateData,
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
