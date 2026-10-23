import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        let bgStyle = 'bg-slate-900 text-white dark:bg-slate-800 border-slate-700';
        let Icon = Info;
        let iconColor = 'text-blue-400';

        if (toast.type === 'success') {
          bgStyle = 'bg-emerald-950 text-emerald-50 border-emerald-700/60 shadow-emerald-950/20';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'error' || toast.type === 'warning') {
          bgStyle = 'bg-rose-950 text-rose-50 border-rose-700/60 shadow-rose-950/20';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md animate-slide-up transition-all ${bgStyle}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-sm">
              <h4 className="font-semibold">{toast.title}</h4>
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
