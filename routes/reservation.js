const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation');
const {isAuthenticated, handleValidation} = require('../utilities/auth');

router.get('/', handleValidation, reservationController.getReservation);
router.get('/:id', handleValidation, reservationController.getById);
router.post('/', isAuthenticated, handleValidation, reservationController.createReservation);
router.put('/:id', isAuthenticated, handleValidation, reservationController.updateReservation);
router.delete('/:id', isAuthenticated, handleValidation, reservationController.deleteReservation);

module.exports = router;