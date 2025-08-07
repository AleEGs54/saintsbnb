/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require('express');
const { connectDB } = require("./database/index"); 
const app = express();
const cors = require('cors');
require('dotenv').config();
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");

const port = process.env.PORT || 3000;

// Passport configuration
require('./auth/passport')(passport)

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"], 
  origin: "*"
}));

// Sessions & Passport
app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET || "your-secret-key-here",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => { 
  res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.username || req.session.user.displayName}` : "Not logged in"); 
});

app.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;  // 🎯 THIS IS THE CRUCIAL MISSING PIECE
    res.redirect("/");
  }
);
// Auth Route FIRST to ensure /auth/... paths are handled
app.use('/auth', require('./routes/auth'));

// Then Main routes
app.use('/', require('./routes'));



// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: '404: Route not found' });
});


// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});


// Uncaught Exception Handler
process.on("uncaughtException", (err, origin) => {
  console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});


// Connect to MongoDB and Start Server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server and Database are running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to connect to database:", err);
  });

