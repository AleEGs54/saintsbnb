const router = require('express').Router();

//swagger route.
router.use('/api-docs', require('./swagger'));

module.exports = router;
