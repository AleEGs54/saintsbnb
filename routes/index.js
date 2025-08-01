const router = require('express').Router();

//swagger route.
router.use('/api-docs', require('./swagger'));
router.use('/posts', require('./post'));
router.use('/reservations', require('./reservation'));

module.exports = router;
