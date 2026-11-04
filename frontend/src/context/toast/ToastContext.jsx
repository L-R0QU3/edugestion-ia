import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-eliminar después de 3.5 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Contenedor visual de los Toasts */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            background: t.type === 'error' ? '#fee2e2' : t.type === 'info' ? '#e0f2fe' : '#dcfce7',
            color: t.type === 'error' ? '#991b1b' : t.type === 'info' ? '#075985' : '#166534',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontWeight: 'bold',
            fontSize: '14px',
            borderLeft: `4px solid ${t.type === 'error' ? '#ef4444' : t.type === 'info' ? '#0ea5e9' : '#22c55e'}`,
            animation: 'slideIn 0.3s ease-out forwards'
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}