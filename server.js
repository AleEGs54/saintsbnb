const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectToDatabase = require('./database/index');
const port = process.env.PORT;

// Import session and passport config
const session = require('express-session');
const passportConfig = require('./auth/passport');
const flash = require('connect-flash');

// app config
app.use(cors()); //Allows requests from any origin
app.use(express.json()); //Parses incoming JSON data
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data (e.g., form submissions)

// Configure session middleware (MUST be before passport.initialize() and passport.session())
app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            'a_very_strong_and_random_secret_key_for_sessions', // Use a strong, unique secret from your .env
        resave: false, // Don't save session if unmodified
        saveUninitialized: false, // Don't create session until something stored
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
        },
        proxy: true, // Trust the reverse proxy (e.g., Heroku, Render)
    }),
);

app.use(flash());

// Initialize Passport after session middleware
passportConfig(app); // Call the passport config function and pass the app instance

// database connection
connectToDatabase();

//app routers
app.use('/', require('./routes')); //Main router

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(err.statusCode || 500).json({
        message: err.message || 'An unexpected error occurred.',
    });
});

//app listen
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
