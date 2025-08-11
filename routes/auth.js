const express = require('express')
const passport = require('passport')
const router = express.Router()

// Google authentication routes
// to login you must hit this endpoint: /auth/google
// to log out you must hit this endpoint: /auth/logout

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Google authentication route'
});

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // #swagger.tags = ['Auth']
  // #swagger.description = 'Google authentication callback'
    req.session.user = req.user;
    
    res.redirect('/api-docs');
  }
)

router.get('/logout', (req, res, next) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Google authentication logout'
  req.logout((error) => {
    if (error) return next(error);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie('connect.sid');
      res.redirect('/logoutscreen');
    });
  });
});

module.exports = router;