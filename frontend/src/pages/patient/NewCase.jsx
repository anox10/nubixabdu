import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  FileText,
  HeartPulse,
  AlertTriangle,
  Shield,
  Camera,
  UploadCloud,
  Trash2,
  Image,
  ArrowRight,
  Clock,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function NewCase({ setActivePage }) {
  const { showToast } = useAuth();
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [durationOfSymptoms, setDurationOfSymptoms] = useState('');
  const [jointAssessment, setJointAssessment] = useState('Prominent, crack easily (VATA)');
  const [pastHistory, setPastHistory] = useState('');
  const [drugAllergyHistory, setDrugAllergyHistory] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      // Check file size limit (under 5MB each)
      if (file.size > 5 * 1024 * 1024) {
        showToast(`File ${file.name} exceeds 5MB limit.`, 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target.result;
        setAttachments((prev) => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ''; // Reset input
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chiefComplaint.trim()) {
      showToast('Please enter your chief complaint / symptoms.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      await api.createCase({
        chief_complaint: chiefComplaint.trim(),
        duration_of_symptoms: durationOfSymptoms.trim(),
        joint_assessment: jointAssessment,
        past_history: pastHistory.trim() || 'None reported',
        drug_allergy_history: drugAllergyHistory.trim() || 'No known drug allergies (NKDA)',
        family_history: familyHistory.trim() || 'Non-contributory',
        attachment_urls: attachments
      });

      showToast('Clinical case intake & documents saved successfully!', 'success');
      setActivePage('patient-book');
    } catch (err) {
      showToast(err.message || 'Failed to submit case', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const jointOptions = [
    { label: 'Prominent, crack easily', type: 'VATA' },
    { label: 'Loose, flexible', type: 'PITTA' },
    { label: 'Large, well-padded, sturdy', type: 'KAPHA' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 to-emerald-700 p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-green-200">
                CLINORA Clinical Intake
              </span>
              <h1 className="text-2xl font-black tracking-tight">Structured Medical Case & Document Upload</h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-green-100 mt-2 max-w-xl">
            Fill your symptom details, duration, joint constitutional indicators, and capture device camera photos of old reports or X-rays.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Chief Complaint */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-green-600" />
              <span>1. Chief Complaint & Main Symptoms *</span>
            </label>
            <textarea
              required
              rows={3}
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Describe your current pain, reason for visit, or clinical discomfort..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm outline-none placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* DURATION OF SYMPTOMS (KALA) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span>DURATION OF SYMPTOMS (KALA)</span>
            </label>
            <input
              type="text"
              value={durationOfSymptoms}
              onChange={(e) => setDurationOfSymptoms(e.target.value)}
              placeholder="e.g. 3 weeks / 6 months"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm outline-none placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* 11. How are your joints? (Constitutional / Prakriti Assessment) */}
          <div className="border border-green-200/80 bg-green-50/30 rounded-3xl p-5 space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span>11. How are your joints?</span>
            </label>

            <div className="space-y-2">
              {jointOptions.map((opt) => {
                const optValue = `${opt.label} (${opt.type})`;
                const isSelected = jointAssessment === optValue;
                return (
                  <div
                    key={opt.type}
                    onClick={() => setJointAssessment(optValue)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-green-500 ring-2 ring-green-500/20 shadow-xs'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-green-600 bg-green-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">{opt.label}</span>
                    </div>
                    <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      ({opt.type})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Past History */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <span>2. Past Medical & Surgical History</span>
            </label>
            <textarea
              rows={2}
              value={pastHistory}
              onChange={(e) => setPastHistory(e.target.value)}
              placeholder="Existing medical conditions (Hypertension, Diabetes, Asthma), prior surgeries, or daily prescriptions..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Drug & Allergy History */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>3. Drug & Allergy History</span>
            </label>
            <textarea
              rows={2}
              value={drugAllergyHistory}
              onChange={(e) => setDrugAllergyHistory(e.target.value)}
              placeholder="Known medication allergies (Penicillin, Sulfa, NSAIDs) and reactions, or enter 'NKDA'..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Family History */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                F
              </span>
              <span>4. Family Medical History</span>
            </label>
            <textarea
              rows={2}
              value={familyHistory}
              onChange={(e) => setFamilyHistory(e.target.value)}
              placeholder="Hereditary illnesses in biological parents or siblings (Heart disease, stroke, diabetes)..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Document & Camera Upload Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Image className="w-4 h-4 text-green-600" />
                <span>5. Upload Diagnostics / Camera Photo Capture (Optional)</span>
              </label>
              <p className="text-xs text-slate-500 mt-1">
                Take a direct photo using your device camera or upload image files/scans of previous lab reports or X-rays.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Direct Camera Capture */}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-xs">
                <Camera className="w-4 h-4" />
                <span>Take Camera Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {/* Upload Existing Files */}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs rounded-2xl border border-slate-300 transition-all">
                <UploadCloud className="w-4 h-4 text-slate-600" />
                <span>Upload Image / Report</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {/* Thumbnail Previews */}
            {attachments.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase text-slate-500">
                  Attached Documents ({attachments.length}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {attachments.map((url, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-300 bg-white aspect-[4/3] group shadow-xs">
                      <img src={url} alt={`Doc ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors shadow-sm"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Doc {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setActivePage('patient-dashboard')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel & Return to Dashboard
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-green-600/20 disabled:opacity-50"
            >
              <span>{submitting ? 'Saving Case & Documents...' : 'Save Case & Proceed to Book'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
