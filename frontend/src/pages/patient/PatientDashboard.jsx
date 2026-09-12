import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import {
  Calendar,
  ClipboardList,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HeartPulse,
  CreditCard,
  Building,
  Image,
  Sparkles,
  Eye,
  Clock as ClockIcon
} from 'lucide-react';
import CaseModal from '../../components/CaseModal';

export default function PatientDashboard({ setActivePage }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [cases, setCases] = useState([]);
  const [prakritiResult, setPrakritiResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [aptRes, casesRes, prakritiRes] = await Promise.all([
          api.getMyAppointments(),
          api.getMyCases(),
          api.getPrakritiResults().catch(() => ({ result: null }))
        ]);
        setAppointments(aptRes.appointments || []);
        setCases(casesRes.cases || []);
        setPrakritiResult(prakritiRes.result || null);
      } catch (err) {
        console.error('Failed to load patient dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const upcomingApt = appointments.find(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );

  const statusBadge = {
    pending: 'bg-amber-100 text-amber-900 border-amber-300',
    confirmed: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    completed: 'bg-blue-100 text-blue-900 border-blue-300',
    cancelled: 'bg-slate-100 text-slate-600 border-slate-300',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>CLINORA Patient Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {user?.name || 'Patient'}
          </h1>
          <p className="text-green-100 text-xs sm:text-sm mt-1 max-w-xl">
            Submit intake cases with camera documents, browse hospital specialists, choose online/reception payments, and track visits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActivePage('patient-new-case')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-green-900 font-extrabold text-xs sm:text-sm hover:bg-green-50 transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-green-600" />
            <span>New Case & Upload</span>
          </button>
          <button
            onClick={() => setActivePage('patient-book')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-green-950/50 hover:bg-green-950/70 text-white font-extrabold text-xs sm:text-sm border border-green-400/30 transition-all backdrop-blur-md"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Doctor</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Upcoming Visits</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending').length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Submitted Cases</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{cases.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed Visits</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {appointments.filter((a) => a.status === 'completed').length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-green-300 transition-colors"
          onClick={() => setActivePage('prakriti-test')}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Prakriti Assessment</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {prakritiResult ? '✓' : '—'}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Spotlight Appointment */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span>Next Upcoming Appointment</span>
              </h2>
              <button
                onClick={() => setActivePage('patient-appointments')}
                className="text-xs font-bold text-green-600 hover:text-green-800 flex items-center gap-1"
              >
                View all ({appointments.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingApt ? (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        statusBadge[upcomingApt.status]
                      }`}
                    >
                      {upcomingApt.status}
                    </span>

                    {/* Payment badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        upcomingApt.payment_status === 'paid'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                    >
                      {upcomingApt.payment_method === 'online' ? (
                        <CreditCard className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Building className="w-3 h-3 text-amber-600" />
                      )}
                      <span>
                        {upcomingApt.payment_method === 'online' ? 'Online (Paid)' : 'Pay at Reception (Pending)'}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{upcomingApt.doctor_name}</h3>
                  <p className="text-xs font-bold text-green-700 flex items-center gap-2">
                    <span>📅 {upcomingApt.date}</span>
                    <span>•</span>
                    <span>⏰ {upcomingApt.time_slot}</span>
                  </p>
                  {upcomingApt.notes && (
                    <p className="text-xs text-slate-600 italic">Notes: "{upcomingApt.notes}"</p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
                  {upcomingApt.case && (
                    <button
                      onClick={() => setSelectedCase(upcomingApt.case)}
                      className="w-full sm:w-auto px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                    >
                      View Case & Docs
                    </button>
                  )}
                  <button
                    onClick={() => setActivePage('patient-appointments')}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm font-medium text-slate-500 mb-3">No active upcoming appointments scheduled.</p>
                <button
                  onClick={() => setActivePage('patient-book')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Specialist</span>
                </button>
              </div>
            )}
          </div>

          {/* Cases list */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-green-600" />
                <span>My Submitted Clinical Cases</span>
              </h2>
              <button
                onClick={() => setActivePage('patient-my-cases')}
                className="text-xs font-bold text-green-600 hover:text-green-800 flex items-center gap-1"
              >
                All Cases ({cases.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {cases.length > 0 ? (
              <div className="space-y-3">
                {cases.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-green-300 bg-slate-50/50 hover:bg-green-50/30 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-bold text-slate-700">Case ID: {c.id}</span>
                        <span>•</span>
                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                        {c.attachment_urls && c.attachment_urls.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-green-100 text-green-800 text-[10px] font-bold rounded">
                            <Image className="w-3 h-3" />
                            {c.attachment_urls.length} Doc{c.attachment_urls.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">
                        {c.chief_complaint}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-green-600 hover:underline">
                      View →
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
                No clinical cases submitted yet. Submit a case form before your appointment.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Quick Actions */}
        <div className="space-y-6">
          {/* Prakriti Assessment Card */}
          <div
            className="bg-green-50/60 hover:bg-green-100/70 border border-green-100 transition-all flex items-start gap-3 group cursor-pointer rounded-2xl p-4"
            onClick={() => setActivePage('prakriti-test')}
          >
            <div className="p-2 rounded-xl bg-green-600 text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Prakriti Assessment</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {prakritiResult ? 'View your Prakriti result' : 'Take the Ayurvedic constitution test'}
              </p>
              {prakritiResult && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-green-100 text-green-800 text-[10px] font-bold rounded mt-1">
                  Completed — {prakritiResult.dominantLabel}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Quick Actions
            </h3>

            <button
              onClick={() => setActivePage('patient-new-case')}
              className="w-full text-left p-4 rounded-2xl bg-green-50/60 hover:bg-green-100/70 border border-green-100 transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-xl bg-green-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">1. Fill Case & Capture Docs</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Input symptoms and use camera to upload old reports or X-rays.
                </p>
              </div>
            </button>

            <button
              onClick={() => setActivePage('patient-book')}
              className="w-full text-left p-4 rounded-2xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-100 transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">2. Book Specialist & Pay</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pick doctor, time slot, and choose Pay Online or Pay at Reception.
                </p>
              </div>
            </button>

            <button
              onClick={() => setActivePage('patient-appointments')}
              className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-xl bg-slate-700 text-white shadow-xs group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">3. Track & Cancel Visits</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Check doctor confirmation status and payment receipts.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <CaseModal caseData={selectedCase} onClose={() => setSelectedCase(null)} />
    </div>
  );
}
