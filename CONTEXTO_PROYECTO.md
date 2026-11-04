# 📋 CONTEXTO TÉCNICO Y DE TRASPASO: EduGestión IA (v1.0.1)

# 📋 CONTEXTO TÉCNICO Y DE TRASPASO: EduGestión IA (v1.1.0)

## 1. Visión General del Proyecto
EduGestión IA es un sistema integral de gestión escolar. Actualmente nos encontramos en la **Versión 1.1.0**, una actualización mayor que introdujo el organigrama completo de roles del colegio, mejoras importantes de UI/UX (modales y notificaciones) y la Mesa de Ayuda.

**Arquitectura:** Monolito modular en Java (Backend) + Microservicio independiente en Python (IA) + SPA en React (Frontend).

## 2. Stack Tecnológico
- **Frontend:** React 18, Vite, React Router. UI basada en CSS puro y variables globales (`global.css`). Uso de Notificaciones Toast y Ventanas Modales.
- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Hibernate, Maven.
- **Base de Datos:** PostgreSQL 15.
- **IA:** Python 3.11 + Flask + OpenAI API (con modo fallback "mock").
- **Infraestructura:** Docker y Docker Compose (frontend, backend, db, ai-service).

## 3. Organigrama de Roles (Nuevo)
Implementamos la estructura real de un colegio:
- `ADMINISTRADOR`: Control total del sistema.
- `DIRECTOR`, `JEFE_UTP`, `COORDINADOR`: Equipo directivo. Ven el panel académico y de gestión.
- `SECRETARIA`: Gestión de matrículas, estudiantes y usuarios.
- `PROFESOR_JEFE`, `PROFESOR_ASIGNATURA`: Docentes. Ven notas, asistencia, anotaciones y horarios.
- `CONVIVENCIA`, `PSICOLOGO`: Solo ven el módulo de Convivencia Escolar.
- `BIBLIOTECARIO`: Solo ve la Biblioteca.
- `ESTUDIANTE`, `APODERADO`: Vistas de consulta familiar.

## 4. Módulos y Funcionalidades Implementadas (v1.1.0)
1. **Autenticación:** JWT y control de accesos granular (RBAC).
2. **Gestión Académica:** Cursos, asignaturas, matrículas (con Ficha Profesional: dirección, salud, contacto de emergencia).
3. **Estudiantes y Funcionarios:** Módulos separados. CRUD completo (Crear, Leer, Editar, Eliminar) con validación de RUT automática (Módulo 11).
4. **Asistencia:** Pasar lista, alumno y apoderado consultan.
5. **Anotaciones:** Libro de clases.
6. **Convivencia Escolar:** Módulo exclusivo y confidencial para registrar casos y seguimientos.
7. **Horarios:** Bloques de colores, editables y eliminables.
8. **Comunicados:** Envío filtrado por roles.
9. **Biblioteca:** Catálogo, préstamos y devoluciones.
10. **Mesa de Ayuda (Tickets):** Los usuarios reportan problemas y el admin responde/cierra.
11. **Bot Flotante:** Asistente en la esquina inferior derecha.
12. **Dashboards Dinámicos:** Estadísticas reales por cada rol.
13. **IA Real:** Generación de evaluaciones con OpenAI.

## 5. Estado Actual y Pendientes (Roadmap v1.2.0)
- ✅ **Completado:** Toda la base funcional, organigrama de roles, UI/UX (Modales/Toasts), Mesa de Ayuda.
- ⏳ **Pendiente para la próxima versión:**
  1. **RUTs:** Validación de RUTs reales (rechazar ceros a la izquierda).
  2. **Reportes:** Exportar boletines de notas en PDF.
  3. **Reglas Académicas:** Configurar ponderaciones de notas y promedios por semestre.
  4. **IA:** Permitir editar las preguntas generadas antes de guardarlas.

## 6. Instrucción para nuevos chats
> "Hola. Estamos desarrollando EduGestión IA. Te adjunto el `CONTEXTO_PROYECTO.md` (v1.1.0). Actúa como mi Tech Lead. Queremos empezar a trabajar en la v1.2.0, específicamente en: **[INSERTAR TAREA, ej: Exportar boletines de notas a PDF]**."

## 7. Instrucciones para iniciar un nuevo chat con IA
Si necesitas continuar el desarrollo en un nuevo chat (porque se acabó el límite o pasó el tiempo), copia y pega lo siguiente:

> "Hola. Estamos desarrollando el proyecto **EduGestión IA**. Te adjunto el archivo `CONTEXTO_PROYECTO.md` que contiene el estado actual (v1.0.1), la arquitectura y las decisiones técnicas. 
> 
> A partir de ahora, actúa como mi **Tech Lead y Desarrollador Senior**. Queremos empezar a trabajar en la **v1.1.0**, específicamente en la siguiente tarea del Roadmap: **[INSERTAR TAREA AQUÍ, por ejemplo: Implementar notificaciones Toasts para reemplazar los alerts]**.
