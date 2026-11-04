import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/toast/ToastContext';

export default function SchedulesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [horarios, setHorarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ asignaturaId: '', docenteId: '', diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '09:30', sala: '' });

  // Paleta de colores profesionales para las asignaturas
  const colores = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#6366f1', '#14b8a6'];

  const esAdminODirector = user?.rol === 'ADMINISTRADOR' || user?.rol === 'DIRECTOR';
  const esDocente = user?.rol === 'PROFESOR_ASIGNATURA' || user?.rol === 'PROFESOR_JEFE';

  const cargarDatos = async () => {
    try {
      const resA = await api('/academic/asignaturas');
      setAsignaturas(resA);

      if (esAdminODirector) {
        const [resC, resD1, resD2] = await Promise.all([
          api('/academic/cursos'), 
          api('/users?rol=PROFESOR_ASIGNATURA'),
          api('/users?rol=PROFESOR_JEFE')
        ]);
        setCursos(resC); 
        setDocentes([...resD1, ...resD2]); // Juntamos ambos tipos de profesores
      } else if (esDocente) {
        const res = await api('/schedules/mis-clases');
        setHorarios(res);
      } else if (user?.rol === 'ESTUDIANTE') {
        const res = await api('/schedules/mis-clases-estudiante');
        setHorarios(res);
      }
    } catch (e) { showToast(e.message, 'error'); }
  };

  useEffect(() => { cargarDatos(); }, [user]);

  const verHorarioCurso = async (id) => {
    setCursoSeleccionado(id);
    setEditandoId(null);
    if (!id) return;
    const res = await api(`/schedules/curso/${id}`);
    setHorarios(res);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, cursoId: cursoSeleccionado };
      
      if (editandoId) {
        await api(`/schedules/${editandoId}`, { method: 'PUT', body: JSON.stringify(payload) });
        showToast('Bloque horario actualizado', 'success');
      } else {
        await api('/schedules', { method: 'POST', body: JSON.stringify(payload) });
        showToast('Bloque horario guardado', 'success');
      }
      
      limpiarFormulario();
      verHorarioCurso(cursoSeleccionado);
    } catch (err) { showToast(err.message, 'error'); }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este bloque horario?')) return;
    try {
      await api(`/schedules/${id}`, { method: 'DELETE' });
      verHorarioCurso(cursoSeleccionado);
      showToast('Bloque eliminado', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const seleccionarParaEditar = (h) => {
    setEditandoId(h.id);
    setForm({
      asignaturaId: h.asignaturaId.toString(),
      docenteId: h.docenteId.toString(),
      diaSemana: h.diaSemana,
      horaInicio: h.horaInicio.substring(0, 5),
      horaFin: h.horaFin.substring(0, 5),
      sala: h.sala || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setForm({ asignaturaId: '', docenteId: '', diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '09:30', sala: '' });
  };

  const getColor = (asignaturaId) => {
    return colores[asignaturaId % colores.length];
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Horarios de Clases</h1>

      {/* PANEL DE ADMINISTRACIÓN (SOLO ADMIN Y DIRECTOR) */}
      {esAdminODirector && (
        <div style={{ background: 'white', padding: 20, borderRadius: 10, marginBottom: 30, boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--color-primary)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--color-navy)' }}>
            {editandoId ? '✏️ Editando Bloque Horario' : '➕ Crear Nuevo Bloque'}
          </h3>
          <select onChange={e => verHorarioCurso(e.target.value)} style={{...inp, marginBottom: 15, width: '100%', maxWidth: 300}}>
            <option value="">Selecciona Curso para ver/editar...</option>
            {cursos.map(c => <option key={c.id} value={c.id}>{c.nivel} {c.letra}</option>)}
          </select>
          
          {cursoSeleccionado && (
            <form onSubmit={guardar} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', background: editandoId ? '#f0f9ff' : 'transparent', padding: editandoId ? 15 : 0, borderRadius: 8, border: editandoId ? '1px solid #bae6fd' : 'none' }}>
              <select required value={form.asignaturaId} onChange={e => setForm({...form, asignaturaId: e.target.value})} style={inp}>
                <option value="">Asignatura...</option>
                {asignaturas.map(a => <option key={a.id} value={a.id}>{a.codigo} - {a.nombre}</option>)}
              </select>
              <select required value={form.docenteId} onChange={e => setForm({...form, docenteId: e.target.value})} style={inp}>
                <option value="">Docente...</option>
                {docentes.map(d => <option key={d.id} value={d.id}>{d.nombres} {d.apellidos}</option>)}
              </select>
              <select value={form.diaSemana} onChange={e => setForm({...form, diaSemana: e.target.value})} style={inp}>
                {['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="time" required value={form.horaInicio} onChange={e => setForm({...form, horaInicio: e.target.value})} style={{...inp, width: 110}} />
              <input type="time" required value={form.horaFin} onChange={e => setForm({...form, horaFin: e.target.value})} style={{...inp, width: 110}} />
              <input placeholder="Sala (Ej: A-12)" value={form.sala} onChange={e => setForm({...form, sala: e.target.value})} style={inp} />
              
              <button type="submit" style={{...btn, background: editandoId ? '#f59e0b' : 'var(--color-primary)'}}>
                {editandoId ? 'Guardar Cambios' : 'Agregar Bloque'}
              </button>
              
              {editandoId && (
                <button type="button" onClick={limpiarFormulario} style={{...btn, background: 'gray'}}>Cancelar</button>
              )}
            </form>
          )}
        </div>
      )}

      {/* VISTA DEL CALENDARIO */}
      {horarios.length === 0 ? (
        <div style={{ background: 'white', padding: 50, borderRadius: 10, textAlign: 'center', color: 'var(--color-gray-600)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ color: 'var(--color-navy)' }}>No hay clases programadas</h2>
          <p>Selecciona un curso o pídele a la Dirección que asigne bloques.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 15 }}>
          {['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES'].map(dia => (
            <div key={dia} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h4 style={{ textAlign: 'center', margin: '0 0 5px 0', color: 'var(--color-navy)', fontSize: 16, paddingBottom: 10, borderBottom: '2px solid #e2e8f0' }}>
                {dia}
              </h4>
              
              {horarios.filter(h => h.diaSemana === dia).sort((a,b) => a.horaInicio.localeCompare(b.horaInicio)).map(h => {
                const asig = asignaturas.find(a => a.id === h.asignaturaId);
                const color = getColor(h.asignaturaId);
                
                return (
                  <div key={h.id} style={{ 
                    background: 'white', 
                    borderRadius: 8, 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
                    borderLeft: `6px solid ${color}`,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 'bold', color: color, marginBottom: 4 }}>
                        {h.horaInicio.substring(0, 5)} - {h.horaFin.substring(0, 5)}
                      </div>
                      <div style={{ fontWeight: 'bold', color: 'var(--color-navy)', fontSize: 15, marginBottom: 2 }}>
                        {asig ? asig.nombre : 'Asignatura'}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        📍 Sala: {h.sala || 'No asignada'}
                      </div>
                    </div>

                    {/* BOTONES DE ACCIÓN (SOLO VISIBLES PARA ADMIN Y DIRECTOR) */}
                    {esAdminODirector && (
                      <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9' }}>
                        <button onClick={() => seleccionarParaEditar(h)} style={{ flex: 1, padding: '8px', background: '#f8fafc', border: 'none', borderRight: '1px solid #f1f5f9', cursor: 'pointer', fontSize: 12, fontWeight: 'bold', color: '#d97706' }}>
                          Editar
                        </button>
                        <button onClick={() => eliminar(h.id)} style={{ flex: 1, padding: '8px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 'bold', color: '#dc2626' }}>
                          Borrar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
const inp = { padding: '10px', border: '1px solid #cbd5e1', borderRadius: 6, flex: 1, fontSize: 14, background: 'white' };
const btn = { padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', fontSize: 14 };