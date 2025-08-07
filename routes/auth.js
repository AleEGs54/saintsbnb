const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))


router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/api-docs');
  }
)


router.get('/logout', (req, res, next) => {
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