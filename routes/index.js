// routes/index.js
const router = require('express').Router();

// Swagger & feature routes
router.use('/api-docs', require('./swagger'));
router.use('/posts', require('./post'));
router.use('/reservations', require('./reservation'));
router.use('/auth', require('./auth')); // <- auth routes live here

// Home
router.get('/', (req, res) => {
  // #swagger.tags = ['Home']
  // #swagger.description = 'Home page endpoint'
  res.send('Welcome to the home page!');
});

// Optional: a simple "logged out" screen
router.get('/logoutscreen', (req, res) => {
  res.send('Welcome to the home page! You have been logged out.');
});

module.exports = router;
