import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function MyGradesPage() {
  const [notas, setNotas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);

  useEffect(() => {
    Promise.all([
      api('/grades/mis-notas'),
      api('/academic/asignaturas')
    ]).then(([resNotas, resAsigs]) => {
      setNotas(resNotas);
      setAsignaturas(resAsigs);
    }).catch(console.error);
  }, []);

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Mis Calificaciones</h1>
      
      <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: 'var(--color-gray-100)', textAlign: 'left' }}>
            <th style={th}>Asignatura</th>
            <th style={th}>Tipo</th>
            <th style={th}>Fecha</th>
            <th style={th}>Nota</th>
          </tr>
        </thead>
        <tbody>
          {notas.map(n => {
             // Intentamos buscar la asignatura, si no, mostramos ID
             const asig = asignaturas.find(a => a.id === n.cursoAsignaturaId) || { nombre: 'Asignatura' };
             return (
              <tr key={n.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={td}><b>{asig.nombre}</b></td>
                <td style={td}>{n.tipo}</td>
                <td style={td}>{new Date(n.fecha).toLocaleDateString()}</td>
                <td style={td}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: 12, fontWeight: 'bold',
                    background: n.nota >= 4.0 ? '#dcfce7' : '#fee2e2',
                    color: n.nota >= 4.0 ? '#166534' : '#991b1b'
                  }}>
                    {n.nota}
                  </span>
                </td>
              </tr>
            );
          })}
          {notas.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: 20 }}>Aún no tienes notas registradas.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
const th = { padding: 12, color: 'var(--color-gray-600)', fontSize: 14 };
const td = { padding: 12, fontSize: 14 };