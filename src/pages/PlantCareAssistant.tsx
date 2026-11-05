import React, { useState } from 'react';
import { Plant, SensorReading, PlantHealthEvaluation } from '../types';
import { Bot, Send, Sparkles, User, HelpCircle, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface PlantCareAssistantProps {
  plant: Plant;
  reading: SensorReading;
  health: PlantHealthEvaluation;
}

interface AssistantResponse {
  answer: string;
  causes?: string[];
  actionSteps: string[];
  scientificNote: string;
}

export const PlantCareAssistant: React.FC<PlantCareAssistantProps> = ({
  plant,
  reading,
  health,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; data?: AssistantResponse }>>([
    {
      sender: 'assistant',
      text: `Hello young gardener! 🌱 I am your AGROSMART Plant Care Assistant. You are currently monitoring ${plant.name}. How can I help you today? You can choose one of the questions below or type your own question!`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const QUICK_QUESTIONS = [
    'How much water does my plant need?',
    'Does my plant need sunlight?',
    'Why are my leaves turning yellow?',
    'What soil is suitable for my plant?',
    'How can I improve plant growth?',
    'Is my plant safe right now?',
  ];

  const generateAnswer = (query: string): AssistantResponse => {
    const q = query.toLowerCase();

    // 1. Water
    if (q.includes('water') || q.includes('moist') || q.includes('thirsty') || q.includes('drink')) {
      const currentMoist = reading.soilMoisture;
      let moistStatusText = '';
      if (currentMoist !== null) {
        if (currentMoist < plant.requirements.soilMoisture.min) {
          moistStatusText = `Right now, your soil moisture sensor reads ${currentMoist}%, which is DRY! Your ${plant.name} is thirsty.`;
        } else if (currentMoist > plant.requirements.soilMoisture.max) {
          moistStatusText = `Warning: your soil moisture is ${currentMoist}%, which is TOO WET! Do not water today.`;
        } else {
          moistStatusText = `Your current soil moisture is ${currentMoist}%, which is healthy and well hydrated.`;
        }
      }

      return {
        answer: `For ${plant.name}, the ideal soil moisture is ${plant.requirements.soilMoisture.idealMin}% to ${plant.requirements.soilMoisture.idealMax}%. ${moistStatusText}`,
        causes: [
          'Plants drink water through root hairs and carry minerals up to the leaves.',
          'Too much water drowns roots because air pockets in the dirt get completely filled with water.',
          'Too little water causes plant cells to lose pressure (called turgor pressure), making stems flop over.',
        ],
        actionSteps: [
          plant.requirements.wateringAdvice,
          'Do the "Finger Test": push your index finger 1 inch into the dirt. If it feels cool and damp, wait before watering.',
          'Always make sure your pot has open drainage holes so excess water can escape freely.',
        ],
        scientificNote:
          'Science Tip: Plants evaporate water from microscopic pores under their leaves called "stomata". This pulling force is known as transpiration!',
      };
    }

    // 2. Sunlight
    if (q.includes('sun') || q.includes('light') || q.includes('dark') || q.includes('shade')) {
      const currentLux = reading.sunlightLux;
      let lightStatus = '';
      if (currentLux !== null) {
        if (currentLux < plant.requirements.sunlight.minLux) {
          lightStatus = `Currently, the light sensor detects only ${currentLux.toLocaleString()} Lux, which is dim. Your ${plant.name} needs brighter light.`;
        } else if (currentLux > plant.requirements.sunlight.maxLux) {
          lightStatus = `Careful! The sensor detects ${currentLux.toLocaleString()} Lux, which is very intense. Watch for leaf scorch.`;
        } else {
          lightStatus = `Light level is currently ${currentLux.toLocaleString()} Lux — great for photosynthesis!`;
        }
      }

      return {
        answer: `${plant.name} belongs in the "${plant.requirements.sunlight.category}" category. It needs around ${plant.requirements.sunlight.hoursPerDay} hours of light daily. ${lightStatus}`,
        causes: [
          'Plants use sunlight energy, water, and carbon dioxide (CO2) to create glucose sugars through photosynthesis.',
          'When light is too low, stems grow thin and "leggy" as the plant desperately stretches towards the nearest window.',
          'When light is too strong, extreme UV rays can bleach leaves and turn green chlorophyll white or crispy brown.',
        ],
        actionSteps: [
          plant.requirements.sunlightAdvice,
          'Rotate your pot 90 degrees once a week so all sides receive balanced light.',
          'Clean dust off the leaves with a damp cloth so sunlight can reach the leaf cells directly.',
        ],
        scientificNote:
          'Science Tip: Green chlorophyll pigments in chloroplasts absorb blue and red light wavelengths, but reflect green light — that is why plants look green!',
      };
    }

    // 3. Yellow leaves
    if (q.includes('yellow') || q.includes('leaf') || q.includes('leaves') || q.includes('pale')) {
      return {
        answer: `Yellow leaves (called chlorosis in science) are a plant's way of calling for help. On your ${plant.name}, there are 3 main reasons why leaves turn yellow:`,
        causes: [
          '#1 Overwatering: If leaves turn pale yellow and feel limp or mushy, roots are suffocating from stagnant water.',
          '#2 Under-watering: If bottom leaves turn dry, crispy yellow and drop off, the plant is sacrificing old leaves to conserve water.',
          '#3 Lack of Nitrogen or Iron: If leaves turn yellow while the veins stay green, the soil pH might be locking up essential minerals.',
        ],
        actionSteps: [
          'Check your current soil moisture reading. If it is over 75%, let the pot dry completely.',
          'Inspect the underside of leaves for tiny spider mites or aphids that suck plant sap.',
          'Gently prune off leaves that are more than 50% yellow so the plant does not waste energy keeping them alive.',
        ],
        scientificNote:
          'Science Tip: Nitrogen is a "mobile nutrient". When nitrogen is scarce, the plant takes nitrogen from older bottom leaves and sends it to new top shoots, causing older leaves to turn yellow first!',
      };
    }

    // 4. Soil
    if (q.includes('soil') || q.includes('ph') || q.includes('dirt') || q.includes('potting') || q.includes('compost')) {
      return {
        answer: `${plant.name} grows best in soil with an ideal pH of ${plant.requirements.soilPh.ideal.toFixed(1)} (safe range: ${plant.requirements.soilPh.min.toFixed(1)} to ${plant.requirements.soilPh.max.toFixed(1)}).`,
        causes: [
          'Soil is not just dirt — it is an active ecosystem with air pockets, minerals, and beneficial microbes.',
          'If soil pH is too low (acidic < 6.0), phosphorus gets locked up.',
          'If soil pH is too high (alkaline > 7.5), iron gets locked up, stopping chlorophyll production.',
        ],
        actionSteps: [
          plant.requirements.soilAdvice,
          'Recipe for healthy potting mix: 40% garden soil, 30% organic compost (vermicompost), 30% coco-peat or coarse sand for drainage.',
          'Never pack soil down tightly with your hands; roots need oxygen to breathe.',
        ],
        scientificNote:
          'Science Tip: Soil Electrical Conductivity (EC) measures dissolved mineral ions. A moderate EC (1.0 to 2.5 mS/cm) feeds plants safely without causing root burn.',
      };
    }

    // 5. Growth improvement
    if (q.includes('growth') || q.includes('fast') || q.includes('grow') || q.includes('improve') || q.includes('fertilizer')) {
      return {
        answer: `To boost healthy, sturdy growth for ${plant.name}, follow the "Four Pillars of Plant Health": Sunlight, Steady Moisture, Root Airflow, and Gentle Nutrition.`,
        causes: [
          'Plants do not "eat" fertilizer like food — sunlight is their food. Fertilizer is only a vitamin supplement.',
          'Balanced nutrition includes N (Nitrogen for green leaves), P (Phosphorus for roots and flowers), and K (Potassium for overall disease resistance).',
        ],
        actionSteps: [
          plant.requirements.feedingAdvice,
          'Pinch or prune the top growing tips to encourage the plant to branch out into a bushy shape.',
          'Keep temperatures within ' + plant.requirements.temperature.idealMin + '°C to ' + plant.requirements.temperature.idealMax + '°C.',
          'Use natural homemade plant teas: banana peel soak for potassium, crushed eggshell water for calcium, and diluted compost tea.',
        ],
        scientificNote:
          'Science Tip: Adding too much chemical fertilizer all at once creates osmotic shock that pulls water out of the plant. Always fertilize in small, diluted amounts!',
      };
    }

    // Default / Current Safety
    return {
      answer: `Currently, ${plant.name}'s Health Index is ${health.score}/100 (${health.grade}). ${
        health.criticalAlerts.length > 0
          ? `We detected ${health.criticalAlerts.length} condition(s) that need your attention: ${health.criticalAlerts.join('; ')}.`
          : 'All connected environmental parameters are within safe biological ranges.'
      }`,
      causes: [
        `Temperature is currently ${reading.temperature ?? 'Offline'}°C (Ideal: ${plant.requirements.temperature.idealMin}-${plant.requirements.temperature.idealMax}°C).`,
        `Moisture is currently ${reading.soilMoisture ?? 'Offline'}% (Ideal: ${plant.requirements.soilMoisture.idealMin}-${plant.requirements.soilMoisture.idealMax}%).`,
        `Sunlight is currently ${reading.sunlightLux?.toLocaleString() ?? 'Offline'} Lux.`,
      ],
      actionSteps: health.recommendations.length > 0 ? health.recommendations : [plant.requirements.wateringAdvice, plant.requirements.sunlightAdvice],
      scientificNote:
        'Science Tip: AGROSMART checks these metrics 24/7 so you never have to guess what your plant is experiencing!',
    };
  };

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg = { sender: 'user' as const, text: q };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const responseData = generateAnswer(q);
      const assistantMsg = {
        sender: 'assistant' as const,
        text: responseData.answer,
        data: responseData,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-stone-100">
      {/* Header */}
      <div className="bg-stone-900 rounded-3xl p-6 border border-stone-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xl">🤖</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                AGROSMART Plant Care Assistant
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                9th-grade friendly botanical guidance and instant answers for <strong className="text-emerald-400">{plant.name}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-300">
          <span>Active Context:</span>
          <span className="text-emerald-400 font-bold">{plant.icon} {plant.name} ({health.score}/100)</span>
        </div>
      </div>

      {/* Quick Question Chips */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Popular Beginner Questions (Tap to ask):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 hover:text-emerald-300 hover:border-emerald-700 border border-stone-800 text-stone-300 text-xs font-medium shadow-xs transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 shadow-md p-5 space-y-4 max-h-[550px] overflow-y-auto">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm shadow-xs ${
                  isUser
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : '🌱'}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  isUser
                    ? 'bg-emerald-700 text-white rounded-tr-xs'
                    : 'bg-stone-950 text-stone-200 border border-stone-800 rounded-tl-xs'
                }`}
              >
                <p className="font-medium whitespace-pre-line">{msg.text}</p>

                {/* Rich Data Cards for Assistant Answers */}
                {msg.data && (
                  <div className="space-y-3 pt-1 border-t border-stone-800 text-stone-300">
                    {msg.data.causes && msg.data.causes.length > 0 && (
                      <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                        <span className="font-bold text-white text-[11px] uppercase tracking-wider block">
                          What is happening biologically:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-stone-300">
                          {msg.data.causes.map((cause, cIdx) => (
                            <li key={cIdx}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.data.actionSteps && msg.data.actionSteps.length > 0 && (
                      <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/60 space-y-1">
                        <span className="font-bold text-emerald-300 text-[11px] uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Step-by-step practical action:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-emerald-200">
                          {msg.data.actionSteps.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.data.scientificNote && (
                      <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 flex items-start gap-1.5 text-[11px]">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{msg.data.scientificNote}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-stone-400 text-xs italic">
            <span>🌱</span>
            <span>AGROSMART is analyzing plant requirements...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-stone-900 p-2 rounded-2xl border border-stone-800 shadow-md"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          placeholder={`Ask about ${plant.name}'s water, sunlight, soil, yellow leaves...`}
          className="flex-1 px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
