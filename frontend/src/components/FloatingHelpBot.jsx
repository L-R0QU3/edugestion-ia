import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FloatingHelpBot() {
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();

  return (
    <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 9999 }}>
      {/* Ventana del Chat */}
      {isOpen && (
        <div style={{
          width: 300, background: 'white', borderRadius: 12, boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
          marginBottom: 15, overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}>
          {/* Encabezado */}
          <div style={{ background: 'var(--color-navy)', color: 'white', padding: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold' }}>🤖 Asistente Virtual</div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: 16 }}>✖</button>
          </div>

          {/* Cuerpo */}
          <div style={{ padding: 15, backgroundColor: '#f8fafc', height: 250, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'white', padding: 10, borderRadius: 8, borderBottomLeftRadius: 0, fontSize: 13, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              ¡Hola! 👋 Soy tu asistente. ¿En qué te puedo ayudar hoy?
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
              <button onClick={() => alert("Para ver tus notas, dirígete al menú lateral y haz clic en 'Mis Notas'.")} style={btnPregunta}>📚 ¿Cómo veo mis notas?</button>
              <button onClick={() => alert("Los profesores pueden pasar lista en la pestaña 'Pasar Lista'.")} style={btnPregunta}>📝 ¿Cómo paso asistencia?</button>
              <button onClick={() => alert("Para sacar un libro, dirígete a la Biblioteca y pídeselo al bibliotecario.")} style={btnPregunta}>📖 ¿Cómo pido un libro?</button>
            </div>
          </div>

          {/* Footer (Ir a Tickets) */}
          <div style={{ padding: 10, background: 'white', borderTop: '1px solid #eee' }}>
            <button 
              onClick={() => { setIsOpen(false); nav('/support'); }} 
              style={{ width: '100%', padding: 10, background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', fontSize: 13 }}
            >
              🎫 Crear un Ticket a Soporte
            </button>
          </div>
        </div>
      )}

      {/* Botón Flotante Redondo */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 60, height: 60, borderRadius: '50%', background: 'var(--color-primary)', color: 'white',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(29, 78, 216, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          transition: 'transform 0.2s', transform: isOpen ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        {isOpen ? '✖' : '💬'}
      </button>
    </div>
  );
}

const btnPregunta = { 
  textAlign: 'left', padding: '8px 12px', background: '#e0f2fe', color: '#0284c7', 
  border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 'bold' 
};