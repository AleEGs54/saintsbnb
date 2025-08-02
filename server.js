/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require('express');
const { connectDB } = require("./database/index"); 
const app = express();
const cors = require('cors');
require('dotenv').config();
const session = require("express-session");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows requests from any origin
app.use(express.json()); // Parses incoming JSON data
app.use(bodyParser.urlencoded({ extended: true }));


// Routers
app.use('/', require('./routes')); // Main router


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
