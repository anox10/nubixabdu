import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Stethoscope, CreditCard, Building, FileText, Filter } from 'lucide-react';
import CaseModal from '../../components/CaseModal';

export default function AllAppointments() {
  const { showToast } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);

  const fetchMasterAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.getMasterAppointments({
        status: statusFilter,
        payment_method: paymentFilter
      });
      setAppointments(res.appointments || []);
    } catch (err) {
      showToast('Failed to fetch master appointments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterAppointments();
  }, [statusFilter, paymentFilter]);

  const statusBadge = {
    pending: 'bg-amber-100 text-amber-900 border-amber-300',
    confirmed: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    completed: 'bg-blue-100 text-blue-900 border-blue-300',
    cancelled: 'bg-slate-100 text-slate-600 border-slate-300',
    no_show: 'bg-rose-100 text-rose-900 border-rose-300',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Calendar className="w-7 h-7 text-green-600" />
          <span>Master Appointments & Payment Audit</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Hospital-wide overview of all patient appointments, payment methods (Online vs Pay at Reception), and clinical intake records.
        </p>
      </div>

      {/* Dual Filter Bars */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-2">Status:</span>
          {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Payment Method Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 mr-2">Payment Method:</span>
          <button
            onClick={() => setPaymentFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              paymentFilter === 'all'
                ? 'bg-green-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Methods
          </button>
          <button
            onClick={() => setPaymentFilter('online')}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              paymentFilter === 'online'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Online (Paid)</span>
          </button>
          <button
            onClick={() => setPaymentFilter('pay_at_reception')}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              paymentFilter === 'pay_at_reception'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Pay at Reception (Pending)</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading master appointments table...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-sm">
          No appointments found matching these filters.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-3.5 px-4">Apt ID / Date</th>
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Assigned Doctor</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Time Slot</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Case / Docs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div>{apt.id}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{apt.date}</div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{apt.patient_name}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{apt.doctor_name}</td>
                    <td className="py-3.5 px-4 text-green-700 font-bold">{apt.specialization}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{apt.time_slot}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
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
                          {apt.payment_method === 'online' ? 'Online (Paid)' : 'Reception (Pending)'}
                        </span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          statusBadge[apt.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {apt.case ? (
                        <button
                          onClick={() => setSelectedCase(apt.case)}
                          className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-800 rounded-lg text-[11px] font-bold border border-green-200"
                        >
                          Inspect Case {apt.case.attachment_urls?.length > 0 ? `(${apt.case.attachment_urls.length} Docs)` : ''}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CaseModal caseData={selectedCase} onClose={() => setSelectedCase(null)} />
    </div>
  );
}
