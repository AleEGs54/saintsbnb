const isAuthenticated = (req, res, next) => {
    // Use req.isAuthenticated() from Passport.js to check if the user is authenticated.
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware/route handler
    }
    // If not authenticated, send a 401 Unauthorized response
    return res.status(401).json({
        message: 'Unauthorized: You must be logged in to access this resource.',
    });
};

module.exports = { isAuthenticated };
