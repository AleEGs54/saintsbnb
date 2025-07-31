// auth/authenticate.js
const isAuthenticated = (req, res, next) => {
    // Use req.isAuthenticated() from Passport.js
    if (req.isAuthenticated()) {
        return next();
    }

    return res
        .status(401)
        .json({ message: 'You do not have access (Authentication Required).' });
};

module.exports = { isAuthenticated };
