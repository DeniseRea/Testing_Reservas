const Reserva = require('../models/Reserva');

// Crear nueva reserva
exports.crearReserva = async (req, res) => {
  try {
    const reserva = new Reserva({ ...req.body, userId: req.user.id });
    await reserva.save();
    res.status(201).json({ msg: 'Reserva creada', reserva });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todas las reservas del usuario
exports.obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find({ userId: req.user.id });
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar una reserva
exports.eliminarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json({ msg: 'Reserva eliminada', reserva });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
