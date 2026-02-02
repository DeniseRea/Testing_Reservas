# Pruebas de Carga con K6

## Instalación de K6

### Windows (usando Chocolatey):
```powershell
choco install k6
```

### Windows (descarga manual):
https://k6.io/docs/get-started/installation/

### Alternativa (sin instalación):
```powershell
# Usar Docker
docker pull grafana/k6
```

---

## 📋 Tipos de Pruebas Implementadas

### 1️⃣ Load Testing (Prueba de Carga Normal)
**Archivo:** `k6-load-test.js`  
**Objetivo:** Evaluar rendimiento bajo carga esperada  
**Usuarios:** 10 → 50 → 0  
**Duración:** ~50 segundos

```powershell
k6 run tests/k6-load-test.js
```

**Qué verifica:**
- ✅ 95% de requests < 500ms
- ✅ Menos de 10% de errores
- ✅ Comportamiento normal del sistema

---

### 2️⃣ Stress Testing (Prueba de Estrés)
**Archivo:** `k6-stress-test.js`  
**Objetivo:** Encontrar el punto de ruptura  
**Usuarios:** 0 → 200 → 0  
**Duración:** ~3.5 minutos

```powershell
k6 run tests/k6-stress-test.js
```

**Qué verifica:**
- ⚠️ ¿Cuántos usuarios antes de fallar?
- ⚠️ Tolerancia hasta 30% de errores
- ⚠️ Tiempo de respuesta máximo 2s

---

### 3️⃣ Spike Testing (Prueba de Picos)
**Archivo:** `k6-spike-test.js`  
**Objetivo:** Aguantar golpes repentinos de tráfico  
**Usuarios:** 0 → 100 (en 10s) → 0  
**Duración:** ~1.5 minutos

```powershell
k6 run tests/k6-spike-test.js
```

**Qué verifica:**
- 🚀 Subida brusca de 0 a 100 usuarios
- 🚀 ¿El sistema responde o colapsa?
- 🚀 Tolerancia hasta 20% de errores

---

### 4️⃣ Soak Testing (Prueba de Resistencia)
**Archivo:** `k6-soak-test.js`  
**Objetivo:** Detectar fugas de memoria (memory leaks)  
**Usuarios:** 50 constantes  
**Duración:** 10 minutos (ajustable a 3 horas)

```powershell
k6 run tests/k6-soak-test.js
```

**Qué verifica:**
- 🔥 Estabilidad a largo plazo
- 🔥 Sin degradación de rendimiento
- 🔥 Máximo 5% de errores

**Para prueba larga (3 horas):**  
Edita el archivo y cambia:
```javascript
{ duration: '10m', target: 50 }  // Cambiar a '3h'
```

---

## 🎯 Ejecutar todas las pruebas

```powershell
# 1. Prueba de carga normal
k6 run tests/k6-load-test.js

# 2. Prueba de estrés
k6 run tests/k6-stress-test.js

# 3. Prueba de picos
k6 run tests/k6-spike-test.js

# 4. Prueba de resistencia (rápida - 10 min)
k6 run tests/k6-soak-test.js
```

---

## 📊 Interpretar Resultados

### ✅ Métricas Clave:
- **http_req_duration:** Tiempo de respuesta promedio
- **http_req_failed:** % de requests fallidos
- **http_reqs:** Requests por segundo
- **vus (Virtual Users):** Usuarios concurrentes

### 🔴 Señales de Alerta:
- ❌ Tasa de errores > 10%
- ❌ Tiempo de respuesta creciendo constantemente
- ❌ Status 500 (errores de servidor)
- ❌ Status 503 (servicio no disponible)

---

## 🛠️ Requisitos Previos

1. **Servidor corriendo:**
   ```powershell
   npm start
   ```

2. **MongoDB conectado** (ver .env)

3. **Puerto 3000 libre**

---

## 💡 Consejos

- Ejecuta las pruebas **de menor a mayor intensidad**
- Monitorea el uso de CPU/memoria durante las pruebas
- Las pruebas **Stress** y **Soak** pueden degradar el rendimiento temporalmente
- Reinicia el servidor entre pruebas para limpiar estado

---

## 📈 Exportar Resultados

```powershell
# Guardar resultados en JSON
k6 run --out json=resultados-load.json tests/k6-load-test.js

# Ver resumen en archivo de texto
k6 run tests/k6-load-test.js > resultados-load.txt
```
