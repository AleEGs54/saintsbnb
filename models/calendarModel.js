const mongoose = require('mongoose');

/**
 * @typedef Calendar
 * @property {ObjectId} post_id.required - ID of housing
 * @property {Date} date.required - Specific date for the calendar entry
 * @property {boolean} available.required - Indicates if the date is available for booking
 */
const calendarSchema = new mongoose.Schema(
    {
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Housing',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Calendar', calendarSchema);
