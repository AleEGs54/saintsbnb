// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @typedef UserSchema
 * @property {string} name.required - The name of the user
 * @property {string} email.required - The email of the user (must be unique)
 * @property {string} password - The hashed password of the user (required for local login)
 * @property {string} phone - The phone number of the user
 * @property {string} role.required.enum - The role of the user (guest, host, admin)
 * @property {string} [providerID] - ID from OAuth provider (e.g., Google, GitHub)
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            // Added for local login
            type: String,
            // required: true, // Make this required only if not using OAuth exclusively for a user
            select: false, // Do not return password by default in queries
        },
        phone: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ['guest', 'host', 'admin'],
            required: true,
            default: 'guest',
        },
        providerID: {
            // Generalized ID for any OAuth provider
            type: String,
            unique: true,
            sparse: true, // Allows null values, but ensures uniqueness if a value exists
        },
        // githubId: { // Removed this specific ID as you opted for a general providerID
        //     type: String,
        //     unique: true,
        //     sparse: true
        // }
    },
    {
        timestamps: true,
    },
);

// Hash the password before saving a new user or if password is modified
userSchema.pre('save', async function (next) {
    if (this.isModified('password') && this.password) {
        // Only hash if password exists and is modified
        this.password = await bcrypt.hash(this.password, 10); // Hash with 10 salt rounds
    }
    next();
});

// Method to compare passwords
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
