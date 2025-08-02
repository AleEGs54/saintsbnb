/* eslint-disable no-undef */ 
const mongoose = require('mongoose'); 
const { Schema } = mongoose; 
 
const reservationSchema = new Schema({ 
  post_id: { type: String, required: true }, 
  user_id: { type: String, required: true }, 
  check_in_date: { type: String, required: true }, 
  check_out_date: { type: String, required: true }, 
  status: { type: String, required: true }, 
  total_price: { type: String, required: true } 
}); 
 

module.exports = mongoose.model('Reservation', reservationSchema);