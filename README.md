# EduGestión IA - Plataforma Integral de Gestión Escolar

Plataforma web modular diseñada para centralizar la gestión académica, administrativa, pedagógica, formativa y bibliotecaria de un establecimiento educacional, incorporando Inteligencia Artificial real para la generación de material pedagógico.

**Versión actual:** 1.0.1 (MVP Completo)

## 🚀 Tecnologías Utilizadas
- **Frontend:** React 18 + Vite (Nginx para producción)
- **Backend Principal:** Java 17 + Spring Boot 3 + Spring Security (JWT)
- **Base de Datos:** PostgreSQL 15
- **Microservicio IA:** Python 3.11 + Flask + OpenAI API (gpt-4o-mini)
- **Infraestructura:** Docker & Docker Compose

## 📋 Requisitos Previos
- Tener instalado **Docker** y **Docker Compose** (Se recomienda usar WSL2/Ubuntu en Windows).
- Puertos libres: `5173` (Frontend), `8080` (Backend), `5432` (PostgreSQL), `5000` (IA).
- *(Opcional)* Una API Key de OpenAI para habilitar la IA real.

## ⚙️ Instalación y Ejecución

1. Clona este repositorio.
2. Copia el archivo `.env.example` a `.env` (`cp .env.example .env`).
3. Abre el archivo `.env` y configura tus variables. **Muy importante:** Pega tu `OPENAI_API_KEY` para habilitar la IA real. Si la dejas vacía, el sistema usará un modo de prueba simulado.
4. Levanta todos los servicios ejecutando:
   ```bash
   docker compose up --build -d
El sistema descargará las imágenes, compilará el código y levantará la base de datos con datos de prueba automáticos.

### 👥 Usuarios de Prueba (Generados automáticamente)

El sistema cuenta con un sembrador de datos (`DataSeeder.java`) que crea los siguientes accesos al iniciar por primera vez:

| Rol | Email | Contraseña | Funcionalidades Principales |
| :--- | :--- | :--- | :--- |
| **Dirección** | `admin@edugestion.local` | `Admin123!Change` | Control total: usuarios, académico, biblioteca, horarios, convivencia y comunicados. |
| **Docente** | `carlos@example.com` | `EduGestion2026!` | Notas, asistencia, anotaciones, horarios, IA y comunicados. |
| **Estudiante** | `juan@example.com` | `EduGestion2026!` | Ver notas, asistencia, horarios, biblioteca y comunicados. |
| **Apoderada** | `maria@example.com` | `EduGestion2026!` | Ver notas, asistencia, anotaciones de su pupilo y comunicados. |

### 📦 Módulos Implementados

- Autenticación con JWT y roles.
- Gestión Académica (Cursos, Asignaturas, Matrículas).
- Registro de Calificaciones.
- Control de Asistencia y Atrasos.
- Anotaciones de Convivencia (Positivas/Negativas).
- Módulo de Convivencia Escolar (Casos confidenciales).
- Horarios de Clases.
- Comunicados Institucionales (Filtrados por rol).
- Biblioteca (Catálogo, Préstamos y Devoluciones).
- Dashboards dinámicos con estadísticas reales por rol.
- **IA Real:** Generación de evaluaciones mediante OpenAI.

### 🛠️ Solución de Problemas (Troubleshooting)

- **Error de compilación:** Ejecutar `docker compose build --no-cache backend` o `frontend`.
- **IA en modo "mock":** Revisar que la `OPENAI_API_KEY` en el `.env` sea válida. Ejecutar `docker compose up -d --force-recreate ai-service`.
- **Error 403 al entrar a una ruta:** El token JWT expiró. Cierra sesión y vuelve a entrar.

### 2. Crear/Actualizar `CONTEXTO_PROYECTO.md`
Este archivo es el "traspaso de conocimiento". Crea un archivo llamado `CONTEXTO_PROYECTO.md` en la raíz y pega esto:

```markdown
# Contexto Técnico del Proyecto: EduGestión IA (v1.0.1)

## 1. Visión General
EduGestión IA es un sistema integral de gestión escolar. Actualmente nos encontramos en la **Versión 1.0.1**, la cual cumple con casi la totalidad de los requisitos del "Master Prompt" (Fases 1 a 4 completadas). La arquitectura es un monolito modular en Java con microservicios de IA en Python.

## 2. Stack y Arquitectura
- **Frontend:** React 18, Vite, React Router. UI basada en CSS puro y variables globales (`global.css`).
- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Hibernate.
- **Base de Datos:** PostgreSQL 15 (Scripts en `db/init/01-init.sql`).
- **IA:** Python 3.11 + Flask. Conectado a OpenAI (`gpt-4o-mini`). Tiene modo fallback a "mock" si falla la API Key.
- **Infraestructura:** Docker Compose. Se resolvieron problemas de red usando nombres de host (`http://ai-service:5000`).

## 3. Estado Actual de los Módulos (v1.0.1)
- ✅ Autenticación, JWT y Roles (DIRECCION, DOCENTE, ESTUDIANTE, APODERADO, BIBLIOTECARIO).
- ✅ Gestión Académica (Cursos, Asignaturas, Matrículas).
- ✅ Calificaciones (Docente registra, Alumno y Apoderado consultan).
- ✅ Asistencia (Docente pasa lista, Alumno y Apoderado consultan).
- ✅ Anotaciones (Libro de clases, filtrado por visibilidad para apoderados).
- ✅ Convivencia Escolar (Módulo exclusivo y confidencial para Dirección).
- ✅ Horarios (Dirección crea, Docentes y Alumnos consultan).
- ✅ Comunicados (Envío filtrado por roles).
- ✅ Biblioteca (Libros, Préstamos, Devoluciones).
- ✅ IA (Generación de evaluaciones con OpenAI real).
- ✅ Dashboards con estadísticas reales por rol.

## 4. Estructura Clave (Para futuros chats)
- **Sembrador de Datos:** `backend/.../config/DataSeeder.java` (crea los usuarios de prueba automáticamente).
- **Seguridad:** `backend/.../config/SecurityConfig.java` (controla CORS y endpoints públicos).
- **App React:** `frontend/src/App.jsx` (TODAS las rutas deben ir aquí. El comodín `*` siempre va al final).
- **Menú Lateral:** `frontend/src/layouts/MainLayout.jsx` (Controla qué ve cada rol en el menú).
- **IA:** `ai-service/app.py` (Si se cambia la API Key, usar `docker compose up -d --force-recreate ai-service`).

## 5. Roadmap / Próximas Mejoras (Pendientes para futuras versiones)
1. **UI/UX:** Reemplazar los `alert()` del navegador por notificaciones flotantes (ej. usando `react-toastify`). Hacer que las tablas sean 100% responsive para celulares.
2. **IA:** Permitir que el profesor edite o elimine las preguntas generadas antes de guardarlas. Añadir generación de rúbricas.
3. **Reglas Académicas:** Permitir a la Dirección configurar si el promedio es semestral, trimestral, o si las notas tienen ponderaciones.
4. **Biblioteca:** Añadir lógica de renovaciones y bloqueos por atrasos.
5. **Reportes:** Implementar descarga de boletines de notas en PDF.

## 6. Instrucción para la IA en nuevos chats
"Copia y pega esto al inicio de un nuevo chat junto con este archivo:
> *Hola, estamos desarrollando EduGestión IA. Te adjunto el `CONTEXTO_PROYECTO.md` (v1.0.1). Quiero que actuemos como Tech Leads para implementar la siguiente mejora del Roadmap: [INSERTAR MEJORA AQUÍ].*"