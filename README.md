# Testing_Reservas - Sistema de Reservas

[![Tests Unitarios CI](https://github.com/DeniseRea/Testing_Reservas/actions/workflows/test.yml/badge.svg)](https://github.com/DeniseRea/Testing_Reservas/actions/workflows/test.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Jest](https://img.shields.io/badge/tested%20with-jest-brightgreen.svg)](https://jestjs.io/)

Sistema de gestión de reservas con API REST, autenticación JWT y pruebas automatizadas completas.

## Características

- ✅ API REST con Express.js
- ✅ Autenticación JWT
- ✅ Base de datos MongoDB
- ✅ Pruebas unitarias con Jest (56+ tests)
- ✅ Pruebas de carga con K6
- ✅ CI/CD con GitHub Actions
- ✅ Cobertura de código >80%

## Requisitos

- Node.js >= 18.x
- MongoDB Atlas o local
- npm >= 8.x

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/DeniseRea/Testing_Reservas.git
cd Testing_Reservas

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
MONGO_URI=mongodb+srv://tu-usuario:tu-password@cluster0.xxxxx.mongodb.net/grupoA
JWT_SECRET=tu-secreto-seguro-aqui
PORT=3000
```

##  Ejecución

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start

# Ejecutar pruebas
npm test

# Pruebas en modo watch
npm run test:watch
```

## 🧪 Pruebas

### Pruebas Unitarias (Jest)

```bash
npm test
```

**Cobertura:**
- 56+ pruebas unitarias
- Validación de fechas, horas, contraseñas
- Tokens JWT
- Middleware de autenticación
- Controladores

### Pruebas de Carga (K6)

```bash
# Prueba de carga normal
k6 run tests/k6-load-test.js

# Prueba de estrés
k6 run tests/k6-stress-test.js

# Prueba de picos
k6 run tests/k6-spike-test.js

# Prueba de resistencia
k6 run tests/k6-soak-test.js
```

## API Endpoints

### Autenticación

**Registrar usuario:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

### Reservas (requieren token)

**Crear reserva:**
```http
POST /api/reservas
Authorization: Bearer <token>
Content-Type: application/json

{
  "fecha": "2026-03-15",
  "hora": "10:00",
  "servicio": "Consulta médica"
}
```

**Listar reservas:**
```http
GET /api/reservas
Authorization: Bearer <token>
```

**Eliminar reserva:**
```http
DELETE /api/reservas/:id
Authorization: Bearer <token>
```

## CI/CD (GitHub Actions)

Este proyecto incluye integración continua automática:

### Workflow de Pruebas Unitarias
- ✅ Se ejecuta en cada push y pull request
- ✅ Prueba en Node.js 18.x y 20.x
- ✅ Genera reporte de cobertura
- ✅ Comenta resultados en PRs

### Workflow de Pruebas de Carga (Opcional)
- Ejecución manual o programada
- Pruebas de rendimiento con K6
- Guarda resultados como artefactos

## Estructura del Proyecto

```
Testing_Reservas/
├── .github/
│   └── workflows/
│       ├── test.yml          # CI para pruebas unitarias
│       └── k6-tests.yml      # CI para pruebas de carga
├── src/
│   ├── controllers/          # Lógica de negocio
│   ├── middlewares/          # Middleware JWT
│   ├── models/               # Modelos MongoDB
│   ├── routes/               # Rutas API
│   ├── utils/                # Funciones auxiliares
│   ├── app.js                # Configuración Express
│   └── server.js             # Servidor
├── tests/
│   ├── auth.test.js          # Tests de autenticación
│   ├── authController.test.js
│   ├── reserva.test.js       # Tests de validaciones
│   ├── k6-load-test.js       # K6: Carga
│   ├── k6-stress-test.js     # K6: Estrés
│   ├── k6-spike-test.js      # K6: Picos
│   └── k6-soak-test.js       # K6: Resistencia
├── .env                      # Variables de entorno (no incluir en git)
├── .gitignore
├── package.json
└── README.md
```

## Métricas de Calidad

- **Cobertura de código:** >80%
- **Pruebas unitarias:** 56+ tests
- **Tiempo de respuesta (p95):** <500ms
- **Tasa de errores:** <5%

## Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT
- ✅ Validación de entrada
- ✅ Variables de entorno para secretos
- ✅ Tokens con expiración (1 hora)

##  Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

**Importante:** Todas las pruebas deben pasar antes de hacer merge.

## Configuración de Secrets en GitHub

Para que el CI/CD funcione correctamente, configura estos secrets en tu repositorio:

1. Ve a: `Settings` → `Secrets and variables` → `Actions`
2. Agrega estos secrets:
   - `MONGO_URI`: Tu cadena de conexión a MongoDB
   - `JWT_SECRET`: Tu secreto para JWT

## Documentación Adicional

- [Guía de Pruebas Jest](tests/JEST-README.md)
- [Guía de Pruebas K6](tests/README.md)

## Autor

**Denise Rea**
- GitHub: [@DeniseRea](https://github.com/DeniseRea)

## Licencia

Este proyecto es de uso educativo.

---

⭐ Si te ha sido útil este proyecto, considera darle una estrella en GitHub
