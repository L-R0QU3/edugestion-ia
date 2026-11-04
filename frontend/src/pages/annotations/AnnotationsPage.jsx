import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/toast/ToastContext';

export default function AnnotationsPage() {
  const { showToast } = useToast();
  const [estudiantes, setEstudiantes] = useState([]);
  const [seleccionado, setSeleccionado] = useState('');
  const [anotaciones, setAnotaciones] = useState([]);
  
  const [tipo, setTipo] = useState('POSITIVA');
  const [descripcion, setDescripcion] = useState('');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    api('/users?rol=ESTUDIANTE').then(setEstudiantes).catch((err) => showToast(err.message, 'error'));
  }, []);

  const cargarAnotaciones = async (id) => {
    setSeleccionado(id);
    if (!id) return;
    const res = await api(`/annotations/estudiante/${id}`);
    setAnotaciones(res);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await api('/annotations', {
        method: 'POST',
        body: JSON.stringify({ estudianteId: seleccionado, tipo, descripcion, visibleApoderado: visible })
      });
      setDescripcion('');
      cargarAnotaciones(seleccionado);
      showToast('Anotación guardada', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Libro de Anotaciones</h1>
      
      <select onChange={e => cargarAnotaciones(e.target.value)} style={{...inp, width: '100%', maxWidth: 400, marginBottom: 20}}>
        <option value="">Selecciona un Estudiante...</option>
        {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>)}
      </select>

      {seleccionado && (
        <>
          <form onSubmit={guardar} style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ marginTop: 0 }}>Nueva Anotación</h3>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
              <select value={tipo} onChange={e => setTipo(e.target.value)} style={inp}>
                <option value="POSITIVA">Positiva</option>
                <option value="NEGATIVA">Negativa</option>
                <option value="NEUTRA">Neutra</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14 }}>
                <input type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)} />
                Visible para Apoderado
              </label>
            </div>
            <textarea 
              placeholder="Describe la situación..." required value={descripcion} onChange={e => setDescripcion(e.target.value)} 
              style={{...inp, width: '100%', height: 80, marginBottom: 10, resize: 'none'}} 
            />
            <button type="submit" style={btn}>Guardar Anotación</button>
          </form>

          <h3>Historial de {estudiantes.find(e => e.id === parseInt(seleccionado))?.nombres}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {anotaciones.map(a => (
              <div key={a.id} style={{ background: 'white', padding: 15, borderRadius: 8, borderLeft: `4px solid ${a.tipo === 'POSITIVA' ? 'green' : a.tipo === 'NEGATIVA' ? 'red' : 'gray'}`, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 5 }}>
                  <b>{a.tipo}</b>
                  <span>{new Date(a.fecha).toLocaleDateString()}</span>
                </div>
                <p style={{ margin: 0 }}>{a.descripcion}</p>
              </div>
            ))}
            {anotaciones.length === 0 && <p>No hay anotaciones para este alumno.</p>}
          </div>
        </>
      )}
    </div>
  );
}
const inp = { padding: '10px', border: '1px solid #ccc', borderRadius: 4 };
const btn = { padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' };