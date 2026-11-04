import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/toast/ToastContext';
import Modal from '../../components/Modal';

export default function SupportPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ asunto: '', descripcion: '' });

  const [editando, setEditando] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [estadoNuevo, setEstadoNuevo] = useState('CERRADO');

  const esAdmin = ['ADMINISTRADOR', 'DIRECTOR', 'JEFE_UTP', 'SECRETARIA'].includes(user?.rol);

  const cargarDatos = async () => {
    try {
      if (esAdmin) {
        const res = await api('/support/todos');
        setTickets(res);
      } else {
        const res = await api('/support/mis-tickets');
        setTickets(res);
      }
    } catch (e) { showToast(e.message, 'error'); }
  };

  useEffect(() => { cargarDatos(); }, [user]);

  const crearTicket = async (e) => {
    e.preventDefault();
    try {
      await api('/support', { method: 'POST', body: JSON.stringify(form) });
      setForm({ asunto: '', descripcion: '' });
      setIsModalOpen(false);
      cargarDatos();
      showToast('Ticket enviado a soporte', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const responderTicket = async (e) => {
    e.preventDefault();
    try {
      await api(`/support/${editando.id}/responder`, {
        method: 'PUT',
        body: JSON.stringify({ respuestaAdmin: respuesta, estado: estadoNuevo })
      });
      setEditando(null);
      setRespuesta('');
      cargarDatos();
      showToast('Ticket actualizado', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const getEstadoColor = (estado) => {
    if (estado === 'ABIERTO') return 'red';
    if (estado === 'EN_PROCESO') return 'orange';
    return 'green';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--color-navy)', margin: 0 }}>Mesa de Ayuda</h1>
          <p style={{ color: 'var(--color-gray-600)', marginTop: 5 }}>Soporte técnico para la plataforma.</p>
        </div>
        {!esAdmin && (
          <button onClick={() => setIsModalOpen(true)} style={btnPrimary}>+ Crear Ticket</button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 20 }}>
        {tickets.map(t => (
          <div key={t.id} style={{ background: 'white', padding: 20, borderRadius: 8, borderLeft: `4px solid ${getEstadoColor(t.estado)}`, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <h3 style={{ margin: 0, color: 'var(--color-navy)' }}>{t.asunto}</h3>
              <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 'bold', background: '#f1f5f9' }}>{t.estado}</span>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: 14 }}>{t.descripcion}</p>
            
            {t.respuestaAdmin && (
              <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, fontSize: 13, borderLeft: '3px solid var(--color-primary)' }}>
                <b>Respuesta de Soporte:</b> {t.respuestaAdmin}
              </div>
            )}

            {esAdmin && t.estado !== 'CERRADO' && (
              <div style={{ marginTop: 15 }}>
                {editando?.id === t.id ? (
                  <form onSubmit={responderTicket} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <textarea placeholder="Escribe la respuesta..." required value={respuesta} onChange={e => setRespuesta(e.target.value)} style={{...inp, height: 60, resize: 'none'}} />
                    <div style={{ display: 'flex', gap: 10 }}>
                      <select value={estadoNuevo} onChange={e => setEstadoNuevo(e.target.value)} style={inp}>
                        <option value="EN_PROCESO">En Proceso</option>
                        <option value="CERRADO">Cerrar Ticket</option>
                      </select>
                      <button type="submit" style={{...btnPrimary, padding: '5px 15px'}}>Guardar</button>
                      <button type="button" onClick={() => setEditando(null)} style={{...btnSecondary, padding: '5px 15px'}}>Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => { setEditando(t); setRespuesta(t.respuestaAdmin || ''); }} style={btnSecondary}>Responder / Cerrar</button>
                )}
              </div>
            )}
          </div>
        ))}
        {tickets.length === 0 && <p>No hay tickets creados.</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Ticket">
        <form onSubmit={crearTicket} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <input placeholder="Asunto (Ej: No puedo subir notas)" required value={form.asunto} onChange={e => setForm({...form, asunto: e.target.value})} style={inp} />
          <textarea placeholder="Describe tu problema con detalle..." required value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} style={{...inp, height: 100, resize: 'none'}} />
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{...btnSecondary, flex: 1}}>Cancelar</button>
            <button type="submit" style={{...btnPrimary, flex: 1}}>Enviar Ticket</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
const inp = { padding: '12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14 };
const btnPrimary = { padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' };
const btnSecondary = { padding: '10px 20px', background: '#e2e8f0', color: '#333', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' };