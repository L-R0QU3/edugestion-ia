import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/toast/ToastContext';
import Modal from '../../components/Modal';

export default function StudentsPage() {
  const { showToast } = useToast();
  const [estudiantes, setEstudiantes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  
  const [formEstudiante, setFormEstudiante] = useState({ rut: '', nombres: '', apellidos: '', email: '' });

  const cargarDatos = async () => {
    try {
      const resEst = await api('/users?rol=ESTUDIANTE');
      setEstudiantes(resEst);
    } catch (e) { showToast(e.message, 'error'); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const calcularDv = (cuerpo) => {
    let suma = 0; let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) { suma += parseInt(cuerpo[i]) * multiplicador; multiplicador = multiplicador === 7 ? 2 : multiplicador + 1; }
    const dv = 11 - (suma % 11); return dv === 11 ? '0' : dv === 10 ? 'K' : dv.toString();
  };

  const handleRutChange = (e, setForm) => {
    let raw = e.target.value.toUpperCase().replace(/[^0-9K]/g, '');
    if (raw.length > 9) raw = raw.slice(0, 9);
    let cuerpo = raw.slice(0, 8); let dv = raw.length > 8 ? raw.slice(8) : '';
    let cuerpoFormateado = '';
    let contador = 0;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      cuerpoFormateado = cuerpo[i] + cuerpoFormateado; contador++;
      if (contador % 3 === 0 && i !== 0) cuerpoFormateado = '.' + cuerpoFormateado;
    }
    setForm(prev => ({ ...prev, rut: dv ? `${cuerpoFormateado}-${dv}` : cuerpoFormateado }));
  };

  const handleRutBlur = (form, setForm) => {
    if (!form.rut) return;
    let partes = form.rut.replace(/\./g, '').split('-');
    if (!partes[1] && partes[0].length >= 7) setForm({ ...form, rut: `${form.rut}-${calcularDv(partes[0])}` });
  };

  const guardarEstudiante = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api(`/users/${editandoId}`, { method: 'PUT', body: JSON.stringify({ ...formEstudiante, rol: 'ESTUDIANTE' }) });
        showToast('Estudiante actualizado', 'success');
      } else {
        await api('/users', { method: 'POST', body: JSON.stringify({ ...formEstudiante, rol: 'ESTUDIANTE' }) });
        showToast('Estudiante registrado exitosamente', 'success');
      }
      setIsModalOpen(false);
      setFormEstudiante({ rut: '', nombres: '', apellidos: '', email: '' });
      setEditandoId(null);
      cargarDatos();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar a este estudiante del sistema?')) return;
    try {
      await api(`/users/${id}`, { method: 'DELETE' });
      showToast('Estudiante eliminado', 'success');
      cargarDatos();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const abrirEditar = (e) => {
    setFormEstudiante({ rut: e.rut, nombres: e.nombres, apellidos: e.apellidos, email: e.email });
    setEditandoId(e.id);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--color-navy)', margin: 0 }}>Alumnos Matriculados</h1>
          <p style={{ color: 'var(--color-gray-600)', marginTop: 5 }}>Registro de estudiantes del colegio.</p>
        </div>
        <button onClick={() => { setFormEstudiante({ rut: '', nombres: '', apellidos: '', email: '' }); setEditandoId(null); setIsModalOpen(true); }} style={btnPrimary}>+ Inscribir Estudiante</button>
      </div>

      <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse', borderRadius: 8, boxShadow: 'var(--shadow-sm)', marginTop: 20 }}>
        <thead>
          <tr style={{ background: 'var(--color-gray-100)', textAlign: 'left' }}>
            <th style={th}>Nombre del Alumno</th><th style={th}>RUT</th><th style={th}>Email</th><th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map(e => (
            <tr key={e.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={td}><b>{e.nombres} {e.apellidos}</b></td>
              <td style={td}>{e.rut}</td>
              <td style={td}>{e.email}</td>
              <td style={td}>
                <button onClick={() => abrirEditar(e)} style={{...btnSmall, color: '#d97706', background: '#fef3c7'}}>Editar</button>
                <button onClick={() => eliminar(e.id)} style={{...btnSmall, color: '#dc2626', background: '#fee2e2'}}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editandoId ? "Editar Estudiante" : "Inscribir Estudiante"}>
        <form onSubmit={guardarEstudiante} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <input placeholder="RUT del Alumno" required value={formEstudiante.rut} onChange={(e) => handleRutChange(e, setFormEstudiante)} onBlur={() => handleRutBlur(formEstudiante, setFormEstudiante)} style={inp} />
          <div style={{ display: 'flex', gap: 10 }}>
            <input placeholder="Nombres" required value={formEstudiante.nombres} onChange={e => setFormEstudiante({...formEstudiante, nombres: e.target.value})} style={{...inp, flex: 1}} />
            <input placeholder="Apellidos" required value={formEstudiante.apellidos} onChange={e => setFormEstudiante({...formEstudiante, apellidos: e.target.value})} style={{...inp, flex: 1}} />
          </div>
          <input type="email" placeholder="Email del Alumno" required value={formEstudiante.email} onChange={e => setFormEstudiante({...formEstudiante, email: e.target.value})} style={inp} />

          <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{...btnSecondary, flex: 1}}>Cancelar</button>
            <button type="submit" style={{...btnPrimary, flex: 1}}>Guardar Estudiante</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
const inp = { padding: '12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14 };
const btnPrimary = { padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' };
const btnSecondary = { padding: '10px 20px', background: '#e2e8f0', color: '#333', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' };
const btnSmall = { padding: '4px 8px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', fontSize: 12, marginRight: 5 };
const th = { padding: 12, color: 'var(--color-gray-600)', fontSize: 14 };
const td = { padding: 12, fontSize: 14 };