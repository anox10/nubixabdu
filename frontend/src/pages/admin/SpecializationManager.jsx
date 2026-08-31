import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Building2, Plus, Trash2 } from 'lucide-react';

export default function SpecializationManager() {
  const { showToast } = useAuth();
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSpecializations = async () => {
    try {
      setLoading(true);
      const res = await api.getSpecializations();
      setSpecializations(res.specializations || []);
    } catch (err) {
      showToast('Failed to load specializations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      await api.createSpecialization({
        name: name.trim(),
        description: description.trim() || 'Medical department'
      });

      showToast(`Department '${name}' created!`, 'success');
      setName('');
      setDescription('');
      fetchSpecializations();
    } catch (err) {
      showToast(err.message || 'Failed to create specialization', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, specName) => {
    if (!window.confirm(`Delete department '${specName}'?`)) return;

    try {
      await api.deleteSpecialization(id);
      showToast(`Department '${specName}' deleted.`, 'info');
      fetchSpecializations();
    } catch (err) {
      showToast(err.message || 'Failed to delete department', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Building2 className="w-7 h-7 text-green-600" />
          <span>Hospital Departments & Specializations</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure clinical departments used across doctor registrations and patient booking filters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-green-600" />
              <span>Add Department</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Oncology, ENT, Gastroenterology"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of services offered..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Add Department'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Departments */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Active Specializations ({specializations.length})
          </h3>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading departments...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specializations.map((spec) => (
                <div
                  key={spec.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-green-300 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900">{spec.name}</h4>
                      <button
                        onClick={() => handleDelete(spec.id, spec.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{spec.description}</p>
                  </div>

                  <span className="text-[10px] text-slate-400 font-semibold">ID: {spec.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
