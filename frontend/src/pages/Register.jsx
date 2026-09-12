import React, { useState, useEffect } from 'react';
import { useAuth, isValidGmail } from '../context/AuthContext';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, Mail, Key, User, Stethoscope, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Register({ setActivePage }) {
  const { register } = useAuth();
  const { t } = useLanguage();
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('General Medicine');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [specializationsList, setSpecializationsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.getSpecializations()
      .then(res => {
        if (res.specializations && res.specializations.length > 0) {
          setSpecializationsList(res.specializations);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isValidGmail(email)) {
      setErrorMsg('Please enter a valid Gmail address (e.g. name@gmail.com). Only Gmail domains are accepted.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        role,
        name,
        email: email.trim().toLowerCase(),
        password,
        ...(role === 'doctor' && {
          specialization,
          bio,
          experience_years: Number(experienceYears)
        })
      };

      const res = await register(payload);
      if (res.user.role === 'patient') {
        setActivePage('patient-dashboard');
      } else if (res.user.role === 'doctor') {
        setActivePage('doctor-dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 px-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 space-y-6">
        {/* Header with Green CLINORA */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-md shadow-green-600/20 mb-3">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Join <span className="text-green-600">CLINORA</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('register.selectRole')}</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Role Toggle */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
              role === 'patient'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-green-600" />
            <span>{t('register.registerAsPatient')}</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
              role === 'doctor'
                ? 'bg-white text-blue-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <span>{t('register.registerAsDoctor')}</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              {t('register.fullLegalName')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'doctor' ? 'Dr. Elizabeth Blackwell' : 'Jane Smith'}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              {t('login.gmailAddress')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              {t('login.password')}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('register.atLeast6Chars')}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Doctor specific fields */}
          {role === 'doctor' && (
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Medical Specialization
                  </label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs sm:text-sm outline-none bg-white font-medium"
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
                    Years of Clinical Experience
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Professional Bio & Clinical Background
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Medical background, residency, fellowships, or clinical focus..."
                  className="w-full px-3.5 py-2 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs sm:text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed">
                ℹ️ <strong>Doctor Verification Notice:</strong> Doctor registrations are created in an unapproved state and reviewed by the CLINORA administrator before access is unlocked.
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-green-600/20 disabled:opacity-50 mt-4"
          >
            <UserPlus className="w-4 h-4" />
            <span>{submitting ? 'Registering Account...' : `Register as ${role === 'doctor' ? 'Doctor' : 'Patient'}`}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered with CLINORA?{' '}
          <button
            onClick={() => setActivePage('login')}
            className="text-green-700 font-extrabold hover:underline"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}
