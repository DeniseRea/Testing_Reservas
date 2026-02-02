import http from 'k6/http';
import { check, sleep } from 'k6';

// 2. STRESS TESTING (Prueba de Estrés)
// Objetivo: Encontrar el punto de ruptura del sistema
export const options = {
  stages: [
    { duration: '1m', target: 200 },  // Sube agresivamente a 200 usuarios
    { duration: '2m', target: 200 },  // Castiga al servidor por 2 minutos
    { duration: '30s', target: 0 },   // Baja
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // Más tolerante: 2s
    http_req_failed: ['rate<0.3'],     // Toleramos hasta 30% de errores
  },
};

const BASE_URL = 'http://localhost:3000';

export function setup() {
  // Crear usuario para pruebas
  const registerRes = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({
    username: `stressuser_${Date.now()}`,
    password: 'stress123'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    username: registerRes.json('username') || `stressuser_${Date.now()}`,
    password: 'stress123'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  return { token: loginRes.json('token') };
}

export default function(data) {
  const token = data.token;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Crear múltiples reservas para estresar el sistema
  const createRes = http.post(`${BASE_URL}/api/reservas`, JSON.stringify({
    fecha: '2026-04-20',
    hora: `${Math.floor(Math.random() * 12) + 8}:00`,
    servicio: `Servicio ${Math.random()}`
  }), { headers });

  check(createRes, {
    'no hay error crítico': (r) => r.status < 500,
  });

  sleep(0.5); // Menos tiempo de espera para más presión
}
