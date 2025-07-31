// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const {
    usersValidationRules,
    validate,
    loginValidationRules,
} = require('../utilities/validation');
const utilities = require('../utilities/errorHandling');
const { isAuthenticated } = require('../auth/authenticate');
require('dotenv').config();

//#swagger.tags = ['Users'];

// --- OAuth Login Route (Generic Placeholder) ---
router.get(
    '/auth/external',
    passport.authenticate(
        process.env.AUTHENTICATION_PASSPORT || 'some-default-strategy',
    ),
);

// Generic OAuth Callback Route
router.get(
    '/auth/external/callback',
    passport.authenticate(
        process.env.AUTHENTICATION_PASSPORT || 'some-default-strategy',
        { failureRedirect: '/users/login-local' },
    ),
    (req, res) => {
        res.redirect('/users/dashboard');
    },
);

// --- Local Authentication Routes ---

// Route to register a new user (account creation)
router.post(
    '/register',
    usersValidationRules,
    validate,
    utilities.handleErrors(userController.registerUser),
);

// Route for local user login
router.post(
    '/login-local',
    loginValidationRules,
    validate,
    passport.authenticate('local', {
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/login-local',
        failureFlash: true,
    }),
);

// --- General User Management Routes ---

// Route for user logout
router.get(
    '/logout',
    utilities.handleErrors((req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.session.destroy((err) => {
                if (err) return next(err);
                res.clearCookie('connect.sid');
                res.status(200).json({ message: 'Logged out successfully' });
            });
        });
    }),
);

// GET all users
router.get(
    '/',
    isAuthenticated,
    utilities.handleErrors(userController.getAllUsers),
);

// GET route to retrieve a single user by ID
router.get(
    '/:id',
    isAuthenticated,
    utilities.handleErrors(userController.getUser),
);

// POST route to create a new user (admin-level creation, distinct from /register)
router.post(
    '/',
    isAuthenticated,
    usersValidationRules,
    validate,
    utilities.handleErrors(userController.createUser),
);

// PUT route to update an existing user by ID
router.put(
    '/:id',
    isAuthenticated,
    usersValidationRules,
    validate,
    utilities.handleErrors(userController.updateUser),
);

// DELETE route to delete a user by ID
router.delete(
    '/:id',
    isAuthenticated,
    utilities.handleErrors(userController.deleteUser),
);

// Example dashboard route (for successful login redirect)
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.status(200).json({
        message: 'Welcome to your dashboard!',
        user: req.user,
    });
});

module.exports = router;