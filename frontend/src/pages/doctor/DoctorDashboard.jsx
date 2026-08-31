import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  FileText,
  CreditCard,
  Building,
  Check,
  X,
  Image
} from 'lucide-react';
import CaseModal from '../../components/CaseModal';

export default function DoctorDashboard() {
  const { user, showToast } = useAuth();
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
      showToast('Failed to load appointment queue.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (aptId, nextStatus, notes = '') => {
    try {
      await api.updateAppointmentStatus(aptId, nextStatus, notes);
      showToast(`Appointment status updated to ${nextStatus}.`, 'success');
      fetchAppointments();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const filtered = appointments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;

  const statusStyle = {
    pending: 'bg-amber-100 text-amber-900 border-amber-300',
    confirmed: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    completed: 'bg-blue-100 text-blue-900 border-blue-300',
    cancelled: 'bg-slate-100 text-slate-600 border-slate-300',
    no_show: 'bg-rose-100 text-rose-900 border-rose-300',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-green-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold mb-3 border border-green-500/30">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>CLINORA Doctor Workstation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {user?.name || 'Doctor'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Review incoming patient bookings, inspect attached X-rays/diagnostics, track payments, and update visit outcomes.
          </p>
        </div>

        {/* Queue Metrics */}
        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
          <div className="text-center px-3">
            <span className="text-2xl font-black text-amber-400">{pendingCount}</span>
            <span className="block text-[10px] uppercase font-bold text-slate-300">Pending</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="text-center px-3">
            <span className="text-2xl font-black text-green-400">{confirmedCount}</span>
            <span className="block text-[10px] uppercase font-bold text-slate-300">Confirmed</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="text-center px-3">
            <span className="text-2xl font-black text-blue-400">{completedCount}</span>
            <span className="block text-[10px] uppercase font-bold text-slate-300">Completed</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              statusFilter === tab
                ? 'bg-green-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Fetching doctor appointment queue...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-sm">
          No appointments found matching filter '{statusFilter}'.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-green-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      statusStyle[apt.status] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {apt.status}
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
                      {apt.payment_method === 'online' ? 'Online (Paid)' : 'Pay at Reception (Pending)'}
                    </span>
                  </span>

                  <span className="text-xs text-slate-400 font-semibold">Ref: {apt.id}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-700 font-bold text-sm flex items-center justify-center border border-green-100">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{apt.patient_name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Patient ID: {apt.patient_id}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span>Date: <strong>{apt.date}</strong></span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>Time: <strong>{apt.time_slot}</strong></span>
                  </span>
                </div>

                {apt.notes && (
                  <p className="text-xs text-slate-600 italic">Patient note: "{apt.notes}"</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end">
                {/* View Case and Attached Documents */}
                {apt.case ? (
                  <button
                    onClick={() => setSelectedCase(apt.case)}
                    className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-900 text-xs font-black rounded-xl border border-green-200 flex items-center gap-1.5 shadow-xs"
                  >
                    <FileText className="w-4 h-4 text-green-700" />
                    <span>
                      Inspect Case {apt.case.attachment_urls?.length > 0 ? `(${apt.case.attachment_urls.length} Docs)` : ''}
                    </span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 italic">No case record attached</span>
                )}

                {/* Pending Actions */}
                {apt.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Appointment</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'cancelled', 'Rejected by doctor')}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {/* Confirmed Actions */}
                {apt.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'completed')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Completed</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'no_show')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200"
                    >
                      No-Show
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case & Diagnostics Modal */}
      <CaseModal caseData={selectedCase} onClose={() => setSelectedCase(null)} />
    </div>
  );
}
