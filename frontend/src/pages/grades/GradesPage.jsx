import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function GradesPage() {
  const [misAsignaturas, setMisAsignaturas] = useState([]);
  const [todosCursos, setTodosCursos] = useState([]);
  const [todasAsignaturas, setTodasAsignaturas] = useState([]);
  
  const [seleccion, setSeleccion] = useState('');
  const [notas, setNotas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [nota, setNota] = useState('');

  useEffect(() => {
    // Cargamos todo lo necesario en paralelo
    Promise.all([
      api('/grades/mis-asignaturas'),
      api('/academic/cursos'),
      api('/academic/asignaturas')
    ]).then(([resMisAsig, resCursos, resAsigs]) => {
      setMisAsignaturas(resMisAsig);
      setTodosCursos(resCursos);
      setTodasAsignaturas(resAsigs);
    }).catch(console.error);
  }, []);

  const cargarCurso = async (id) => {
    setSeleccion(id);
    if (!id) return;
    try {
      const [resNotas, resEst] = await Promise.all([
        api(`/grades/curso/${id}`),
        api('/users?rol=ESTUDIANTE') // Ahora ya no dará Error 403
      ]);
      setNotas(resNotas);
      setEstudiantes(resEst);
    } catch (e) { alert(e.message); }
  };

  const guardarNota = async (e) => {
    e.preventDefault();
    try {
      await api('/grades', {
        method: 'POST',
        body: JSON.stringify({ cursoAsignaturaId: seleccion, estudianteId: e.target.estudiante.value, nota })
      });
      setNota('');
      cargarCurso(seleccion);
      alert('Nota guardada con éxito');
    } catch (e) { alert(e.message); }
  };

  // Función auxiliar para buscar el nombre del curso y asignatura
  const getNombreAsignatura = (ca) => {
    const curso = todosCursos.find(c => c.id === ca.cursoId);
    const asignatura = todasAsignaturas.find(a => a.id === ca.asignaturaId);
    return `${curso?.nivel || 'Curso'} ${curso?.letra || ''} - ${asignatura?.nombre || 'Asignatura'}`;
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Registro de Calificaciones</h1>
      
      <select onChange={e => cargarCurso(e.target.value)} style={inp}>
        <option value="">Selecciona tu curso/asignatura...</option>
        {misAsignaturas.map(a => (
          <option key={a.id} value={a.id}>{getNombreAsignatura(a)}</option>
        ))}
      </select>

      {seleccion && (
        <div style={{ marginTop: 20, background: 'white', padding: 20, borderRadius: 8 }}>
          <h3>Poner Nota</h3>
          <form onSubmit={guardarNota} style={{ display: 'flex', gap: 10 }}>
            <select name="estudiante" required style={inp}>
              <option value="">Selecciona Alumno...</option>
              {estudiantes.map(es => <option key={es.id} value={es.id}>{es.nombres} {es.apellidos}</option>)}
            </select>
            <input type="number" step="0.1" min="1.0" max="7.0" required value={nota} onChange={e => setNota(e.target.value)} placeholder="Nota (1.0 - 7.0)" style={inp} />
            <button type="submit" style={btn}>Guardar</button>
          </form>

          <h3 style={{ marginTop: 30 }}>Notas del Curso</h3>
          <ul>
            {notas.map(n => {
               const alumno = estudiantes.find(e => e.id === n.estudianteId);
               return <li key={n.id}>{alumno ? `${alumno.nombres} ${alumno.apellidos}` : `Alumno ID: ${n.estudianteId}`} - Nota: <b>{n.nota}</b></li>
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
const inp = { padding: '10px', border: '1px solid #ccc', borderRadius: 4, marginBottom: 10, width: '100%', maxWidth: 400 };
const btn = { padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' };