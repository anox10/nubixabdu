import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Activity,
  Users,
  Stethoscope,
  UserCheck,
  Calendar,
  Building2,
  AlertCircle,
  CreditCard,
  Building,
  ShieldCheck,
  DollarSign
} from 'lucide-react';

export default function AdminDashboard({ setActivePage }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await api.getAdminStats();
        setStats(res.stats);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-green-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold mb-3 border border-green-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CLINORA Superadmin Workstation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Hospital Operational Overview</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Doctor credential verifications, master scheduling audit, payment splits, and department management.
          </p>
        </div>

        {stats?.pendingDoctors > 0 && (
          <button
            onClick={() => setActivePage('admin-approvals')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg animate-pulse"
          >
            <UserCheck className="w-5 h-5" />
            <span>{stats.pendingDoctors} Doctor Approvals Pending</span>
          </button>
        )}
      </div>

      {/* Overview Stats Cards */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Computing analytics...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Patients</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{stats?.totalPatients || 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Doctors</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{stats?.totalDoctors || 0}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  {stats?.approvedDoctors || 0} Approved • {stats?.pendingDoctors || 0} Pending
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Appointments This Week</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{stats?.appointmentsThisWeek || 0}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  {stats?.totalAppointments || 0} Total Lifetime
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Open Reported Issues</p>
                <h3 className="text-3xl font-black text-amber-600 mt-1">{stats?.openReports || 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Payment Method Breakdown Split */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-600" />
              <span>Payment Method Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-emerald-900 block">1. Online Payments (Paid)</span>
                  <p className="text-2xl font-black text-emerald-900 mt-1">{stats?.onlinePaymentsCount || 0}</p>
                  <span className="text-[11px] text-emerald-700 font-medium">Pre-paid via Card/UPI gateway</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-amber-900 block">2. Pay at Reception (Pending Collection)</span>
                  <p className="text-2xl font-black text-amber-900 mt-1">{stats?.receptionPaymentsCount || 0}</p>
                  <span className="text-[11px] text-amber-700 font-medium">To be collected at hospital front desk</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Building className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operational Modules */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Hospital Operational Controls
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => setActivePage('admin-approvals')}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-slate-900">Doctor Credential Verification</h4>
            <p className="text-xs text-slate-500">
              Approve or reject pending doctor applications to unlock clinical workstation access.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:underline pt-2">
              Review Queue →
            </span>
          </div>

          <div
            onClick={() => setActivePage('admin-specializations')}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-slate-900">Department Specializations</h4>
            <p className="text-xs text-slate-500">
              Add or remove hospital departments (Cardiology, Pediatrics, Dermatology, etc.).
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:underline pt-2">
              Manage Departments →
            </span>
          </div>

          <div
            onClick={() => setActivePage('admin-appointments')}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-slate-900">Master Appointments Audit</h4>
            <p className="text-xs text-slate-500">
              Filter all appointments by payment method (Online vs Reception), doctor, status, and inspect cases.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 group-hover:underline pt-2">
              Inspect Appointments →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
