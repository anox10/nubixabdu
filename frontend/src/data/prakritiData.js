// Comprehensive Ayurvedic Prakriti (Constitutional / Dosha) Data & Engine
// 24 questions — one per dosha tendency

export const PRAKRITI_CATEGORIES = [
  { id: 'all', name: 'All 24 Parameters' },
  { id: 'physical', name: 'Physical Build & Features' },
  { id: 'physiology', name: 'Metabolism, Digestion & Sleep' },
  { id: 'temperament', name: 'Energy, Mind & Emotional Patterns' }
];

export const PRAKRITI_QUESTIONS = [
  // ── Physical Build & Features (1-6) ──
  {
    id: 'body_frame',
    num: 1,
    category: 'physical',
    title: 'Body Frame & Build',
    hint: 'Bone structure, body weight tendencies and overall silhouette',
    options: [
      { dosha: 'VATA', label: 'Slender, thin, difficulty gaining weight', description: 'Light bone structure, prominent joints/clavicles, tends to stay thin.' },
      { dosha: 'PITTA', label: 'Medium, athletic, well-proportioned build', description: 'Symmetrical musculature, moderate frame, stable body weight.' },
      { dosha: 'KAPHA', label: 'Broad, heavy, solid build, gains weight easily', description: 'Dense bone structure, wide shoulders/hips, holds physical strength.' }
    ]
  },
  {
    id: 'skin',
    num: 2,
    category: 'physical',
    title: 'Skin Texture & Complexion',
    hint: 'Moisture level, temperature and tendency to skin reactions',
    options: [
      { dosha: 'VATA', label: 'Dry, rough, thin, cool to touch', description: 'Prone to cracking, chapping, calluses, or dullness in winter.' },
      { dosha: 'PITTA', label: 'Warm, sensitive, reddish or fair complexion', description: 'Prone to freckles, moles, sunburns, redness or inflammatory acne.' },
      { dosha: 'KAPHA', label: 'Smooth, soft, oily, thick, cool & radiant', description: 'Well-hydrated, thick skin, retains youthful glow and elasticity.' }
    ]
  },
  {
    id: 'hair',
    num: 3,
    category: 'physical',
    title: 'Hair Characteristics',
    hint: 'Natural hair density, texture, thickness and scalp tendencies',
    options: [
      { dosha: 'VATA', label: 'Dry, thin, brittle, curly or frizzy', description: 'Prone to split ends, dandruff and dull luster.' },
      { dosha: 'PITTA', label: 'Fine, soft, straight, prone to early thinning/greying', description: 'Silky texture, blonde/reddish/brown tint, prone to hair fall.' },
      { dosha: 'KAPHA', label: 'Thick, dense, lustrous, wavy, dark & deeply rooted', description: 'Abundant volume, oily scalp, strong natural sheen.' }
    ]
  },
  {
    id: 'eyes',
    num: 4,
    category: 'physical',
    title: 'Eyes & Gaze',
    hint: 'Eye size, moisture, brightness and gaze dynamics',
    options: [
      { dosha: 'VATA', label: 'Small, dry, active, blinking frequently', description: 'Quick eye movements, slightly dull sclera, prone to dry eyes.' },
      { dosha: 'PITTA', label: 'Medium, sharp, piercing gaze, light-sensitive', description: 'Bright, penetrating look, prone to red/inflamed eyes from screens.' },
      { dosha: 'KAPHA', label: 'Large, calm, attractive with thick eyelashes', description: 'Prominent white sclera, steady tranquil gaze, clear moisture.' }
    ]
  },
  {
    id: 'weight_tendency',
    num: 5,
    category: 'physical',
    title: 'Weight Tendency',
    hint: 'How easily weight changes and body composition',
    options: [
      { dosha: 'VATA', label: 'Hard to gain, easy to lose; irregular appetite drives weight changes', description: 'Weight fluctuates, often underweight for frame.' },
      { dosha: 'PITTA', label: 'Moderate; gains weight with rich/rich foods, loses with stress', description: 'Muscular but can gain belly fat with poor diet.' },
      { dosha: 'KAPHA', label: 'Easy to gain, hard to lose; solid, heavy frame', description: 'Stocky build, weight settles slowly but stays.' }
    ]
  },
  {
    id: 'pulse',
    num: 6,
    category: 'physical',
    title: 'Pulse & Heartbeat',
    hint: 'Resting heart feel and circulation patterns',
    options: [
      { dosha: 'VATA', label: 'Thin, fast, irregular, hard to locate', description: 'Pulse feels light, quick, and may skip.' },
      { dosha: 'PITTA', label: 'Strong, bounding, warm, regular', description: 'Pulse feels forceful and easy to find.' },
      { dosha: 'KAPHA', label: 'Slow, steady, deep, calm', description: 'Pulse feels slow, smooth and relaxed.' }
    ]
  },

  // ── Metabolism, Digestion & Sleep (7-12) ──
  {
    id: 'digestion',
    num: 7,
    category: 'physiology',
    title: 'Appetite & Digestion',
    hint: 'Hunger consistency, digestive strength and post-meal comfort',
    options: [
      { dosha: 'VATA', label: 'Irregular (Vishamagni) – variable hunger, prone to gas/bloating', description: 'Sometimes ravenous, sometimes forgets to eat; prone to flatulence.' },
      { dosha: 'PITTA', label: 'Sharp / Strong (Tikshnagni) – intense hunger, irritable if delayed', description: 'Cannot tolerate skipping meals; prone to hyperacidity or heartburn.' },
      { dosha: 'KAPHA', label: 'Slow / Steady (Mandagni) – can skip meals easily, sluggish digestion', description: 'Low constant hunger, feels heavy or sleepy after normal meals.' }
    ]
  },
  {
    id: 'thirst_diet',
    num: 8,
    category: 'physiology',
    title: 'Thirst & Dietary Cravings',
    hint: 'Daily fluid intake needs and preferred food tastes',
    options: [
      { dosha: 'VATA', label: 'Variable thirst; craves warm, nourishing & oily foods', description: 'Loves hot soups, comforting carbs, stews, warm herbal teas.' },
      { dosha: 'PITTA', label: 'Intense thirst; craves cold beverages & cooling foods', description: 'Loves iced drinks, sweet fruits, salads, mint and bitter greens.' },
      { dosha: 'KAPHA', label: 'Low thirst; craves spicy, hot, light & stimulating foods', description: 'Loves pungent spices, ginger, roasted snacks, dry and astringent tastes.' }
    ]
  },
  {
    id: 'bowel',
    num: 9,
    category: 'physiology',
    title: 'Bowel Habits & Elimination',
    hint: 'Stool consistency, frequency and regularity',
    options: [
      { dosha: 'VATA', label: 'Hard, dry, irregular, prone to constipation (Krura Koshta)', description: 'Straining, irregular days, dry or dark stools.' },
      { dosha: 'PITTA', label: 'Soft, loose, frequent 2-3 times/day (Mrdu Koshta)', description: 'Yellowish, soft stools, occasional burning sensation with spicy food.' },
      { dosha: 'KAPHA', label: 'Heavy, slow, regular once daily (Madhyama Koshta)', description: 'Well-formed, regular morning evacuation, never rushed.' }
    ]
  },
  {
    id: 'sleep',
    num: 10,
    category: 'physiology',
    title: 'Sleep Quality & Duration',
    hint: 'Ease of falling asleep, depth of rest and waking state',
    options: [
      { dosha: 'VATA', label: 'Light, interrupted, difficulty falling asleep (4-6 hrs)', description: 'Wakes up at slight sounds, active dreams, mind races at bedtime.' },
      { dosha: 'PITTA', label: 'Moderate, sound, wakes up feeling alert or warm (6-8 hrs)', description: 'Falls asleep quickly, vivid/colorful dreams, wakes refreshed.' },
      { dosha: 'KAPHA', label: 'Deep, heavy, prolonged sleep, hard to wake up (8-10+ hrs)', description: 'Sound unbroken sleep, morning grogginess, loves afternoon naps.' }
    ]
  },
  {
    id: 'temperature',
    num: 11,
    category: 'physiology',
    title: 'Body Temperature Preference',
    hint: 'How your body reacts to hot and cold environments',
    options: [
      { dosha: 'VATA', label: 'Often feels cold; cold hands/feet, loves warmth', description: 'Dislikes drafts, craves warm rooms and hot drinks.' },
      { dosha: 'PITTA', label: 'Often feels warm/hot; sensitive to heat', description: 'Prefers cool environments, may sweat easily.' },
      { dosha: 'KAPHA', label: 'Usually comfortable/cool; tolerates cold', description: 'Feels fine in moderate temperatures, dislikes damp cold.' }
    ]
  },
  {
    id: 'sweating',
    num: 12,
    category: 'physiology',
    title: 'Sweating Pattern',
    hint: 'How much and when you sweat during activity or heat',
    options: [
      { dosha: 'VATA', label: 'Minimal sweating; dry skin even with exertion', description: 'Rarely perspires, skin stays dry.' },
      { dosha: 'PITTA', label: 'Moderate to heavy sweating; body heats up quickly', description: 'Sweats with exertion, may have body odor.' },
      { dosha: 'KAPHA', label: 'Mild sweating; perspires slowly and steadily', description: 'Takes time to break a sweat, stays cool longer.' }
    ]
  },

  // ── Energy, Mind & Emotional Patterns (13-24) ──
  {
    id: 'energy',
    num: 13,
    category: 'temperament',
    title: 'Physical Stamina & Energy Pattern',
    hint: 'Energy output curve, physical endurance and fatigue recovery',
    options: [
      { dosha: 'VATA', label: 'Short bursts of high energy, quickly depleted', description: 'Restless activity, sudden enthusiasm followed by rapid fatigue.' },
      { dosha: 'PITTA', label: 'Moderate, focused energy with strong competitive drive', description: 'Goal-oriented stamina, pushes through challenges with discipline.' },
      { dosha: 'KAPHA', label: 'High steady endurance, methodical & slow to tire', description: 'Slow to start physical activity, but sustains long periods effortlessly.' }
    ]
  },
  {
    id: 'daily_energy',
    num: 14,
    category: 'temperament',
    title: 'Daily Energy Pattern',
    hint: 'When you feel most alert and productive during the day',
    options: [
      { dosha: 'VATA', label: 'Peak in morning, dips mid-day, flares evening; erratic', description: 'Best energy is unpredictable, changes hourly.' },
      { dosha: 'PITTA', label: 'Peak mid-morning to afternoon; strong through midday', description: 'Sharpest between 10am-2pm, may skip meals when busy.' },
      { dosha: 'KAPHA', label: 'Slow start, builds through morning, steady all day', description: 'Gains momentum, sustains energy long, sleeps well.' }
    ]
  },
  {
    id: 'exercise',
    num: 15,
    category: 'temperament',
    title: 'Exercise & Movement Preference',
    hint: 'Natural inclination toward physical activity',
    options: [
      { dosha: 'VATA', label: 'Varied, quick, creative movement; likes dancing, cycling', description: 'Bored by repetition, prefers variety and spontaneity.' },
      { dosha: 'PITTA', label: 'Goal-oriented, competitive, likes challenge and intensity', description: 'Enjoys sports, tracking performance, pushing limits.' },
      { dosha: 'KAPHA', label: 'Steady, sustained, gentle movement; likes walking, swimming', description: 'Prefers regular routine, dislikes overexertion.' }
    ]
  },
  {
    id: 'stress_response',
    num: 16,
    category: 'temperament',
    title: 'Stress & Worry Response',
    hint: 'How you react under pressure or uncertainty',
    options: [
      { dosha: 'VATA', label: 'Anxious, worried, racing thoughts, insomnia under stress', description: 'Mind spins, feels overwhelmed by change.' },
      { dosha: 'PITTA', label: 'Irritable, frustrated, perfectionist under stress', description: 'Tightens up, wants control, can be sharp-tongued.' },
      { dosha: 'KAPHA', label: 'Withdraws, slows down, resists change under stress', description: 'Stays calm but may become lethargic or stubborn.' }
    ]
  },
  {
    id: 'communication',
    num: 17,
    category: 'temperament',
    title: 'Communication Style',
    hint: 'How you naturally express yourself',
    options: [
      { dosha: 'VATA', label: 'Fast, talkative, creative, jumps between topics', description: 'Enjoys storytelling, may forget details mid-sentence.' },
      { dosha: 'PITTA', label: 'Direct, precise, argumentative, loves debate', description: 'Speaks to convince, can be sharp or critical.' },
      { dosha: 'KAPHA', label: 'Slow, calm, deliberate, thoughtful listener', description: 'Speaks after thinking, avoids conflict, steady.' }
    ]
  },
  {
    id: 'learning',
    num: 18,
    category: 'temperament',
    title: 'Learning Style',
    hint: 'How you best absorb new information',
    options: [
      { dosha: 'VATA', label: 'Quick grasp but forgets fast; learns by doing/trying', description: 'Learns in bursts, needs variety.' },
      { dosha: 'PITTA', label: 'Deep, analytical; learns by understanding systems', description: 'Likes details, logic, and evidence.' },
      { dosha: 'KAPHA', label: 'Slow but thorough; learns by repetition and routine', description: 'Needs time, retains well once learned.' }
    ]
  },
  {
    id: 'memory',
    num: 19,
    category: 'temperament',
    title: 'Memory Pattern',
    hint: 'How you remember things day to day',
    options: [
      { dosha: 'VATA', label: 'Quick to learn, quick to forget; forgets names/dates', description: 'Memories are vivid but fleeting.' },
      { dosha: 'PITTA', label: 'Sharp, photographic; remembers facts and details', description: 'Retains data, lists, and technical info well.' },
      { dosha: 'KAPHA', label: 'Slow to learn but never forgets; strong long-term memory', description: 'Remembers events, people, and feelings for years.' }
    ]
  },
  {
    id: 'emotions',
    num: 20,
    category: 'temperament',
    title: 'Emotional Tendencies',
    hint: 'Your natural emotional baseline',
    options: [
      { dosha: 'VATA', label: 'Enthusiastic, imaginative, anxious, fearful', description: 'Moods shift quickly; joyful one moment, worried the next.' },
      { dosha: 'PITTA', label: 'Passionate, focused, angry, jealous', description: 'Intense feelings, competitive, hates unfairness.' },
      { dosha: 'KAPHA', label: 'Calm, loving, attached, resistant to change', description: 'Steady emotions, slow to anger, very loyal.' }
    ]
  },
  {
    id: 'concentration',
    num: 21,
    category: 'temperament',
    title: 'Concentration & Focus',
    hint: 'Ability to sustain attention on a task',
    options: [
      { dosha: 'VATA', label: 'Scattered, distracted, multitasks but completes little', description: 'Mind wanders, needs novelty to stay engaged.' },
      { dosha: 'PITTA', label: 'Intense, laser-like focus; obsessed with goals', description: 'Can hyperfocus but burns out.' },
      { dosha: 'KAPHA', label: 'Steady, patient focus; slow to start but persistent', description: 'Sticks with tasks, dislikes rushing.' }
    ]
  },
  {
    id: 'social',
    num: 22,
    category: 'temperament',
    title: 'Social & Solitude Preference',
    hint: 'How you recharge socially',
    options: [
      { dosha: 'VATA', label: 'Social butterfly; meets many, connects briefly', description: 'Enjoys variety, dislikes routine social circles.' },
      { dosha: 'PITTA', label: 'Selective social; values meaningful conversation', description: 'Prefers depth over breadth, can be dominating.' },
      { dosha: 'KAPHA', label: 'Loyal, few close friends; enjoys home and routine', description: 'Steady relationships, dislikes change.' }
    ]
  },
  {
    id: 'weather_pref',
    num: 23,
    category: 'temperament',
    title: 'Weather & Season Preference',
    hint: 'Which season and climate feels most comfortable',
    options: [
      { dosha: 'VATA', label: 'Loves warm, sunny, dry weather; dislikes cold/wind', description: 'Feels best in summer, struggles in winter.' },
      { dosha: 'PITTA', label: 'Loves cool, breezy, moderate weather; dislikes heat', description: 'Feels best in spring/autumn, struggles in summer.' },
      { dosha: 'KAPHA', label: 'Lives in most weather; dislikes damp, cold, rainy', description: 'Feels best in dry warmth, struggles in wet cold.' }
    ]
  },
  {
    id: 'appetite_regularity',
    num: 24,
    category: 'temperament',
    title: 'Meal Regularity',
    hint: 'How consistent your eating patterns are',
    options: [
      { dosha: 'VATA', label: 'Irregular; sometimes skips, sometimes binges', description: 'Eating times change daily, appetite varies.' },
      { dosha: 'PITTA', label: 'Strong routine; gets irritable if meal is late', description: 'Need regular meals, sharp hunger signals.' },
      { dosha: 'KAPHA', label: 'Steady; can skip a meal comfortably', description: 'Flexible appetite, no urgency around food.' }
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
// Backward-compat exports for CaseModal


export function parsePrakritiData(jointAssessment) {
  if (!jointAssessment) return null;
  if (typeof jointAssessment === "string" && jointAssessment.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(jointAssessment);
      if (parsed.type === "prakriti_v2" || parsed.dominant || parsed.answers) return { isStructured: true, ...parsed };
    } catch {}
  }
  let detectedDosha = "VATA";
  if (/pitta/i.test(jointAssessment)) detectedDosha = "PITTA";
  else if (/kapha/i.test(jointAssessment)) detectedDosha = "KAPHA";
  return { isStructured: false, rawText: jointAssessment, detectedDosha, summary: jointAssessment };
}
