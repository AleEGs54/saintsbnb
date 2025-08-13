const express = require('express')
const passport = require('passport')
const router = express.Router()

// Google authentication routes
// to login you must hit this endpoint: /auth/google
// to log out you must hit this endpoint: /auth/logout

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Initiate Google OAuth login'
  // #swagger.summary = 'Initiate Google OAuth login'
});

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // #swagger.tags = ['Auth']
    // #swagger.description = 'Google OAuth callback for authentication'
    // #swagger.summary = 'Handle Google OAuth callback'
    req.session.user = req.user;
    
    res.redirect('/api-docs');
  }
)

const express = require('express');
const passport = require('passport');

const router = express.Router();


const hasGoogle =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL;

if (hasGoogle) {
  // Start Google OAuth
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  // Google OAuth callback
  router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/'); // change to '/api-docs' if you prefer
    }
  );
}


const hasGithub =
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  (process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback');

// Start GitHub OAuth
router.get('/login', (req, res, next) => {
  if (!hasGithub) {
    return res.status(500).json({ message: 'GitHub OAuth not configured. Missing env vars.' });
  }
  return passport.authenticate('github')(req, res, next);
});


router.get(
  '/github/callback',
  (req, res, next) => {
    if (!hasGithub) {
      return res.status(500).json({ message: 'GitHub OAuth not configured. Missing env vars.' });
    }
    return passport.authenticate('github', { failureRedirect: '/api-docs', session: true })(
      req,
      res,
      next
    );
  },
  (req, res) => {
    // Passport already put the user in the session
    res.redirect('/'); // change to '/api-docs' if you want
  }
);


router.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ loggedIn: true, user: req.user });
  }
  return res.status(401).json({ loggedIn: false });
});

// Logout (works for both Google & GitHub)
router.get('/logout', (req, res, next) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Logout the current user and clear session'
  // #swagger.summary = 'Logout the current user and clear session'
  req.logout((error) => {
    if (error) return next(error);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie('connect.sid');
  req.logout(err => {
    if (err) return next(err);
    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie('connect.sid'); // session cookie name
        res.redirect('/logoutscreen');  // or just res.redirect('/');
      });
    } else {
      res.redirect('/logoutscreen');
    }
  });
});

module.exports = router;