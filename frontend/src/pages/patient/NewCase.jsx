import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import VoiceInput from '../../components/VoiceInput';
import {
  PRAKRITI_QUESTIONS,
  PRAKRITI_CATEGORIES,
  DOSHA_INFO,
  calculateDoshaDistribution
} from '../../data/prakritiData';
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
  Sparkles,
  Users,
  CheckCircle2,
  Info,
  ChevronRight,
  Flame,
  Wind,
  Droplets,
  Layers
} from 'lucide-react';

export default function NewCase({ setActivePage }) {
  const { t } = useLanguage();
  const { showToast } = useAuth();
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [durationOfSymptoms, setDurationOfSymptoms] = useState('');
  
  // Initialize default Prakriti answers for all 12 questions
  const [prakritiAnswers, setPrakritiAnswers] = useState(() => {
    const initial = {};
    PRAKRITI_QUESTIONS.forEach((q) => {
      initial[q.id] = 'VATA'; // Default selection or starting baseline
    });
    return initial;
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [pastHistory, setPastHistory] = useState('');
  const [drugAllergyHistory, setDrugAllergyHistory] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Compute live real-time Dosha distribution
  const doshaResult = useMemo(() => {
    return calculateDoshaDistribution(prakritiAnswers);
  }, [prakritiAnswers]);

  const handleSelectOption = (questionId, dosha) => {
    setPrakritiAnswers((prev) => ({
      ...prev,
      [questionId]: dosha
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(t('patient.fileSizeLimit', { name: file.name }), 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target.result;
        setAttachments((prev) => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chiefComplaint.trim()) {
      showToast(t('patient.chiefComplaintRequired'), 'warning');
      return;
    }

    try {
      setSubmitting(true);

      // Construct structured Prakriti Assessment object
      const structuredPrakriti = {
        type: 'prakriti_v2',
        dominant: doshaResult.dominant,
        dominantType: doshaResult.dominantType,
        percentages: {
          vata: doshaResult.vataPct,
          pitta: doshaResult.pittaPct,
          kapha: doshaResult.kaphaPct
        },
        scores: {
          vata: doshaResult.vataCount,
          pitta: doshaResult.pittaCount,
          kapha: doshaResult.kaphaCount
        },
        summary: `${doshaResult.dominant} (Vata: ${doshaResult.vataPct}%, Pitta: ${doshaResult.pittaPct}%, Kapha: ${doshaResult.kaphaPct}%)`,
        answers: PRAKRITI_QUESTIONS.map((q) => {
          const chosenDosha = prakritiAnswers[q.id] || 'VATA';
          const chosenOpt = q.options.find((o) => o.dosha === chosenDosha) || q.options[0];
          return {
            id: q.id,
            num: q.num,
            title: q.title,
            sanskrit: q.sanskrit,
            dosha: chosenDosha,
            label: chosenOpt.label,
            description: chosenOpt.description
          };
        })
      };

      await api.createCase({
        chief_complaint: chiefComplaint.trim(),
        duration_of_symptoms: durationOfSymptoms.trim(),
        joint_assessment: JSON.stringify(structuredPrakriti),
        past_history: pastHistory.trim() || 'None reported',
        drug_allergy_history: drugAllergyHistory.trim() || 'No known drug allergies (NKDA)',
        family_history: familyHistory.trim() || 'Non-contributory',
        attachment_urls: attachments
      });

      showToast(t('patient.caseSaved'), 'success');
      setActivePage('patient-book');
    } catch (err) {
      showToast(err.message || t('patient.failedToSubmitCase'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredQuestions = activeCategory === 'all'
    ? PRAKRITI_QUESTIONS
    : PRAKRITI_QUESTIONS.filter((q) => q.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                CLINORA {t('prakriti.ayurvedicPrakritiAssessment')}
              </span>
              <h1 className="text-2xl font-black tracking-tight">{t('newCase.structuredMedicalCaseTitle')}</h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2.5 max-w-2xl relative z-10 leading-relaxed">
            Record your symptoms, complete the 12-factor Ayurvedic constitutional (Prakriti) assessment to identify your biological Dosha tendencies, and attach diagnostic photos or past medical records.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {/* 1. Chief Complaint */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              <span>1. Chief Complaint & Main Symptoms *</span>
            </label>
            <div className="flex gap-2">
              <textarea
                required
                rows={3}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Describe your current pain, primary illness reason, or clinical discomfort..."
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm outline-none placeholder:text-slate-400 font-medium transition-all"
              />
              <VoiceInput
                value={chiefComplaint}
                onChange={setChiefComplaint}
              />
            </div>
          </div>

          {/* 2. Duration of Symptoms (Kala) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>2. Duration of Symptoms (Kala)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={durationOfSymptoms}
                onChange={(e) => setDurationOfSymptoms(e.target.value)}
                placeholder="e.g. 3 weeks / 6 months / Acute since 2 days"
                className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm outline-none placeholder:text-slate-400 font-medium transition-all"
              />
              <VoiceInput
                value={durationOfSymptoms}
                onChange={setDurationOfSymptoms}
              />
            </div>
          </div>

          {/* 3. Comprehensive Ayurvedic Prakriti (Constitutional) Assessment */}
          <div className="border-2 border-emerald-200 bg-gradient-to-b from-emerald-50/40 to-slate-50/50 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xs">
            {/* Section Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                      3. Ayurvedic Prakriti & Constitutional Assessment
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      12 Parameters
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Select the option that best represents your natural baseline throughout your life (not just during illness).
                  </p>
                </div>
              </div>
            </div>

            {/* Live Real-time Dosha Meter Box */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Live Constitutional Analysis
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm sm:text-base font-black text-slate-900">
                      {doshaResult.dominant}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="text-[11px] font-bold text-slate-500">
                    Completion:
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    12 / 12 Answered
                  </span>
                </div>
              </div>

              {/* 3 Dosha Bars & Elemental Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* VATA */}
                <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🌬️</span>
                      <div>
                        <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide">Vata</h4>
                        <span className="text-[10px] text-indigo-600 font-medium">Air + Ether</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-indigo-900">{doshaResult.vataPct}%</span>
                      <span className="block text-[9px] font-bold text-indigo-600">{doshaResult.vataCount} traits</span>
                    </div>
                  </div>
                  <div className="w-full bg-indigo-100 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${doshaResult.vataPct}%` }}
                    />
                  </div>
                </div>

                {/* PITTA */}
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🔥</span>
                      <div>
                        <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">Pitta</h4>
                        <span className="text-[10px] text-amber-600 font-medium">Fire + Water</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-amber-900">{doshaResult.pittaPct}%</span>
                      <span className="block text-[9px] font-bold text-amber-600">{doshaResult.pittaCount} traits</span>
                    </div>
                  </div>
                  <div className="w-full bg-amber-100 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${doshaResult.pittaPct}%` }}
                    />
                  </div>
                </div>

                {/* KAPHA */}
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">💧</span>
                      <div>
                        <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">Kapha</h4>
                        <span className="text-[10px] text-emerald-600 font-medium">Water + Earth</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-emerald-900">{doshaResult.kaphaPct}%</span>
                      <span className="block text-[9px] font-bold text-emerald-600">{doshaResult.kaphaCount} traits</span>
                    </div>
                  </div>
                  <div className="w-full bg-emerald-100 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${doshaResult.kaphaPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-black uppercase text-slate-500 mr-1">
                Filter Section:
              </span>
              {PRAKRITI_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {filteredQuestions.map((q) => {
                const currentSelected = prakritiAnswers[q.id];

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3 transition-all hover:border-emerald-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">
                            {q.num}
                          </span>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900">
                            {q.title}
                          </h4>
                          <span className="text-[11px] italic font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            ({q.sanskrit})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 pl-7">
                          {q.hint}
                        </p>
                      </div>
                    </div>

                    {/* 3 Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pl-0 sm:pl-7">
                      {q.options.map((opt) => {
                        const isSelected = currentSelected === opt.dosha;
                        const doshaStyle = DOSHA_INFO[opt.dosha];

                        return (
                          <div
                            key={opt.dosha}
                            onClick={() => handleSelectOption(q.id, opt.dosha)}
                            className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                              isSelected
                                ? `${doshaStyle.bgLight} ${doshaStyle.border} shadow-sm ring-1 ring-${doshaStyle.color}-400`
                                : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                      isSelected
                                        ? `border-${doshaStyle.color}-600 bg-${doshaStyle.color}-600 text-white`
                                        : 'border-slate-300 bg-white'
                                    }`}
                                  >
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                  <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-md border ${doshaStyle.badge}`}>
                                    {doshaStyle.icon} {opt.dosha}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs font-bold text-slate-900 leading-snug">
                                {opt.label}
                              </p>
                              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                                {opt.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Past History */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <span>4. Past Medical & Surgical History</span>
            </label>
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={pastHistory}
                onChange={(e) => setPastHistory(e.target.value)}
                placeholder="Existing medical conditions (Hypertension, Diabetes, Asthma), prior surgeries, or daily prescriptions..."
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm outline-none placeholder:text-slate-400 font-medium transition-all"
              />
              <VoiceInput
                value={pastHistory}
                onChange={setPastHistory}
              />
            </div>
          </div>

          {/* 5. Drug & Allergy History */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>5. Drug & Allergy History</span>
            </label>
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={drugAllergyHistory}
                onChange={(e) => setDrugAllergyHistory(e.target.value)}
                placeholder="Known medication allergies (Penicillin, Sulfa, NSAIDs) and reactions, or enter 'NKDA'..."
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm outline-none placeholder:text-slate-400 font-medium transition-all"
              />
              <VoiceInput
                value={drugAllergyHistory}
                onChange={setDrugAllergyHistory}
              />
            </div>
          </div>

          {/* 6. Family History */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span>6. Family Medical History</span>
            </label>
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={familyHistory}
                onChange={(e) => setFamilyHistory(e.target.value)}
                placeholder="Hereditary illnesses in biological parents or siblings (Heart disease, stroke, diabetes)..."
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm outline-none placeholder:text-slate-400 font-medium transition-all"
              />
              <VoiceInput
                value={familyHistory}
                onChange={setFamilyHistory}
              />
            </div>
          </div>

          {/* 7. Document & Camera Upload Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Image className="w-4 h-4 text-emerald-600" />
                <span>7. Upload Diagnostics / Camera Photo Capture (Optional)</span>
              </label>
              <p className="text-xs text-slate-500 mt-1">
                Take a direct photo using your device camera or upload image files/scans of previous lab reports or X-rays.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Direct Camera Capture */}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-xs">
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
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel & Return to Dashboard
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              <span>{submitting ? 'Saving Case & Prakriti Profile...' : 'Save Case & Proceed to Book'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
