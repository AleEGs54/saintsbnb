// models/housingModel.js
const mongoose = require('mongoose');

/**
 * @typedef PostSchema
 * @property {number} rooms.required - Number of rooms in the home
 * @property {boolean} availability.required - Is the home currently available
 * @property {number} price.required - Price per night or per stay
 * @property {string} address.required - Full address of the home
 * @property {number} maxOccupants.required - Maximum number of occupants allowed
 * @property {string[]} features - Array of features (e.g., "wifi", "parking", "kitchen")
 * @property {mongoose.Schema.Types.ObjectId} user_id.required - Reference to the host/admin user who owns this post
 * @property {string} description - A detailed description of the property
 * @property {string[]} images - URLs to images of the property
 */
const postSchema = new mongoose.Schema(
    {
        rooms: {
            type: Number,
            required: true,
        },
        availability: {
            type: Boolean,
            required: true,
            default: true,
        },

        price: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        maxOccupants: {
            type: Number,
            required: true,
        },
        features: {
            type: [String], // Array of strings
            default: [],
        },
        user_id: {
            // Reference to the User (Host/Admin) who created this post
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Refers to the 'User' model
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        images: {
            type: [String], // Array of image URLs
            default: ['/images/no-image.png'],
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps automatically
    },
);

module.exports = mongoose.model('Post', postSchema);
