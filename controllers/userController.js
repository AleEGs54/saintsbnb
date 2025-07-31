// controllers/userController.js
const userModel = require('../models/userModel');

const userController = {};

/**
 * @function registerUser
 * @description Registers a new user with local credentials.
 * @param {object} req - Express request object (expects name, email, password, phone, role in body).
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
userController.registerUser = async (req, res, next) => {
    const { name, email, password, phone, role } = req.body;
    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res
                .status(409)
                .json({ message: 'Email already registered.' });
        }

        // Create a new user instance
        const newUser = new userModel({ name, email, password, phone, role });
        await newUser.save();

        req.logIn(newUser, (err) => {
            if (err) {
                console.error('Error logging in after registration:', err);
                // Return 201 for successful registration, even if auto-login fails
                return res.status(201).json({
                    message:
                        'User registered successfully, but automatic login failed. Please try logging in.',
                    user: {
                        _id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role,
                    },
                });
            }
            res.status(201).json({
                message: 'User registered and logged in successfully!',
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            });
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already exists.' });
        }
        next(error); // Pass other errors to the error handler
    }
};

/**
 * @function getAllUsers
 * @description Retrieves all users.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
userController.getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find({}); // Find all users
        res.status(200).json(users); // Respond with all users
    } catch (error) {
        next(error);
    }
};

/**
 * @function getUser
 * @description Retrieves a single user by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
userController.getUser = async (req, res, next) => {
    const userId = req.params.id; // Get user ID from URL parameters
    try {
        const user = await userModel.findById(userId); // Find user by ID

        if (!user) {
            // If user not found, return a 404 error
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user); // Respond with the user data
    } catch (error) {
        // Pass any Mongoose or other errors to the error handling middleware
        next(error);
    }
};

/**
 * @function createUser
 * @description Creates a new user (typically for admin use or internal processes,
 * distinct from self-registration via /register).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
userController.createUser = async (req, res, next) => {
    const userData = req.body; // Get user data from request body
    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        // Create a new user instance and save it to the database
        const newUser = new userModel(userData);
        await newUser.save();

        res.status(201).json({
            message: 'User created successfully!',
            user: newUser,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already exists.' });
        }
        // Handle validation errors if any (e.g., if 'password' is required but not provided in userData)
        if (error.name === 'ValidationError') {
            return res
                .status(400)
                .json({ message: error.message, errors: error.errors });
        }
        next(error);
    }
};

/**
 * @function updateUser
 * @description Updates an existing user by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
userController.updateUser = async (req, res, next) => {
    const userId = req.params.id; // Get user ID from URL parameters
    const updateData = req.body; // Get update data from request body
    try {
        // Find user by ID and update, return the updated document
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true },
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            message: 'User updated successfully!',
            user: updatedUser,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res
                .status(400)
                .json({ message: error.message, errors: error.errors });
        }
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already exists.' });
        }
        next(error);
    }
};

/**
 * @function deleteUser
 * @description Deletes a user by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
userController.deleteUser = async (req, res, next) => {
    const userId = req.params.id; // Get user ID from URL parameters
    try {
        const deletedUser = await userModel.findByIdAndDelete(userId); // Find user by ID and delete

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
        next(error);
    }
};

module.exports = userController;
