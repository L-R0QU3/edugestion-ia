import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FloatingHelpBot from '../components/FloatingHelpBot';

export default function MainLayout({ children }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const rol = user?.rol;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 240, background: 'var(--color-navy)', color: 'white', padding: 16, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>EduGestión IA</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
          <NavItem to="/dashboard">Dashboard</NavItem>
          <NavItem to="/communications">Comunicados</NavItem>
          <NavItem to="/support">Mesa de Ayuda</NavItem>
          
          {(rol === 'ADMINISTRADOR' || rol === 'DIRECTOR') && (
            <>
              <NavItem to="/academic">Académico</NavItem>
              <NavItem to="/students">Estudiantes</NavItem>
              <NavItem to="/users">Funcionarios</NavItem>
              <NavItem to="/schedules">Horarios</NavItem>
              <NavItem to="/coexistence">Convivencia</NavItem>
              <NavItem to="/library">Biblioteca</NavItem>
            </>
          )}

          {/* JEFE UTP Y COORDINADOR (Gestión Pedagógica) */}
          {(rol === 'JEFE_UTP' || rol === 'COORDINADOR') && (
            <>
              <NavItem to="/academic">Académico</NavItem>
              <NavItem to="/schedules">Horarios</NavItem>
              <NavItem to="/coexistence">Convivencia</NavItem>
            </>
          )}

          {/* SECRETARÍA (Solo Matrículas y Alumnos) */}
          {rol === 'SECRETARIA' && (
            <>
              <NavItem to="/students">Estudiantes</NavItem>
              <NavItem to="/academic">Académico</NavItem>
            </>
          )}

          {/* DOCENTES (Profesores) */}
          {(rol === 'PROFESOR_JEFE' || rol === 'PROFESOR_ASIGNATURA') && (
            <>
              <NavItem to="/grades">Calificaciones</NavItem>
              <NavItem to="/attendance">Pasar Lista</NavItem>
              <NavItem to="/annotations">Anotaciones</NavItem>
              <NavItem to="/ai">Asistente IA</NavItem>
              <NavItem to="/schedules">Horarios</NavItem>
            </>
          )}

          {/* APOYO ESCOLAR */}
          {(rol === 'CONVIVENCIA' || rol === 'PSICOLOGO') && (
            <NavItem to="/coexistence">Convivencia</NavItem>
          )}

          {rol === 'BIBLIOTECARIO' && (
            <NavItem to="/library">Biblioteca</NavItem>
          )}

          {/* FAMILIAS */}
          {rol === 'ESTUDIANTE' && (
            <>
              <NavItem to="/my-grades">Mis Notas</NavItem>
              <NavItem to="/my-attendance">Mi Asistencia</NavItem>
              <NavItem to="/library">Biblioteca</NavItem>
              <NavItem to="/schedules">Horarios</NavItem>
            </>
          )}

          {rol === 'APODERADO' && (
            <NavItem to="/guardian">Mis Pupilos</NavItem>
          )}
        </nav>

        <div style={{ fontSize: 13, color: 'var(--color-gray-300)', marginTop: 15 }}>
          {user?.nombre}<br/>
          <span style={{ fontSize: 11, opacity: 0.8 }}>{rol}</span>
          <button onClick={() => { logout(); nav('/login') }} style={{ marginTop: 8, width: '100%', background: 'transparent', border: '1px solid var(--color-gray-300)', color: 'white', padding: '6px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Cerrar sesión</button>
        </div>
      </aside>
      
      <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>{children}</main>
      
      {/* AQUÍ ESTÁ LA MAGIA: El botón flotante se renderiza aquí */}
      <FloatingHelpBot />
      
    </div>
  )
}

function NavItem({ to, children }) {
  return (
    <NavLink to={to} style={({ isActive }) => ({
      color: isActive ? 'white' : 'var(--color-gray-300)',
      padding: '8px 10px', borderRadius: 6,
      background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
      textDecoration: 'none', fontSize: 14
    })}>{children}</NavLink>
  )
}