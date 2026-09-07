// Comprehensive Ayurvedic Prakriti (Constitutional / Dosha) Data & Engine

export const PRAKRITI_CATEGORIES = [
  { id: 'all', name: 'All 12 Parameters' },
  { id: 'physical', name: 'Physical Build & Features' },
  { id: 'physiology', name: 'Metabolism, Digestion & Sleep' },
  { id: 'temperament', name: 'Energy, Joints & Mind' }
];

export const PRAKRITI_QUESTIONS = [
  // ── Physical Build & Features (1-4) ──
  {
    id: 'body_frame',
    num: 1,
    category: 'physical',
    title: 'Body Frame & Build',
    sanskrit: 'Sharira Rachana',
    hint: 'Bone structure, body weight tendencies and overall silhouette',
    options: [
      {
        dosha: 'VATA',
        label: 'Slender, thin, difficulty gaining weight',
        description: 'Light bone structure, prominent joints/clavicles, tends to stay thin.'
      },
      {
        dosha: 'PITTA',
        label: 'Medium, athletic, well-proportioned build',
        description: 'Symmetrical musculature, moderate frame, stable body weight.'
      },
      {
        dosha: 'KAPHA',
        label: 'Broad, heavy, solid build, gains weight easily',
        description: 'Dense bone structure, wide shoulders/hips, holds physical strength.'
      }
    ]
  },
  {
    id: 'skin',
    num: 2,
    category: 'physical',
    title: 'Skin Texture & Complexion',
    sanskrit: 'Twak',
    hint: 'Moisture level, temperature and tendency to skin reactions',
    options: [
      {
        dosha: 'VATA',
        label: 'Dry, rough, thin, cool to touch',
        description: 'Prone to cracking, chapping, calluses, or dullness in winter.'
      },
      {
        dosha: 'PITTA',
        label: 'Warm, sensitive, reddish or fair complexion',
        description: 'Prone to freckles, moles, sunburns, redness or inflammatory acne.'
      },
      {
        dosha: 'KAPHA',
        label: 'Smooth, soft, oily, thick, cool & radiant',
        description: 'Well-hydrated, thick skin, retains youthful glow and elasticity.'
      }
    ]
  },
  {
    id: 'hair',
    num: 3,
    category: 'physical',
    title: 'Hair Characteristics',
    sanskrit: 'Kesha',
    hint: 'Natural hair density, texture, thickness and scalp tendencies',
    options: [
      {
        dosha: 'VATA',
        label: 'Dry, thin, brittle, curly or frizzy',
        description: 'Prone to split ends, dandruff and dull luster.'
      },
      {
        dosha: 'PITTA',
        label: 'Fine, soft, straight, prone to early thinning/greying',
        description: 'Silky texture, blonde/reddish/brown tint, prone to hair fall.'
      },
      {
        dosha: 'KAPHA',
        label: 'Thick, dense, lustrous, wavy, dark & deeply rooted',
        description: 'Abundant volume, oily scalp, strong natural sheen.'
      }
    ]
  },
  {
    id: 'eyes',
    num: 4,
    category: 'physical',
    title: 'Eyes & Gaze',
    sanskrit: 'Netra',
    hint: 'Eye size, moisture, brightness and gaze dynamics',
    options: [
      {
        dosha: 'VATA',
        label: 'Small, dry, active, blinking frequently',
        description: 'Quick eye movements, slightly dull sclera, prone to dry eyes.'
      },
      {
        dosha: 'PITTA',
        label: 'Medium, sharp, piercing gaze, light-sensitive',
        description: 'Bright, penetrating look, prone to red/inflamed eyes from screens.'
      },
      {
        dosha: 'KAPHA',
        label: 'Large, calm, attractive with thick eyelashes',
        description: 'Prominent white sclera, steady tranquil gaze, clear moisture.'
      }
    ]
  },

  // ── Metabolism, Digestion & Sleep (5-8) ──
  {
    id: 'digestion',
    num: 5,
    category: 'physiology',
    title: 'Appetite & Digestion',
    sanskrit: 'Agni',
    hint: 'Hunger consistency, digestive strength and post-meal comfort',
    options: [
      {
        dosha: 'VATA',
        label: 'Irregular (Vishamagni) – variable hunger, prone to gas/bloating',
        description: 'Sometimes ravenous, sometimes forgets to eat; prone to flatulence.'
      },
      {
        dosha: 'PITTA',
        label: 'Sharp / Strong (Tikshnagni) – intense hunger, irritable if delayed',
        description: 'Cannot tolerate skipping meals; prone to hyperacidity or heartburn.'
      },
      {
        dosha: 'KAPHA',
        label: 'Slow / Steady (Mandagni) – can skip meals easily, sluggish digestion',
        description: 'Low constant hunger, feels heavy or sleepy after normal meals.'
      }
    ]
  },
  {
    id: 'thirst_diet',
    num: 6,
    category: 'physiology',
    title: 'Thirst & Dietary Cravings',
    sanskrit: 'Trishna & Ahara',
    hint: 'Daily fluid intake needs and preferred food tastes',
    options: [
      {
        dosha: 'VATA',
        label: 'Variable thirst; craves warm, nourishing & oily foods',
        description: 'Loves hot soups, comforting carbs, stews, warm herbal teas.'
      },
      {
        dosha: 'PITTA',
        label: 'Intense thirst; craves cold beverages & cooling foods',
        description: 'Loves iced drinks, sweet fruits, salads, mint and bitter greens.'
      },
      {
        dosha: 'KAPHA',
        label: 'Low thirst; craves spicy, hot, light & stimulating foods',
        description: 'Loves pungent spices, ginger, roasted snacks, dry and astringent tastes.'
      }
    ]
  },
  {
    id: 'bowel',
    num: 7,
    category: 'physiology',
    title: 'Bowel Habits & Elimination',
    sanskrit: 'Koshta',
    hint: 'Stool consistency, frequency and regularity',
    options: [
      {
        dosha: 'VATA',
        label: 'Hard, dry, irregular, prone to constipation (Krura Koshta)',
        description: 'Straining, irregular days, dry or dark stools.'
      },
      {
        dosha: 'PITTA',
        label: 'Soft, loose, frequent 2-3 times/day (Mrdu Koshta)',
        description: 'Yellowish, soft stools, occasional burning sensation with spicy food.'
      },
      {
        dosha: 'KAPHA',
        label: 'Heavy, slow, regular once daily (Madhyama Koshta)',
        description: 'Well-formed, regular morning evacuation, never rushed.'
      }
    ]
  },
  {
    id: 'sleep',
    num: 8,
    category: 'physiology',
    title: 'Sleep Quality & Duration',
    sanskrit: 'Nidra',
    hint: 'Ease of falling asleep, depth of rest and waking state',
    options: [
      {
        dosha: 'VATA',
        label: 'Light, interrupted, difficulty falling asleep (4-6 hrs)',
        description: 'Wakes up at slight sounds, active dreams, mind races at bedtime.'
      },
      {
        dosha: 'PITTA',
        label: 'Moderate, sound, wakes up feeling alert or warm (6-8 hrs)',
        description: 'Falls asleep quickly, vivid/colorful dreams, wakes refreshed.'
      },
      {
        dosha: 'KAPHA',
        label: 'Deep, heavy, prolonged sleep, hard to wake up (8-10+ hrs)',
        description: 'Sound unbroken sleep, morning grogginess, loves afternoon naps.'
      }
    ]
  },

  // ── Energy, Joints & Mind (9-12) ──
  {
    id: 'weather',
    num: 9,
    category: 'temperament',
    title: 'Thermal & Weather Sensitivity',
    sanskrit: 'Satmya',
    hint: 'Reaction to cold, heat, humidity and seasonal changes',
    options: [
      {
        dosha: 'VATA',
        label: 'Dislikes cold & dry wind; loves warmth & sunshine',
        description: 'Cold hands/feet, thrives in warm baths and summer temperatures.'
      },
      {
        dosha: 'PITTA',
        label: 'Dislikes heat, humidity & direct sun; loves cool breezes',
        description: 'Sweats easily, thrives in air-conditioned spaces and chilly weather.'
      },
      {
        dosha: 'KAPHA',
        label: 'Dislikes cold & damp/rainy weather; likes dry warmth',
        description: 'Tolerates most temperatures well, feels congested in wet cold.'
      }
    ]
  },
  {
    id: 'energy',
    num: 10,
    category: 'temperament',
    title: 'Physical Stamina & Energy Pattern',
    sanskrit: 'Bala / Chesta',
    hint: 'Energy output curve, physical endurance and fatigue recovery',
    options: [
      {
        dosha: 'VATA',
        label: 'Short bursts of high energy, quickly depleted',
        description: 'Restless activity, sudden enthusiasm followed by rapid fatigue.'
      },
      {
        dosha: 'PITTA',
        label: 'Moderate, focused energy with strong competitive drive',
        description: 'Goal-oriented stamina, pushes through challenges with discipline.'
      },
      {
        dosha: 'KAPHA',
        label: 'High steady endurance, methodical & slow to tire',
        description: 'Slow to start physical activity, but sustains long periods effortlessly.'
      }
    ]
  },
  {
    id: 'joints',
    num: 11,
    category: 'temperament',
    title: 'Joints & Musculoskeletal Mobility',
    sanskrit: 'Sandhi',
    hint: 'Joint size, flexibility, cracking sounds and cold stiffness',
    options: [
      {
        dosha: 'VATA',
        label: 'Prominent, crack easily, popping sounds, stiff in cold',
        description: 'Knobby bones, clicking on movement, dry joint lubrication.'
      },
      {
        dosha: 'PITTA',
        label: 'Loose, flexible, moderate size, prone to warmth/inflammation',
        description: 'Good range of motion, tender when strained.'
      },
      {
        dosha: 'KAPHA',
        label: 'Large, sturdy, well-padded, well-lubricated & strong',
        description: 'Heavy solid joints, exceptional stability and cushioning.'
      }
    ]
  },
  {
    id: 'mind',
    num: 12,
    category: 'temperament',
    title: 'Mind, Memory & Stress Response',
    sanskrit: 'Manas',
    hint: 'Learning style, memory retention and emotional response under pressure',
    options: [
      {
        dosha: 'VATA',
        label: 'Quick learner, creative, forgetful; stress triggers anxiety/worry',
        description: 'Grasps concepts instantly, overthinks, worries easily under tension.'
      },
      {
        dosha: 'PITTA',
        label: 'Sharp intellect, decisive, organized; stress triggers irritability/anger',
        description: 'Analytical mind, perfectionist, impatient with mistakes or delays.'
      },
      {
        dosha: 'KAPHA',
        label: 'Calm, patient, strong long-term memory; stress triggers withdrawal',
        description: 'Takes time to learn but never forgets, peaceful, resistant to change.'
      }
    ]
  }
];

export const DOSHA_INFO = {
  VATA: {
    name: 'Vata',
    elements: 'Air + Space (Vayu & Akasha)',
    color: 'indigo',
    bgLight: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    barColor: 'bg-indigo-500',
    icon: '🌬️',
    qualities: 'Light, Cold, Dry, Rough, Mobile, Quick'
  },
  PITTA: {
    name: 'Pitta',
    elements: 'Fire + Water (Agni & Jala)',
    color: 'amber',
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    barColor: 'bg-amber-500',
    icon: '🔥',
    qualities: 'Hot, Sharp, Light, Oily, Spreading, Penetrating'
  },
  KAPHA: {
    name: 'Kapha',
    elements: 'Earth + Water (Prithvi & Jala)',
    color: 'emerald',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    barColor: 'bg-emerald-500',
    icon: '💧',
    qualities: 'Heavy, Slow, Cool, Oily, Smooth, Stable'
  }
};

/**
 * Calculates real-time Dosha counts, percentages, and constitutional classification
 */
export function calculateDoshaDistribution(answers = {}) {
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
      vataCount: 0,
      pittaCount: 0,
      kaphaCount: 0,
      totalAnswered: 0,
      totalQuestions,
      vataPct: 33,
      pittaPct: 33,
      kaphaPct: 34,
      dominant: 'Balanced (Tridoshic Assessment In-Progress)',
      dominantType: 'tridosha',
      primaryDosha: null
    };
  }

  const vataPct = Math.round((vata / totalAnswered) * 100);
  const pittaPct = Math.round((pitta / totalAnswered) * 100);
  const kaphaPct = Math.max(0, 100 - vataPct - pittaPct);

  // Determine dominant constitution
  const scores = [
    { dosha: 'VATA', name: 'Vata', count: vata, pct: vataPct },
    { dosha: 'PITTA', name: 'Pitta', count: pitta, pct: pittaPct },
    { dosha: 'KAPHA', name: 'Kapha', count: kapha, pct: kaphaPct }
  ].sort((a, b) => b.count - a.count);

  let dominant = '';
  let dominantType = 'single';
  const diff12 = scores[0].count - scores[1].count;
  const diff23 = scores[1].count - scores[2].count;

  if (scores[0].count === scores[2].count || (diff12 <= 1 && diff23 <= 1 && totalAnswered >= 6)) {
    dominant = 'Sama Prakriti (Tridoshic Balance)';
    dominantType = 'tridosha';
  } else if (diff12 <= 1 && totalAnswered >= 4) {
    dominant = `${scores[0].name}-${scores[1].name} Dual Prakriti (Dvidoshaja)`;
    dominantType = 'dual';
  } else {
    dominant = `${scores[0].name} Dominant Prakriti (Ekadoshaja)`;
    dominantType = 'single';
  }

  return {
    vataCount: vata,
    pittaCount: pitta,
    kaphaCount: kapha,
    totalAnswered,
    totalQuestions,
    vataPct,
    pittaPct,
    kaphaPct,
    dominant,
    dominantType,
    primaryDosha: scores[0].dosha,
    secondaryDosha: scores[1].dosha
  };
}

/**
 * Safely parses joint_assessment data into either structured Prakriti object or legacy fallback
 */
export function parsePrakritiData(jointAssessment) {
  if (!jointAssessment) return null;

  // Try parsing JSON
  if (typeof jointAssessment === 'string' && jointAssessment.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(jointAssessment);
      if (parsed.type === 'prakriti_v2' || parsed.dominant || parsed.answers) {
        return {
          isStructured: true,
          ...parsed
        };
      }
    } catch {
      // Not JSON, continue to string match
    }
  }

  // Fallback for legacy single-question string (e.g. "Prominent, crack easily (VATA)")
  let detectedDosha = 'VATA';
  if (/pitta/i.test(jointAssessment)) detectedDosha = 'PITTA';
  else if (/kapha/i.test(jointAssessment)) detectedDosha = 'KAPHA';

  return {
    isStructured: false,
    rawText: jointAssessment,
    detectedDosha,
    summary: jointAssessment
  };
}
