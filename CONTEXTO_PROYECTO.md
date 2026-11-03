# Contexto del Proyecto: EduGestión IA

## 1. Visión General
EduGestión IA es una plataforma web modular para la gestión escolar (académica, administrativa, pedagógica y bibliotecaria). Actualmente nos encontramos en la **Versión 1.0.0 (MVP Funcional)**.

## 2. Stack Tecnológico y Arquitectura
- **Frontend:** React 18 + Vite (usando CSS puro centralizado en `global.css`).
- **Backend:** Java 17 + Spring Boot 3 + Spring Security (JWT).
- **Base de Datos:** PostgreSQL 15.
- **Microservicio de IA:** Python 3.11 + Flask.
- **Infraestructura:** Docker + Docker Compose.
- **Entorno de Desarrollo:** Windows 10 LTSC usando WSL2/Ubuntu para ejecutar Docker.

## 3. Estado Actual (Lo que ya funciona en v1.0.0)
- **Autenticación:** Login con JWT, roles (DIRECCION, DOCENTE, ESTUDIANTE, APODERADO, BIBLIOTECARIO).
- **Gestión Académica:** CRUD de cursos, asignaturas, matrículas y asignación de docentes.
- **Calificaciones:** Profesores pueden poner notas (1.0 a 7.0) y los alumnos pueden ver sus propias notas en su dashboard.
- **Biblioteca:** Catálogo de libros, préstamo a estudiantes y registro de devoluciones (baja/sube el stock).
- **IA:** Integración Frontend -> Java -> Python (Flask). El microservicio de Python simula la generación de preguntas y el backend las guarda en la BD.
- **Dashboards:** Vistas diferenciadas según el rol del usuario.
- **Sembrador de Datos (DataSeeder):** Al levantar por primera vez, crea automáticamente:
  - `admin@edugestion.local` / `Admin123!Change` (DIRECCION)
  - `carlos@example.com` / `EduGestion2026!` (DOCENTE)
  - `juan@example.com` / `EduGestion2026!` (ESTUDIANTE)

## 4. Notas Técnicas Importantes (Para no volver a tropezar)
- **Docker y Redes:** El archivo `docker-compose.yml` tiene IPs estáticas (`172.20.0.x`) configuradas para que el backend Java pueda comunicarse con el microservicio Python sin errores de "I/O".
- **Compilación:** Si se hacen cambios en Java o React y Docker falla, usar `docker compose up -d --build --no-cache backend frontend`.
- **Base de Datos:** Los tipos de datos en Java (`Double`) coinciden con los de SQL (`DOUBLE PRECISION`) para evitar el error de validación de Hibernate.
- **Reset de BD:** Si se necesita borrar todo para empezar de cero (cuidado, borra datos), usar `docker compose down -v`.

## 5. Roadmap / Próximas Mejoras (En orden de prioridad)
Queremos construir la **v1.1.0** con las siguientes mejoras, en este orden:

1. **IA Real:** Modificar el archivo `ai-service/app.py` para conectar con la API de OpenAI (o Gemini) usando una `API_KEY` real, en lugar de devolver textos simulados.
2. **Módulo de Apoderados:** Habilitar la vista para que un apoderado inicie sesión y pueda ver las notas de su pupilo (requiere relacionar usuarios en la BD).
3. **Módulo de Asistencia:** Permitir a los docentes pasar lista (Presente/Ausente/Tarde) a sus alumnos.
4. **UI/UX:** Hacer el diseño 100% responsive (adaptable a celulares) y reemplazar los `alert()` nativos del navegador por notificaciones elegantes (Toasts).

## 6. Cómo pedirle ayuda a la IA en un nuevo chat
Si el chat se reinicia, copia y pega este mensaje junto con este archivo:
> "Hola, estoy desarrollando el proyecto EduGestión IA. Te adjunto el archivo `CONTEXTO_PROYECTO.md` con todo el estado actual (v1.0.0). Quiero que actuemos como equipo para implementar la Fase 1 del Roadmap: **Integrar la IA real en Python**. ¿Por dónde empezamos?"