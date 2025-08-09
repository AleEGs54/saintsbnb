const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const isAuthenticated = (req, res, next) => {
  // If Passport has established a session, allow the request
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  // Fallback: Passport attaches the user object even if isAuthenticated() isn’t defined
  if (req.user) {
    return next();
  }
  // Unauthorized: generic message with login hints
  return res.status(401).json({
    message: 'Unauthorized – please log in',
    loginUrls: {
      github: '/auth/login'
      // google: '/auth/google' // keep if you still support Google logins
    }
  });
};

module.exports = { handleValidation, isAuthenticated };