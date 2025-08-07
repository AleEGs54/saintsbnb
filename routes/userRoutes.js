// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const {
    registrationValidationRules,
    adminUserValidationRules,
    validate,
    loginValidationRules,
} = require('../utilities/validation');
const { isAuthenticated } = require('../auth/authenticate');
const {
    isAdmin,
    preventRoleChange,
    isSelfOrAdmin,
} = require('../utilities/index');
require('dotenv').config();

// OAuth Login Route
router.get(
    /* #swagger.ignore = true */
    '/auth/github',
    passport.authenticate('github', { scope: 'openid email profile' }),
);

// OAuth Callback Route
router.get(
    /* #swagger.ignore = true */
    '/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/users/login',
        successRedirect: '/users/dashboard',
    }),
);

// Route to register a new user (account creation)
router.post(
    '/register',
    registrationValidationRules,
    validate,
    userController.registerUser,
);

// POST route to create a new user (admin-level creation)
router.post(
    '/',
    isAuthenticated,
    isAdmin,
    adminUserValidationRules,
    validate,
    userController.createUser,
);

// Route for local user login

router.post(
    '/login',
    loginValidationRules,
    validate,
    userController.loginLocal,
);

// Route for user logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        return req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});

// GET all users
router.get('/', isAuthenticated, userController.getAllUsers);

// GET route to retrieve a single user by ID
router.get('/:id', isAuthenticated, userController.getUser);

// PUT route to update an existing user by ID
router.put(
    '/:id',
    isAuthenticated,
    isSelfOrAdmin,
    preventRoleChange,
    adminUserValidationRules,
    validate,
    userController.updateUser,
);

// DELETE route to delete a user by ID

router.delete('/:id', isAuthenticated, userController.deleteUser);

// Example dashboard route (for successful login redirect)

router.get(
    /* #swagger.ignore = true */
    '/dashboard',
    isAuthenticated,
    (req, res) => {
        res.status(200).json({
            message: 'Welcome to your dashboard!',
            user: req.user,
        });
    },
);

module.exports = router;
