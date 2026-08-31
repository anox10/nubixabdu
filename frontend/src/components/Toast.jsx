import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Toast() {
  const { toast, setToast } = useAuth();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    error: 'bg-rose-50 border-rose-300 text-rose-900',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
    info: 'bg-blue-50 border-blue-300 text-blue-900',
  }[toast.type || 'info'];

  const IconComponent = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }[toast.type || 'info'];

  const iconColors = {
    success: 'text-emerald-600',
    error: 'text-rose-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  }[toast.type || 'info'];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg max-w-md ${bgStyles}`}>
        <IconComponent className={`w-5 h-5 flex-shrink-0 ${iconColors}`} />
        <p className="text-sm font-medium leading-snug">{toast.message}</p>
        <button
          onClick={() => setToast(null)}
          className="ml-auto p-1 rounded-md hover:bg-black/5 text-slate-500 hover:text-slate-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
