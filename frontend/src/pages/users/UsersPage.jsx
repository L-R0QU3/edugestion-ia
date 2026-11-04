import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/toast/ToastContext';
import Modal from '../../components/Modal';

export default function UsersPage() {
  const { showToast } = useToast();
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ rut: '', nombres: '', apellidos: '', email: '', rol: 'PROFESOR_ASIGNATURA' });

  const cargar = () => api('/users').then(setUsuarios).catch((err) => showToast(err.message, 'error'));
  useEffect(() => { cargar(); }, []);

  const calcularDv = (cuerpo) => {
    let suma = 0; let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) { suma += parseInt(cuerpo[i]) * multiplicador; multiplicador = multiplicador === 7 ? 2 : multiplicador + 1; }
    const dv = 11 - (suma % 11); return dv === 11 ? '0' : dv === 10 ? 'K' : dv.toString();
  };

  const handleRutChange = (e) => {
    let raw = e.target.value.toUpperCase().replace(/[^0-9K]/g, '');
    if (raw.length > 9) raw = raw.slice(0, 9);
    let cuerpo = raw.slice(0, 8); let dv = raw.length > 8 ? raw.slice(8) : '';
    let cuerpoFormateado = '';
    let contador = 0;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      cuerpoFormateado = cuerpo[i] + cuerpoFormateado; contador++;
      if (contador % 3 === 0 && i !== 0) cuerpoFormateado = '.' + cuerpoFormateado;
    }
    setForm({ ...form, rut: dv ? `${cuerpoFormateado}-${dv}` : cuerpoFormateado });
  };

  const handleRutBlur = () => {
    if (!form.rut) return;
    let partes = form.rut.replace(/\./g, '').split('-');
    if (!partes[1] && partes[0].length >= 7) setForm({ ...form, rut: `${form.rut}-${calcularDv(partes[0])}` });
  };

  const validarRutCompleto = (rut) => {
    if (!rut || !rut.includes('-')) return false;
    const partes = rut.replace(/\./g, '').split('-');
    return partes[0].length >= 7 && partes[0].length <= 8 && calcularDv(partes[0]) === partes[1].toUpperCase();
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!validarRutCompleto(form.rut)) return showToast('RUT inválido.', 'error');

    try {
      if (editandoId) {
        await api(`/users/${editandoId}`, { method: 'PUT', body: JSON.stringify(form) });
        showToast('Funcionario actualizado', 'success');
      } else {
        await api('/users', { method: 'POST', body: JSON.stringify(form) });
        showToast('Funcionario registrado exitosamente', 'success');
      }
      setForm({ rut: '', nombres: '', apellidos: '', email: '', rol: 'PROFESOR_ASIGNATURA' });
      setEditandoId(null);
      cargar(); setIsModalOpen(false);
    } catch (err) { showToast(err.message, 'error'); }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar a este funcionario del sistema?')) return;
    try {
      await api(`/users/${id}`, { method: 'DELETE' });
      showToast('Funcionario eliminado', 'success');
      cargar();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const abrirEditar = (u) => {
    setForm({ rut: u.rut, nombres: u.nombres, apellidos: u.apellidos, email: u.email, rol: u.rol });
    setEditandoId(u.id);
    setIsModalOpen(true);
  };

  const funcionarios = usuarios.filter(u => u.rol !== 'ESTUDIANTE' && u.rol !== 'APODERADO');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--color-navy)', margin: 0 }}>Funcionarios del Colegio</h1>
          <p style={{ color: 'var(--color-gray-600)', marginTop: 5 }}>Gestión de Directivos, Docentes y Administrativos.</p>
        </div>
        <button onClick={() => { setForm({ rut: '', nombres: '', apellidos: '', email: '', rol: 'PROFESOR_ASIGNATURA' }); setEditandoId(null); setIsModalOpen(true); }} style={btnPrimary}>+ Nuevo Funcionario</button>
      </div>

      <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse', borderRadius: 8, boxShadow: 'var(--shadow-sm)', marginTop: 20 }}>
        <thead>
          <tr style={{ background: 'var(--color-gray-100)', textAlign: 'left' }}>
            <th style={th}>Nombre</th><th style={th}>RUT</th><th style={th}>Email</th><th style={th}>Cargo</th><th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={td}>{u.nombres} {u.apellidos}</td>
              <td style={td}>{u.rut}</td>
              <td style={td}>{u.email}</td>
              <td style={td}><span style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 'bold' }}>{u.rol.replace(/_/g, ' ')}</span></td>
              <td style={td}>
                <button onClick={() => abrirEditar(u)} style={{...btnSmall, color: '#d97706', background: '#fef3c7'}}>Editar</button>
                <button onClick={() => eliminar(u.id)} style={{...btnSmall, color: '#dc2626', background: '#fee2e2'}}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editandoId ? "Editar Funcionario" : "Registrar Nuevo Funcionario"}>
        <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <input placeholder="RUT" required value={form.rut} onChange={handleRutChange} onBlur={handleRutBlur} style={inp} />
          <input placeholder="Nombres" required value={form.nombres} onChange={e => setForm({...form, nombres: e.target.value})} style={inp} />
          <input placeholder="Apellidos" required value={form.apellidos} onChange={e => setForm({...form, apellidos: e.target.value})} style={inp} />
          <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inp} />
          
          <select value={form.rol} onChange={e => setForm({...form, rol: e.target.value})} style={inp}>
            <optgroup label="Directivos y Administración">
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="DIRECTOR">Director</option>
              <option value="JEFE_UTP">Jefe de UTP</option>
              <option value="COORDINADOR">Coordinador Académico</option>
              <option value="SECRETARIA">Secretaría</option>
            </optgroup>
            <optgroup label="Docencia">
              <option value="PROFESOR_JEFE">Profesor Jefe</option>
              <option value="PROFESOR_ASIGNATURA">Profesor de Asignatura</option>
            </optgroup>
            <optgroup label="Apoyo Escolar">
              <option value="CONVIVENCIA">Encargado de Convivencia</option>
              <option value="PSICOLOGO">Psicólogo</option>
              <option value="BIBLIOTECARIO">Bibliotecario</option>
            </optgroup>
          </select>
          
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{...btnSecondary, flex: 1}}>Cancelar</button>
            <button type="submit" style={{...btnPrimary, flex: 1}}>Guardar</button>
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