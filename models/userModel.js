const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @typedef UserSchema
 * @property {string} name.required - The name of the user
 * @property {string} email.required - The email of the user (must be unique)
 * @property {string} password - The hashed password of the user (required for local login)
 * @property {string} phone - The phone number of the user
 * @property {string} role.required.enum - The role of the user (guest, host, admin)
 * @property {string} [githubId] - ID from GitHub OAuth
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
            // Only required for local login
            type: String,
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
        githubId: {
            type: String,
            unique: true,
            sparse: true, // Allows null values, but enforces uniqueness if a value exists
        },
    },
    {
        timestamps: true,
    },
);

// Hash the password before saving if modified
userSchema.pre('save', async function (next) {
    if (this.isModified('password') && this.password) {
        this.password = await bcrypt.hash(this.password, 10); // Salt rounds = 10
    }
    next();
});

// Method to compare passwords
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
