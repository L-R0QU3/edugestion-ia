import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function MyAttendancePage() {
  const { user } = useAuth();
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    // Si es estudiante, consulta sus asistencias. (Lógica de apoderado se hará en su panel)
    if (user?.rol === 'ESTUDIANTE') {
      api('/attendance/mis-asistencias').then(setAsistencias).catch(console.error);
    }
  }, [user]);

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Mi Asistencia</h1>
      <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--color-gray-100)', textAlign: 'left' }}>
            <th style={th}>Fecha</th>
            <th style={th}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map(a => (
            <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={td}>{a.fecha}</td>
              <td style={td}>
                <span style={{
                  padding: '4px 10px', borderRadius: 12, fontWeight: 'bold',
                  background: a.estado === 'PRESENTE' ? '#dcfce7' : a.estado === 'AUSENTE' ? '#fee2e2' : '#fef08a',
                  color: a.estado === 'PRESENTE' ? '#166534' : a.estado === 'AUSENTE' ? '#991b1b' : '#854d0e'
                }}>
                  {a.estado}
                </span>
              </td>
            </tr>
          ))}
          {asistencias.length === 0 && <tr><td colSpan="2" style={{ padding: 20, textAlign: 'center' }}>Sin registros de asistencia.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
const th = { padding: 12, color: 'var(--color-gray-600)', fontSize: 14 };
const td = { padding: 12, fontSize: 14 };