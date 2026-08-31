import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ReportedIssues() {
  const { showToast } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminReports();
      setReports(res.reports || []);
    } catch (err) {
      showToast('Failed to fetch reported issues.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id) => {
    try {
      const res = await api.resolveReport(id);
      showToast(res.message, 'success');
      fetchReports();
    } catch (err) {
      showToast(err.message || 'Failed to update report status', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <AlertCircle className="w-7 h-7 text-amber-600" />
          <span>User Feedback & Issue Reports</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review issues, clinical feedback, and suggestions filed by patients and medical staff.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading issue reports...</div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-sm">
          No feedback or issue reports logged.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                rep.status === 'open' ? 'border-amber-200' : 'border-slate-200 opacity-80'
              }`}
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      rep.status === 'open'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}
                  >
                    {rep.status}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Report ID: {rep.id}</span>
                </div>

                <p className="text-sm font-bold text-slate-900 leading-relaxed">
                  "{rep.description}"
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Filed by: <strong className="text-slate-700">{rep.reporter_name || 'Anonymous'}</strong> ({rep.reporter_role || 'user'})</span>
                  <span>•</span>
                  <span>{new Date(rep.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleResolve(rep.id)}
                  className={`px-4 py-2 text-xs font-black rounded-xl border transition-all flex items-center gap-1.5 ${
                    rep.status === 'open'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{rep.status === 'open' ? 'Mark Resolved' : 'Re-open Issue'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
