const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const isAuthenticated = (req, res, next) => {
  // Passport session check works for both Google and GitHub
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  if (req.user) return next();
  // generic 401 with both login options
  return res.status(401).json({
    message: 'Unauthorized – please log in',
    loginUrls: {
      github: '/auth/login',
      google: '/auth/google'
    }
  });
};

module.exports = { handleValidation, isAuthenticated }