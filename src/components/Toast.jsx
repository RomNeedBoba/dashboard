import React, { useEffect } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import '../theme/components/Toast.css';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <Check className="toast-icon" />,
    error: <X className="toast-icon" />,
    warning: <AlertCircle className="toast-icon" />,
    info: <Info className="toast-icon" />
  };

  return (
    <div className={`toast toast-${type}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};

export default Toast;