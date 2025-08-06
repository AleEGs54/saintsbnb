// auth/authenticate.js
const isAuthenticated = (req, res, next) => {
    // Use req.isAuthenticated() from Passport.js
  if (req.session.user === undefined) {
    return res.status(401).json({ message: "You do not have access" });
  }
  return next();
};

module.exports = { isAuthenticated };
