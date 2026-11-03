import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AttendancePage() {
  const [cursosAsig, setCursosAsig] = useState([]);
  const [cursoSel, setCursoSel] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencias, setAsistencias] = useState({}); // { estudianteId: 'PRESENTE' }

  useEffect(() => {
    api('/grades/mis-asignaturas').then(setCursosAsig).catch(console.error);
  }, []);

  const cargarCurso = async (cId, f) => {
    if (!cId || !f) return;
    try {
      const [resEst, resAsist] = await Promise.all([
        api(`/academic/cursos/${cId}/estudiantes`),
        api(`/attendance/curso/${cId}/fecha/${f}`)
      ]);
      setEstudiantes(resEst);
      
      const mapAsist = {};
      resEst.forEach(e => mapAsist[e.id] = 'PRESENTE'); // Por defecto todos presentes
      resAsist.forEach(a => mapAsist[a.estudianteId] = a.estado);
      setAsistencias(mapAsist);
    } catch (e) { alert(e.message); }
  };

  const guardar = async () => {
    try {
      const registros = Object.keys(asistencias).map(estId => ({
        estudianteId: parseInt(estId),
        estado: asistencias[estId]
      }));
      await api('/attendance', { method: 'POST', body: JSON.stringify({ cursoId: cursoSel, fecha, registros }) });
      alert('Asistencia guardada correctamente');
    } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Pasar Lista</h1>
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <select onChange={e => { setCursoSel(e.target.value); cargarCurso(e.target.value, fecha); }} style={inp}>
          <option value="">Selecciona Curso...</option>
          {cursosAsig.map(c => <option key={c.id} value={c.cursoId}>Curso ID {c.cursoId}</option>)}
        </select>
        <input type="date" value={fecha} onChange={e => { setFecha(e.target.value); cargarCurso(cursoSel, e.target.value); }} style={inp} />
        <button onClick={guardar} style={btn}>Guardar Asistencia</button>
      </div>

      {estudiantes.length > 0 && (
        <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-gray-100)', textAlign: 'left' }}>
              <th style={th}>Estudiante</th>
              <th style={th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map(est => (
              <tr key={est.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={td}>{est.nombres} {est.apellidos}</td>
                <td style={td}>
                  <select 
                    value={asistencias[est.id]} 
                    onChange={e => setAsistencias({...asistencias, [est.id]: e.target.value})}
                    style={{...inp, width: 'auto'}}
                  >
                    <option value="PRESENTE">Presente</option>
                    <option value="AUSENTE">Ausente</option>
                    <option value="ATRASADO">Atrasado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
const inp = { padding: '10px', border: '1px solid #ccc', borderRadius: 4 };
const btn = { padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' };
const th = { padding: 12, color: 'var(--color-gray-600)', fontSize: 14 };
const td = { padding: 12, fontSize: 14 };