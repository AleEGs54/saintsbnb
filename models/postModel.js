/* eslint-disable no-undef */
const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, required: true },
  rooms: { type: Number, required: true },
  availability: { type: Boolean, required: true, default: false },
  description: { type: String, required: true, default: 'No description' },
  owner: { type: String, required: true },
  price: { type: String, required: true },
  address: { type: String, required: true },
  max_occupants: { type: Number, required: true },
  location: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);