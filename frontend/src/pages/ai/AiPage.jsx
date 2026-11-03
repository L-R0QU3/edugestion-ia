import { useState } from 'react';
import { api } from '../../api/client';

export default function AiPage() {
  const [tema, setTema] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const generar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    try {
      const res = await api('/ai/evaluaciones', {
        method: 'POST',
        body: JSON.stringify({ tema })
      });
      setResultado(res);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Asistente de IA Académico</h1>
      <p style={{ color: 'var(--color-gray-600)' }}>Genera evaluaciones automáticamente con Inteligencia Artificial.</p>

      <form onSubmit={generar} style={{ background: 'white', padding: 20, borderRadius: 8, marginTop: 20, display: 'flex', gap: 10 }}>
        <input 
          placeholder="¿Qué tema quieres evaluar? (Ej: Las Fracciones)" 
          required 
          value={tema} 
          onChange={e => setTema(e.target.value)} 
          style={{ padding: 10, border: '1px solid #ccc', borderRadius: 4, flex: 1 }} 
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {loading ? 'Generando con IA...' : 'Generar Evaluación'}
        </button>
      </form>

      {resultado && (
        <div style={{ background: 'white', padding: 20, borderRadius: 8, marginTop: 20, borderLeft: '4px solid var(--color-primary)' }}>
          <h2 style={{ marginTop: 0, color: 'var(--color-navy)' }}>{resultado.titulo}</h2>
          <p><b>Tema:</b> {resultado.tema}</p>
          <h3>Preguntas Generadas:</h3>
          <ol>
            {resultado.preguntas.map(p => (
              <li key={p.id} style={{ marginBottom: 10 }}>
                {p.enunciado} <i>({p.tipo})</i>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}