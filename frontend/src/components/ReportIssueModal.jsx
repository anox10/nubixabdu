import React, { useState } from 'react';
import { X, AlertCircle, Send } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReportIssueModal({ isOpen, onClose }) {
  const { showToast } = useAuth();
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      setSubmitting(true);
      await api.createReport(description.trim());
      showToast('Report submitted to CLINORA administration.', 'success');
      setDescription('');
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-green-400" />
            <h3 className="font-extrabold text-sm">Report Hospital Issue / Feedback</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Describe the issue or feedback
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Schedule timing issue, reception payment question, or clinical intake suggestions..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !description.trim()}
              className="flex items-center gap-2 px-5 py-2 text-xs font-extrabold rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
