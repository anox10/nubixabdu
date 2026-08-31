import React, { useState } from 'react';
import { X, FileText, AlertTriangle, Clock, User, HeartPulse, Image, ZoomIn, FileCheck, Activity, Sparkles } from 'lucide-react';

export default function CaseModal({ caseData, onClose }) {
  const [zoomedImage, setZoomedImage] = useState(null);

  if (!caseData) return null;

  const hasAllergies =
    caseData.drug_allergy_history &&
    !caseData.drug_allergy_history.toLowerCase().includes('nkda') &&
    !caseData.drug_allergy_history.toLowerCase().includes('no known') &&
    !caseData.drug_allergy_history.toLowerCase().includes('none');

  const attachments = Array.isArray(caseData.attachment_urls) ? caseData.attachment_urls : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Clinical Case & Documents</h3>
              <p className="text-xs text-green-100 flex items-center gap-2 mt-0.5">
                <span>Case Ref: {caseData.id}</span>
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
          {/* Chief Complaint */}
          <div className="bg-green-50/70 border border-green-200/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-green-900 font-bold mb-1.5">
              <HeartPulse className="w-4 h-4 text-green-600" />
              <h4>1. Chief Complaint & Symptoms</h4>
            </div>
            <p className="text-slate-800 leading-relaxed pl-6 whitespace-pre-wrap font-medium">
              {caseData.chief_complaint}
            </p>
          </div>

          {/* DURATION OF SYMPTOMS (KALA) */}
          {caseData.duration_of_symptoms && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                <Clock className="w-4 h-4 text-green-600" />
                <h4>Duration of Symptoms (Kala)</h4>
              </div>
              <p className="text-slate-800 pl-6 font-semibold">
                {caseData.duration_of_symptoms}
              </p>
            </div>
          )}

          {/* 11. How are your joints? (Constitutional / Prakriti Assessment) */}
          {caseData.joint_assessment && (
            <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-emerald-950 font-bold">
                  <Activity className="w-4 h-4 text-green-600" />
                  <h4>11. How are your joints? (Constitutional Assessment)</h4>
                </div>
              </div>
              <p className="text-slate-900 pl-6 font-bold flex items-center gap-2">
                <span>{caseData.joint_assessment}</span>
              </p>
            </div>
          )}

          {/* Past History */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h4 className="text-slate-900 font-bold mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              2. Past Medical & Surgical History
            </h4>
            <p className="text-slate-700 leading-relaxed pl-4 whitespace-pre-wrap">
              {caseData.past_history || 'None reported.'}
            </p>
          </div>

          {/* Drug & Allergy History */}
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
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                )}
                3. Drug & Allergy History
              </h4>
              {hasAllergies && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-600 text-white rounded-full">
                  Allergy Alert
                </span>
              )}
            </div>
            <p className="leading-relaxed pl-4 whitespace-pre-wrap">
              {caseData.drug_allergy_history || 'No known drug allergies (NKDA).'}
            </p>
          </div>

          {/* Family History */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h4 className="text-slate-900 font-bold mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              4. Family Medical History
            </h4>
            <p className="text-slate-700 leading-relaxed pl-4 whitespace-pre-wrap">
              {caseData.family_history || 'Non-contributory.'}
            </p>
          </div>

          {/* Uploaded Documents / Reports / X-Ray Gallery */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h4 className="text-slate-900 font-bold flex items-center gap-2">
              <Image className="w-4 h-4 text-green-600" />
              <span>5. Uploaded Medical Documents & Diagnostics ({attachments.length})</span>
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
