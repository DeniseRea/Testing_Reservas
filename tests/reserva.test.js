const {
  validarFechaNoEsPasado,
  validarFormatoHora,
  validarHorarioLaboral,
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  validarEmail,
  validarPasswordLength
} = require('../src/utils/validators');

// ====================================
// PRUEBAS DE VALIDACIÓN DE FECHAS
// ====================================
describe('Validación de Fechas', () => {
  test('Debe rechazar fechas pasadas', () => {
    const fechaPasada = '2020-01-01';
    expect(validarFechaNoEsPasado(fechaPasada)).toBe(false);
  });

  test('Debe aceptar fecha de hoy', () => {
    const hoy = new Date().toISOString().split('T')[0];
    expect(validarFechaNoEsPasado(hoy)).toBe(true);
  });

  test('Debe aceptar fechas futuras', () => {
    const fechaFutura = '2027-12-31';
    expect(validarFechaNoEsPasado(fechaFutura)).toBe(true);
  });

  test('Debe rechazar fecha de ayer', () => {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const fechaAyer = ayer.toISOString().split('T')[0];
    expect(validarFechaNoEsPasado(fechaAyer)).toBe(false);
  });
});

// ====================================
// PRUEBAS DE VALIDACIÓN DE HORA
// ====================================
describe('Validación de Formato de Hora', () => {
  test('Debe aceptar hora válida 09:00', () => {
    expect(validarFormatoHora('09:00')).toBe(true);
  });

  test('Debe aceptar hora válida 23:59', () => {
    expect(validarFormatoHora('23:59')).toBe(true);
  });

  test('Debe rechazar formato inválido 25:00', () => {
    expect(validarFormatoHora('25:00')).toBe(false);
  });

  test('Debe rechazar formato inválido 12:60', () => {
    expect(validarFormatoHora('12:60')).toBe(false);
  });

  test('Debe rechazar formato sin dos puntos', () => {
    expect(validarFormatoHora('1200')).toBe(false);
  });

  test('Debe rechazar texto aleatorio', () => {
    expect(validarFormatoHora('abc:def')).toBe(false);
  });
});

// ====================================
// PRUEBAS DE HORARIO LABORAL
// ====================================
describe('Validación de Horario Laboral', () => {
  test('Debe aceptar hora dentro del horario laboral (9:00)', () => {
    expect(validarHorarioLaboral('09:00')).toBe(true);
  });

  test('Debe aceptar hora límite inferior (8:00)', () => {
    expect(validarHorarioLaboral('08:00')).toBe(true);
  });

  test('Debe aceptar hora antes del límite superior (17:30)', () => {
    expect(validarHorarioLaboral('17:30')).toBe(true);
  });

  test('Debe rechazar hora fuera de horario (18:00)', () => {
    expect(validarHorarioLaboral('18:00')).toBe(false);
  });

  test('Debe rechazar hora muy temprano (6:00)', () => {
    expect(validarHorarioLaboral('06:00')).toBe(false);
  });

  test('Debe rechazar hora muy tarde (20:00)', () => {
    expect(validarHorarioLaboral('20:00')).toBe(false);
  });
});

// ====================================
// PRUEBAS DE CONTRASEÑAS
// ====================================
describe('Validación de Contraseñas', () => {
  test('Debe hashear una contraseña correctamente', async () => {
    const password = 'miPassword123';
    const hash = await hashPassword(password);
    
    expect(hash).toBeTruthy();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });

  test('Debe comparar contraseña correcta con su hash', async () => {
    const password = 'testPassword';
    const hash = await hashPassword(password);
    const match = await comparePassword(password, hash);
    
    expect(match).toBe(true);
  });

  test('Debe rechazar contraseña incorrecta', async () => {
    const password = 'correctPassword';
    const hash = await hashPassword(password);
    const match = await comparePassword('wrongPassword', hash);
    
    expect(match).toBe(false);
  });

  test('Debe validar longitud mínima de contraseña', () => {
    expect(validarPasswordLength('12345')).toBe(false); // 5 caracteres
    expect(validarPasswordLength('123456')).toBe(true); // 6 caracteres
    expect(validarPasswordLength('1234567890')).toBe(true); // 10 caracteres
  });

  test('Debe rechazar contraseña vacía', () => {
    expect(validarPasswordLength('')).toBe(false);
    expect(validarPasswordLength(null)).toBe(false);
  });
});

// ====================================
// PRUEBAS DE JWT (Tokens)
// ====================================
describe('Generación y Verificación de Tokens JWT', () => {
  const SECRET = 'test-secret-key';

  test('Debe generar un token válido', () => {
    const payload = { id: '12345', email: 'test@test.com' };
    const token = generateToken(payload, SECRET);
    
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT tiene 3 partes
  });

  test('Debe verificar y decodificar un token válido', () => {
    const payload = { id: '67890', email: 'user@example.com' };
    const token = generateToken(payload, SECRET);
    const decoded = verifyToken(token, SECRET);
    
    expect(decoded).toBeTruthy();
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });

  test('Debe rechazar un token con secreto incorrecto', () => {
    const payload = { id: 'abc123' };
    const token = generateToken(payload, SECRET);
    const decoded = verifyToken(token, 'wrong-secret');
    
    expect(decoded).toBe(null);
  });

  test('Debe rechazar un token malformado', () => {
    const decoded = verifyToken('token.invalido.aqui', SECRET);
    expect(decoded).toBe(null);
  });

  test('Debe rechazar un string vacío como token', () => {
    const decoded = verifyToken('', SECRET);
    expect(decoded).toBe(null);
  });
});

// ====================================
// PRUEBAS DE VALIDACIÓN DE EMAIL
// ====================================
describe('Validación de Email', () => {
  test('Debe aceptar email válido simple', () => {
    expect(validarEmail('test@example.com')).toBe(true);
  });

  test('Debe aceptar email con subdominios', () => {
    expect(validarEmail('user@mail.company.com')).toBe(true);
  });

  test('Debe aceptar email con números', () => {
    expect(validarEmail('user123@test456.com')).toBe(true);
  });

  test('Debe rechazar email sin @', () => {
    expect(validarEmail('testexample.com')).toBe(false);
  });

  test('Debe rechazar email sin dominio', () => {
    expect(validarEmail('test@')).toBe(false);
  });

  test('Debe rechazar email sin extensión', () => {
    expect(validarEmail('test@example')).toBe(false);
  });

  test('Debe rechazar email con espacios', () => {
    expect(validarEmail('test @example.com')).toBe(false);
  });

  test('Debe rechazar string vacío', () => {
    expect(validarEmail('')).toBe(false);
  });
});

// ====================================
// PRUEBAS INTEGRADAS (Edge Cases)
// ====================================
describe('Casos Extremos y Combinados', () => {
  test('Validación completa de reserva: fecha futura + hora válida + horario laboral', () => {
    const fecha = '2027-06-15';
    const hora = '10:30';
    
    const fechaValida = validarFechaNoEsPasado(fecha);
    const horaValida = validarFormatoHora(hora);
    const horarioValido = validarHorarioLaboral(hora);
    
    expect(fechaValida && horaValida && horarioValido).toBe(true);
  });

  test('Debe rechazar reserva con fecha pasada aunque hora sea válida', () => {
    const fecha = '2020-01-01';
    const hora = '10:00';
    
    const fechaValida = validarFechaNoEsPasado(fecha);
    const horaValida = validarFormatoHora(hora);
    
    expect(fechaValida).toBe(false);
    expect(horaValida).toBe(true);
  });

  test('Debe rechazar reserva fuera de horario laboral', () => {
    const fecha = '2027-12-31';
    const hora = '20:00';
    
    const fechaValida = validarFechaNoEsPasado(fecha);
    const horarioValido = validarHorarioLaboral(hora);
    
    expect(fechaValida).toBe(true);
    expect(horarioValido).toBe(false);
  });
});
