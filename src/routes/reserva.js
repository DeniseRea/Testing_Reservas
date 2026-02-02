const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { 
  crearReserva, 
  obtenerReservas, 
  eliminarReserva 
} = require('../controllers/reservaController');

// Rutas protegidas para reservas
router.get('/', auth, obtenerReservas);
router.post('/', auth, crearReserva);
router.delete('/:id', auth, eliminarReserva);

module.exports = router;
