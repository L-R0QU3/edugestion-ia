-- Roles del sistema
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(30) UNIQUE NOT NULL
);

INSERT INTO roles (nombre) VALUES
  ('DIRECCION'), ('DOCENTE'), ('BIBLIOTECARIO'), ('APODERADO'), ('ESTUDIANTE');

CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  rut VARCHAR(12) UNIQUE NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(30) NOT NULL, 
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Gestión Académica
CREATE TABLE cursos (
  id BIGSERIAL PRIMARY KEY,
  nivel VARCHAR(50) NOT NULL,       -- Ej: 1° Medio, 8° Básico
  letra VARCHAR(5) NOT NULL,        -- Ej: A, B, C
  anio INT NOT NULL,                -- Ej: 2026
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE asignaturas (
  id BIGSERIAL PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL, -- Ej: MAT-01
  nombre VARCHAR(100) NOT NULL,       -- Ej: Matemática
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE matriculas (
  id BIGSERIAL PRIMARY KEY,
  estudiante_id BIGINT NOT NULL REFERENCES usuarios(id),
  curso_id BIGINT NOT NULL REFERENCES cursos(id),
  anio INT NOT NULL,
  fecha_registro TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(estudiante_id, curso_id, anio)
);

CREATE TABLE curso_asignatura (
  id BIGSERIAL PRIMARY KEY,
  curso_id BIGINT NOT NULL REFERENCES cursos(id),
  asignatura_id BIGINT NOT NULL REFERENCES asignaturas(id),
  docente_id BIGINT NOT NULL REFERENCES usuarios(id),
  UNIQUE(curso_id, asignatura_id)
);

CREATE TABLE calificaciones (
  id BIGSERIAL PRIMARY KEY,
  estudiante_id BIGINT NOT NULL REFERENCES usuarios(id),
  curso_asignatura_id BIGINT NOT NULL REFERENCES curso_asignatura(id),
  nota DOUBLE PRECISION NOT NULL CHECK (nota >= 1.0 AND nota <= 7.0), -- <-- CAMBIO AQUÍ
  tipo VARCHAR(50) DEFAULT 'PRUEBA',
  fecha TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE libros (
  id BIGSERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  autor VARCHAR(150) NOT NULL,
  isbn VARCHAR(20),
  anio INT,
  categoria VARCHAR(100),
  ejemplares_totales INT NOT NULL DEFAULT 1,
  ejemplares_disponibles INT NOT NULL DEFAULT 1
);

CREATE TABLE prestamos (
  id BIGSERIAL PRIMARY KEY,
  libro_id BIGINT NOT NULL REFERENCES libros(id),
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  fecha_prestamo DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_devolucion DATE,
  estado VARCHAR(20) DEFAULT 'ACTIVO' -- ACTIVO, DEVUELTO
);

CREATE TABLE evaluaciones (
  id BIGSERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  tema VARCHAR(200) NOT NULL,
  docente_id BIGINT NOT NULL REFERENCES usuarios(id),
  fecha_creacion TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE preguntas (
  id BIGSERIAL PRIMARY KEY,
  evaluacion_id BIGINT NOT NULL REFERENCES evaluaciones(id) ON DELETE CASCADE,
  enunciado TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'DESARROLLO'
);

CREATE TABLE guardian_students (
  id BIGSERIAL PRIMARY KEY,
  apoderado_id BIGINT NOT NULL REFERENCES usuarios(id),
  estudiante_id BIGINT NOT NULL REFERENCES usuarios(id),
  parentesco VARCHAR(50) DEFAULT 'Tutor', -- Ej: Padre, Madre, Tutor
  UNIQUE(apoderado_id, estudiante_id)
);

CREATE TABLE asistencias (
  id BIGSERIAL PRIMARY KEY,
  estudiante_id BIGINT NOT NULL REFERENCES usuarios(id),
  curso_id BIGINT NOT NULL REFERENCES cursos(id),
  fecha DATE NOT NULL,
  estado VARCHAR(20) NOT NULL, -- PRESENTE, AUSENTE, ATRASADO
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(estudiante_id, curso_id, fecha) -- Evita duplicados en el mismo día
);

CREATE TABLE anotaciones (
  id BIGSERIAL PRIMARY KEY,
  estudiante_id BIGINT NOT NULL REFERENCES usuarios(id),
  docente_id BIGINT NOT NULL REFERENCES usuarios(id),
  tipo VARCHAR(20) NOT NULL, -- POSITIVA, NEGATIVA, NEUTRA
  descripcion TEXT NOT NULL,
  visible_apoderado BOOLEAN DEFAULT TRUE,
  fecha TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE comunicados (
  id BIGSERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  contenido TEXT NOT NULL,
  autor_id BIGINT NOT NULL REFERENCES usuarios(id),
  destinatario VARCHAR(50) NOT NULL, -- TODOS, ESTUDIANTES, DOCENTES, APODERADOS
  fecha TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE horarios (
  id BIGSERIAL PRIMARY KEY,
  curso_id BIGINT NOT NULL REFERENCES cursos(id),
  asignatura_id BIGINT NOT NULL REFERENCES asignaturas(id),
  docente_id BIGINT NOT NULL REFERENCES usuarios(id),
  dia_semana VARCHAR(20) NOT NULL, -- LUNES, MARTES, etc.
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  sala VARCHAR(50)
);

CREATE TABLE casos_convivencia (
  id BIGSERIAL PRIMARY KEY,
  estudiante_id BIGINT NOT NULL REFERENCES usuarios(id),
  reportado_por_id BIGINT NOT NULL REFERENCES usuarios(id),
  categoria VARCHAR(100) NOT NULL, -- Ej: Conflicto, Bullying, Rendimiento, Otro
  descripcion TEXT NOT NULL,
  estado VARCHAR(30) NOT NULL DEFAULT 'REGISTRADO', -- REGISTRADO, EN_REVISION, EN_SEGUIMIENTO, CERRADO
  acciones_tomadas TEXT,
  fecha_registro TIMESTAMPTZ DEFAULT now(),
  fecha_actualizacion TIMESTAMPTZ
);