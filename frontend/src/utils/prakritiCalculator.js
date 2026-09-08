// Reusable Prakriti scoring utility
// Pure function — easy to test, modify, or replace

import { PRAKRITI_QUESTIONS } from '../data/prakritiData';

/**
 * Calculate Prakriti result from a map of { questionId: 'VATA'|'PITTA'|'KAPHA' }
 * Returns a plain, serialisable result object.
 */
export function calculatePrakritiResult(answers = {}) {
  let vata = 0;
  let pitta = 0;
  let kapha = 0;

  PRAKRITI_QUESTIONS.forEach((q) => {
    const chosen = answers[q.id];
    if (chosen === 'VATA') vata++;
    else if (chosen === 'PITTA') pitta++;
    else if (chosen === 'KAPHA') kapha++;
  });

  const totalAnswered = vata + pitta + kapha;
  const totalQuestions = PRAKRITI_QUESTIONS.length;

  if (totalAnswered === 0) {
    return {
      vataScore: 0,
      pittaScore: 0,
      kaphaScore: 0,
      vataPercent: 33,
      pittaPercent: 33,
      kaphaPercent: 34,
      dominantType: 'tridosha',
      dominantLabel: 'Balanced (Tridoshic Assessment In-Progress)',
      primaryDosha: null,
      secondaryDosha: null,
      totalAnswered,
      totalQuestions
    };
  }

  const vataPercent = Math.round((vata / totalAnswered) * 100);
  const pittaPercent = Math.round((pitta / totalAnswered) * 100);
  const kaphaPercent = Math.max(0, 100 - vataPercent - pittaPercent);

  const scores = [
    { dosha: 'VATA', name: 'Vata', count: vata, pct: vataPercent },
    { dosha: 'PITTA', name: 'Pitta', count: pitta, pct: pittaPercent },
    { dosha: 'KAPHA', name: 'Kapha', count: kapha, pct: kaphaPercent }
  ].sort((a, b) => b.count - a.count);

  let dominantType = 'single';
  let dominantLabel = '';

  const diff12 = scores[0].count - scores[1].count;
  const diff23 = scores[1].count - scores[2].count;

  if (scores[0].count === scores[2].count || (diff12 <= 1 && diff23 <= 1 && totalAnswered >= 6)) {
    dominantLabel = 'Sama Prakriti (Tridoshic Balance)';
    dominantType = 'tridosha';
  } else if (diff12 <= 1 && totalAnswered >= 4) {
    dominantLabel = `${scores[0].name}-${scores[1].name} Dual Prakriti (Dvidoshaja)`;
    dominantType = 'dual';
  } else {
    dominantLabel = `${scores[0].name} Dominant Prakriti (Ekadoshaja)`;
    dominantType = 'single';
  }

  return {
    vataScore: vata,
    pittaScore: pitta,
    kaphaScore: kapha,
    vataPercent,
    pittaPercent,
    kaphaPercent,
    dominantType,
    dominantLabel,
    primaryDosha: scores[0].dosha,
    secondaryDosha: scores[1].dosha,
    totalAnswered,
    totalQuestions
  };
}

/** Dosha metadata for rendering */
export const DOSHA_INFO = {
  VATA: { name: 'Vata', elements: 'Air + Space', color: 'indigo', icon: '🌬️', bgLight: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', barColor: 'bg-indigo-500', qualities: 'Light, Cold, Dry, Rough, Mobile, Quick' },
  PITTA: { name: 'Pitta', elements: 'Fire + Water', color: 'amber', icon: '🔥', bgLight: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800 border-amber-200', barColor: 'bg-amber-500', qualities: 'Hot, Sharp, Light, Oily, Spreading, Penetrating' },
  KAPHA: { name: 'Kapha', elements: 'Earth + Water', color: 'emerald', icon: '💧', bgLight: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', barColor: 'bg-emerald-500', qualities: 'Heavy, Slow, Cool, Oily, Smooth, Stable' }
};

/** Wellness suggestions keyed by dosha */
export const WELLNESS_SUGGESTIONS = {
  VATA: [
    'Follow a regular daily routine — wake, eat, and sleep at the same times.',
    'Choose warm, cooked, nourishing meals; avoid cold, raw, or dry foods.',
    'Practice gentle warming exercise like walking, yoga, or tai chi.',
    'Use warm oil self-massage (abhyanga) before bathing.',
    'Create a calm evening routine — limit screen time, try warm drinks.'
  ],
  PITTA: [
    'Stay cool — prefer moderate exercise, avoid midday heat.',
    'Eat cooling, fresh foods; reduce spicy, oily, or acidic items.',
    'Practice relaxation — meditation, nature walks, gentle breathing.',
    'Keep a regular sleep schedule; avoid late-night work.',
    'Spend time in nature, near water or greenery to cool the mind.'
  ],
  KAPHA: [
    'Stay active — regular moderate exercise, avoid sedentary habits.',
    'Prefer light, warm, spicy foods; reduce heavy, oily, sweet items.',
    'Try new activities to avoid routine stagnation.',
    'Practice energising breathwork or brisk morning walks.',
    'Keep a consistent wake time; avoid oversleeping.'
  ]
};

/** General characteristics per dosha type */
export const CHARACTERISTICS = {
  VATA: ['Creative, quick-thinking, enthusiastic', 'Variable appetite and digestion', 'Light, interrupted sleep', 'Cold hands/feet, dry skin'],
  PITTA: ['Focused, ambitious, decisive', 'Strong appetite, gets irritable if delayed', 'Moderate sleep, vivid dreams', 'Warm body, sensitive skin'],
  KAPHA: ['Calm, patient, steady', 'Steady appetite, can skip meals', 'Deep, heavy sleep', 'Cool, smooth, oily skin']
};