import React, { useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    setToast({ message, type });
    if (duration > 0) {
      setTimeout(() => {
        setToast((current) => (current?.message === message ? null : current));
      }, duration);
    }
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
};

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  const bgColor = isError ? '#ef4444' : (isInfo ? '#3b82f6' : '#10b981');
  const Icon = isError ? AlertCircle : (isInfo ? Info : CheckCircle2);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: bgColor,
        color: '#ffffff',
        padding: '12px 18px',
        borderRadius: '8px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 99999,
        fontSize: '13px',
        fontWeight: '600',
        animation: 'slideInRight 0.25s ease-out'
      }}
    >
      <Icon size={18} />
      <span style={{ maxWidth: '320px' }}>{toast.message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.8)',
            cursor: 'pointer',
            padding: 0,
            marginLeft: '6px',
            display: 'flex'
          }}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default Toast;
