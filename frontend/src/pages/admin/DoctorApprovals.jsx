import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Stethoscope, Check, X } from 'lucide-react';

export default function DoctorApprovals() {
  const { showToast } = useAuth();
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await api.getPendingDoctors();
      setPendingDoctors(res.pendingDoctors || []);
    } catch (err) {
      showToast('Failed to fetch pending doctors list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id, isApproved, name) => {
    try {
      await api.approveDoctor(id, isApproved);
      showToast(
        isApproved
          ? `Dr. ${name} approved successfully!`
          : `Dr. ${name} registration rejected.`,
        isApproved ? 'success' : 'info'
      );
      fetchPending();
    } catch (err) {
      showToast(err.message || 'Failed to update approval status', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <UserCheck className="w-7 h-7 text-green-600" />
          <span>Doctor Verification & Approval Queue</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review credentials for newly registered clinicians before permitting access to patient case records and bookings.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading pending doctor approvals...</div>
      ) : pendingDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-2">
          <p className="text-slate-700 font-bold text-sm">No Pending Doctor Registrations</p>
          <p className="text-xs text-slate-400">All registered doctor accounts have been verified and approved.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-amber-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider rounded-full border border-amber-300">
                    Pending Approval
                  </span>
                  <span className="text-xs font-semibold text-slate-400">ID: {doc.id}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-700 font-bold text-sm flex items-center justify-center border border-green-100">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-green-700 font-bold">{doc.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-medium">Department</span>
                    <span className="text-slate-800 font-bold">{doc.specialization}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Experience</span>
                    <span className="text-slate-800 font-bold">{doc.experience_years} Years</span>
                  </div>
                </div>

                {doc.bio && (
                  <p className="text-xs text-slate-600 italic">Bio: "{doc.bio}"</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                <button
                  onClick={() => handleApprove(doc.id, true, doc.name)}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Doctor</span>
                </button>

                <button
                  onClick={() => handleApprove(doc.id, false, doc.name)}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-1.5 transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
