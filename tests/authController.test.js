const bcrypt = require('bcryptjs');

// Simulación de funciones del controlador para testing
class AuthController {
  /**
   * Valida credenciales de login
   * @param {string} email 
   * @param {string} password 
   * @param {string} hashedPassword 
   * @returns {Promise<boolean>}
   */
  static async validateCredentials(email, password, hashedPassword) {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Valida datos de registro
   * @param {object} userData 
   * @returns {object}
   */
  static validateRegistration(userData) {
    const errors = [];

    if (!userData.email) {
      errors.push('Email es requerido');
    }

    if (!userData.password) {
      errors.push('Contraseña es requerida');
    } else if (userData.password.length < 6) {
      errors.push('Contraseña debe tener al menos 6 caracteres');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userData.email && !emailRegex.test(userData.email)) {
      errors.push('Email inválido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Simula creación de usuario
   * @param {string} email 
   * @param {string} password 
   * @returns {object}
   */
  static async createUser(email, password) {
    const validation = this.validateRegistration({ email, password });
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    return {
      id: 'mock-id-' + Date.now(),
      email,
      password: hashedPassword
    };
  }
}

describe('AuthController - Validación de Registro', () => {
  test('Debe validar correctamente datos completos', () => {
    const userData = {
      email: 'test@example.com',
      password: '123456'
    };

    const result = AuthController.validateRegistration(userData);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('Debe rechazar registro sin email', () => {
    const userData = {
      password: '123456'
    };

    const result = AuthController.validateRegistration(userData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email es requerido');
  });

  test('Debe rechazar registro sin password', () => {
    const userData = {
      email: 'test@example.com'
    };

    const result = AuthController.validateRegistration(userData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Contraseña es requerida');
  });

  test('Debe rechazar contraseña menor a 6 caracteres', () => {
    const userData = {
      email: 'test@example.com',
      password: '12345'
    };

    const result = AuthController.validateRegistration(userData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Contraseña debe tener al menos 6 caracteres');
  });

  test('Debe rechazar email con formato inválido', () => {
    const userData = {
      email: 'email-invalido',
      password: '123456'
    };

    const result = AuthController.validateRegistration(userData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email inválido');
  });

  test('Debe acumular múltiples errores', () => {
    const userData = {
      email: 'invalido',
      password: '123'
    };

    const result = AuthController.validateRegistration(userData);

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});

describe('AuthController - Validación de Credenciales', () => {
  let hashedPassword;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash('correctPassword', 10);
  });

  test('Debe validar credenciales correctas', async () => {
    const isValid = await AuthController.validateCredentials(
      'test@example.com',
      'correctPassword',
      hashedPassword
    );

    expect(isValid).toBe(true);
  });

  test('Debe rechazar contraseña incorrecta', async () => {
    const isValid = await AuthController.validateCredentials(
      'test@example.com',
      'wrongPassword',
      hashedPassword
    );

    expect(isValid).toBe(false);
  });

  test('Debe lanzar error si falta email', async () => {
    await expect(
      AuthController.validateCredentials('', 'password', hashedPassword)
    ).rejects.toThrow('Email y contraseña son requeridos');
  });

  test('Debe lanzar error si falta password', async () => {
    await expect(
      AuthController.validateCredentials('test@test.com', '', hashedPassword)
    ).rejects.toThrow('Email y contraseña son requeridos');
  });
});

describe('AuthController - Creación de Usuario', () => {
  test('Debe crear usuario con datos válidos', async () => {
    const user = await AuthController.createUser('new@example.com', '123456');

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBe('new@example.com');
    expect(user.password).not.toBe('123456'); // Debe estar hasheada
  });

  test('Debe hashear la contraseña correctamente', async () => {
    const plainPassword = 'mySecretPass';
    const user = await AuthController.createUser('user@test.com', plainPassword);

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    expect(isMatch).toBe(true);
  });

  test('Debe rechazar creación con datos inválidos', async () => {
    await expect(
      AuthController.createUser('invalid-email', '123')
    ).rejects.toThrow();
  });

  test('Debe generar IDs únicos para diferentes usuarios', async () => {
    const user1 = await AuthController.createUser('user1@test.com', '123456');
    const user2 = await AuthController.createUser('user2@test.com', '123456');

    expect(user1.id).not.toBe(user2.id);
  });
});
