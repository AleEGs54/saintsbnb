/* eslint-disable no-undef */
const mongoose = require('mongoose');
const { Schema } = mongoose;

const reservationSchema = new Schema({
  post_id: { type: Schema.Types.ObjectId, required: true },
  user_id: { type: Schema.Types.ObjectId, required: true },
  check_in_date: { type: Date, required: true },
  check_out_date: { type: Date, required: true },
  status: { type: String, required: true },
  total_price: { type: String, required: true }
});


module.exports = mongoose.model('Reservation', reservationSchema);