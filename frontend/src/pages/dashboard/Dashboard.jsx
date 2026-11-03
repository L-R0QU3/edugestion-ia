import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api('/dashboard/stats').then(setStats).catch(console.error)
  }, [])

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Hola, {user?.nombre}</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: 30 }}>Bienvenido al panel de <b>{user?.rol}</b></p>

      {/* SECCIÓN DE ESTADÍSTICAS */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, marginBottom: 40 }}>
          
          {user?.rol === 'DIRECCION' && (
            <>
              <StatCard title="Estudiantes" value={stats.totalEstudiantes} />
              <StatCard title="Docentes" value={stats.totalDocentes} />
              <StatCard title="Cursos" value={stats.totalCursos} />
              <StatCard title="Libros" value={stats.totalLibros} />
              <StatCard title="Préstamos Activos" value={stats.prestamosActivos} />
            </>
          )}

          {user?.rol === 'BIBLIOTECARIO' && (
            <>
              <StatCard title="Libros en Catálogo" value={stats.totalLibros} />
              <StatCard title="Préstamos Activos" value={stats.prestamosActivos} />
            </>
          )}

          {user?.rol === 'ESTUDIANTE' && (
            <>
              <StatCard title="Mi Promedio" value={stats.promedio} suffix=" / 7.0" highlight={stats.promedio >= 4.0} />
              <StatCard title="Ausencias" value={stats.ausencias} highlight={stats.ausencias === 0} />
              <StatCard title="Libros Prestados" value={stats.librosPrestados} />
            </>
          )}

          {user?.rol === 'APODERADO' && (
            <>
              <StatCard title="Mis Pupilos" value={stats.pupilos} />
            </>
          )}

        </div>
      )}

      <h2 style={{ fontSize: 20, color: 'var(--color-navy)', borderBottom: '2px solid #eee', paddingBottom: 10 }}>Accesos Rápidos</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20, marginTop: 20 }}>
        
        {/* TARJETAS PARA DIRECCIÓN */}
        {user?.rol === 'DIRECCION' && (
          <>
            <Link to="/academic" style={{ textDecoration: 'none' }}><Card title="Gestión Académica" desc="Cursos, asignaturas y matrículas." /></Link>
            <Link to="/users" style={{ textDecoration: 'none' }}><Card title="Usuarios" desc="Crear y gestionar cuentas." /></Link>
            <Link to="/library" style={{ textDecoration: 'none' }}><Card title="Biblioteca" desc="Catálogo y préstamos." /></Link>
            <Link to="/communications" style={{ textDecoration: 'none' }}><Card title="Comunicados" desc="Publicar avisos oficiales." /></Link>
            <Link to="/schedules" style={{ textDecoration: 'none' }}><Card title="Horarios" desc="Planificación de clases." /></Link>
            <Link to="/coexistence" style={{ textDecoration: 'none' }}><Card title="Convivencia Escolar" desc="Registro y seguimiento de casos." /></Link>
          </>
        )}

        {/* TARJETAS PARA DOCENTES */}
        {user?.rol === 'DOCENTE' && (
          <>
            <Link to="/grades" style={{ textDecoration: 'none' }}><Card title="Calificaciones" desc="Registrar notas de alumnos." /></Link>
            <Link to="/attendance" style={{ textDecoration: 'none' }}><Card title="Pasar Lista" desc="Registrar asistencia diaria." /></Link>
            <Link to="/annotations" style={{ textDecoration: 'none' }}><Card title="Anotaciones" desc="Observaciones de comportamiento." /></Link>
            <Link to="/ai" style={{ textDecoration: 'none' }}><Card title="Asistente IA" desc="Generar evaluaciones." /></Link>
            <Link to="/schedules" style={{ textDecoration: 'none' }}><Card title="Horarios" desc="Ver mis clases asignadas." /></Link>
          </>
        )}

        {/* TARJETAS PARA ESTUDIANTES */}
        {user?.rol === 'ESTUDIANTE' && (
          <>
            <Link to="/my-grades" style={{ textDecoration: 'none' }}><Card title="Mis Notas" desc="Revisar calificaciones." /></Link>
            <Link to="/my-attendance" style={{ textDecoration: 'none' }}><Card title="Mi Asistencia" desc="Historial de asistencia." /></Link>
            <Link to="/library" style={{ textDecoration: 'none' }}><Card title="Biblioteca" desc="Libros y préstamos." /></Link>
            <Link to="/schedules" style={{ textDecoration: 'none' }}><Card title="Mis Horarios" desc="Revisar tu horario escolar." /></Link>
            <Link to="/communications" style={{ textDecoration: 'none' }}><Card title="Comunicados" desc="Avisos del colegio." /></Link>
          </>
        )}

        {/* TARJETAS PARA APODERADOS */}
        {user?.rol === 'APODERADO' && (
          <>
            <Link to="/guardian" style={{ textDecoration: 'none' }}><Card title="Mis Pupilos" desc="Ver notas, asistencia y anotaciones." /></Link>
            <Link to="/communications" style={{ textDecoration: 'none' }}><Card title="Comunicados" desc="Avisos importantes." /></Link>
          </>
        )}

        {/* TARJETAS PARA BIBLIOTECARIO */}
        {user?.rol === 'BIBLIOTECARIO' && (
          <Link to="/library" style={{ textDecoration: 'none' }}><Card title="Gestión de Biblioteca" desc="Catálogo y préstamos." /></Link>
        )}

      </div>
    </div>
  )
}

// Componentes reutilizables para las tarjetas
function StatCard({ title, value, suffix = '', highlight = false }) {
  return (
    <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: 'var(--shadow-sm)', borderLeft: highlight ? '4px solid var(--color-success)' : '4px solid var(--color-primary)' }}>
      <div style={{ fontSize: 13, color: 'var(--color-gray-600)', marginBottom: 5 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 'bold', color: highlight ? 'var(--color-success)' : 'var(--color-navy)' }}>
        {value}{suffix}
      </div>
    </div>
  )
}

function Card({ title, desc }) {
  return (
    <div style={{ background: 'white', padding: 24, borderRadius: 12, borderTop: '4px solid var(--color-primary)', boxShadow: 'var(--shadow-md)', height: '100%' }}>
      <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-navy)', fontSize: 18 }}>{title}</h3>
      <p style={{ margin: 0, color: 'var(--color-gray-600)', fontSize: 14, lineHeight: 1.5 }}>{desc}</p>
    </div>
  )
}