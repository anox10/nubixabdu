import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Calendar, Clock, Stethoscope, FileText, XCircle, CreditCard, Building } from 'lucide-react';
import CaseModal from '../../components/CaseModal';

export default function MyAppointments({ setActivePage }) {
  const { showToast } = useAuth();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.getMyAppointments();
      setAppointments(res.appointments || []);
    } catch (err) {
      showToast(t('patient.failedToLoadAppointments') || 'Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (aptId) => {
    if (!window.confirm(t('patient.confirmCancel') || 'Are you sure you want to cancel this appointment?')) return;

    try {
      await api.updateAppointmentStatus(aptId, 'cancelled', 'Cancelled by patient');
      showToast(t('patient.appointmentCancelled') || 'Appointment cancelled.', 'info');
      fetchAppointments();
    } catch (err) {
      showToast(err.message || t('patient.cancelFailed') || 'Failed to cancel appointment', 'error');
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  const statusBadgeStyle = {
    pending: 'bg-amber-100 text-amber-900 border-amber-300',
    confirmed: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    completed: 'bg-blue-100 text-blue-900 border-blue-300',
    cancelled: 'bg-slate-100 text-slate-600 border-slate-300',
    no_show: 'bg-rose-100 text-rose-900 border-rose-300',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-green-600" />
            <span>{t('patient.myAppointments') || 'My Hospital Appointments'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('patient.trackingConfirmation') || 'Track doctor confirmation status, payment receipts, and attached clinical cases.'}
          </p>
        </div>

        <button
          onClick={() => setActivePage('patient-book')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>{t('patient.bookDoctor') || 'Book Doctor'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              statusFilter === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t(`patient.${tab}`) || tab}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">{t('patient.loadingAppointments') || 'Loading your appointments...'}</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <p className="text-slate-500 text-sm font-medium">{t('patient.noAppointmentsMatching') || 'No appointments found matching this filter.'}</p>
          <button
            onClick={() => setActivePage('patient-book')}
            className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl"
          >
            {t('patient.bookASpecialist') || 'Book a Specialist'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      statusBadgeStyle[apt.status] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {t(`patient.${apt.status}`) || apt.status}
                  </span>

                  {/* Payment status badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                      apt.payment_status === 'paid'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-900 border-amber-300'
                    }`}
                  >
                    {apt.payment_method === 'online' ? (
                      <CreditCard className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Building className="w-3 h-3 text-amber-600" />
                    )}
                    <span>
                      {apt.payment_method === 'online'
                        ? t('patient.onlinePaid') || 'Paid Online'
                        : t('patient.payAtReception') || 'Pay at Reception (Pending)'}
                    </span>
                  </span>

                  <span className="text-xs text-slate-400 font-semibold">{t('patient.ref') || 'Ref:'} {apt.id}</span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-green-600" />
                    <span>{apt.doctor_name}</span>
                  </h3>
                  <p className="text-xs text-green-700 font-bold mt-0.5">
                    {t('patient.specialization') || 'Department:'} {apt.specialization}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span>{t('patient.date') || 'Date:'} <strong>{apt.date}</strong></span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>{t('patient.timeSlot') || 'Time Slot:'} <strong>{apt.time_slot}</strong></span>
                  </span>
                </div>

                {apt.notes && (
                  <p className="text-xs text-slate-600 italic">{t('patient.visitNotes') || 'Notes:'} "{apt.notes}"</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap md:flex-col items-center justify-end gap-2.5 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                {apt.case ? (
                  <button
                    onClick={() => setSelectedCase(apt.case)}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-green-600" />
                    <span>{t('patient.viewCaseDocs') || 'View Case & Docs'}</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">{t('patient.noCasesAttached') || 'No case attached'}</span>
                )}

                {(apt.status === 'pending' || apt.status === 'confirmed') && (
                  <button
                    onClick={() => handleCancel(apt.id)}
                    className="w-full sm:w-auto px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{t('patient.cancelVisit') || 'Cancel Visit'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CaseModal caseData={selectedCase} onClose={() => setSelectedCase(null)} />
    </div>
  );
}
