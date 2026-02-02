const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ====================================
// FUNCIONES AUXILIARES PARA TESTING
// ====================================

/**
 * Valida que una fecha no sea del pasado
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {boolean} - true si la fecha es válida (hoy o futura)
 */
function validarFechaNoEsPasado(fecha) {
  const fechaReserva = new Date(fecha + 'T00:00:00'); // Forzar medianoche UTC
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
  
  return fechaReserva >= hoy;
}

/**
 * Valida formato de hora (HH:MM)
 * @param {string} hora - Hora en formato HH:MM
 * @returns {boolean}
 */
function validarFormatoHora(hora) {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(hora);
}

/**
 * Valida que la hora esté en horario laboral (8:00 - 18:00)
 * @param {string} hora - Hora en formato HH:MM
 * @returns {boolean}
 */
function validarHorarioLaboral(hora) {
  const [horas] = hora.split(':').map(Number);
  return horas >= 8 && horas < 18;
}

/**
 * Hashea una contraseña
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} - Contraseña hasheada
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Compara contraseña con hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} hash - Hash de la contraseña
 * @returns {Promise<boolean>}
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Genera un token JWT
 * @param {object} payload - Datos a incluir en el token
 * @param {string} secret - Secreto para firmar
 * @returns {string} - Token JWT
 */
function generateToken(payload, secret) {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

/**
 * Verifica un token JWT
 * @param {string} token - Token a verificar
 * @param {string} secret - Secreto para verificar
 * @returns {object|null} - Payload decodificado o null si es inválido
 */
function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

/**
 * Valida formato de email
 * @param {string} email
 * @returns {boolean}
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida longitud mínima de contraseña
 * @param {string} password
 * @param {number} minLength - Longitud mínima (default: 6)
 * @returns {boolean}
 */
function validarPasswordLength(password, minLength = 6) {
  return password && typeof password === 'string' && password.length >= minLength;
}

module.exports = {
  validarFechaNoEsPasado,
  validarFormatoHora,
  validarHorarioLaboral,
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  validarEmail,
  validarPasswordLength
};
