const Calendar = require('../models/calendarModel');

exports.createCalendarEntry = async (req, res, next) => {
    try {
        const entry = new Calendar(req.body);
        const saved = await entry.save();
        return res.status(201).json(saved);
    } catch (err) {
        return next(err);
    }
};

exports.getCalendarByPost = async (req, res, next) => {
    try {
        const entries = await Calendar.find({ post_id: req.params.postId });
        return res.status(200).json(entries);
    } catch (err) {
        return next(err);
    }
};

exports.updateCalendarEntry = async (req, res, next) => {
    try {
        const updated = await Calendar.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
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
