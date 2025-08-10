# 📌 Iconik - SaaS para Gestión de Spas de Uñas

[![CI/CD Status](https://github.com/jlmonroy13/iconik/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/jlmonroy13/iconik/actions/workflows/ci-cd.yml)

## 🎯 Objetivo

Iconik es una plataforma SaaS que permite a múltiples spas de uñas gestionar sus operaciones diarias: agendamiento de citas, ventas de servicios, control de inventario, evaluación de manicuristas y comunicación con clientes vía WhatsApp.

---

## 🧱 Stack Tecnológico

| Área                  | Herramienta                                                   |
| --------------------- | ------------------------------------------------------------- |
| **Frontend**          | Next.js 15 (App Router), React 19, Tailwind CSS 4, TypeScript |
| **Backend**           | API Routes en App Router, Prisma ORM, PostgreSQL (Railway)    |
| **Auth**              | Auth.js (usuario + contraseña con Credentials Provider)       |
| **Carga de Archivos** | UploadThing + S3/R2                                           |
| **Mensajería**        | WhatsApp API (Twilio o Meta)                                  |
| **Deploy**            | Vercel (Frontend + API), Railway (DB + cronjobs si aplica)    |

---

## 🧩 Módulos Principales

### 🔐 Autenticación

- Inicio de sesión con Auth.js
- Roles: Administrador, Manicurista, Cliente

### 🏢 Multi-Tenancy

- Cada spa tiene su propio espacio
- Datos filtrados por `spaId`

### 💅 Servicios

- Registro de servicios: manicurista, cliente, tipo, valor, método de pago, horas, evaluación
- CRUD de servicios
- Imágenes (UploadThing)
- Evaluaciones de clientes

### 📅 Agendamiento de Citas

- Asignación manual por la administradora
- Horarios y disponibilidad de manicuristas

### 📊 Estadísticas y Reportes

- Ventas por día
- Horas pico
- Desempeño de manicuristas
- Exportación a Excel

### 💬 Recordatorios y Mensajes

- WhatsApp API para:
  - Confirmación de citas
  - Seguimiento post-servicio

### 📦 Inventario

- Control de stock
- Alertas por bajo inventario

### 🧾 Facturación

- Generación y descarga de facturas

---

## 📦 MVP - Plan por Etapas

### ✅ Setup del Proyecto

- Next.js 15 + Tailwind + TypeScript
- Auth.js + ESLint + UploadThing

### 🧱 Base Multi-Tenant

- Prisma Models: `User`, `Spa`, `Service`, `Client`, `Manicurist`
- Auth.js configurado con Credentials Provider

### 🔨 Funcionalidades Iniciales

- CRUD de Servicios
- Subida de imágenes (UploadThing + S3/R2)
- Reportes por fecha
- Estadísticas básicas:
  - Servicios por día
  - Total de ventas
  - Mejores manicuristas

---

## 🧠 Futuro

- Agendamiento automático desde el cliente
- Modo oscuro
- Panel de administración para múltiples spas
- Facturación electrónica
- Notificaciones push/web

---

## 💸 Costos Estimados Mensuales

| Recurso            | Proveedor      | Costo Estimado (COP) | Notas           |
| ------------------ | -------------- | -------------------- | --------------- |
| Frontend (hosting) | Vercel         | $0 - $60,000         | 100 GB / 1M req |
| PostgreSQL         | Railway        | $30,000 - $100,000   | 512 MB - 2 GB   |
| Archivos (S3 o R2) | AWS/Cloudflare | $10,000 - $50,000    | Según uso       |
| UploadThing        | UploadThing    | $0 - $50,000         | 1 GB gratis     |
| WhatsApp API       | Twilio/Meta    | Desde $15,000        | Según uso       |
| Auth.js            | Auth.js        | $0 - $30,000         | Hasta 5K MAU    |

---

## 🧪 Ambientes

- Producción: `https://iconik.app`
- Staging: `https://staging.iconik.app`

---

## 🧠 Notas Técnicas

- Arquitectura multi-tenant: todo recurso asociado a un `spaId`
- Escalable como SaaS con múltiples clientes (spas)
- Backoffice privado para administración central

---

## 🚦 Integración Continua y Despliegue (CI/CD)

Este proyecto utiliza **GitHub Actions** para automatizar la integración continua y el despliegue (CI/CD).

- El pipeline se ejecuta automáticamente en cada push y pull request a la rama `main`.
- Las tareas automatizadas incluyen:
  - Instalación de dependencias (`npm ci`)
  - Linting del código (`npm run lint`)
  - Ejecución de tests (`npm test`)
  - Build de la aplicación (`npm run build`)
- Si alguna de estas tareas falla, el pipeline se detiene y marca el commit como fallido.
- Puedes ver el estado actual del pipeline en el badge al inicio de este README o en la pestaña [Actions de GitHub](https://github.com/jlmonroy13/iconik/actions).

El archivo de configuración del workflow se encuentra en `.github/workflows/ci-cd.yml`.
