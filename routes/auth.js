const express = require('express');
const passport = require('passport');
const router = express.Router();

// Mount Google routes only if all env vars exist
const hasGoogle =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET;

if (hasGoogle) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/api-docs' }),
    (req, res) => res.redirect('/')
  );
}

// Always register GitHub routes if env vars exist
const hasGithub =
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  (process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback');
router.get('/login', (req, res, next) => {
  if (!hasGithub) {
    return res.status(500).json({ message: 'GitHub OAuth not configured. Missing env vars.' });
  }
  return passport.authenticate('github')(req, res, next);
});
router.get('/github/callback',
  (req, res, next) => {
    if (!hasGithub) {
      return res.status(500).json({ message: 'GitHub OAuth not configured. Missing env vars.' });
    }
    return passport.authenticate('github', { failureRedirect: '/api-docs', session: true })(req, res, next);
  },
  (req, res) => res.redirect('/')
);

// Show login status
router.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) return res.json({ loggedIn: true, user: req.user });
  return res.status(401).json({ loggedIn: false });
});

// Unified logout for both strategies
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