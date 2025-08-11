const User = require('../models/userModel');

const userController = {};

// GET all users
userController.getAll = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Retrieve a list of all users.'
    // #swagger.summary = 'Get all users'
    try {
        const result = await User.find();
        if (result.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching users',
            error: err.message,
        });
    }
};

// GET user by ID
userController.getById = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Retrieve a specific user by their ID.'
    // #swagger.summary = 'Get user by ID'
    try {
        const result = await User.findById(req.params.id);
        if (result) {
            return res.status(200).json(result);
        }
        res.status(404).json({ message: 'User not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching user',
            error: err.message,
        });
    }
};

// POST new User
userController.createUser = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    // #swagger.description = 'Create a new user.'
    // #swagger.summary = 'Create a new user'
    try {
        const newUser = await User.create({
            googleId: req.body.googleId,
            displayName: req.body.displayName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            isAdmin: req.body.isAdmin,
            isCustomer: req.body.isCustomer,
            createdAt: req.body.createdAt
        });
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to create user',
            error: err.message,
        });
    }
};

// PUT update User
userController.updateUser = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    // #swagger.description = 'Update an existing user by ID.'
    // #swagger.summary = 'Update user by ID'
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                googleId: req.body.googleId,
                displayName: req.body.displayName,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                isAdmin: req.body.isAdmin,
                isCustomer: req.body.isCustomer,
                createdAt: req.body.createdAt
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({
            message: 'Error updating user',
            error: err.message,
        });
    }
};

// DELETE User
userController.deleteUser = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    // #swagger.description = 'Delete a user by ID.'
    // #swagger.summary = 'Delete user by ID'
    try {
        const deletedUser = await User.deleteOne({ _id: req.params.id });

        if (deletedUser.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting user',
            error: err.message,
        });
    }
};

// PATCH toggle user's admin status
userController.toggleAdmin = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    // #swagger.description = "Toggle a user's admin status."
    // #swagger.summary = "Toggle user's admin status"
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isAdmin = !user.isAdmin;
        await user.save();

        res.status(200).json({
            message: `User admin status set to ${user.isAdmin}`,
            user
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error toggling admin status',
            error: err.message,
        });
    }
};

module.exports = userController;
