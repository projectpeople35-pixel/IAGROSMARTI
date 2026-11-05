import React from 'react';
import { Plant, SensorReading, PlantHealthEvaluation } from '../types';
import { PageId } from '../components/Sidebar';
import {
  Droplets,
  Sun,
  Thermometer,
  CloudRain,
  FlaskConical,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Clock,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface HomeDashboardProps {
  plant: Plant;
  reading: SensorReading;
  health: PlantHealthEvaluation;
  onNavigate: (page: PageId) => void;
  onSwitchToLiveMode: () => void;
  onSwitchToDemoMode: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  plant,
  reading,
  health,
  onNavigate,
  onSwitchToLiveMode,
  onSwitchToDemoMode,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 stroke-emerald-400';
    if (score >= 65) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  const getMetricCardStyle = (status: 'LOW' | 'NORMAL' | 'HIGH' | 'MISSING') => {
    switch (status) {
      case 'NORMAL':
        return {
          bg: 'bg-emerald-950/30 border-emerald-800/50',
          badge: 'bg-emerald-950 text-emerald-300 border border-emerald-700/60',
          indicator: 'Optimal',
        };
      case 'LOW':
        return {
          bg: 'bg-amber-950/30 border-amber-800/50',
          badge: 'bg-amber-950 text-amber-300 border border-amber-700/60',
          indicator: 'Low',
        };
      case 'HIGH':
        return {
          bg: 'bg-rose-950/30 border-rose-800/50',
          badge: 'bg-rose-950 text-rose-300 border border-rose-700/60',
          indicator: 'High',
        };
      case 'MISSING':
      default:
        return {
          bg: 'bg-stone-900 border-stone-800',
          badge: 'bg-stone-800 text-stone-400',
          indicator: 'Offline',
        };
    }
  };

  // Find individual analyses
  const moistureAnalysis = health.analyses.find(a => a.parameter === 'soilMoisture');
  const sunAnalysis = health.analyses.find(a => a.parameter === 'sunlight');
  const tempAnalysis = health.analyses.find(a => a.parameter === 'temperature');
  const humAnalysis = health.analyses.find(a => a.parameter === 'humidity');
  const phAnalysis = health.analyses.find(a => a.parameter === 'soilPh');
  const fertilityAnalysis = health.analyses.find(a => a.parameter === 'fertility');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome & Plant Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 text-white p-6 sm:p-8 shadow-2xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-xs font-semibold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Smart Gardening Assistant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome to AGROSMART 🌱
            </h1>
            <p className="text-stone-300 text-sm leading-relaxed">
              Real-time environmental monitoring and plant requirement detection. We compare your soil, light, and temperature conditions with <strong className="text-emerald-300">{plant.name}</strong>'s biological needs in simple language.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('detector')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
              >
                <span>Check Requirement Detector</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('water')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Water Supply & Pump</span>
              </button>
              <button
                onClick={() => onNavigate('plants')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-white text-xs font-semibold border border-stone-700 transition cursor-pointer"
              >
                <span>Change Plant ({plant.name})</span>
              </button>
            </div>
          </div>

          {/* Plant Health Score Ring Card */}
          <div className="flex-shrink-0 w-full lg:w-auto bg-stone-900/80 backdrop-blur-md rounded-2xl p-5 border border-stone-800 flex items-center justify-between sm:justify-start gap-6 shadow-xl">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-stone-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={getScoreColor(health.score)}
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * health.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-white tracking-tight">{health.score}</span>
                <span className="text-[10px] font-semibold text-stone-400 uppercase">Score / 100</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{plant.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-white">{plant.name}</h3>
                  <p className="text-[11px] text-emerald-400 italic">{plant.scientificName}</p>
                </div>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-800 text-stone-200 border border-stone-700">
                <span className={`w-2 h-2 rounded-full ${health.score >= 80 ? 'bg-emerald-400' : health.score >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`} />
                <span>Health: {health.grade}</span>
              </div>
              <p className="text-[11px] text-stone-300 max-w-[180px] line-clamp-2">
                {health.criticalAlerts.length > 0 ? `${health.criticalAlerts.length} urgent condition(s)` : 'All key conditions optimal'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner (if any) */}
      {health.criticalAlerts.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/70 border-2 border-rose-800 text-rose-200 shadow-md animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-900/80 text-rose-300 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  {plant.name} Needs Attention! ({health.criticalAlerts.length} Alert{health.criticalAlerts.length > 1 ? 's' : ''})
                </h3>
                <button
                  onClick={() => onNavigate('detector')}
                  className="text-xs font-bold text-rose-300 underline hover:text-white cursor-pointer"
                >
                  View Solution →
                </button>
              </div>
              <ul className="text-xs text-rose-300 space-y-1 list-disc list-inside">
                {health.criticalAlerts.map((alert, idx) => (
                  <li key={idx} className="font-medium">
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Primary Live Environmental Sensor Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Live Environmental Metrics</h2>
            <p className="text-xs text-stone-400">
              Real-time readings from Arduino UNO & ESP32 sensors compared with {plant.name}'s ideal thresholds
            </p>
          </div>
          <button
            onClick={() => onNavigate('sensors')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Sensor Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Soil Moisture */}
          {(() => {
            const style = getMetricCardStyle(moistureAnalysis?.status || 'MISSING');
            return (
              <div className={`p-4 rounded-2xl border ${style.bg} transition-all shadow-md`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Soil Moisture</h4>
                      <p className="text-[10px] text-stone-400">Capacitive Sensor</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.indicator}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-white">
                    {reading.soilMoisture !== null ? `${reading.soilMoisture}%` : 'Disconnected'}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">
                    (Target: {plant.requirements.soilMoisture.idealMin}% - {plant.requirements.soilMoisture.idealMax}%)
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-300 line-clamp-2">
                  {moistureAnalysis?.simpleProblemText}
                </p>

                <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Advice:</span>
                  <span className="font-semibold text-emerald-400 truncate max-w-[190px]">
                    {moistureAnalysis?.simpleActionText}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* 2. Sunlight */}
          {(() => {
            const style = getMetricCardStyle(sunAnalysis?.status || 'MISSING');
            return (
              <div className={`p-4 rounded-2xl border ${style.bg} transition-all shadow-md`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Sunlight Intensity</h4>
                      <p className="text-[10px] text-stone-400">BH1750 / LDR Light Sensor</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.indicator}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-white">
                    {reading.sunlightLux !== null ? `${reading.sunlightLux.toLocaleString()} Lux` : 'Disconnected'}
                  </span>
                </div>
                <div className="text-[11px] text-stone-400">
                  Target: {plant.requirements.sunlight.minLux.toLocaleString()} - {plant.requirements.sunlight.maxLux.toLocaleString()} Lux
                </div>

                <p className="mt-2 text-xs text-stone-300 line-clamp-2">
                  {sunAnalysis?.simpleProblemText}
                </p>

                <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Category:</span>
                  <span className="font-semibold text-amber-300">
                    {plant.requirements.sunlight.category} ({plant.requirements.sunlight.hoursPerDay}h/day)
                  </span>
                </div>
              </div>
            );
          })()}

          {/* 3. Temperature */}
          {(() => {
            const style = getMetricCardStyle(tempAnalysis?.status || 'MISSING');
            return (
              <div className={`p-4 rounded-2xl border ${style.bg} transition-all shadow-md`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Surrounding Temp</h4>
                      <p className="text-[10px] text-stone-400">DHT11 / DHT22 Sensor</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.indicator}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-white">
                    {reading.temperature !== null ? `${reading.temperature}°C` : 'Disconnected'}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">
                    (Ideal: {plant.requirements.temperature.idealMin}°C - {plant.requirements.temperature.idealMax}°C)
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-300 line-clamp-2">
                  {tempAnalysis?.simpleProblemText}
                </p>

                <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Safe Range:</span>
                  <span className="font-semibold text-orange-300">
                    {plant.requirements.temperature.min}°C to {plant.requirements.temperature.max}°C
                  </span>
                </div>
              </div>
            );
          })()}

          {/* 4. Humidity */}
          {(() => {
            const style = getMetricCardStyle(humAnalysis?.status || 'MISSING');
            return (
              <div className={`p-4 rounded-2xl border ${style.bg} transition-all shadow-md`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                      <CloudRain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Air Humidity</h4>
                      <p className="text-[10px] text-stone-400">Relative Humidity</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.indicator}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-white">
                    {reading.humidity !== null ? `${reading.humidity}%` : 'Disconnected'}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">
                    (Target: {plant.requirements.humidity.idealMin}% - {plant.requirements.humidity.idealMax}%)
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-300 line-clamp-2">
                  {humAnalysis?.simpleProblemText}
                </p>

                <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Safe Limits:</span>
                  <span className="font-semibold text-teal-300">
                    {plant.requirements.humidity.min}% - {plant.requirements.humidity.max}%
                  </span>
                </div>
              </div>
            );
          })()}

          {/* 5. Soil pH */}
          {(() => {
            const style = getMetricCardStyle(phAnalysis?.status || 'MISSING');
            return (
              <div className={`p-4 rounded-2xl border ${style.bg} transition-all shadow-md`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Soil pH</h4>
                      <p className="text-[10px] text-stone-400">Acidity / Alkalinity Probe</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.indicator}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-white">
                    {reading.soilPh !== null ? `${reading.soilPh.toFixed(1)} pH` : 'Disconnected'}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">
                    (Ideal: {plant.requirements.soilPh.ideal.toFixed(1)})
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-300 line-clamp-2">
                  {phAnalysis?.simpleProblemText}
                </p>

                <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Acceptable:</span>
                  <span className="font-semibold text-purple-300">
                    {plant.requirements.soilPh.min.toFixed(1)} - {plant.requirements.soilPh.max.toFixed(1)} pH
                  </span>
                </div>
              </div>
            );
          })()}

          {/* 6. Soil Fertility & EC */}
          {(() => {
            const style = getMetricCardStyle(fertilityAnalysis?.status || 'MISSING');
            return (
              <div className={`p-4 rounded-2xl border ${style.bg} transition-all shadow-md`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Soil Fertility (EC/NPK)</h4>
                      <p className="text-[10px] text-stone-400">Electrical Conductivity</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.indicator}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-white">
                    {reading.soilEc !== null ? `${reading.soilEc.toFixed(1)} mS/cm` : 'Optional Probe'}
                  </span>
                </div>
                <div className="text-[11px] text-stone-400">
                  Target: {plant.requirements.npk.ecRange}
                </div>

                <p className="mt-2 text-xs text-stone-300 line-clamp-2">
                  {fertilityAnalysis?.simpleProblemText}
                </p>

                <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">NPK Preference:</span>
                  <span className="font-semibold text-emerald-400">
                    N:{plant.requirements.npk.nitrogen} P:{plant.requirements.npk.phosphorus} K:{plant.requirements.npk.potassium}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Quick Action Shortcuts & Care Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Plant Requirement Summary */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-md space-y-3 text-stone-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-base">📋</span>
              <span>Daily Care Recommendations for {plant.name}</span>
            </h3>
            <button
              onClick={() => onNavigate('assistant')}
              className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Ask AI Assistant →
            </button>
          </div>

          <div className="space-y-2.5 text-xs text-stone-300">
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-2.5">
              <span className="text-base flex-shrink-0">💧</span>
              <div>
                <strong className="text-white">Watering Guide:</strong>
                <p className="text-stone-400 mt-0.5">{plant.requirements.wateringAdvice}</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-2.5">
              <span className="text-base flex-shrink-0">☀️</span>
              <div>
                <strong className="text-white">Sunlight Guide:</strong>
                <p className="text-stone-400 mt-0.5">{plant.requirements.sunlightAdvice}</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-2.5">
              <span className="text-base flex-shrink-0">🌱</span>
              <div>
                <strong className="text-white">Soil & Feeding:</strong>
                <p className="text-stone-400 mt-0.5">{plant.requirements.soilAdvice} {plant.requirements.feedingAdvice}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Status & Microcontroller Hub */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-md space-y-3 text-stone-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Microcontroller Connection Status</span>
            </h3>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              reading.source === 'DEMO'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : reading.isLiveConnected
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {reading.source === 'DEMO' ? 'Demo Mode' : (reading.isLiveConnected ? 'ESP32 Online' : 'Hardware Disconnected')}
            </span>
          </div>

          <div className="space-y-2 text-xs text-stone-300">
            <div className="flex items-center justify-between py-1.5 border-b border-stone-800">
              <span className="text-stone-400">Active Source:</span>
              <span className="font-semibold text-white">
                {reading.source === 'DEMO' ? 'Simulated Sensor Telemetry' : 'ESP32 Wi-Fi / Arduino UNO'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-stone-800">
              <span className="text-stone-400">Hardware ID:</span>
              <span className="font-mono text-emerald-300">{reading.deviceId}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-stone-800">
              <span className="text-stone-400">Connection Integrity:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid telemetry packet
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-stone-400">Honest Sensor Rule:</span>
              <span className="text-[11px] text-stone-400 italic">
                Moisture ≠ Fertility (EC probe required for salts)
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            {reading.source === 'DEMO' ? (
              <button
                onClick={onSwitchToLiveMode}
                className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                Switch to Live Sensor Mode →
              </button>
            ) : (
              <button
                onClick={onSwitchToDemoMode}
                className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                Switch to Demo Mode →
              </button>
            )}
            <button
              onClick={() => onNavigate('sensors')}
              className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition cursor-pointer whitespace-nowrap"
            >
              Pinout Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
