import React from 'react';
import { Activity, ShieldCheck, Stethoscope, Calendar, FileText, CreditCard, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Landing({ setActivePage }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-900 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-500/30">
            <Activity className="w-4 h-4 text-green-400" />
            <span>{t('landing.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {t('landing.heroTitle')}{' '}
            <span className="text-green-400 underline decoration-green-500/40">{t('common.clinora')}</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {t('landing.heroDescription')}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActivePage('login')}
              className="flex items-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-green-600/30 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('landing.signInPortal')}</span>
            </button>

            <button
              onClick={() => setActivePage('register')}
              className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all backdrop-blur-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('landing.createAccount')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4 hover:border-green-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">{t('landing.structuredIntakeTitle')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('landing.structuredIntakeDesc')}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4 hover:border-green-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">{t('landing.flexiblePaymentTitle')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('landing.flexiblePaymentDesc')}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4 hover:border-green-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">{t('landing.secureRolesTitle')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('landing.secureRolesDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}
