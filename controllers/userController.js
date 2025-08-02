// controllers/userController.js
const userModel = require('../models/userModel');
const passport = require('passport');
const userController = {};

// register a new user as a client
userController.registerUser = async (req, res, next) => {
    //#swagger.tags = ['Users']
    const { name, email, password, phone, role } = req.body;
    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res
                .status(409)
                .json({ message: 'Email already registered.' });
        }

        // Create a new user instance and save it to the database
        const newUser = new userModel({ name, email, password, phone, role });
        await newUser.save();

        // Wrap req.logIn in a Promise to use it with async/await
        await new Promise((resolve, reject) => {
            req.logIn(newUser, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });

        // If login is successful, send the response
        return res.status(201).json({
            message: 'User registered and logged in successfully!',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        // If there's a duplicate key error, return a 409 error
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        // Pass other errors to the error handling middleware
        return next(error);
    }
};

// get all users
userController.getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find({}); // Find all users
        return res.status(200).json(users); // Respond with all users
    } catch (error) {
        return next(error);
    }
};

// get user by ID
userController.getUser = async (req, res, next) => {
    const userId = req.params.id; // Get user ID from URL parameters
    try {
        const user = await userModel.findById(userId); // Find user by ID

        if (!user) {
            // If user not found, return a 404 error
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json(user); // Respond with the user data
    } catch (error) {
        // Pass any Mongoose or other errors to the error handling middleware
        return next(error);
    }
};

// create a new user as an admin
userController.createUser = async (req, res, next) => {
    const { name, email, password, phone, role } = req.body; // Get user data from request body
    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        // Create a new user instance and save it to the database
        const newUser = new userModel({ name, email, password, phone, role });
        await newUser.save();

        return res.status(201).json({
            message: 'User created successfully!',
            user: newUser,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already exists.' });
        }
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res
                .status(400)
                .json({ message: error.message, errors: error.errors });
        }
        return next(error);
    }
};

// update users by ID
userController.updateUser = async (req, res, next) => {
    const userId = req.params.id; // Get user ID from URL parameters
    const { name, email, password, phone, role } = req.body; // Get update data from request body
    try {
        // Find user by ID and update, returning the updated document
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { name, email, password, phone, role },
            { new: true, runValidators: true },
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
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
        return next(error);
    }
};

// delete user by ID
userController.deleteUser = async (req, res, next) => {
    const userId = req.params.id; // Get user ID from URL parameters
    try {
        const deletedUser = await userModel.findByIdAndDelete(userId); // Find user by ID and delete

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
        return next(error);
    }
};

// Login using local strategy
userController.loginLocal = (req, res, next) => {
    const { email, password } = req.body;

    return passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user)
            return res
                .status(401)
                .json({ message: info?.message || 'Unauthorized' });

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res, next); // Agora a função retorna sempre
};

module.exports = userController;
