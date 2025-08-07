const mongoose = require('mongoose');

/**
 * @typedef CalendarEntry
 * @property {mongoose.Schema.Types.ObjectId} housingId.required - ID of the housing listing
 * @property {Date} date.required - Specific date for the calendar entry
 * @property {boolean} available.required - Indicates if the date is available for booking
 */
const calendarSchema = new mongoose.Schema(
    {
        housingId: {
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
