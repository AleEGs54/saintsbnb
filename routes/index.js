const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

// swagger route.
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// user routes
router.use(
    //#swagger.tags = ['Users'];
    '/users',
    require('./userRoutes'),
); // All routes in userRoutes will be prefixed with /users

// housing routes
router.use(
    //#swagger.tags = ['Housing'];
    '/housing',
    require('./housingRoutes'),
); // All routes in housingRoutes will be prefixed with /housing

// home page route
router.get('/', (req, res) => {
    //#swagger.tags = ['Home Page'];
    res.send('Welcome to SaintsBnB API!');
});

// booking routes
router.use(
    //#swagger.tags = ['Booking'];
    '/booking',
    require('./bookingRoutes'),
); // All routes in bookingRoutes will be prefixed with /booking

// calendar routes
router.use(
    //#swagger.tags = ['Users'];
    '/calendar',
    require('./calendarRoutes'),
); // All routes in calendarRoutes will be prefixed with /calendar

module.exports = router;
