import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function SchedulesPage() {
  const { user } = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');

  const [form, setForm] = useState({ diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '09:30', sala: '' });

  const cargarDatos = async () => {
    try {
      // Todos necesitan ver las asignaturas para mostrar el nombre en las tarjetas
      const resA = await api('/academic/asignaturas');
      setAsignaturas(resA);

      if (user.rol === 'DIRECCION') {
        const [resC, resD] = await Promise.all([
          api('/academic/cursos'), api('/users?rol=DOCENTE')
        ]);
        setCursos(resC); setDocentes(resD);
      } else if (user.rol === 'DOCENTE') {
        const res = await api('/schedules/mis-clases');
        setHorarios(res);
      } else if (user.rol === 'ESTUDIANTE') {
        const res = await api('/schedules/mis-clases-estudiante');
        setHorarios(res);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { cargarDatos(); }, [user]);

  const verHorarioCurso = async (id) => {
    setCursoSeleccionado(id);
    if (!id) return;
    const res = await api(`/schedules/curso/${id}`);
    setHorarios(res);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await api('/schedules', { method: 'POST', body: JSON.stringify({ ...form, cursoId: cursoSeleccionado, asignaturaId: e.target.asig.value, docenteId: e.target.doc.value }) });
      alert('Bloque horario guardado');
      verHorarioCurso(cursoSeleccionado);
    } catch (err) { alert(err.message); }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Horarios de Clases</h1>

      {user.rol === 'DIRECCION' && (
        <div style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 20 }}>
          <h3>Crear Bloque Horario</h3>
          <select onChange={e => verHorarioCurso(e.target.value)} style={inp}>
            <option value="">Selecciona Curso para ver/editar...</option>
            {cursos.map(c => <option key={c.id} value={c.id}>{c.nivel} {c.letra}</option>)}
          </select>
          
          {cursoSeleccionado && (
            <form onSubmit={guardar} style={{ display: 'flex', gap: 10, marginTop: 15, flexWrap: 'wrap' }}>
              <select name="asig" required style={inp}>
                <option value="">Asignatura...</option>
                {asignaturas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
              <select name="doc" required style={inp}>
                <option value="">Docente...</option>
                {docentes.map(d => <option key={d.id} value={d.id}>{d.nombres} {d.apellidos}</option>)}
              </select>
              <select value={form.diaSemana} onChange={e => setForm({...form, diaSemana: e.target.value})} style={inp}>
                {['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="time" required value={form.horaInicio} onChange={e => setForm({...form, horaInicio: e.target.value})} style={inp} />
              <input type="time" required value={form.horaFin} onChange={e => setForm({...form, horaFin: e.target.value})} style={inp} />
              <input placeholder="Sala (Ej: A-12)" value={form.sala} onChange={e => setForm({...form, sala: e.target.value})} style={inp} />
              <button type="submit" style={btn}>Agregar</button>
            </form>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES'].map(dia => (
          <div key={dia} style={{ background: 'white', borderRadius: 8, padding: 10, boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ textAlign: 'center', borderBottom: '2px solid var(--color-primary)', paddingBottom: 5 }}>{dia}</h4>
            {horarios.filter(h => h.diaSemana === dia).sort((a,b) => a.horaInicio.localeCompare(b.horaInicio)).map(h => {
              const asig = asignaturas.find(a => a.id === h.asignaturaId);
              return (
                <div key={h.id} style={{ background: 'var(--color-gray-100)', padding: 10, borderRadius: 6, marginBottom: 8, fontSize: 13 }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-navy)', marginBottom: 4 }}>{asig ? asig.nombre : 'Asignatura'}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{h.horaInicio} - {h.horaFin}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>Sala: {h.sala || 'N/A'}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
const inp = { padding: '8px', border: '1px solid #ccc', borderRadius: 4 };
const btn = { padding: '8px 16px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' };