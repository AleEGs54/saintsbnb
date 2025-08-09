const router = require('express').Router();


//swagger route.
router.use('/api-docs', require('./swagger'));
router.use('/posts', require('./post'));
router.use('/reservations', require('./reservation'));
router.use('/reviews', require('./review'));
router.use('/user', require('./user'));
router.use('/auth', require('./auth'));


router.get("/", (req, res) => {
  // #swagger.tags = ['Home']
  // #swagger.description = 'Home page endpoint'
  res.send("Welcome to the home page!");
});

router.get("/logoutscreen", (req, res) => {
  // #swagger.tags = ['Home']
  // #swagger.description = 'Home page endpoint'
  res.send("Welcome to the home page! You have been logged out.");
});


module.exports = router;
