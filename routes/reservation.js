const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation');

router.get('/', reservationController.getReservation);
router.get('/:id', reservationController.getById);
router.post('/', reservationController.createReservation);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;