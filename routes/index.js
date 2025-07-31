const router = require('express').Router();
const postController = require('../controllers/posts');
const reservationController = require('../controllers/reservations');

//swagger route.
router.use('/api-docs', require('./swagger'));
router.get('/', (req, res) => res.send('Welocme to Saints BNB!'));

// Housing/post routes
router.get('/home/getAll', postController.getHousing);
router.get('/home/:id', postController.getById);
router.get('/home/location/:location', postController.getByLocation);
router.post('/home/createHome', postController.addHousing);
router.put('/home/:id', postController.updateHousing);
router.delete('/home/:id', postController.deleteHousing);

// Reservation/booking routes
router.get('/booking/getAll', reservationController.getReservation);
router.get('/booking/:id', reservationController.getById);
router.post('/booking/createBooking', reservationController.addReservation);
router.put('/booking/:id', reservationController.updateReservation);
router.delete('/booking/:id', reservationController.deleteReservation);


module.exports = router;
