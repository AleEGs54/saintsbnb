const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true },
    post_id: { type: Schema.Types.ObjectId, required: true },
    review_date: { type: Date, required: true },
    review_text: { type: String, required: true },
    ratings: { type: Number, required: true },
});


module.exports = mongoose.model('Review', reviewSchema);
