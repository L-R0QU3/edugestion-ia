# EduGestión IA - Plataforma de Gestión Escolar

Plataforma web modular diseñada para centralizar la gestión académica, administrativa, pedagógica y bibliotecaria de un establecimiento educacional, incorporando un microservicio de Inteligencia Artificial para la generación de evaluaciones.

## 🚀 Tecnologías Utilizadas
- **Frontend:** React 18 + Vite (Nginx para producción)
- **Backend Principal:** Java 17 + Spring Boot 3 + Spring Security (JWT)
- **Base de Datos:** PostgreSQL 15
- **Microservicio IA:** Python 3.11 + Flask
- **Infraestructura:** Docker & Docker Compose

## 📋 Requisitos Previos
- Tener instalado **Docker** y **Docker Compose** (Se recomienda usar WSL2/Ubuntu en Windows para un mejor rendimiento).
- Puertos libres: `5173` (Frontend), `8080` (Backend), `5432` (PostgreSQL), `5000` (IA).

## ⚙️ Instalación y Ejecución

1. Clona este repositorio o descarga los archivos.
2. En la raíz del proyecto, asegúrate de tener el archivo `.env` (puedes basarte en `.env.example`).
3. Levanta todos los servicios ejecutando:
   ```bash
   docker compose up --build -d