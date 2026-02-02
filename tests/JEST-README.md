# Fase 5: Automatización - Pruebas Unitarias con Jest

## 📋 Configuración Completada

### Dependencias Instaladas:
- ✅ **Jest** - Framework de testing
- ✅ **bcryptjs** - Para pruebas de hash de contraseñas
- ✅ **jsonwebtoken** - Para pruebas de tokens JWT

---

## 🧪 Archivos de Prueba Creados

### 1️⃣ **tests/reserva.test.js** (Pruebas principales de lógica de negocio)
**Cobertura: 60+ casos de prueba**

**Validación de Fechas:**
- ✅ Rechazar fechas pasadas
- ✅ Aceptar fecha de hoy
- ✅ Aceptar fechas futuras
- ✅ Rechazar fecha de ayer

**Validación de Hora:**
- ✅ Formato válido HH:MM
- ✅ Rechazar formatos inválidos (25:00, 12:60, etc.)
- ✅ Horario laboral (8:00 - 18:00)

**Validación de Contraseñas:**
- ✅ Hash de contraseñas
- ✅ Comparación de contraseñas
- ✅ Longitud mínima (6 caracteres)

**Validación de JWT:**
- ✅ Generación de tokens
- ✅ Verificación de tokens
- ✅ Rechazo de tokens inválidos

**Validación de Email:**
- ✅ Formato válido
- ✅ Rechazo de formatos inválidos

### 2️⃣ **tests/auth.test.js** (Middleware de autenticación)
- ✅ Rechazar requests sin token
- ✅ Rechazar tokens inválidos
- ✅ Aceptar tokens válidos
- ✅ Extracción correcta del token Bearer

### 3️⃣ **tests/authController.test.js** (Controlador de autenticación)
- ✅ Validación de registro
- ✅ Validación de credenciales
- ✅ Creación de usuarios
- ✅ Hasheo de contraseñas

### 4️⃣ **src/utils/validators.js** (Funciones auxiliares)
Funciones puras para testing:
- `validarFechaNoEsPasado(fecha)`
- `validarFormatoHora(hora)`
- `validarHorarioLaboral(hora)`
- `hashPassword(password)`
- `comparePassword(password, hash)`
- `generateToken(payload, secret)`
- `verifyToken(token, secret)`
- `validarEmail(email)`
- `validarPasswordLength(password)`

---

## 🚀 Comandos Disponibles

### Instalar Jest:
```powershell
npm install --save-dev jest
```

### Ejecutar todas las pruebas:
```powershell
npm test
```

### Ejecutar pruebas con observador (modo desarrollo):
```powershell
npm run test:watch
```

### Ejecutar solo pruebas unitarias:
```powershell
npm run test:unit
```

### Ver cobertura de código:
```powershell
npm test
# Luego abre: coverage/lcov-report/index.html
```

---

## 📊 Estructura de las Pruebas

```
tests/
├── reserva.test.js         # 60+ pruebas de validaciones
├── auth.test.js            # 5+ pruebas de middleware
└── authController.test.js  # 15+ pruebas de controlador

src/
└── utils/
    └── validators.js       # Funciones auxiliares testeables
```

---

## ✅ Verificación de Calidad

### Cobertura Esperada:
- **Validadores:** 100%
- **Lógica de negocio:** >80%
- **Controladores:** >70%

### Tipos de Pruebas:
1. **Unitarias:** Funciones puras sin dependencias
2. **Lógica de negocio:** Validaciones y reglas
3. **Edge cases:** Casos extremos y límites
4. **Integración:** Flujos completos de validación

---

## 🎯 Ejemplo de Salida Esperada

```
PASS  tests/reserva.test.js
  Validación de Fechas
    ✓ Debe rechazar fechas pasadas (5ms)
    ✓ Debe aceptar fecha de hoy (2ms)
    ✓ Debe aceptar fechas futuras (1ms)
  Validación de Hora
    ✓ Debe aceptar hora válida 09:00 (1ms)
    ✓ Debe rechazar formato inválido 25:00 (1ms)
  ...

Test Suites: 3 passed, 3 total
Tests:       60+ passed, 60+ total
Coverage:    >80%
```

---

## 🔍 Caso de Uso Real: Validación de Fechas Pasadas

**Código Testeado:**
```javascript
function validarFechaNoEsPasado(fecha) {
  const fechaReserva = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return fechaReserva >= hoy;
}
```

**Prueba:**
```javascript
test('Debe rechazar fechas pasadas', () => {
  const fechaPasada = '2020-01-01';
  expect(validarFechaNoEsPasado(fechaPasada)).toBe(false);
});
```

**¿Por qué es importante?**
- ❌ Evita reservas en fechas pasadas
- ✅ Prueba matemática pura (sin base de datos)
- ✅ Valida lógica interna del código
- ✅ No depende de APIs externas

---

## 📝 Próximos Pasos

1. ✅ **Instalación:** `npm install --save-dev jest`
2. ✅ **Ejecución:** `npm test`
3. 🔄 **CI/CD:** Configurar GitHub Actions o GitLab CI
4. 📊 **Reporte:** Revisar coverage/lcov-report/index.html

---

## 🛠️ Integración con CI/CD (Siguiente Fase)

### GitHub Actions (ejemplo):
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

### GitLab CI (ejemplo):
```yaml
test:
  script:
    - npm install
    - npm test
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
```

---

## 💡 Ventajas de las Pruebas Unitarias

✅ **Rápidas:** Sin base de datos, sin red  
✅ **Confiables:** Mismos resultados siempre  
✅ **Documentación:** Explican cómo funciona el código  
✅ **Refactorización segura:** Detectan cambios que rompen funcionalidad  
✅ **CI/CD:** Se ejecutan automáticamente en cada commit
