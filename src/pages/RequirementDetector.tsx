import React, { useState } from 'react';
import { Plant, SensorReading, PlantHealthEvaluation, RequirementAnalysis, StatusLevel } from '../types';
import {
  Droplets,
  Sun,
  Thermometer,
  CloudRain,
  FlaskConical,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Info,
  HelpCircle,
  Lightbulb,
  CheckSquare,
} from 'lucide-react';
import { sensorService } from '../services/sensorService';

interface RequirementDetectorProps {
  plant: Plant;
  reading: SensorReading;
  health: PlantHealthEvaluation;
  onNavigateToPlantSelector: () => void;
}

export const RequirementDetector: React.FC<RequirementDetectorProps> = ({
  plant,
  reading,
  health,
  onNavigateToPlantSelector,
}) => {
  const [filter, setFilter] = useState<'all' | 'issues' | 'optimal'>('all');
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const toggleAction = (key: string) => {
    setCompletedActions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredAnalyses = health.analyses.filter(a => {
    if (filter === 'issues') return a.status === 'LOW' || a.status === 'HIGH';
    if (filter === 'optimal') return a.status === 'NORMAL';
    return true;
  });

  const getStatusColor = (status: StatusLevel) => {
    switch (status) {
      case 'NORMAL':
        return {
          bg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-100',
          badge: 'bg-emerald-600 text-white',
          border: 'border-emerald-700/60',
          lightBg: 'bg-emerald-950/30',
          gaugeZone: 'bg-emerald-500',
        };
      case 'LOW':
        return {
          bg: 'bg-amber-950/40 border-amber-800/60 text-amber-100',
          badge: 'bg-amber-600 text-white',
          border: 'border-amber-700/60',
          lightBg: 'bg-amber-950/30',
          gaugeZone: 'bg-amber-500',
        };
      case 'HIGH':
        return {
          bg: 'bg-rose-950/40 border-rose-800/60 text-rose-100',
          badge: 'bg-rose-600 text-white',
          border: 'border-rose-700/60',
          lightBg: 'bg-rose-950/30',
          gaugeZone: 'bg-rose-500',
        };
      case 'MISSING':
      default:
        return {
          bg: 'bg-stone-900 border-stone-800 text-stone-300',
          badge: 'bg-stone-700 text-white',
          border: 'border-stone-800',
          lightBg: 'bg-stone-900',
          gaugeZone: 'bg-stone-600',
        };
    }
  };

  const getIconForParam = (param: string) => {
    switch (param) {
      case 'soilMoisture':
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'sunlight':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'temperature':
        return <Thermometer className="w-5 h-5 text-orange-400" />;
      case 'humidity':
        return <CloudRain className="w-5 h-5 text-teal-400" />;
      case 'soilPh':
        return <FlaskConical className="w-5 h-5 text-purple-400" />;
      case 'fertility':
      default:
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-stone-100">
      {/* Title & Introduction Header */}
      <div className="bg-stone-900 rounded-3xl p-6 border border-stone-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-emerald-900/60 text-emerald-400 text-xl border border-emerald-800">🎯</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Smart Plant Requirement Detector
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                Scientific condition comparison engine calibrated for <strong className="text-emerald-400">{plant.name} ({plant.scientificName})</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-stone-950 text-stone-300 border border-stone-800 text-xs font-semibold flex items-center gap-2">
            <span>Plant: {plant.icon} {plant.name}</span>
            <button
              onClick={onNavigateToPlantSelector}
              className="text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Summary Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-stone-900 rounded-2xl border border-stone-800 self-start">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === 'all' ? 'bg-stone-800 text-white shadow-xs' : 'text-stone-400 hover:text-white'
            }`}
          >
            All Parameters ({health.analyses.length})
          </button>
          <button
            onClick={() => setFilter('issues')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              filter === 'issues' ? 'bg-stone-800 text-rose-400 shadow-xs' : 'text-stone-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Needs Attention ({health.analyses.filter(a => a.status === 'LOW' || a.status === 'HIGH').length})</span>
          </button>
          <button
            onClick={() => setFilter('optimal')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              filter === 'optimal' ? 'bg-stone-800 text-emerald-400 shadow-xs' : 'text-stone-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Optimal ({health.analyses.filter(a => a.status === 'NORMAL').length})</span>
          </button>
        </div>

        {reading.source === 'DEMO' && (
          <div className="text-xs text-amber-300 bg-amber-950/60 border border-amber-800/70 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Demo Mode: Use the simulator sliders below to test edge cases!</span>
          </div>
        )}
      </div>

      {/* Parameter Cards with 9th Grade Explanations */}
      <div className="grid grid-cols-1 gap-5">
        {filteredAnalyses.map(analysis => {
          const colors = getStatusColor(analysis.status);
          const isDone = !!completedActions[analysis.parameter];

          return (
            <div
              key={analysis.parameter}
              className={`rounded-3xl border ${colors.border} bg-stone-900 overflow-hidden shadow-md transition-all`}
            >
              {/* Card Header Bar */}
              <div className={`p-4 sm:p-5 border-b ${colors.border} ${colors.lightBg} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-stone-950 shadow-xs border border-stone-800">
                    {getIconForParam(analysis.parameter)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-white">{analysis.label}</h3>
                      <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${colors.badge}`}>
                        STATUS: {analysis.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Target Range: <strong className="text-stone-300">{analysis.targetRange}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 self-start sm:self-auto bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">
                  <span className="text-[11px] text-stone-400 font-semibold uppercase">Current:</span>
                  <span className="text-xl font-black text-white">
                    {analysis.currentVal !== null ? `${analysis.currentVal} ${analysis.unit}` : 'Missing'}
                  </span>
                </div>
              </div>

              {/* Card Body: The Core 9th-Grade Explanations */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* 1. Primary Problem Statement */}
                <div className={`p-3.5 rounded-2xl border ${colors.bg}`}>
                  <div className="flex items-start gap-2.5">
                    {analysis.status === 'NORMAL' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {analysis.simpleProblemText}
                      </h4>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                        {analysis.detailedExplanation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. What the user should do right now */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="p-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold flex-shrink-0">
                      ACTION
                    </span>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        What you should do:
                      </div>
                      <p className={`text-xs font-semibold text-stone-200 mt-0.5 ${isDone ? 'line-through text-stone-500' : ''}`}>
                        {analysis.simpleActionText}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAction(analysis.parameter)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-auto ${
                      isDone
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-stone-900 border border-stone-700 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Action Completed!' : 'Mark Completed'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Simulation Console (Demo Mode) */}
      {reading.source === 'DEMO' && (
        <div className="rounded-3xl bg-stone-900 p-6 border border-stone-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 text-lg">🧪</span>
              <div>
                <h3 className="text-base font-bold text-white">Student Simulation Lab</h3>
                <p className="text-xs text-stone-400">
                  Slide values to simulate dry soil, scorching sun, cold night, or acid soil to see the detector react in real time!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {/* Moisture Slider */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>Soil Moisture</span>
                <span className="text-blue-400">{reading.soilMoisture}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={reading.soilMoisture ?? 50}
                onChange={e => sensorService.setDemoSlider('soilMoisture', +e.target.value)}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>5% (Bone Dry)</span>
                <span>50% (Normal)</span>
                <span>95% (Flooded)</span>
              </div>
            </div>

            {/* Sunlight Slider */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>Sunlight Lux</span>
                <span className="text-amber-400">{reading.sunlightLux?.toLocaleString()} Lux</span>
              </div>
              <input
                type="range"
                min="500"
                max="80000"
                step="500"
                value={reading.sunlightLux ?? 30000}
                onChange={e => sensorService.setDemoSlider('sunlightLux', +e.target.value)}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>500 (Dark Room)</span>
                <span>35k (Balcony)</span>
                <span>80k (Scorching)</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>Temperature</span>
                <span className="text-orange-400">{reading.temperature}°C</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                step="0.5"
                value={reading.temperature ?? 24}
                onChange={e => sensorService.setDemoSlider('temperature', +e.target.value)}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>5°C (Freezing)</span>
                <span>24°C (Ideal)</span>
                <span>45°C (Heatwave)</span>
              </div>
            </div>

            {/* Humidity Slider */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>Air Humidity</span>
                <span className="text-teal-400">{reading.humidity}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="95"
                value={reading.humidity ?? 60}
                onChange={e => sensorService.setDemoSlider('humidity', +e.target.value)}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>15% (Arid)</span>
                <span>60% (Fresh)</span>
                <span>95% (Muggy)</span>
              </div>
            </div>

            {/* Soil pH Slider */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>Soil pH</span>
                <span className="text-purple-400">{reading.soilPh?.toFixed(1)} pH</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.1"
                value={reading.soilPh ?? 6.5}
                onChange={e => sensorService.setDemoSlider('soilPh', +e.target.value)}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>4.0 (Acidic)</span>
                <span>6.5 (Balanced)</span>
                <span>9.0 (Alkaline)</span>
              </div>
            </div>

            {/* Soil EC Slider */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>Soil EC (Conductivity)</span>
                <span className="text-emerald-400">{reading.soilEc?.toFixed(1)} mS/cm</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.1"
                value={reading.soilEc ?? 1.8}
                onChange={e => sensorService.setDemoSlider('soilEc', +e.target.value)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>0.2 (Depleted)</span>
                <span>1.8 (Optimal)</span>
                <span>5.0 (Salt Burn!)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
