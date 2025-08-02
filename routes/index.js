const router = require('express').Router();

//swagger route.
router.use('/api-docs', require('./swagger'));
router.use('/posts', require('./post'));
router.use('/reservations', require('./reservation'));

router.get("/", (req, res) => {
  // #swagger.tags = ['Home']
  // #swagger.description = 'Home page endpoint'
  res.send("Welcome to the home page!");
});


module.exports = router;
