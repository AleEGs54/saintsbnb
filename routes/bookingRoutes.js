const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { bookingValidationRules, validate } = require('../utilities/validation');
const { isAuthenticated } = require('../auth/authenticate');

// Criar reserva
router.post('/', isAuthenticated, bookingValidationRules, validate, bookingController.createBooking);

// Obter reserva por ID
router.get('/:id', isAuthenticated, bookingController.getBookingById);

// Obter reservas por usuário
router.get('/user/:userId', isAuthenticated, bookingController.getBookingsByUser);

// Obter reservas por imóvel
router.get('/post/:postId', isAuthenticated, bookingController.getBookingsByPost);

// Atualizar reserva
router.put('/:id', isAuthenticated, bookingValidationRules, validate, bookingController.updateBooking);

// Deletar reserva
router.delete('/:id', isAuthenticated, bookingController.deleteBooking);

module.exports = router;