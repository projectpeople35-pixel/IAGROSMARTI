import React, { useState } from 'react';
import {
  Users,
  Heart,
  ShieldCheck,
  Sparkles,
  Leaf,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Stethoscope,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface AboutProjectProps {
  onNavigate: (page: PageId) => void;
}

interface PlantRescueScenario {
  id: string;
  title: string;
  symptom: string;
  diagnosis: string;
  recoverySteps: Array<{ phase: string; title: string; action: string }>;
  successRate: string;
}

const RESCUE_SCENARIOS: PlantRescueScenario[] = [
  {
    id: 'overwatered',
    title: 'Yellow, Mushy Leaves with Wet Soil',
    symptom: 'Leaves are pale yellow, soft, and falling off; soil feels wet and heavy.',
    diagnosis: 'Overwatering & Root Suffocation (Roots cannot absorb oxygen in mud)',
    recoverySteps: [
      { phase: 'Day 1: Emergency Stop', title: 'Stop Watering', action: 'Cease all watering immediately. Drain any standing water in the saucer.' },
      { phase: 'Day 2: Aerate the Dirt', title: 'Aerate Soil', action: 'Gently poke 5-6 holes into the soil with a clean pencil to introduce oxygen channels.' },
      { phase: 'Day 3: Increase Airflow', title: 'Ventilate', action: 'Move the pot to a bright, well-ventilated spot with indirect light so the moisture evaporates.' },
      { phase: 'Day 7: Resume with Care', title: 'Finger Check', action: 'Do not water again until the top 2 inches of soil feel completely dry to the touch.' },
    ],
    successRate: '92% Recovery Rate if caught before total root rot',
  },
  {
    id: 'underwatered',
    title: 'Dry, Crispy Leaves with Drooping Stem',
    symptom: 'Stems are floppy, bottom leaves are crunchy and dry, soil has pulled away from pot edge.',
    diagnosis: 'Severe Dehydration (Cell turgor pressure has collapsed)',
    recoverySteps: [
      { phase: 'Immediate', title: 'Bottom Watering Soak', action: 'Place the pot into a bowl of water for 30 minutes so soil rehydrates from the bottom up.' },
      { phase: 'Hour 2', title: 'Drain Excess', action: 'Lift the pot and let excess water drain completely from the bottom holes.' },
      { phase: 'Next 3 Days', title: 'Gentle Humidity', action: 'Mist the leaves lightly and keep away from hot, dry heaters or air conditioners.' },
      { phase: 'Day 5', title: 'Turgor Check', action: 'Notice stems standing upright as water pressure re-inflates the cells.' },
    ],
    successRate: '98% Recovery Rate within 24 hours of deep bottom-soaking',
  },
  {
    id: 'sun_scorch',
    title: 'Bleached, Whitish-Brown Burn Marks on Leaves',
    symptom: 'Crispy dry patches on upper leaves that face direct midday windows or outdoor sun.',
    diagnosis: 'Sun Scald / Photodamage (Extreme UV destroyed chlorophyll pigments)',
    recoverySteps: [
      { phase: 'Day 1', title: 'Step Back from Sun', action: 'Move the pot 3 to 5 feet back from the scorching direct sun, or hang a sheer white curtain.' },
      { phase: 'Day 2', title: 'Hydrate Roots', action: 'Ensure soil moisture is in the healthy optimal zone (60%) so the plant can cool its leaves.' },
      { phase: 'Day 3', title: 'Do Not Panic-Cut', action: 'Leave partially green leaves on the plant; they are still synthesizing emergency energy.' },
      { phase: 'Day 14', title: 'Fresh Growth', action: 'New replacement shoots will sprout acclimated to the gentler lighting.' },
    ],
    successRate: '88% Recovery Rate; burned spots will not turn green, but new growth will be healthy',
  },
  {
    id: 'etiolation',
    title: 'Long, Thin, Leggy Stems with Tiny Pale Leaves',
    symptom: 'The plant is stretching awkwardly toward a window with large gaps between leaves.',
    diagnosis: 'Light Starvation / Etiolation (Plant is stretching in search of photons)',
    recoverySteps: [
      { phase: 'Day 1', title: 'Gradual Light Increase', action: 'Shift the plant closer to the brightest window or place under a desk lamp with a 6500K daylight bulb.' },
      { phase: 'Day 3', title: 'Prune the Tops', action: 'Pinch off the leggy top tips. This triggers dormant buds below to grow bushy side branches.' },
      { phase: 'Weekly', title: 'Rotate 90 Degrees', action: 'Turn the pot a quarter-turn each week so stems grow straight upward instead of leaning.' },
    ],
    successRate: '95% Transformation into a compact, bushy plant',
  },
  {
    id: 'powdery_mildew',
    title: 'White Powdery Dust Coating Leaves',
    symptom: 'White talcum-powder-like spots spreading across leaf surfaces in still, humid air.',
    diagnosis: 'Powdery Mildew Fungal Spores (Triggered by stagnant air & wet night leaves)',
    recoverySteps: [
      { phase: 'Day 1', title: 'Isolate & Prune', action: 'Separate the plant from other pots and clip off the most heavily dusted leaves.' },
      { phase: 'Day 1 Evening', title: 'Baking Soda Spray', action: 'Mix 1 teaspoon of baking soda and 2 drops of gentle dish soap in 1 liter of water; mist affected leaves.' },
      { phase: 'Day 2', title: 'Improve Circulation', action: 'Ensure room airflow and never water overhead in late evening.' },
    ],
    successRate: '85% Spore eradication within 10 days of treatment',
  },
];

export const AboutProject: React.FC<AboutProjectProps> = ({ onNavigate }) => {
  const [selectedRescueId, setSelectedRescueId] = useState<string>('overwatered');
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const activeRescue = RESCUE_SCENARIOS.find(s => s.id === selectedRescueId) || RESCUE_SCENARIOS[0];

  const toggleStep = (stepKey: string) => {
    setCheckedSteps(prev => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-stone-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 text-white p-6 sm:p-8 shadow-2xl border border-emerald-800/40">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-xs font-semibold text-emerald-200">
            <span>🌱</span>
            <span>Project Overview & Social Impact</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            PROJECT NAME: AGROSMART 🌱
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            A smart plant-care and environmental monitoring system designed to help students, beginners, urban gardeners, and people without farming knowledge easily understand and satisfy the biological requirements of diverse plants.
          </p>
        </div>
      </div>

      {/* DEVELOPERS SECTION */}
      <div className="rounded-3xl bg-stone-900 p-6 sm:p-8 border border-stone-800 shadow-md space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xl">👥</span>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Developers & Project Team
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                The student engineering minds behind the AGROSMART hardware and software architecture
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Member 1: Ranvijay Tripathi */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-stone-950 to-stone-900 border-2 border-emerald-600/60 shadow-md space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              RT
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider">
                Special Executive
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">Ranvijay Tripathi</h3>
              <p className="text-xs font-semibold text-emerald-400">Project Architect & Team Lead</p>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Spearheaded project architecture, system integration, requirement detection logic, and overall product vision for AGROSMART.
            </p>
          </div>

          {/* Member 2: Ayush Gautam */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-stone-950 to-stone-900 border border-stone-800 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              AG
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-800 text-stone-300 border border-stone-700 uppercase tracking-wider">
                Developer
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">Ayush Gautam</h3>
              <p className="text-xs font-semibold text-teal-400">Hardware & Sensor Telemetry</p>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Designed microcontroller sensor circuits, Arduino UNO analog telemetry, and ESP32 Wi-Fi serial communication protocols.
            </p>
          </div>

          {/* Member 3: Rishabh */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-stone-950 to-stone-900 border border-stone-800 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              R
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-800 text-stone-300 border border-stone-700 uppercase tracking-wider">
                Developer
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">Rishabh</h3>
              <p className="text-xs font-semibold text-emerald-400">UI/UX & Botanical Research</p>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Researched plant requirement parameters, built the 9th-grade educational curricula, and designed the interactive student interface.
            </p>
          </div>
        </div>

        {/* Purpose, Creativity, Teamwork, and Social Value */}
        <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 text-xs text-stone-300 leading-relaxed">
          <h4 className="font-bold text-white text-sm">Team Collaboration & Engineering Philosophy</h4>
          <p>
            AGROSMART is built on the belief that smart agriculture should not be confined to industrial farmlands. By combining accessible microcontrollers (Arduino UNO & ESP32) with a scientific web application, our team makes botanical knowledge intuitive for every school student, home grower, and urban dweller.
          </p>
        </div>
      </div>

      {/* CREATIVE FEATURE: SAVE A PLANT */}
      <div className="rounded-3xl bg-stone-900 p-6 sm:p-8 border border-stone-800 shadow-md space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800 text-xl">🩺</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  SAVE A PLANT: Interactive Problem Troubleshooter
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 uppercase">
                  Emergency Clinic
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Is your home or school plant looking sick? Select the visual symptom below for a tailored 4-phase recovery plan!
              </p>
            </div>
          </div>
        </div>

        {/* Symptom Selector Buttons */}
        <div className="flex flex-wrap gap-2">
          {RESCUE_SCENARIOS.map(sc => (
            <button
              key={sc.id}
              onClick={() => setSelectedRescueId(sc.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                selectedRescueId === sc.id
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-stone-950 text-stone-300 border border-stone-800 hover:bg-stone-800'
              }`}
            >
              <span>🌿</span>
              <span>{sc.title}</span>
            </button>
          ))}
        </div>

        {/* Active Rescue Plan Box */}
        <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Medical Diagnosis:</span>
              <h3 className="text-sm font-extrabold text-white">{activeRescue.diagnosis}</h3>
              <p className="text-xs text-stone-300 mt-0.5"><strong>Symptom:</strong> {activeRescue.symptom}</p>
            </div>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full self-start sm:self-auto">
              {activeRescue.successRate}
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Interactive 4-Phase Recovery Protocol (Check off each step):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeRescue.recoverySteps.map((step, idx) => {
                const stepKey = `${activeRescue.id}-${idx}`;
                const isChecked = !!checkedSteps[stepKey];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(stepKey)}
                    className={`p-3.5 rounded-xl border text-xs transition cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-950/60 border-emerald-700 text-emerald-100'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-rose-700'
                    }`}
                  >
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-lg flex items-center justify-center border ${
                      isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-700 bg-stone-950'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        {step.phase}
                      </span>
                      <strong className="block text-white">{step.title}</strong>
                      <p className={`text-[11px] leading-relaxed ${isChecked ? 'line-through text-stone-500' : 'text-stone-400'}`}>
                        {step.action}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* OUR GREEN MISSION */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 text-white p-6 sm:p-8 shadow-2xl border border-emerald-800/40 space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 uppercase tracking-wider">
            Our Purpose & Social Value
          </span>
          <h2 className="text-2xl font-black mt-2 tracking-tight">OUR GREEN MISSION 🌱</h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl">
            AGROSMART was created not just as an IoT gadget, but as an educational movement for sustainable cities and environmentally conscious youth.
          </p>
        </div>

        {/* 7 Core Goals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1.5">
            <span className="text-lg">🎒</span>
            <h4 className="font-bold text-emerald-400 text-sm">Encourage Students</h4>
            <p className="text-stone-300">
              Inspire young students in schools to observe botany through interactive sensor experiments rather than dry textbooks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1.5">
            <span className="text-lg">🏙️</span>
            <h4 className="font-bold text-emerald-400 text-sm">Promote Urban Gardening</h4>
            <p className="text-stone-300">
              Enable apartment balconies, windowsills, and rooftops in dense cities to become thriving green sanctuaries.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1.5">
            <span className="text-lg">💧</span>
            <h4 className="font-bold text-emerald-400 text-sm">Reduce Water Waste</h4>
            <p className="text-stone-300">
              Combat unnecessary overwatering by tracking real root-zone moisture instead of guessing on fixed days.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1.5">
            <span className="text-lg">🌾</span>
            <h4 className="font-bold text-emerald-400 text-sm">Responsible Fertilizer Use</h4>
            <p className="text-stone-300">
              Prevent chemical soil burning and downstream water pollution by monitoring soil electrical conductivity and pH.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1.5">
            <span className="text-lg">📢</span>
            <h4 className="font-bold text-emerald-400 text-sm">Spread Plant Awareness</h4>
            <p className="text-stone-300">
              Demystify biological signs like yellow leaves, crispy tips, and light starvation into clear, actionable diagnosis.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1.5">
            <span className="text-lg">🤝</span>
            <h4 className="font-bold text-emerald-400 text-sm">Knowledge for Everyone</h4>
            <p className="text-stone-300">
              Bridge the knowledge gap between commercial agricultural scientists and everyday gardening enthusiasts.
            </p>
          </div>
        </div>

        {/* The Inspiring Quote */}
        <div className="p-5 rounded-2xl bg-stone-950/80 border border-emerald-800/40 text-center space-y-2">
          <p className="text-base sm:text-lg font-serif italic text-emerald-100">
            "Every healthy plant begins with the right care. AGROSMART makes understanding that care easier for everyone."
          </p>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">
            — The AGROSMART Initiative 🌱
          </span>
        </div>
      </div>
    </div>
  );
};
