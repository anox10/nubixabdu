import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { ClipboardList, PlusCircle, Clock, Image, ArrowRight } from 'lucide-react';
import CaseModal from '../../components/CaseModal';

export default function MyCases({ setActivePage }) {
  const { t } = useLanguage();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    async function fetchCases() {
      try {
        setLoading(true);
        const data = await api.getMyCases();
        setCases(data.cases || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCases();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-7 h-7 text-green-600" />
            <span>{t('patient.mySubmittedCases') || 'My Submitted Cases'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('myCases.subtitle') || 'Historical medical intake records and diagnostic document attachments.'}
          </p>
        </div>

        <button
          onClick={() => setActivePage('patient-new-case')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('patient.newCaseUpload') || 'New Case & Upload'}</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">{t('patient.loadingCases') || 'Loading clinical case history...'}</div>
      ) : cases.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <p className="text-slate-600 font-bold text-sm">{t('patient.noCasesYet') || 'No clinical cases submitted yet.'}</p>
          <button
            onClick={() => setActivePage('patient-new-case')}
            className="px-5 py-2.5 bg-green-600 text-white font-extrabold text-xs rounded-xl shadow-xs"
          >
            {t('myCases.submitFirst') || 'Submit First Case Record'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cases.map((c) => {
            const hasAttachments = c.attachment_urls && c.attachment_urls.length > 0;
            return (
              <div
                key={c.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-slate-700">{t('patient.caseId') || 'Case ID:'} {c.id}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(c.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-green-700">{t('patient.chiefComplaint') || 'Chief Complaint'}</h4>
                    <p className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-2">
                      {c.chief_complaint}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {hasAttachments ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-800 text-xs font-bold rounded-xl border border-green-200">
                        <Image className="w-3.5 h-3.5 text-green-600" />
                        <span>{c.attachment_urls.length} {t('patient.attachment') || 'Attachment'}{c.attachment_urls.length > 1 ? 's' : ''}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">{t('patient.noCaseAttached') || 'No document attachments'}</span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCase(c)}
                    className="text-xs font-bold text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    {t('patient.inspectorCaseDocs') || 'View Record & Docs'} <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActivePage('patient-book')}
                    className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-800 text-xs font-bold rounded-xl border border-green-200"
                  >
                    {t('patient.bookDoctor') || 'Book Doctor'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CaseModal caseData={selectedCase} onClose={() => setSelectedCase(null)} />
    </div>
  );
}
