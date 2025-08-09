// routes/auth.js
const express = require('express');
const passport = require('passport');

const router = express.Router();

/** ---------------------------
 *  OPTIONAL GOOGLE ROUTES
 *  Only mount if Google env vars exist so we don't crash when they're missing
 * --------------------------*/
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
      // You can change this redirect to wherever you want
      res.redirect('/api-docs');
    }
  );
}

/** ---------------------------
 *  GITHUB ROUTES
 *  These will be used for your current testing
 * --------------------------*/
const hasGithub =
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  (process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback');

// Start GitHub OAuth
router.get('/login', (req, res, next) => {
  if (!hasGithub) {
    return res
      .status(500)
      .json({ message: 'GitHub OAuth not configured. Missing env vars.' });
  }
  return passport.authenticate('github')(req, res, next);
});

// GitHub OAuth callback (must match GITHUB_CALLBACK_URL)
router.get(
  '/github/callback',
  (req, res, next) => {
    if (!hasGithub) {
      return res
        .status(500)
        .json({ message: 'GitHub OAuth not configured. Missing env vars.' });
    }
    return passport.authenticate('github', { failureRedirect: '/api-docs', session: true })(
      req,
      res,
      next
    );
  },
  (req, res) => {
    // Passport already placed the user into the session
    res.redirect('/');
  }
);

/** ---------------------------
 *  UTIL ROUTES
 * --------------------------*/

// Check current auth state
router.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ loggedIn: true, user: req.user });
  }
  return res.status(401).json({ loggedIn: false });
});

// Logout (works for both Google & GitHub)
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/logoutscreen');
      });
    } else {
      res.redirect('/logoutscreen');
    }
  });
});

module.exports = router;