import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function MainLayout({ children }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 240, background: 'var(--color-navy)', color: 'white', padding: 16, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>EduGestión IA</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <NavItem to="/dashboard">Dashboard</NavItem>
          <NavItem to="/communications">Comunicados</NavItem>
          
          {/* MENÚ PARA DIRECCIÓN */}
          {user?.rol === 'DIRECCION' && (
            <>
              <NavItem to="/academic">Académico</NavItem>
              <NavItem to="/users">Usuarios</NavItem>
              <NavItem to="/library">Biblioteca</NavItem>
              <NavItem to="/schedules">Horarios</NavItem>
              <NavItem to="/coexistence">Convivencia</NavItem>
            </>
          )}

          {/* MENÚ PARA DOCENTES */}
          {user?.rol === 'DOCENTE' && (
              <>
                <NavItem to="/grades">Calificaciones</NavItem>
                <NavItem to="/attendance">Pasar Lista</NavItem>
                <NavItem to="/annotations">Anotaciones</NavItem>
                <NavItem to="/ai">Asistente IA</NavItem>
                <NavItem to="/schedules">Horarios</NavItem>
              </>
          )}

          {/* MENÚ PARA ESTUDIANTES */}
          {user?.rol === 'ESTUDIANTE' && (
            <>
              <NavItem to="/my-grades">Mis Notas</NavItem>
              <NavItem to="/my-attendance">Mi Asistencia</NavItem>
              <NavItem to="/library">Biblioteca</NavItem>
              <NavItem to="/schedules">Horarios</NavItem>
            </>
          )}

          {/* MENÚ PARA APODERADOS */}
          {user?.rol === 'APODERADO' && (
            <NavItem to="/guardian">Mis Pupilos</NavItem>
          )}

          {/* MENÚ PARA BIBLIOTECARIO */}
          {user?.rol === 'BIBLIOTECARIO' && (
            <NavItem to="/library">Biblioteca</NavItem>
          )}
        </nav>

        <div style={{ fontSize: 13, color: 'var(--color-gray-300)' }}>
          {user?.nombre}<br/>
          <span style={{ fontSize: 11 }}>{user?.rol}</span>
          <button onClick={() => { logout(); nav('/login') }} style={{ marginTop: 8, background: 'transparent', border: '1px solid var(--color-gray-300)', color: 'white', padding: '6px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Cerrar sesión</button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>{children}</main>
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