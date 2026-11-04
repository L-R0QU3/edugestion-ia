import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/toast/ToastContext';

export default function CoexistencePage() {
  const { showToast } = useToast();
  const [casos, setCasos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  
  const [form, setForm] = useState({ categoria: 'CONFLICTO', descripcion: '' });
  const [editando, setEditando] = useState(null);
  const [acciones, setAcciones] = useState('');

  const cargarDatos = async () => {
    try {
      const [resCasos, resEst] = await Promise.all([
        api('/coexistence'),
        api('/users?rol=ESTUDIANTE')
      ]);
      setCasos(resCasos);
      setEstudiantes(resEst);
    } catch (e) { showToast(e.message, 'error'); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await api('/coexistence', { method: 'POST', body: JSON.stringify({ ...form, estudianteId: e.target.estudiante.value }) });
      setForm({ categoria: 'CONFLICTO', descripcion: '' });
      e.target.reset();
      cargarDatos();
      showToast('Caso registrado', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await api(`/coexistence/${id}`, { method: 'PUT', body: JSON.stringify({ estado: nuevoEstado, accionesTomadas: acciones }) });
      setEditando(null);
      setAcciones('');
      cargarDatos();
      showToast('Caso actualizado', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Convivencia Escolar</h1>
      <p style={{ color: 'var(--color-gray-600)' }}>Módulo confidencial para el seguimiento de casos.</p>

      <form onSubmit={guardar} style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 20, marginTop: 20, boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginTop: 0 }}>Registrar Nuevo Caso</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <select name="estudiante" required style={inp}>
            <option value="">Estudiante involucrado...</option>
            {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>)}
          </select>
          <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} style={inp}>
            <option value="CONFLICTO">Conflicto entre pares</option>
            <option value="BULLYING">Acoso / Bullying</option>
            <option value="RENDIMIENTO">Problema de rendimiento</option>
            <option value="FAMILIA">Intervención familiar</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
        <textarea placeholder="Descripción detallada del caso..." required value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} style={{...inp, width: '100%', height: 80, marginBottom: 10, resize: 'none'}} />
        <button type="submit" style={btn}>Registrar Caso</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {casos.map(c => {
          const alumno = estudiantes.find(e => e.id === c.estudianteId);
          return (
            <div key={c.id} style={{ background: 'white', padding: 20, borderRadius: 8, borderLeft: `4px solid ${c.estado === 'CERRADO' ? 'green' : c.estado === 'EN_SEGUIMIENTO' ? 'orange' : 'red'}`, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--color-navy)' }}>{c.categoria}</h3>
                  <span style={{ fontSize: 13, color: '#666' }}>Involucrado: <b>{alumno ? `${alumno.nombres} ${alumno.apellidos}` : 'Desconocido'}</b> | Fecha: {new Date(c.fechaRegistro).toLocaleDateString()}</span>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 'bold', background: '#e2e8f0' }}>{c.estado}</span>
              </div>
              
              <p style={{ background: '#f8fafc', padding: 10, borderRadius: 4, fontSize: 14 }}>{c.descripcion}</p>
              
              {c.accionesTomadas && (
                <div style={{ marginTop: 10, fontSize: 14 }}>
                  <b>Acciones tomadas:</b> {c.accionesTomadas}
                </div>
              )}

              {editando === c.id ? (
                <div style={{ marginTop: 15, padding: 15, background: '#f1f5f9', borderRadius: 6 }}>
                  <textarea placeholder="Escribe las acciones o resoluciones tomadas..." value={acciones} onChange={e => setAcciones(e.target.value)} style={{...inp, width: '100%', height: 60, marginBottom: 10}} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => actualizarEstado(c.id, 'EN_SEGUIMIENTO')} style={{...btn, background: 'orange'}}>En Seguimiento</button>
                    <button onClick={() => actualizarEstado(c.id, 'CERRADO')} style={{...btn, background: 'green'}}>Cerrar Caso</button>
                    <button onClick={() => setEditando(null)} style={{...btn, background: 'gray'}}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setEditando(c.id)} style={{...btn, marginTop: 15, background: 'var(--color-navy)'}}>Actualizar / Dar Seguimiento</button>
              )}
            </div>
          );
        })}
        {casos.length === 0 && <p>No hay casos de convivencia registrados.</p>}
      </div>
    </div>
  );
}
const inp = { padding: '10px', border: '1px solid #ccc', borderRadius: 4, flex: 1 };
const btn = { padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' };