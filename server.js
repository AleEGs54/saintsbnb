
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const { connectDB } = require('./database/index');

const app = express();
const port = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS: use a specific origin when you need cookies (sessions)
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  next();
});
app.use(cors({ origin: ORIGIN, credentials: true }));

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false
}));

// Passport (GitHub only)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,               // required
    clientSecret: process.env.GITHUB_CLIENT_SECRET,       // required
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback' // required
  },
  (accessToken, refreshToken, profile, done) => {
    // You can persist user here if you want; for now just pass the profile through
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ---------- Basic routes ----------
app.get('/', (req, res) => {
  res.send(req.user ? `Logged in as ${req.user.username || req.user.displayName}` : 'Not logged in');
});

app.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ loggedIn: true, user: req.user });
  }
  return res.status(401).json({ loggedIn: false });
});




// Logout
app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    if (req.session) {
      req.session.destroy(() => res.redirect('/'));
    } else {
      res.redirect('/');
    }
  });
});

// ---------- Your app routes ----------
/**
 * If you already have /auth routes in ./routes/auth that include Google,
 * keep them commented while you test GitHub-only to avoid conflicts.
 *
 * // app.use('/auth', require('./routes/auth'));
 */
app.use('/', require('./routes'));

// 404
app.use((req, res) => res.status(404).json({ message: '404: Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Uncaught exceptions (last resort)
process.on('uncaughtException', (err, origin) => {
  console.error(`Uncaught exception: ${err}\nOrigin: ${origin}`);
});

// ---------- Start ----------
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server & DB running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
  });