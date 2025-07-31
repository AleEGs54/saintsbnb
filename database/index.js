const mongoose = require('mongoose');
require('dotenv').config(); // Ensure environment variables are loaded

/*
 * Connects to the MongoDB database using Mongoose.
 * If MONGODB_URI is not found, exits the process.
 * Logs success or error messages to the console.
 */
const connectToDatabase = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log('MongoDB Connected successfully!');
    } catch (error) {
        // Log the error message if connection fails
        console.error('MongoDB connection error:', error.message);
        // Exit the process with a failure code
        process.exit(1);
    }
};

module.exports = connectToDatabase;
