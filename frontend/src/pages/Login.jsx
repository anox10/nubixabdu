import React, { useState } from 'react';
import { useAuth, isValidGmail } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, Key, Mail, ShieldAlert, Activity, ArrowRight, UserPlus } from 'lucide-react';

export default function Login({ setActivePage }) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isValidGmail(email)) {
      setErrorMsg('Please enter a valid Gmail address (e.g. name@gmail.com). Non-Gmail domains are not accepted.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email, password);
      if (res.user.role === 'patient') setActivePage('patient-dashboard');
      else if (res.user.role === 'doctor') setActivePage('doctor-dashboard');
      else if (res.user.role === 'admin') setActivePage('admin-dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 px-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 space-y-6">
        {/* Brand Header with Green CLINORA */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-md shadow-green-600/20 mb-3">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            {t('login.signInClinora')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('login.roleAgnosticLogin')}</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Gmail Address (@gmail.com only)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            {email && !isValidGmail(email) && (
              <p className="text-[11px] text-amber-600 mt-1 font-medium">{t('login.mustEndGmail')}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              {t('login.password')}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-green-600/20 disabled:opacity-50 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? t('login.authenticating') : t('login.signIn')}</span>
          </button>
        </form>

        {/* Register CTA */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          {t('login.needAccount')}{' '}
          <button
            onClick={() => setActivePage('register')}
            className="text-green-700 font-extrabold hover:underline"
          >
            {t('login.registerHere')}
          </button>
        </div>
      </div>
    </div>
  );
}
