import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ rut: '', nombres: '', apellidos: '', email: '', rol: 'ESTUDIANTE' });

  const cargar = () => api('/users').then(setUsuarios).catch(console.error);
  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await api('/users', { method: 'POST', body: JSON.stringify(form) });
      setForm({ rut: '', nombres: '', apellidos: '', email: '', rol: 'ESTUDIANTE' });
      cargar();
    } catch (err) { alert(err.message); }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Usuarios</h1>
      
      <div style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 24 }}>
        <h3>Crear Usuario</h3>
        <form onSubmit={guardar} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input placeholder="RUT" required value={form.rut} onChange={e => setForm({...form, rut: e.target.value})} style={inp} />
          <input placeholder="Nombres" required value={form.nombres} onChange={e => setForm({...form, nombres: e.target.value})} style={inp} />
          <input placeholder="Apellidos" required value={form.apellidos} onChange={e => setForm({...form, apellidos: e.target.value})} style={inp} />
          <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inp} />
          <select value={form.rol} onChange={e => setForm({...form, rol: e.target.value})} style={inp}>
            <option value="ESTUDIANTE">Estudiante</option>
            <option value="DOCENTE">Docente</option>
            <option value="APODERADO">Apoderado</option>
            <option value="BIBLIOTECARIO">Bibliotecario</option>
          </select>
          <button type="submit" style={btn}>Crear (Pass: EduGestion2026!)</button>
        </form>
      </div>

      <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse', borderRadius: 8 }}>
        <thead>
          <tr style={{ background: 'var(--color-gray-100)', textAlign: 'left' }}>
            <th style={th}>Nombre</th><th style={th}>RUT</th><th style={th}>Email</th><th style={th}>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={td}>{u.nombres} {u.apellidos}</td>
              <td style={td}>{u.rut}</td>
              <td style={td}>{u.email}</td>
              <td style={td}><b>{u.rol}</b></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const inp = { padding: '8px', border: '1px solid #ccc', borderRadius: 4 };
const btn = { padding: '8px 16px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' };
const th = { padding: 12, color: 'var(--color-gray-600)', fontSize: 14 };
const td = { padding: 12, fontSize: 14 };