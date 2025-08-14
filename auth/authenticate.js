const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  // Fallback: use req.user (Passport), not req.session.user
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return next();
};

module.exports = { isAuthenticated };