import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Clock, Plus, Trash2 } from 'lucide-react';

export default function DoctorAvailability() {
  const { showToast } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [submitting, setSubmitting] = useState(false);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const res = await api.getMyAvailability();
      setAvailability(res.availability || []);
    } catch (err) {
      showToast('Failed to fetch availability schedule.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleAddAvailability = async (e) => {
    e.preventDefault();

    if (startTime >= endTime) {
      showToast('Start time must be strictly before end time.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      await api.setAvailability({
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime
      });

      showToast(`Availability configured for ${dayOfWeek}s!`, 'success');
      fetchAvailability();
    } catch (err) {
      showToast(err.message || 'Failed to update availability', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, day) => {
    if (!window.confirm(`Delete consultation hours for ${day}?`)) return;

    try {
      await api.deleteAvailability(id);
      showToast(`Schedule for ${day} deleted.`, 'info');
      fetchAvailability();
    } catch (err) {
      showToast(err.message || 'Failed to delete entry', 'error');
    }
  };

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const sortedAvailability = [...availability].sort((a, b) => {
    return daysOrder.indexOf(a.day_of_week) - daysOrder.indexOf(b.day_of_week);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Clock className="w-7 h-7 text-green-600" />
          <span>Weekly Schedule & Slot Availability</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Set working days and daily consultation hours. Patients can only book slots within these ranges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-green-600" />
              <span>Add / Update Schedule</span>
            </h3>

            <form onSubmit={handleAddAvailability} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Day of Week
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs font-bold bg-white outline-none"
                >
                  {daysOrder.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Set Consultation Hours'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Active Weekly Consultation Hours ({sortedAvailability.length})
          </h3>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading schedule...</div>
          ) : sortedAvailability.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-300 text-center text-xs text-slate-500">
              No schedule rules configured yet. Use the form on the left to set your hours.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedAvailability.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between hover:border-green-300 transition-all"
                >
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-900 text-[10px] font-black uppercase tracking-wider">
                      {item.day_of_week}
                    </span>
                    <p className="text-sm font-black text-slate-900 pt-1">
                      ⏰ {item.start_time} – {item.end_time}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id, item.day_of_week)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete schedule rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
