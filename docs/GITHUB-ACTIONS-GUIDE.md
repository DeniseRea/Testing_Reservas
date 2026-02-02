# 🚀 Guía de GitHub Actions CI/CD

## ✅ Configuración Completada

### Workflows Creados:

1. **`.github/workflows/test.yml`** - Pruebas unitarias automáticas
2. **`.github/workflows/k6-tests.yml`** - Pruebas de carga (opcional)

---

## 📋 Paso a Paso para Subir a GitHub

### 1️⃣ Inicializar Git (si no lo has hecho)

```powershell
cd C:\Users\denise\Desktop\Denise\PRUEBAS\EvaluacionPractica1-reservas
git init
git branch -M main
```

### 2️⃣ Agregar archivos al repositorio

```powershell
git add .
git commit -m "feat: Implementación completa con pruebas Jest y K6"
```

### 3️⃣ Conectar con GitHub

```powershell
git remote add origin https://github.com/DeniseRea/Testing_Reservas.git
```

### 4️⃣ Subir el código

```powershell
git push -u origin main
```

---

## 🔐 Configurar Secrets en GitHub

### ⚠️ IMPORTANTE: Antes de que funcione el CI/CD

1. Ve a tu repositorio: https://github.com/DeniseRea/Testing_Reservas
2. Click en **Settings** (⚙️)
3. En el menú izquierdo: **Secrets and variables** → **Actions**
4. Click en **New repository secret**

### Secrets necesarios:

**Secret 1: MONGO_URI**
- Name: `MONGO_URI`
- Value: `mongodb+srv://dnrea_db_user:tT0Y6H9fL7coPPSd@cluster0.hjxh9oo.mongodb.net/?appName=Cluster0`

**Secret 2: JWT_SECRET**
- Name: `JWT_SECRET`
- Value: `secreto123` (o mejor: genera uno más seguro)

---

## 🎯 ¿Qué hace el CI/CD automáticamente?

### Workflow: `test.yml` (Pruebas Unitarias)

**Se ejecuta cuando:**
- ✅ Haces `git push` a `main`, `master` o `develop`
- ✅ Alguien crea un Pull Request
- ✅ Haces merge de branches

**Qué hace:**
1. Clona tu código
2. Instala Node.js (versiones 18.x y 20.x)
3. Instala dependencias (`npm ci`)
4. Ejecuta `npm test`
5. Genera reporte de cobertura
6. Comenta en PRs si pasa o falla

**Duración:** ~2-3 minutos

---

### Workflow: `k6-tests.yml` (Pruebas de Carga)

**Se ejecuta cuando:**
- 🕐 Manualmente (desde Actions tab)
- 🕐 Cada lunes a las 2 AM (opcional)

**Qué hace:**
1. Inicia el servidor
2. Ejecuta pruebas de carga con K6
3. Guarda resultados como artefactos

---

## 📊 Ver los Resultados

### En cada push verás:

1. Ve a tu repo: https://github.com/DeniseRea/Testing_Reservas
2. Click en **Actions** (⚡)
3. Verás el workflow ejecutándose
4. Click en el workflow para ver logs detallados

### Badge de estado:

Agrega esto a tu README para mostrar el estado:

```markdown
[![Tests CI](https://github.com/DeniseRea/Testing_Reservas/actions/workflows/test.yml/badge.svg)](https://github.com/DeniseRea/Testing_Reservas/actions/workflows/test.yml)
```

Se verá así:  
✅ Tests CI: Passing  
❌ Tests CI: Failing

---

## 🎨 Ejemplo de Flujo Completo

```powershell
# 1. Hacer cambios en el código
code src/controllers/reservaController.js

# 2. Ejecutar pruebas localmente
npm test

# 3. Commit y push
git add .
git commit -m "fix: Corregir validación de fecha"
git push origin main

# 4. GitHub Actions se ejecuta automáticamente
# Ve a: https://github.com/DeniseRea/Testing_Reservas/actions

# 5. Recibes email si algo falla
```

---

## ✅ Verificar que funciona

### Después de hacer push:

1. Ve a https://github.com/DeniseRea/Testing_Reservas/actions
2. Deberías ver: `Tests Unitarios CI` ejecutándose
3. Click para ver el progreso en tiempo real
4. Espera ~2-3 minutos
5. Verás: ✅ **Success** o ❌ **Failed**

---

## 🛠️ Comandos útiles

```powershell
# Ver estado de Git
git status

# Ver historial de commits
git log --oneline

# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Subir rama
git push origin feature/nueva-funcionalidad

# Crear Pull Request desde GitHub
# (GitHub te mostrará un botón automáticamente)
```

---

## 🚨 Solución de Problemas

### ❌ Error: "MONGO_URI is not defined"
**Solución:** Configurar el secret `MONGO_URI` en GitHub

### ❌ Error: "Tests failed"
**Solución:** Ejecuta `npm test` localmente primero

### ❌ Error: "Authentication failed"
**Solución:** Verifica tu token de GitHub o usa SSH

### ❌ Error: "node_modules subido al repo"
**Solución:**
```powershell
git rm -r --cached node_modules
git commit -m "chore: Remove node_modules"
git push
```

---

## 📈 Mejoras Futuras (Opcional)

### Integrar Codecov (Cobertura visual)
1. Crea cuenta en https://codecov.io
2. Conecta tu repo
3. El workflow ya está configurado

### Notificaciones Slack/Discord
Agrega webhook en el workflow:
```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Deploy automático
Agrega otro workflow para deploy a:
- Heroku
- Vercel
- AWS
- Azure

---

## 🎓 Resumen

✅ **Listo para:**
1. Subir código a GitHub
2. CI/CD ejecuta pruebas automáticamente
3. Badge muestra estado en README
4. Protección de branches con tests obligatorios

**Siguiente paso:** Ejecuta los comandos de la sección "Paso a Paso" ⬆️
