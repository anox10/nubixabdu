import React, { useState, useEffect, useCallback } from 'react';
import { calculatePrakritiResult, WELLNESS_SUGGESTIONS, CHARACTERISTICS, DOSHA_INFO } from '../utils/prakritiCalculator';
import { PRAKRITI_QUESTIONS } from '../data/prakritiData';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import PrakritiResult from './PrakritiResult';

const STORAGE_KEY = 'prakriti_test_progress';

export default function PrakritiTest({ setActivePage }) {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Load saved progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers && Object.keys(parsed.answers).length > 0) {
          setAnswers(parsed.answers);
          setCurrentQuestion(parsed.currentQuestion || 0);
        }
      }
    } catch (e) {
      console.warn('Failed to load prakriti progress:', e);
    }
  }, []);

  // Persist progress to localStorage whenever answers change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        answers,
        currentQuestion,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save prakriti progress:', e);
    }
  }, [answers, currentQuestion]);

  const handleAnswer = useCallback((dosha) => {
    setAnimating(true);
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [PRAKRITI_QUESTIONS[currentQuestion].id]: dosha }));
      setAnimating(false);
    }, 150);
  }, [currentQuestion]);

  const canNext = !!answers[PRAKRITI_QUESTIONS[currentQuestion].id];

  const goNext = () => {
    if (!canNext) return;
    if (currentQuestion < PRAKRITI_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const goPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    const calcResult = calculatePrakritiResult(answers);
    setResult(calcResult);
    setCompleted(true);

    // Save to Supabase if authenticated
    if (user?.id) {
      setSubmitting(true);
      try {
        const { error } = await supabase.from('prakriti_assessments').insert({
          user_id: user.id,
          vata_score: calcResult.vataScore,
          pitta_score: calcResult.pittaScore,
          kapha_score: calcResult.kaphaScore,
          vata_percentage: calcResult.vataPercent,
          pitta_percentage: calcResult.pittaPercent,
          kapha_percentage: calcResult.kaphaPercent,
          result_type: calcResult.dominantType,
          answers: answers
        });
        if (error) throw error;
        setSaveStatus('Result saved to your profile.');
      } catch (err) {
        console.error('Failed to save prakriti result:', err);
        setSaveStatus('Could not save result — saved locally only.');
      } finally {
        setSubmitting(false);
      }
    } else {
      setSaveStatus('Saved locally (sign in to save to your profile).');
    }

    // Clear local storage once completed
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setCompleted(false);
    setResult(null);
    setSaveStatus('');
    localStorage.removeItem(STORAGE_KEY);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Results view ---
  if (completed && result) {
    return (
      <PrakritiResult
        result={result}
        answers={answers}
        onRetake={handleRetake}
        onSave={() => {/* already saved on complete */}}
        onPrint={handlePrint}
        saveStatus={saveStatus}
        setActivePage={setActivePage}
      />
    );
  }

  // --- Questionnaire view ---
  const question = PRAKRITI_QUESTIONS[currentQuestion];
  const selectedAnswer = answers[question.id];
  const totalQuestions = PRAKRITI_QUESTIONS.length;
  const progress = Math.round(((currentQuestion + (selectedAnswer ? 1 : 0)) / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold mb-4">
          🌿 Ayurvedic Prakriti Assessment
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Discover Your Prakriti
        </h1>
        <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">
          Answer a few questions to understand your predominant Ayurvedic constitution.
        </p>
        <p className="text-slate-400 mt-1 text-xs">
          Prakriti refers to an individual's natural constitutional tendencies according to Ayurveda.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
          <span>⏱ ~5 minutes</span>
          <span>•</span>
          <span>{totalQuestions} questions</span>
          <span>•</span>
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
        ⚠️ This assessment is based on traditional Ayurvedic concepts for educational purposes only. It is not a medical diagnosis or a substitute for professional medical advice.
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            {question.category}
          </span>
          {question.sanskrit && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
              {question.sanskrit}
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-3 mb-1">
          {question.title}
        </h2>
        <p className="text-xs text-slate-400 mb-6">{question.hint}</p>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt.dosha;
            const doshaInfo = DOSHA_INFO[opt.dosha];
            return (
              <button
                key={opt.dosha}
                onClick={() => handleAnswer(opt.dosha)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-4 ${
                  isSelected
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                    : 'border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                }`}
                aria-pressed={isSelected}
                aria-label={`${opt.dosha}: ${opt.label}`}
              >
                <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${
                  isSelected ? 'bg-green-600 text-white' : 'bg-white text-slate-400 border border-slate-200'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <div>
                  <p className={`text-sm font-bold ${isSelected ? 'text-green-900' : 'text-slate-800'}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={goPrevious}
            disabled={currentQuestion === 0}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              currentQuestion === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={goNext}
            disabled={!canNext}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              canNext
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {currentQuestion === totalQuestions - 1 ? 'View Results →' : 'Next →'}
          </button>
        </div>

        {/* Question dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
          {PRAKRITI_QUESTIONS.map((q, idx) => {
            const answered = !!answers[q.id];
            const isCurrent = idx === currentQuestion;
            return (
              <button
                key={q.id}
                onClick={() => {
                  if (answered || idx < currentQuestion) setCurrentQuestion(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isCurrent ? 'bg-green-600 w-6' : answered ? 'bg-green-300' : 'bg-slate-200'
                }`}
                aria-label={`Go to question ${idx + 1}`}
                title={`Question ${idx + 1}: ${q.title}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}