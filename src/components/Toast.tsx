import { useEffect, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Alert } from '../services/mockData';

interface ToastProps {
  alert: Alert;
  onClose: () => void;
}

export const Toast = ({ alert, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getSeverityColor = () => {
    switch (alert.severity) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-orange-600';
      default:
        return 'bg-yellow-600';
    }
  };

  return (
    <div
      className={`${getSeverityColor()} text-white rounded-xl shadow-2xl p-4 min-w-[300px] max-w-md transition-all transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold mb-1">New Alert: {alert.attackType}</h4>
          <p className="text-sm opacity-90">{alert.deviceName}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer = ({ alerts }: { alerts: Alert[] }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {alerts.map((alert) => (
        <Toast key={alert.id} alert={alert} onClose={() => {}} />
      ))}
    </div>
  );
};
