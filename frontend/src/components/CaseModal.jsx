import React, { useState } from 'react';
import {
  X,
  FileText,
  AlertTriangle,
  Clock,
  User,
  HeartPulse,
  Image,
  ZoomIn,
  Sparkles,
  Shield,
  Users,
  ChevronDown,
  ChevronUp,
  Activity
} from 'lucide-react';
import { parsePrakritiData, DOSHA_INFO } from '../data/prakritiData';

export default function CaseModal({ caseData, onClose }) {
  const [zoomedImage, setZoomedImage] = useState(null);
  const [showAllPrakritiDetails, setShowAllPrakritiDetails] = useState(false);

  if (!caseData) return null;

  const hasAllergies =
    caseData.drug_allergy_history &&
    !caseData.drug_allergy_history.toLowerCase().includes('nkda') &&
    !caseData.drug_allergy_history.toLowerCase().includes('no known') &&
    !caseData.drug_allergy_history.toLowerCase().includes('none');

  const attachments = Array.isArray(caseData.attachment_urls) ? caseData.attachment_urls : [];
  const prakriti = parsePrakritiData(caseData.joint_assessment);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Clinical Case & Prakriti Record</h3>
              <p className="text-xs text-emerald-100 flex items-center gap-2 mt-0.5">
                <span>Case Ref: {caseData.id?.slice(0, 8)}...</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(caseData.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Identifier banner */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span>Patient: <strong className="text-slate-800">{caseData.patient_name || 'Patient'}</strong></span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
            {attachments.length} Attachment{attachments.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* 1. Chief Complaint */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-emerald-900 font-bold mb-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              <h4>1. Chief Complaint & Symptoms</h4>
            </div>
            <p className="text-slate-800 leading-relaxed pl-6 whitespace-pre-wrap font-medium">
              {caseData.chief_complaint}
            </p>
          </div>

          {/* 2. DURATION OF SYMPTOMS (KALA) */}
          {caseData.duration_of_symptoms && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h4>2. Duration of Symptoms (Kala)</h4>
              </div>
              <p className="text-slate-800 pl-6 font-semibold">
                {caseData.duration_of_symptoms}
              </p>
            </div>
          )}

          {/* 3. Ayurvedic Prakriti / Constitutional Profile */}
          {prakriti && (
            <div className="bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 border-2 border-emerald-200 rounded-2xl p-4 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-950 font-black text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h4>3. Ayurvedic Prakriti & Constitutional Profile</h4>
                </div>
                {prakriti.isStructured && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                    12 Factors
                  </span>
                )}
              </div>

              {prakriti.isStructured ? (
                <div className="space-y-3 pl-1 sm:pl-6">
                  {/* Dominant constitution badge */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                      Dominant Constitution
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {prakriti.dominant}
                    </span>

                    {/* Dosha Breakdown Bars */}
                    <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-slate-100">
                      {/* Vata */}
                      <div className="bg-indigo-50/80 border border-indigo-100 rounded-lg p-2 text-center">
                        <span className="text-xs">🌬️</span>
                        <span className="block text-[10px] font-black text-indigo-900 uppercase">Vata</span>
                        <span className="text-xs font-black text-indigo-700">{prakriti.percentages?.vata || 0}%</span>
                      </div>
                      {/* Pitta */}
                      <div className="bg-amber-50/80 border border-amber-100 rounded-lg p-2 text-center">
                        <span className="text-xs">🔥</span>
                        <span className="block text-[10px] font-black text-amber-900 uppercase">Pitta</span>
                        <span className="text-xs font-black text-amber-700">{prakriti.percentages?.pitta || 0}%</span>
                      </div>
                      {/* Kapha */}
                      <div className="bg-emerald-50/80 border border-emerald-100 rounded-lg p-2 text-center">
                        <span className="text-xs">💧</span>
                        <span className="block text-[10px] font-black text-emerald-900 uppercase">Kapha</span>
                        <span className="text-xs font-black text-emerald-700">{prakriti.percentages?.kapha || 0}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Detailed Answers */}
                  {Array.isArray(prakriti.answers) && prakriti.answers.length > 0 && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowAllPrakritiDetails(!showAllPrakritiDetails)}
                        className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                      >
                        <span>{showAllPrakritiDetails ? 'Hide' : 'View'} Detailed 12 Constitutional Answers</span>
                        {showAllPrakritiDetails ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {showAllPrakritiDetails && (
                        <div className="mt-2.5 space-y-2 bg-slate-50/80 rounded-xl p-3 border border-slate-200">
                          {prakriti.answers.map((item, idx) => {
                            const style = DOSHA_INFO[item.dosha] || DOSHA_INFO.VATA;
                            return (
                              <div
                                key={idx}
                                className="bg-white rounded-lg p-2.5 border border-slate-200/80 text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-slate-800">
                                    {item.num ? `${item.num}. ` : ''}{item.title}
                                    {item.sanskrit && (
                                      <span className="text-[10px] text-slate-400 font-normal ml-1">
                                        ({item.sanskrit})
                                      </span>
                                    )}
                                  </span>
                                  <span className={`px-2 py-0.2 rounded text-[10px] font-black uppercase ${style.badge}`}>
                                    {style.icon} {item.dosha}
                                  </span>
                                </div>
                                <p className="text-slate-600 text-[11px] leading-relaxed">
                                  {item.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Legacy fallback */
                <p className="text-slate-900 pl-6 font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>{prakriti.rawText || caseData.joint_assessment}</span>
                </p>
              )}
            </div>
          )}

          {/* 4. Past History */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h4 className="text-slate-900 font-bold mb-1.5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <span>4. Past Medical & Surgical History</span>
            </h4>
            <p className="text-slate-700 leading-relaxed pl-6 whitespace-pre-wrap">
              {caseData.past_history || 'None reported.'}
            </p>
          </div>

          {/* 5. Drug & Allergy History */}
          <div
            className={`border rounded-2xl p-4 transition-all ${
              hasAllergies
                ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="font-bold flex items-center gap-2">
                {hasAllergies ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-400 ml-1"></span>
                )}
                <span>5. Drug & Allergy History</span>
              </h4>
              {hasAllergies && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-600 text-white rounded-full">
                  Allergy Alert
                </span>
              )}
            </div>
            <p className="leading-relaxed pl-6 whitespace-pre-wrap">
              {caseData.drug_allergy_history || 'No known drug allergies (NKDA).'}
            </p>
          </div>

          {/* 6. Family History */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h4 className="text-slate-900 font-bold mb-1.5 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span>6. Family Medical History</span>
            </h4>
            <p className="text-slate-700 leading-relaxed pl-6 whitespace-pre-wrap">
              {caseData.family_history || 'Non-contributory.'}
            </p>
          </div>

          {/* 7. Uploaded Documents / Reports / X-Ray Gallery */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h4 className="text-slate-900 font-bold flex items-center gap-2">
              <Image className="w-4 h-4 text-emerald-600" />
              <span>7. Uploaded Medical Documents & Diagnostics ({attachments.length})</span>
            </h4>

            {attachments.length === 0 ? (
              <p className="text-xs text-slate-500 italic pl-6">
                No diagnostic documents, photos, or X-rays were attached with this case.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {attachments.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setZoomedImage(url)}
                    className="relative group rounded-xl overflow-hidden border border-slate-300 bg-black/5 aspect-[4/3] cursor-pointer hover:shadow-md transition-all flex items-center justify-center"
                  >
                    <img
                      src={url}
                      alt={`Medical Document ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <ZoomIn className="w-6 h-6" />
                    </div>
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Doc {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors shadow-sm"
          >
            Close Record
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={zoomedImage} alt="Enlarged Medical Document" className="max-h-[80vh] w-auto object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
