import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageDropdown from './LanguageDropdown';
import {
  Activity,
  Calendar,
  ClipboardList,
  PlusCircle,
  Stethoscope,
  ShieldCheck,
  UserCheck,
  Building2,
  Users,
  AlertCircle,
  LogOut,
  Clock,
  LogIn
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenReportModal }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const getNavLinks = () => {
    if (!user) {
      return [
        { id: 'landing', label: t('common.home') },
        { id: 'login', label: t('common.signIn') },
        { id: 'register', label: t('common.register') },
      ];
    }

    if (user.role === 'patient') {
      return [
        { id: 'patient-dashboard', label: t('patient.dashboard'), icon: Activity },
        { id: 'patient-new-case', label: t('patient.clinicalCaseForm'), icon: PlusCircle },
        { id: 'patient-my-cases', label: t('patient.myCases'), icon: ClipboardList },
        { id: 'patient-book', label: t('patient.bookSpecialist'), icon: Calendar },
        { id: 'patient-appointments', label: t('patient.myAppointments'), icon: Clock },
      ];
    }

    if (user.role === 'doctor') {
      return [
        { id: 'doctor-dashboard', label: t('doctor.appointmentsQueue'), icon: Calendar },
        { id: 'doctor-availability', label: t('doctor.myAvailability'), icon: Clock },
        { id: 'doctor-profile', label: t('doctor.doctorProfile'), icon: Stethoscope },
      ];
    }

    if (user.role === 'admin') {
      return [
        { id: 'admin-dashboard', label: t('admin.analyticsOverview'), icon: Activity },
        { id: 'admin-approvals', label: t('admin.doctorApprovals'), icon: UserCheck },
        { id: 'admin-specializations', label: t('admin.departments'), icon: Building2 },
        { id: 'admin-appointments', label: t('admin.masterAppointments'), icon: Calendar },
        { id: 'admin-users', label: t('admin.userDirectory'), icon: Users },
        { id: 'admin-reports', label: t('admin.issueReports'), icon: AlertCircle },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  const roleColorBadges = {
    patient: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    doctor: 'bg-blue-100 text-blue-800 border-blue-200',
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand - Name "CLINORA" is strictly in GREEN */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (user?.role === 'patient') setActivePage('patient-dashboard');
                else if (user?.role === 'doctor') setActivePage('doctor-dashboard');
                else if (user?.role === 'admin') setActivePage('admin-dashboard');
                else setActivePage('landing');
              }}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-green-600/20 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-green-600 block leading-none">
                  {t('common.clinora')}
                </span>
                <span className="block text-[9px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
                  {t('common.hospitalPlatform')}
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            {user && (
              <nav className="hidden lg:flex items-center gap-1 ml-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = activePage === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => setActivePage(link.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-green-50 text-green-700 shadow-xs border border-green-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-slate-400'}`} />}
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <LanguageDropdown />

                <button
                  onClick={onOpenReportModal}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors"
                  title="Report hospital issue / feedback"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('common.feedback')}</span>
                </button>

                <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                          roleColorBadges[user.role] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t(`roles.${user.role}`)}
                      </span>
                      {user.role === 'doctor' && (
                        <span
                          className={`text-[10px] px-1 rounded font-semibold ${
                            user.is_approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {user.is_approved ? t('roles.approved') : t('roles.pending')}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <LanguageDropdown />

                <button
                  onClick={() => setActivePage('login')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'login'
                      ? 'bg-green-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t('common.signIn')}
                </button>
                <button
                  onClick={() => setActivePage('register')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'register'
                      ? 'bg-green-700 text-white shadow-sm'
                      : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                  }`}
                >
                  {t('common.register')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        {user && (
          <div className="lg:hidden flex items-center gap-1.5 py-2 overflow-x-auto border-t border-slate-100 scrollbar-none">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActivePage(link.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-green-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
