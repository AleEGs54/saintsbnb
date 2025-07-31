const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

//swagger route.
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Import and use user routes
router.use('/users', require('./userRoutes')); // All routes in userRoutes will be prefixed with /users

// Import and use housing routes
router.use('/housing', require('./housingRoutes')); // All routes in housingRoutes will be prefixed with /housing

// You might want a root route (e.g., for API status or home)
router.get('/', (req, res) => {
    res.send('Welcome to SaintsBnB API!');
});

module.exports = router;
