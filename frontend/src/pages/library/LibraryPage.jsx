import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/toast/ToastContext';

export default function LibraryPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [vista, setVista] = useState('libros');
  
  const [libros, setLibros] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  
  const [formLibro, setFormLibro] = useState({ titulo: '', autor: '', isbn: '', anio: '2024', categoria: 'General', ejemplaresTotales: 1 });
  const [prestarId, setPrestarId] = useState(null);
  const [estudianteId, setEstudianteId] = useState('');

  const cargarDatos = async () => {
    try {
      const [resLibros, resPrestamos, resEst] = await Promise.all([
        api('/library/libros'),
        api('/library/prestamos'),
        api('/users?rol=ESTUDIANTE')
      ]);
      setLibros(resLibros);
      setPrestamos(resPrestamos);
      setEstudiantes(resEst);
    } catch (e) { showToast(e.message, 'error'); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const guardarLibro = async (e) => {
    e.preventDefault();
    try {
      await api('/library/libros', { method: 'POST', body: JSON.stringify(formLibro) });
      setFormLibro({ titulo: '', autor: '', isbn: '', anio: '2024', categoria: 'General', ejemplaresTotales: 1 });
      cargarDatos();
      showToast('Libro agregado al catálogo', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const registrarPrestamo = async (e) => {
    e.preventDefault();
    try {
      await api('/library/prestamos', { method: 'POST', body: JSON.stringify({ libroId: prestarId, usuarioId: estudianteId }) });
      setPrestarId(null); setEstudianteId('');
      cargarDatos();
      showToast('Préstamo registrado con éxito', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const devolverLibro = async (id) => {
    try {
      await api(`/library/prestamos/${id}/devolver`, { method: 'POST' });
      cargarDatos();
      showToast('Libro devuelto con éxito', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const esAdminOBiblio = user?.rol === 'DIRECCION' || user?.rol === 'BIBLIOTECARIO';

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Gestión de Biblioteca</h1>
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setVista('libros')} style={{...btnTab, background: vista === 'libros' ? 'var(--color-primary)' : 'white', color: vista === 'libros' ? 'white' : 'var(--color-navy)'}}>Catálogo de Libros</button>
        <button onClick={() => setVista('prestamos')} style={{...btnTab, background: vista === 'prestamos' ? 'var(--color-primary)' : 'white', color: vista === 'prestamos' ? 'white' : 'var(--color-navy)'}}>Préstamos Activos</button>
      </div>

      {vista === 'libros' && (
        <>
          {esAdminOBiblio && (
            <form onSubmit={guardarLibro} style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', boxShadow: 'var(--shadow-sm)' }}>
              <input placeholder="Título" required value={formLibro.titulo} onChange={e => setFormLibro({...formLibro, titulo: e.target.value})} style={inp} />
              <input placeholder="Autor" required value={formLibro.autor} onChange={e => setFormLibro({...formLibro, autor: e.target.value})} style={inp} />
              <input placeholder="ISBN" value={formLibro.isbn} onChange={e => setFormLibro({...formLibro, isbn: e.target.value})} style={inp} />
              <input type="number" placeholder="Ejemplares" required value={formLibro.ejemplaresTotales} onChange={e => setFormLibro({...formLibro, ejemplaresTotales: parseInt(e.target.value)})} style={{...inp, width: 100}} />
              <button type="submit" style={btn}>Agregar Libro</button>
            </form>
          )}

          <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse', boxShadow: 'var(--shadow-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--color-gray-100)', textAlign: 'left' }}>
                <th style={th}>Título</th><th style={th}>Autor</th><th style={th}>Disponibles</th>
                {esAdminOBiblio && <th style={th}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {libros.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}><b>{l.titulo}</b></td>
                  <td style={td}>{l.autor}</td>
                  <td style={td}><span style={{ color: 'var(--color-success)' }}>{l.ejemplaresDisponibles} / {l.ejemplaresTotales}</span></td>
                  {esAdminOBiblio && (
                    <td style={td}>
                      <button onClick={() => setPrestarId(l.id)} disabled={l.ejemplaresDisponibles <= 0} style={{...btn, padding: '6px 10px', fontSize: 12, background: l.ejemplaresDisponibles > 0 ? 'var(--color-success)' : 'gray'}}>Prestar</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vista === 'prestamos' && (
        <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse', boxShadow: 'var(--shadow-sm)' }}>
          <thead>
            <tr style={{ background: 'var(--color-gray-100)', textAlign: 'left' }}>
              <th style={th}>Libro</th><th style={th}>Alumno</th><th style={th}>Fecha Préstamo</th><th style={th}>Estado</th>
              {esAdminOBiblio && <th style={th}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {prestamos.map(p => {
              const libro = libros.find(l => l.id === p.libroId);
              const alumno = estudiantes.find(e => e.id === p.usuarioId);
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>{libro?.titulo || `ID: ${p.libroId}`}</td>
                  <td style={td}>{alumno ? `${alumno.nombres} ${alumno.apellidos}` : `ID: ${p.usuarioId}`}</td>
                  <td style={td}>{p.fechaPrestamo}</td>
                  <td style={td}><b style={{ color: p.estado === 'ACTIVO' ? 'var(--color-danger)' : 'var(--color-success)' }}>{p.estado}</b></td>
                  {esAdminOBiblio && (
                    <td style={td}>
                      {p.estado === 'ACTIVO' && (
                        <button onClick={() => devolverLibro(p.id)} style={{...btn, padding: '6px 10px', fontSize: 12}}>Devolver</button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {prestarId && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={registrarPrestamo} style={{ background: 'white', padding: 30, borderRadius: 8, width: 400 }}>
            <h3 style={{ marginTop: 0 }}>Prestar Libro</h3>
            <p>Selecciona al estudiante que llevará el libro:</p>
            <select required value={estudianteId} onChange={e => setEstudianteId(e.target.value)} style={{...inp, width: '100%', marginBottom: 15}}>
              <option value="">Estudiante...</option>
              {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setPrestarId(null)} style={{...btn, background: 'gray'}}>Cancelar</button>
              <button type="submit" style={btn}>Confirmar Préstamo</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
const inp = { padding: '8px', border: '1px solid #ccc', borderRadius: 4, flex: 1 };
const btn = { padding: '8px 16px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' };
const btnTab = { padding: '8px 16px', border: '1px solid var(--color-gray-300)', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' };
const th = { padding: 12, color: 'var(--color-gray-600)', fontSize: 14 };
const td = { padding: 12, fontSize: 14 };