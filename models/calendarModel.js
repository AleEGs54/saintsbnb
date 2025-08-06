const mongoose = require('mongoose');

/**
 * @typedef Calendar
 * @property {ObjectId} post_id.required - ID do imóvel (housing)
 * @property {Date} date.required - Data específica
 * @property {boolean} available.required - Se o imóvel está disponível nessa data
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
