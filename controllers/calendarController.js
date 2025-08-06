const Calendar = require('../models/calendarModel');

exports.createCalendarEntry = async (req, res, next) => {
    try {
        const entry = new Calendar(req.body);
        const saved = await entry.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

exports.getCalendarByPost = async (req, res, next) => {
    try {
        const entries = await Calendar.find({ post_id: req.params.postId });
        res.status(200).json(entries);
    } catch (err) {
        next(err);
    }
};

exports.updateCalendarEntry = async (req, res, next) => {
    try {
        const updated = await Calendar.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Calendar entry not found' });
        }
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteCalendarEntry = async (req, res, next) => {
    try {
        const deleted = await Calendar.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Calendar entry not found' });
        }
        res.status(200).json({ message: 'Calendar entry deleted' });
    } catch (err) {
        next(err);
    }
};
