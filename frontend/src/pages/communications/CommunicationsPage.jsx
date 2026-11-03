import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function CommunicationsPage() {
  const { user } = useAuth();
  const [comunicados, setComunicados] = useState([]);
  
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [destinatario, setDestinatario] = useState('TODOS');

  const cargar = () => api('/comunicados').then(setComunicados).catch(console.error);

  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await api('/comunicados', { method: 'POST', body: JSON.stringify({ titulo, contenido, destinatario }) });
      setTitulo(''); setContenido(''); setDestinatario('TODOS');
      cargar();
      alert('Comunicado publicado');
    } catch (err) { alert(err.message); }
  };

  const puedeCrear = user?.rol === 'DIRECCION' || user?.rol === 'DOCENTE';

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Comunicaciones Institucionales</h1>
      
      {puedeCrear && (
        <form onSubmit={guardar} style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0 }}>Nuevo Comunicado</h3>
          <input placeholder="Título del comunicado" required value={titulo} onChange={e => setTitulo(e.target.value)} style={{...inp, width: '100%', marginBottom: 10}} />
          <textarea placeholder="Escribe el mensaje aquí..." required value={contenido} onChange={e => setContenido(e.target.value)} style={{...inp, width: '100%', height: 100, marginBottom: 10, resize: 'none'}} />
          
            <div style={{ display: 'flex', gap: 10 }}>
            <select value={destinatario} onChange={e => setDestinatario(e.target.value)} style={inp}>
              <option value="TODOS">Para todos</option>
              <option value="ESTUDIANTE">Solo Estudiantes</option>
              <option value="APODERADO">Solo Apoderados</option>
              <option value="DOCENTE">Solo Docentes</option>
            </select>
            <button type="submit" style={btn}>Publicar Comunicado</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {comunicados.map(c => (
          <div key={c.id} style={{ background: 'white', padding: 20, borderRadius: 8, borderLeft: '4px solid var(--color-primary)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <h3 style={{ margin: 0, color: 'var(--color-navy)' }}>{c.titulo}</h3>
              <span style={{ fontSize: 12, color: '#666' }}>{new Date(c.fecha).toLocaleDateString()}</span>
            </div>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#333', lineHeight: 1.5 }}>{c.contenido}</p>
            <div style={{ marginTop: 15, fontSize: 12, color: '#888' }}>
              Dirigido a: <b>{c.destinatario}</b>
            </div>
          </div>
        ))}
        {comunicados.length === 0 && <p>No hay comunicados publicados.</p>}
      </div>
    </div>
  );
}
const inp = { padding: '10px', border: '1px solid #ccc', borderRadius: 4 };
const btn = { padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' };