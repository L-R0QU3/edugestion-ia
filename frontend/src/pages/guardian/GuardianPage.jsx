import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/toast/ToastContext';

export default function GuardianPage() {
  const { showToast } = useToast();
  const [pupilos, setPupilos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [vista, setVista] = useState('notas');
  
  const [notas, setNotas] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [anotaciones, setAnotaciones] = useState([]);

  useEffect(() => {
    api('/guardians/mis-pupilos').then(setPupilos).catch((err) => showToast(err.message, 'error'));
  }, []);

  const verInfo = async (id, tipo) => {
    setSeleccionado(id);
    setVista(tipo);
    try {
      if (tipo === 'notas') {
        const res = await api(`/grades/pupilo/${id}`);
        setNotas(res);
      } else if (tipo === 'asistencia') {
        const res = await api(`/attendance/pupilo/${id}`);
        setAsistencias(res);
      } else {
        const res = await api(`/annotations/pupilo/${id}`);
        setAnotaciones(res);
      }
    } catch (e) { showToast(e.message, 'error'); }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Portal de Apoderados</h1>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <div style={{ flex: 1, background: 'white', padding: 20, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0 }}>Mis Pupilos</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pupilos.map(p => (
              <li key={p.id} style={{ marginBottom: 15, padding: 10, border: '1px solid #eee', borderRadius: 6 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{p.nombres} {p.apellidos}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <button onClick={() => verInfo(p.id, 'notas')} style={{...btnSmall, background: seleccionado === p.id && vista === 'notas' ? 'var(--color-primary)' : '#e2e8f0', color: seleccionado === p.id && vista === 'notas' ? 'white' : 'black'}}>Ver Notas</button>
                  <button onClick={() => verInfo(p.id, 'asistencia')} style={{...btnSmall, background: seleccionado === p.id && vista === 'asistencia' ? 'var(--color-primary)' : '#e2e8f0', color: seleccionado === p.id && vista === 'asistencia' ? 'white' : 'black'}}>Ver Asistencia</button>
                  <button onClick={() => verInfo(p.id, 'anotaciones')} style={{...btnSmall, background: seleccionado === p.id && vista === 'anotaciones' ? 'var(--color-primary)' : '#e2e8f0', color: seleccionado === p.id && vista === 'anotaciones' ? 'white' : 'black'}}>Ver Anotaciones</button>
                </div>
              </li>
            ))}
            {pupilos.length === 0 && <p>No tienes pupilos vinculados.</p>}
          </ul>
        </div>

        <div style={{ flex: 2, background: 'white', padding: 20, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0 }}>
            {vista === 'notas' ? 'Calificaciones' : vista === 'asistencia' ? 'Registro de Asistencia' : 'Anotaciones'}
          </h3>
          
          {!seleccionado && <p>Selecciona una opción a la izquierda para ver la información.</p>}

          {seleccionado && vista === 'notas' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-gray-100)', textAlign: 'left' }}>
                  <th style={{ padding: 10 }}>Tipo</th>
                  <th style={{ padding: 10 }}>Fecha</th>
                  <th style={{ padding: 10 }}>Nota</th>
                </tr>
              </thead>
              <tbody>
                {notas.map(n => (
                  <tr key={n.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 10 }}>{n.tipo}</td>
                    <td style={{ padding: 10 }}>{new Date(n.fecha).toLocaleDateString()}</td>
                    <td style={{ padding: 10 }}>
                      <span style={{ padding: '4px 10px', borderRadius: 12, fontWeight: 'bold', background: n.nota >= 4.0 ? '#dcfce7' : '#fee2e2', color: n.nota >= 4.0 ? '#166534' : '#991b1b' }}>{n.nota}</span>
                    </td>
                  </tr>
                ))}
                {notas.length === 0 && <tr><td colSpan="3" style={{ padding: 10, textAlign: 'center' }}>Sin notas registradas.</td></tr>}
              </tbody>
            </table>
          )}

          {seleccionado && vista === 'asistencia' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-gray-100)', textAlign: 'left' }}>
                  <th style={{ padding: 10 }}>Fecha</th>
                  <th style={{ padding: 10 }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 10 }}>{a.fecha}</td>
                    <td style={{ padding: 10 }}>
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
                {asistencias.length === 0 && <tr><td colSpan="2" style={{ padding: 10, textAlign: 'center' }}>Sin registros de asistencia.</td></tr>}
              </tbody>
            </table>
          )}

          {seleccionado && vista === 'anotaciones' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {anotaciones.map(a => (
                  <div key={a.id} style={{ padding: 15, borderRadius: 8, borderLeft: `4px solid ${a.tipo === 'POSITIVA' ? 'green' : a.tipo === 'NEGATIVA' ? 'red' : 'gray'}`, background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 5 }}>
                      <b>{a.tipo}</b>
                      <span>{new Date(a.fecha).toLocaleDateString()}</span>
                    </div>
                    <p style={{ margin: 0 }}>{a.descripcion}</p>
                  </div>
                ))}
                {anotaciones.length === 0 && <p>Sin anotaciones visibles.</p>}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
const btnSmall = { padding: '6px 12px', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 'bold' };