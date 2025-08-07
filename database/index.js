// models/db.js
// This file is used to connect to the MongoDB database using Mongoose.
const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
        if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => {
      console.error('❌ Failed to connect to MongoDB:', err.message);
      process.exit(1);
    });
}
}

module.exports = { connectDB };
