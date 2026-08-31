import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Stethoscope, Save } from 'lucide-react';

export default function DoctorProfile() {
  const { user, doctorProfile, refreshUser, showToast } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [specialization, setSpecialization] = useState(doctorProfile?.specialization || 'General Medicine');
  const [bio, setBio] = useState(doctorProfile?.bio || '');
  const [experienceYears, setExperienceYears] = useState(doctorProfile?.experience_years || 5);
  const [specializationsList, setSpecializationsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (doctorProfile) {
      setSpecialization(doctorProfile.specialization || 'General Medicine');
      setBio(doctorProfile.bio || '');
      setExperienceYears(doctorProfile.experience_years || 5);
    }
  }, [user, doctorProfile]);

  useEffect(() => {
    api.getSpecializations()
      .then((res) => setSpecializationsList(res.specializations || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.updateDoctorProfile({
        name,
        specialization,
        bio,
        experience_years: Number(experienceYears)
      });

      showToast('Doctor profile updated successfully.', 'success');
      await refreshUser();
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-3 bg-green-50 text-green-700 rounded-2xl">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Manage Doctor Profile</h1>
            <p className="text-xs text-slate-500">
              Update your department specialization, public biography, and clinical experience.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Full Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs sm:text-sm font-bold outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Specialization
              </label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs sm:text-sm font-bold bg-white outline-none"
              >
                {specializationsList.length > 0 ? (
                  specializationsList.map((spec) => (
                    <option key={spec.id} value={spec.name}>
                      {spec.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Neurology">Neurology</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Years of Experience
              </label>
              <input
                type="number"
                min={0}
                max={60}
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs sm:text-sm font-bold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Professional Biography & Medical Training
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Clinical training, medical school, fellowships, and areas of focus..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs sm:text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving Updates...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
