import React from 'react';
import { calculatePrakritiResult, WELLNESS_SUGGESTIONS, CHARACTERISTICS, DOSHA_INFO } from '../utils/prakritiCalculator';
import { useLanguage } from '../context/LanguageContext';
import { PRAKRITI_QUESTIONS } from '../data/prakritiData';

export default function PrakritiResult({ result, answers, onRetake, onSave, onPrint, saveStatus, setActivePage }) {
  const { t } = useLanguage();
  const { dominantLabel, dominantType, primaryDosha, secondaryDosha, vataPercent, pittaPercent, kaphaPercent, vataScore, pittaScore, kaphaScore, totalAnswered, totalQuestions } = result;

  const primaryInfo = DOSHA_INFO[primaryDosha] || {};
  const secondaryInfo = secondaryDosha ? DOSHA_INFO[secondaryDosha] : null;
  const primaryChars = CHARACTERISTICS[primaryDosha] || [];
  const secondaryChars = secondaryDosha ? CHARACTERISTICS[secondaryDosha] : [];
  const primaryTips = WELLNESS_SUGGESTIONS[primaryDosha] || [];
  const secondaryTips = secondaryDosha ? WELLNESS_SUGGESTIONS[secondaryDosha] : [];

  const doshaBars = [
    { key: 'vata', label: 'Vata', pct: vataPercent, color: 'bg-indigo-500', textColor: 'text-indigo-700', bgLight: 'bg-indigo-50' },
    { key: 'pitta', label: 'Pitta', pct: pittaPercent, color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50' },
    { key: 'kapha', label: 'Kapha', pct: kaphaPercent, color: 'bg-emerald-500', textColor: 'text-emerald-700', bgLight: 'bg-emerald-50' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold mb-4">
          🌿 {t('prakriti.title')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('prakriti.title')}
        </h1>
        <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">
          {t('prakriti.subtitle')}
        </p>
      </div>

      {/* Main Result Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-fade-in">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Prakriti</p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{dominantLabel}</h2>
          <p className="text-xs text-slate-500 mt-1">
            Based on {totalAnswered} of {totalQuestions} questions answered
          </p>
        </div>

        {/* Score Bars */}
        <div className="space-y-5 mb-8">
          {doshaBars.map(d => (
            <div key={d.key}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className={`font-bold ${d.textColor}`}>{d.label}</span>
                <span className="font-black text-slate-700">{d.pct}%</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${d.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${d.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Visual donut-style summary */}
        <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
          {doshaBars.map(d => (
            <div key={d.key} className="text-center">
              <div className={`w-16 h-16 rounded-full ${d.bgLight} border-4 border-white shadow flex items-center justify-center mx-auto mb-2`}>
                <span className={`text-lg font-black ${d.textColor}`}>{d.pct}%</span>
              </div>
              <span className="text-xs font-bold text-slate-600">{d.label}</span>
            </div>
          ))}
        </div>

        {/* Dominant Dosha Info */}
        {primaryInfo.name && (
          <div className={`rounded-2xl p-5 border ${primaryInfo.bgLight || 'bg-slate-50'} ${primaryInfo.border || 'border-slate-200'} mb-6`}>
            <h3 className={`text-base font-extrabold ${primaryInfo.textColor || 'text-slate-900'} flex items-center gap-2`}>
              <span>{primaryInfo.icon || '🌿'}</span>
              {primaryInfo.name} — {primaryInfo.elements}
            </h3>
            <p className={`text-xs mt-1 ${primaryInfo.textColor || 'text-slate-600'}`}>
              {primaryInfo.qualities || ''}
            </p>
          </div>
        )}
      </div>

      {/* Characteristics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
            <span>📋</span> {t('prakriti.commonCharacteristics')}
          </h3>
          <ul className="space-y-2">
            {primaryChars.map((c, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span> {c}
              </li>
            ))}
            {secondaryChars.map((c, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span> {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
            <span>💡</span> {t('prakriti.lifestyleSuggestions')}
          </h3>
          <ul className="space-y-2">
            {primaryTips.map((t, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span> {t}
              </li>
            ))}
            {secondaryTips.map((t, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs text-center">
        ⚠️ {t('prakriti.disclaimer')}
      </div>

      {/* Save status */}
      {saveStatus && (
        <p className="text-xs text-center text-green-600 font-medium">{saveStatus}</p>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pb-8">
        <button
          onClick={onRetake}
          className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors"
        >
          {t('common.retakeTest')}
        </button>
        <button
          onClick={onSave}
          className="px-6 py-3 rounded-2xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors shadow-md shadow-green-600/20"
        >
          {t('common.saveResult')}
        </button>
        <button
          onClick={onPrint}
          className="px-6 py-3 rounded-2xl bg-white text-slate-700 text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          {t('common.printResult')}
        </button>
        <button
          onClick={() => setActivePage('patient-dashboard')}
          className="px-6 py-3 rounded-2xl bg-white text-slate-700 text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          {t('common.backToDashboard')}
        </button>
      </div>
    </div>
  );
}