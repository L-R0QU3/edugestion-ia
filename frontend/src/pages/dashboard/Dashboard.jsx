import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Hola, {user?.nombre}</h1>
      <p style={{ color: 'var(--color-gray-600)' }}>Bienvenido al panel de <b>{user?.rol}</b></p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20, marginTop: 30 }}>
        
        {/* TARJETAS PARA DIRECCIÓN */}
        {user?.rol === 'DIRECCION' && (
          <>
            <Link to="/academic" style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <h3 style={cardTitle}>Gestión Académica</h3>
                <p style={cardText}>Administrar cursos, asignaturas, docentes y matrículas.</p>
              </div>
            </Link>
            <Link to="/users" style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <h3 style={cardTitle}>Usuarios</h3>
                <p style={cardText}>Crear y gestionar cuentas de estudiantes y docentes.</p>
              </div>
            </Link>
            <Link to="/library" style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <h3 style={cardTitle}>Biblioteca</h3>
                <p style={cardText}>Revisar catálogo y gestionar préstamos de libros.</p>
              </div>
            </Link>
          </>
        )}

        {/* TARJETAS PARA DOCENTES */}
        {user?.rol === 'DOCENTE' && (
          <>
            <Link to="/grades" style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <h3 style={cardTitle}>Calificaciones</h3>
                <p style={cardText}>Registrar notas y revisar el historial de tus alumnos.</p>
              </div>
            </Link>
            <Link to="/ai" style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <h3 style={cardTitle}>Asistente IA</h3>
                <p style={cardText}>Generar evaluaciones automáticamente con Inteligencia Artificial.</p>
              </div>
            </Link>
          </>
        )}

        {/* TARJETAS PARA ESTUDIANTES */}
        {user?.rol === 'ESTUDIANTE' && (
          <>
            <Link to="/my-grades" style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <h3 style={cardTitle}>Mis Notas</h3>
                <p style={cardText}>Revisar tus calificaciones y rendimiento académico.</p>
              </div>
            </Link>
            <Link to="/library" style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <h3 style={cardTitle}>Biblioteca</h3>
                <p style={cardText}>Buscar libros disponibles y revisar tus préstamos.</p>
              </div>
            </Link>
          </>
        )}

        {/* TARJETAS PARA BIBLIOTECARIO */}
        {user?.rol === 'BIBLIOTECARIO' && (
          <Link to="/library" style={{ textDecoration: 'none' }}>
            <div style={cardStyle}>
              <h3 style={cardTitle}>Gestión de Biblioteca</h3>
              <p style={cardText}>Administrar el catálogo, préstamos y devoluciones.</p>
            </div>
          </Link>
        )}

      </div>
    </div>
  )
}

const cardStyle = { background: 'white', padding: 24, borderRadius: 12, borderTop: '4px solid var(--color-primary)', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s' };
const cardTitle = { margin: '0 0 10px 0', color: 'var(--color-navy)', fontSize: 18 };
const cardText = { margin: 0, color: 'var(--color-gray-600)', fontSize: 14, lineHeight: 1.5 };