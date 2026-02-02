import http from 'k6/http';
import { check, sleep } from 'k6';

// 4. SOAK TESTING (Prueba de Resistencia/Remojo)
// Objetivo: Estabilidad a largo plazo - Detectar memory leaks
export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Sube lento a 50 usuarios
    { duration: '10m', target: 50 },  // Se queda 10 minutos (para prueba rápida)
    // Para producción real: { duration: '3h', target: 50 }
    { duration: '2m', target: 0 },    // Baja
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],    // Debe mantenerse estable
    http_req_failed: ['rate<0.05'],       // Máximo 5% errores
    http_reqs: ['rate>10'],               // Al menos 10 req/s
  },
};

const BASE_URL = 'http://localhost:3000';

export function setup() {
  const registerRes = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({
    username: `soakuser_${Date.now()}`,
    password: 'soak123456'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    username: registerRes.json('username') || `soakuser_${Date.now()}`,
    password: 'soak123456'
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

  // Ciclo realista: crear, listar, leer
  const createRes = http.post(`${BASE_URL}/api/reservas`, JSON.stringify({
    fecha: `2026-0${Math.floor(Math.random() * 6) + 3}-15`,
    hora: `${Math.floor(Math.random() * 8) + 9}:00`,
    servicio: 'Consulta de seguimiento'
  }), { headers });

  check(createRes, {
    'creación estable': (r) => r.status === 201,
    'sin degradación': (r) => r.timings.duration < 800,
  });

  sleep(2);

  const listRes = http.get(`${BASE_URL}/api/reservas`, { headers });

  check(listRes, {
    'listado estable': (r) => r.status === 200,
    'responde rápido': (r) => r.timings.duration < 500,
  });

  sleep(3); // Simula usuario pensando
}

export function teardown(data) {
  console.log('Prueba de resistencia completada. Revisa métricas de memoria.');
}
