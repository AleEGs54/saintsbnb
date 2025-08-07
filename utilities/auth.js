

const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const isAuthenticated = (req, res, next) => {
  if (req.session.user === undefined) {
    return res.status(401).json({ message: 'Unauthorized' });
  } 
  console.log("User is authenticated:", req.session.user);
  next();
};

module.exports = {handleValidation, isAuthenticated};
