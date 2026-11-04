import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/toast/ToastContext';

export default function GradesPage() {
  const { showToast } = useToast();
  const [misAsignaturas, setMisAsignaturas] = useState([]);
  const [todosCursos, setTodosCursos] = useState([]);
  const [todasAsignaturas, setTodasAsignaturas] = useState([]);
  
  const [seleccion, setSeleccion] = useState('');
  const [notas, setNotas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [nota, setNota] = useState('');

  useEffect(() => {
    Promise.all([
      api('/grades/mis-asignaturas'),
      api('/academic/cursos'),
      api('/academic/asignaturas')
    ]).then(([resMisAsig, resCursos, resAsigs]) => {
      setMisAsignaturas(resMisAsig);
      setTodosCursos(resCursos);
      setTodasAsignaturas(resAsigs);
    }).catch((err) => showToast(err.message, 'error'));
  }, []);

  const cargarCurso = async (id) => {
    setSeleccion(id);
    if (!id) return;
    try {
      const [resNotas, resEst] = await Promise.all([
        api(`/grades/curso/${id}`),
        api('/users?rol=ESTUDIANTE')
      ]);
      setNotas(resNotas);
      setEstudiantes(resEst);
    } catch (e) { showToast(e.message, 'error'); }
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
      showToast('Nota guardada con éxito', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Registro de Calificaciones</h1>
      
      <select onChange={e => cargarCurso(e.target.value)} style={inp}>
        <option value="">Selecciona tu curso/asignatura...</option>
        {misAsignaturas.map(a => {
          const curso = todosCursos.find(c => c.id === a.cursoId);
          const asignatura = todasAsignaturas.find(as => as.id === a.asignaturaId);
          return (
            <option key={a.id} value={a.id}>
              {curso?.nivel} {curso?.letra} - {asignatura?.codigo} {asignatura?.nombre}
            </option>
          );
        })}
      </select>

      {seleccion && (
        <div style={{ marginTop: 20, background: 'white', padding: 20, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0 }}>Poner Nota</h3>
          <form onSubmit={guardarNota} style={{ display: 'flex', gap: 10 }}>
            <select name="estudiante" required style={inp}>
              <option value="">Selecciona Alumno...</option>
              {estudiantes.map(es => <option key={es.id} value={es.id}>{es.nombres} {es.apellidos}</option>)}
            </select>
            <input 
              type="text" 
              required 
              value={nota} 
              onChange={e => {
                // Convierte automáticamente la coma en punto
                const valor = e.target.value.replace('.', ','); 
                setNota(valor);
              }} 
              placeholder="Nota (Ej: 6.5 o 6,5)" 
              style={inp} 
            />
            <button type="submit" style={btn}>Guardar</button>
          </form>

          <h3 style={{ marginTop: 30 }}>Notas del Curso</h3>
          <ul>
            {notas.map(n => {
               const alumno = estudiantes.find(e => e.id === n.estudianteId);
               return <li key={n.id}>{alumno ? `${alumno.nombres} ${alumno.apellidos}` : `Alumno ID: ${n.estudianteId}`} - Nota: <b>{n.nota}</b></li>
            })}
            {notas.length === 0 && <p>No hay notas registradas aún.</p>}
          </ul>
        </div>
      )}
    </div>
  );
}
const inp = { padding: '10px', border: '1px solid #ccc', borderRadius: 4, marginBottom: 10, width: '100%', maxWidth: 400 };
const btn = { padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' };