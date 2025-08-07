const mongoose = require('mongoose');

/**
 * @typedef Booking
 * @property {mongoose.Schema.Types.ObjectId} housingId.required - ID of the housing listing
 * @property {mongoose.Schema.Types.ObjectId} userId.required - ID of user making the booking
 * @property {Date} checkInDate.required - Check-in date
 * @property {Date} checkOutDate.required - Check-out date
 * @property {string} status.required.enum - Status of the booking (pending, confirmed, cancelled, concluded)
 * @property {number} totalPrice.required - Total price for the booking
 */
const bookingSchema = new mongoose.Schema(
    {
        housingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Housing',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        checkInDate: {
            type: Date,
            required: true,
        },
        checkOutDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'concluded'],
            default: 'pending',
        },
        totalPrice: {
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
