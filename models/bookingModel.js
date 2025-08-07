const mongoose = require('mongoose');

/**
 * @typedef Booking
 * @property {ObjectId} post_id.required - ID of housing
 * @property {ObjectId} user_id.required - ID of user making the booking
 * @property {Date} check_in_date.required - Check-in date
 * @property {Date} check_out_date.required - Check-out date
 * @property {string} status.required.enum - Status of the booking (pending, confirmed, cancelled, concluded)
 * @property {number} total_price.required - Total price for the booking
 */
const bookingSchema = new mongoose.Schema(
    {
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Housing',
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        check_in_date: {
            type: Date,
            required: true,
        },
        check_out_date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'concluded'],
            default: 'pending',
        },
        total_price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Booking', bookingSchema);
