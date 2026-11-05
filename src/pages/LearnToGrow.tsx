import React, { useState } from 'react';
import {
  GraduationCap,
  Sun,
  Droplets,
  Thermometer,
  CloudRain,
  Sparkles,
  Layers,
  Globe2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
} from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Why do plants need sunlight to survive?',
    options: [
      'To keep themselves warm at night',
      'To split water and carbon dioxide into glucose food through photosynthesis',
      'To dry out the soil faster',
      'To make their flowers turn red',
    ],
    correctIndex: 1,
    explanation:
      'Sunlight photons are absorbed by chlorophyll pigments in chloroplasts. This solar energy splits water (H2O) and combines with carbon dioxide (CO2) to manufacture glucose sugar and release oxygen!',
  },
  {
    question: 'What actually happens to plant roots when you overwater a pot?',
    options: [
      'Roots drown because water fills up the air pockets, stopping oxygen absorption',
      'Roots grow twice as fast',
      'Leaves immediately turn purple',
      'Soil becomes too fertile',
    ],
    correctIndex: 0,
    explanation:
      'Plant root cells need oxygen for cellular respiration. When soil is flooded, air pockets are blocked, suffocating the roots and causing anaerobic bacteria to rot the root hairs.',
  },
  {
    question: 'Does a standard soil moisture sensor measure soil fertility?',
    options: [
      'Yes, moisture is exactly the same as soil fertility',
      'No! Moisture sensors only measure water content; EC or NPK sensors are needed for fertility',
      'Yes, because wet soil always has lots of fertilizer',
      'No, sensors cannot measure anything in soil',
    ],
    correctIndex: 1,
    explanation:
      'This is an essential scientific principle in AGROSMART! Moisture sensors measure volumetric water percentage. Soil fertility requires measuring electrical conductivity (EC) or specific nitrogen, phosphorus, and potassium ions.',
  },
  {
    question: 'What does "Soil pH" measure and why does it matter?',
    options: [
      'It measures how much sunlight hits the soil',
      'It measures acidity or alkalinity, which controls whether minerals can dissolve for root absorption',
      'It measures how many earthworms live in the soil',
      'It measures soil temperature',
    ],
    correctIndex: 1,
    explanation:
      'Soil pH measures the concentration of hydrogen ions. If soil is too acidic (pH < 5.5) or too alkaline (pH > 7.5), key nutrients chemically bind to soil particles and become locked, starving the plant even if fertilizer is present.',
  },
  {
    question: 'How does IoT smart farming help society and sustainable agriculture?',
    options: [
      'It replaces human farmers with robotic plants',
      'It saves up to 40% of fresh water, reduces chemical run-off, and empowers urban communities to grow fresh food',
      'It eliminates the need for sunlight and soil entirely',
      'It makes crops grow overnight',
    ],
    correctIndex: 1,
    explanation:
      'Smart farming uses precise sensor data to apply water and organic nutrition only when the plant genuinely needs it. This conserves fresh water reserves, protects rivers from fertilizer runoff, and boosts crop yield.',
  },
];

export const LearnToGrow: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) score++;
    });
    return score;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-stone-100">
      {/* Header */}
      <div className="bg-stone-900 rounded-3xl p-6 border border-stone-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xl">📖</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                LEARN TO GROW: Plant Science for Beginners
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                Understand how sunlight, water, soil fertility, and smart sensors work together in 9th-grade English
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Interactive Student Curriculum</span>
        </div>
      </div>

      {/* 6 Core Science Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Lesson 1: What Plants Need */}
        <div className="rounded-3xl bg-stone-900 p-5 border border-stone-800 shadow-md space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xl font-bold">
              🌱
            </div>
            <h3 className="text-sm font-extrabold text-white">1. What Plants Need to Survive</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Just like humans need food, air, and clean water, a plant relies on 5 fundamental environmental factors:
            </p>
            <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
              <li><strong>Sunlight</strong>: The ultimate energy power plant.</li>
              <li><strong>Water (H2O)</strong>: Transports minerals and creates internal pressure.</li>
              <li><strong>Air (CO2 & O2)</strong>: Leaves take CO2; roots inhale O2.</li>
              <li><strong>Soil Nutrients (NPK)</strong>: Essential minerals for tissue building.</li>
              <li><strong>Optimal Temperature</strong>: Keeps biological enzymes active.</li>
            </ul>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-950 text-[11px] text-stone-400 border border-stone-800">
            <strong>Key Rule:</strong> If even one of these 5 factors is missing, the plant cannot thrive (Liebig’s Law of the Minimum).
          </div>
        </div>

        {/* Lesson 2: Why Sunlight is Important */}
        <div className="rounded-3xl bg-stone-900 p-5 border border-stone-800 shadow-md space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center text-xl">
              ☀️
            </div>
            <h3 className="text-sm font-extrabold text-white">2. Why Sunlight is Important</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Leaves are miniature solar-powered food factories containing green organelles called <strong>chloroplasts</strong>.
            </p>
            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/60 font-mono text-[11px] text-amber-200">
              6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ (Sugar) + 6O₂ (Oxygen)
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              When light is too dim (&lt; 2,000 Lux), photosynthesis stops and leaves drop. When sunlight is too harsh (&gt; 70,000 Lux), leaves suffer sunburn.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-950 text-[11px] text-stone-400 border border-stone-800">
            <strong>Sensor Note:</strong> A BH1750 light sensor measures Lux (intensity) so we know if light is sufficient.
          </div>
        </div>

        {/* Lesson 3: Why Water is Important */}
        <div className="rounded-3xl bg-stone-900 p-5 border border-stone-800 shadow-md space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center text-xl">
              💧
            </div>
            <h3 className="text-sm font-extrabold text-white">3. Why Water is Important</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Water makes up over 85% to 95% of a healthy plant’s weight. It serves two vital missions:
            </p>
            <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
              <li><strong>Turgor Pressure:</strong> Water inflates plant cells like little water balloons, keeping stems upright.</li>
              <li><strong>Transpiration Stream:</strong> Water evaporating from leaf pores pulls dissolved soil minerals upward from roots.</li>
            </ul>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>Overwatering Danger:</strong> Soil must have air pores. Constant waterlogging drowns roots and invites fungus!
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-950 text-[11px] text-stone-400 border border-stone-800">
            <strong>Finger Rule:</strong> Never water on a fixed calendar schedule. Water only when the top layer of dirt is dry!
          </div>
        </div>

        {/* Lesson 4: What Soil Fertility & pH Mean */}
        <div className="rounded-3xl bg-stone-900 p-5 border border-stone-800 shadow-md space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center text-xl">
              🧪
            </div>
            <h3 className="text-sm font-extrabold text-white">4. Soil Fertility & pH Explained</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Soil fertility is the presence of essential mineral ions:
            </p>
            <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
              <li><strong>N (Nitrogen):</strong> Grows lush, dark green foliage.</li>
              <li><strong>P (Phosphorus):</strong> Develops strong roots and blooms.</li>
              <li><strong>K (Potassium):</strong> Builds disease defense and fruit sweetness.</li>
            </ul>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>The Role of pH:</strong> If soil pH is too acidic (&lt; 6.0) or alkaline (&gt; 7.5), these minerals chemically lock up and cannot dissolve in water.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-950 text-[11px] text-stone-400 border border-stone-800">
            <strong>Honest Science:</strong> Soil moisture probes only measure wetness, not fertility! Soil EC probes measure dissolved mineral ions.
          </div>
        </div>

        {/* Lesson 5: Temperature & Humidity */}
        <div className="rounded-3xl bg-stone-900 p-5 border border-stone-800 shadow-md space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center text-xl">
              🌡️
            </div>
            <h3 className="text-sm font-extrabold text-white">5. Temperature & Humidity</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Plants cannot wear jackets or turn on fans, so surrounding air parameters dictate their survival:
            </p>
            <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
              <li><strong>Too Hot (&gt; 35°C):</strong> Enzymes deform, flowers drop, and leaves curl up to reduce surface area.</li>
              <li><strong>Too Cold (&lt; 12°C):</strong> Cell fluids thicken and slow down; frost will burst cell walls.</li>
              <li><strong>Dry Air (&lt; 40% RH):</strong> Leaves transpire water faster than roots can drink, causing crispy brown tips.</li>
            </ul>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-950 text-[11px] text-stone-400 border border-stone-800">
            <strong>Solution:</strong> Grouping potted plants together creates a natural micro-climate with higher local humidity!
          </div>
        </div>

        {/* Lesson 6: How Smart Farming Helps Society */}
        <div className="rounded-3xl bg-stone-900 p-5 border border-stone-800 shadow-md space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xl">
              🌍
            </div>
            <h3 className="text-sm font-extrabold text-white">6. How Smart Farming Helps Society</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Traditional farming often wastes up to 60% of irrigation water through evaporation or over-watering. Smart farming transforms agriculture:
            </p>
            <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
              <li><strong>Precision Water:</strong> Irrigation turns on only when soil drops below the plant’s biological limit.</li>
              <li><strong>Zero Fertilizer Runoff:</strong> Prevents excess chemicals from polluting groundwater and rivers.</li>
              <li><strong>Urban Gardening:</strong> Empowers balcony gardeners and schools to grow fresh food locally.</li>
            </ul>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/60 text-[11px] text-emerald-300 border border-emerald-800 font-medium">
            "Technology does not replace nature — it helps us listen to what plants have been trying to tell us all along."
          </div>
        </div>
      </div>

      {/* Interactive 5-Question Science Quiz */}
      <div className="rounded-3xl bg-stone-900 p-6 border border-stone-800 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Student Science Challenge: Test Your Knowledge!</span>
            </h2>
            <p className="text-xs text-stone-400">
              5 interactive questions for 9th-grade biology and science exhibitions
            </p>
          </div>

          {quizSubmitted && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800">
                Score: {calculateScore()} / {QUIZ_QUESTIONS.length}
              </span>
              <button
                onClick={resetQuiz}
                className="text-xs font-semibold text-stone-300 hover:text-white underline cursor-pointer"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {QUIZ_QUESTIONS.map((q, qIdx) => {
            const userAnswer = selectedAnswers[qIdx];
            const isAnswered = userAnswer !== undefined;
            const isCorrect = userAnswer === q.correctIndex;

            return (
              <div key={qIdx} className="space-y-3 p-4 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs">
                    Q{qIdx + 1}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {q.question}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-8">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    let btnStyle = 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850 hover:text-white';

                    if (quizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-950 border-rose-500 text-rose-200 font-bold';
                      } else {
                        btnStyle = 'bg-stone-900 border-stone-800 text-stone-500 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-xs';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        disabled={quizSubmitted}
                        className={`text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && optIdx === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                        )}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="pl-8 pt-1">
                    <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-[11px] text-stone-300 leading-relaxed">
                      <strong className="text-emerald-400">Scientific Explanation: </strong>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!quizSubmitted && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                if (Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length) {
                  alert('Please answer all 5 questions before submitting!');
                  return;
                }
                setQuizSubmitted(true);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Submit Quiz & View Explanations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
