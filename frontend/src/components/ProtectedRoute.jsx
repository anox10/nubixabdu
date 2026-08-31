import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Clock, RefreshCw, LogOut, CheckCircle2 } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles, children, setActivePage }) {
  const { user, loading, refreshUser, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-green-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Connecting to CLINORA session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl shadow-sm border border-slate-200 text-center animate-fade-in">
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-700">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Authentication Required</h3>
        <p className="text-xs text-slate-600 mb-6">
          Please sign in with your registered Gmail account to access this clinical portal.
        </p>
        <button
          onClick={() => setActivePage('login')}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  // Doctor pending approval gate
  if (user.role === 'doctor' && user.is_approved === false) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-md border border-amber-200 animate-fade-in">
        <div className="flex items-center gap-4 mb-5">
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-700">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              Registration Under Review
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">Doctor Verification Pending</h2>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          Hello <strong>{user.name}</strong>, your doctor application has been submitted to CLINORA administration.
          Before clinical case records and appointment queues can be accessed, credentials must be verified by the hospital administrator.
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={refreshUser}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Check Approval Status</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  // Role gate
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl shadow-sm border border-rose-200 text-center">
        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-700">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Access Restricted</h3>
        <p className="text-xs text-slate-600 mb-6">
          This portal requires role [<strong>{allowedRoles.join(', ')}</strong>]. Your active role is [<strong>{user.role}</strong>].
        </p>
        <button
          onClick={() => {
            if (user.role === 'patient') setActivePage('patient-dashboard');
            else if (user.role === 'doctor') setActivePage('doctor-dashboard');
            else if (user.role === 'admin') setActivePage('admin-dashboard');
          }}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors"
        >
          Return to My Dashboard
        </button>
      </div>
    );
  }

  return children;
}
