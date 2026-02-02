import http from 'k6/http';
import { check, sleep } from 'k6';

// 3. SPIKE TESTING (Prueba de Picos)
// Objetivo: Ver si aguanta golpes repentinos de tráfico
export const options = {
  stages: [
    { duration: '10s', target: 100 }, // ¡PUM! 100 usuarios en solo 10 seg
    { duration: '1m', target: 100 },  // Se quedan un rato
    { duration: '10s', target: 0 },   // Se van rápido
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 1s tolerancia por el spike
    http_req_failed: ['rate<0.2'],     // Hasta 20% de errores
  },
};

const BASE_URL = 'http://localhost:3000';

export function setup() {
  const registerRes = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({
    username: `spikeuser_${Date.now()}`,
    password: 'spike123'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    username: registerRes.json('username') || `spikeuser_${Date.now()}`,
    password: 'spike123'
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

  // Simular tráfico repentino
  const listRes = http.get(`${BASE_URL}/api/reservas`, { headers });

  check(listRes, {
    'responde durante pico': (r) => r.status === 200 || r.status === 503,
  });

  const createRes = http.post(`${BASE_URL}/api/reservas`, JSON.stringify({
    fecha: '2026-05-10',
    hora: '09:00',
    servicio: 'Emergencia'
  }), { headers });

  check(createRes, {
    'acepta creación': (r) => r.status < 500,
  });

  sleep(0.3);
}
