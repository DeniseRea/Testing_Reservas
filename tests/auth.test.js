const jwt = require('jsonwebtoken');

// Mock del middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Acceso denegado' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
    req.user = verified;
    next();
  } catch {
    res.status(400).json({ error: 'Token inválido' });
  }
};

describe('Middleware de Autenticación', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  test('Debe rechazar request sin token', () => {
    req.header.mockReturnValue(undefined);
    
    authMiddleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acceso denegado' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Debe rechazar token inválido', () => {
    req.header.mockReturnValue('Bearer token-invalido');
    
    authMiddleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Debe aceptar token válido y llamar next()', () => {
    const payload = { id: '12345', email: 'test@test.com' };
    const token = jwt.sign(payload, 'test-secret-key', { expiresIn: '1h' });
    
    req.header.mockReturnValue(`Bearer ${token}`);
    
    authMiddleware(req, res, next);
    
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(payload.id);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('Debe extraer correctamente el token con "Bearer "', () => {
    const payload = { id: 'abc' };
    const token = jwt.sign(payload, 'test-secret-key');
    
    req.header.mockReturnValue(`Bearer ${token}`);
    
    authMiddleware(req, res, next);
    
    expect(req.user.id).toBe('abc');
    expect(next).toHaveBeenCalled();
  });

  test('Debe rechazar token sin prefijo "Bearer "', () => {
    const payload = { id: '123' };
    const token = jwt.sign(payload, 'test-secret-key');
    
    // Token sin "Bearer " será procesado como undefined tras replace()
    req.header.mockReturnValue(token);
    
    authMiddleware(req, res, next);
    
    // Debería fallar con error de token inválido o acceso denegado
    expect(res.status).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
