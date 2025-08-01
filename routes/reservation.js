const router = require('express').Router();
const reservationController = require('../controllers/reservation');

router.get('/', reservationController.getAll);
router.get('/:id', reservationController.getById);
router.post('/', reservationController.createReservation);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
