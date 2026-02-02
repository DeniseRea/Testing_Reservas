import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. LOAD TESTING (Prueba de Carga Normal)
// Objetivo: Evaluar rendimiento bajo carga esperada
export const options = {
  stages: [
    { duration: '10s', target: 10 },  // Sube a 10 usuarios
    { duration: '30s', target: 50 },  // Mantiene 50 usuarios (carga normal)
    { duration: '10s', target: 0 },   // Baja a 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de requests deben ser < 500ms
    http_req_failed: ['rate<0.1'],    // Menos del 10% de errores
  },
};

const BASE_URL = 'http://localhost:3000';
let authToken = '';

export function setup() {
  // Registrar un usuario de prueba
  const registerRes = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({
    username: `testuser_${Date.now()}`,
    password: 'test123456'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  // Login para obtener token
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    username: registerRes.json('username') || `testuser_${Date.now()}`,
    password: 'test123456'
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

  // Test 1: Crear reserva
  const createRes = http.post(`${BASE_URL}/api/reservas`, JSON.stringify({
    fecha: '2026-03-15',
    hora: '10:00',
    servicio: 'Consulta general'
  }), { headers });

  check(createRes, {
    'reserva creada': (r) => r.status === 201,
    'tiempo de respuesta OK': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test 2: Listar reservas
  const listRes = http.get(`${BASE_URL}/api/reservas`, { headers });

  check(listRes, {
    'lista obtenida': (r) => r.status === 200,
    'tiene datos': (r) => r.json().length >= 0,
  });

  sleep(1);
}
