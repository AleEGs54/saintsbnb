require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const session   = require('express-session');
const bodyParser = require('body-parser');
const passport  = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const { connectDB } = require('./database/index');

const app  = express();
const port = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS: specify origin when sending session cookies
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
  saveUninitialized: false,
}));

// Initialise Passport
app.use(passport.initialize());
app.use(passport.session());

// Register GitHub strategy if configured
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback'
  }, (accessToken, refreshToken, profile, done) => {
    // For now, persist the whole GitHub profile as the user object
    return done(null, profile);
  }));
}

// Conditionally load the Google strategy only when all vars are set
const hasGoogle =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL;
if (hasGoogle) {
  require('./auth/passport')(passport);
}

// Simple (de)serialization: store entire user object
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ---------- Route Handling ----------
app.use('/auth', require('./routes/auth'));   // login/logout/me endpoints
app.use('/', require('./routes'));            // API routes, docs, home

// 404 handler
app.use((req, res) => res.status(404).json({ message: '404: Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Uncaught exception handler
process.on('uncaughtException', (err, origin) => {
  console.error(`Uncaught exception: ${err}\nOrigin: ${origin}`);
});

// ---------- Start Server ----------
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

module.exports = { app };
