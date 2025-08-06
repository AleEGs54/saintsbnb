const mongoose = require('mongoose');

/**
 * @typedef Booking
 * @property {ObjectId} post_id.required - ID do imóvel (housing) reservado
 * @property {ObjectId} user_id.required - ID do usuário que fez a reserva
 * @property {Date} check_in_date.required - Data de entrada
 * @property {Date} check_out_date.required - Data de saída
 * @property {string} status.required.enum - Status da reserva (confirmed, cancelled, pending, concluded)
 * @property {number} total_price.required - Preço total da reserva
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