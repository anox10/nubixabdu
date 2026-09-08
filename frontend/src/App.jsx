import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import ReportIssueModal from './components/ReportIssueModal';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PrakritiTest from './pages/PrakritiTest';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import NewCase from './pages/patient/NewCase';
import MyCases from './pages/patient/MyCases';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorAvailability from './pages/doctor/DoctorAvailability';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorApprovals from './pages/admin/DoctorApprovals';
import SpecializationManager from './pages/admin/SpecializationManager';
import AllAppointments from './pages/admin/AllAppointments';
import UserManagement from './pages/admin/UserManagement';
import ReportedIssues from './pages/admin/ReportedIssues';

function MainContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activePage, setActivePage] = useState('landing');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Sync active view when user logs in or logs out
  useEffect(() => {
    if (user) {
      if (user.role === 'patient') {
        if (!activePage.startsWith('patient-')) setActivePage('patient-dashboard');
      } else if (user.role === 'doctor') {
        if (!activePage.startsWith('doctor-')) setActivePage('doctor-dashboard');
      } else if (user.role === 'admin') {
        if (!activePage.startsWith('admin-')) setActivePage('admin-dashboard');
      }
    } else {
      if (activePage !== 'login' && activePage !== 'register' && activePage !== 'landing') {
        setActivePage('landing');
      }
    }
  }, [user]);

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <Landing setActivePage={setActivePage} />;
      case 'login':
        return <Login setActivePage={setActivePage} />;
      case 'register':
        return <Register setActivePage={setActivePage} />;

      // Patient Routes
      case 'patient-dashboard':
        return (
          <ProtectedRoute allowedRoles={['patient']} setActivePage={setActivePage}>
            <PatientDashboard setActivePage={setActivePage} />
          </ProtectedRoute>
        );
      case 'patient-new-case':
        return (
          <ProtectedRoute allowedRoles={['patient']} setActivePage={setActivePage}>
            <NewCase setActivePage={setActivePage} />
          </ProtectedRoute>
        );
      case 'patient-my-cases':
        return (
          <ProtectedRoute allowedRoles={['patient']} setActivePage={setActivePage}>
            <MyCases setActivePage={setActivePage} />
          </ProtectedRoute>
        );
      case 'patient-book':
        return (
          <ProtectedRoute allowedRoles={['patient']} setActivePage={setActivePage}>
            <BookAppointment setActivePage={setActivePage} />
          </ProtectedRoute>
        );
      case 'patient-appointments':
        return (
          <ProtectedRoute allowedRoles={['patient']} setActivePage={setActivePage}>
            <MyAppointments setActivePage={setActivePage} />
          </ProtectedRoute>
        );

      // Doctor Routes
      case 'doctor-dashboard':
        return (
          <ProtectedRoute allowedRoles={['doctor']} setActivePage={setActivePage}>
            <DoctorDashboard />
          </ProtectedRoute>
        );
      case 'doctor-profile':
        return (
          <ProtectedRoute allowedRoles={['doctor']} setActivePage={setActivePage}>
            <DoctorProfile />
          </ProtectedRoute>
        );
      case 'doctor-availability':
        return (
          <ProtectedRoute allowedRoles={['doctor']} setActivePage={setActivePage}>
            <DoctorAvailability />
          </ProtectedRoute>
        );

      // Admin Routes
      case 'admin-dashboard':
        return (
          <ProtectedRoute allowedRoles={['admin']} setActivePage={setActivePage}>
            <AdminDashboard setActivePage={setActivePage} />
          </ProtectedRoute>
        );
      case 'admin-approvals':
        return (
          <ProtectedRoute allowedRoles={['admin']} setActivePage={setActivePage}>
            <DoctorApprovals />
          </ProtectedRoute>
        );
      case 'admin-specializations':
        return (
          <ProtectedRoute allowedRoles={['admin']} setActivePage={setActivePage}>
            <SpecializationManager />
          </ProtectedRoute>
        );
      case 'admin-appointments':
        return (
          <ProtectedRoute allowedRoles={['admin']} setActivePage={setActivePage}>
            <AllAppointments />
          </ProtectedRoute>
        );
      case 'admin-users':
        return (
          <ProtectedRoute allowedRoles={['admin']} setActivePage={setActivePage}>
            <UserManagement />
          </ProtectedRoute>
        );
      case 'admin-reports':
        return (
          <ProtectedRoute allowedRoles={['admin']} setActivePage={setActivePage}>
            <ReportedIssues />
          </ProtectedRoute>
        );

      // Prakriti Assessment
      case 'prakriti-test':
        return <PrakritiTest setActivePage={setActivePage} />;

      default:
        return <Landing setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      <main className="flex-1 pb-16">{renderPage()}</main>

      {/* Footer with green CLINORA branding */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-green-500 tracking-tight text-sm">{t('common.clinora')}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-semibold">{t('footer.tagline')}</span>
          </div>
          <p className="text-slate-500">{t('footer.secure')}</p>
        </div>
      </footer>

      <Toast />
      <ReportIssueModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
