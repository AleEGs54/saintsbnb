const User = require('../models/userModel');

const userController = {};

// GET all users
userController.getAll = async (req, res) => {
    // #swagger.tags = ['Users']
    try {
        const result = await User.find();
        console.log(result)
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
