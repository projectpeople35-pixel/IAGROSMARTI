import React, { useState, useMemo } from 'react';
import { Plant, SensorReading, PlantHealthEvaluation } from '../types';
import { sensorService, HistoricalDataPoint } from '../services/sensorService';
import {
  FileText,
  HeartPulse,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  Droplets,
  Sun,
  Thermometer,
  CloudRain,
  FlaskConical,
} from 'lucide-react';

interface PlantHealthReportProps {
  plant: Plant;
  reading: SensorReading;
  health: PlantHealthEvaluation;
}

export const PlantHealthReport: React.FC<PlantHealthReportProps> = ({
  plant,
  reading,
  health,
}) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d'>('24h');
  const [selectedParam, setSelectedParam] = useState<'soilMoisture' | 'temperature' | 'humidity' | 'sunlightLux' | 'soilPh'>('soilMoisture');

  const history24h = useMemo(() => sensorService.get24HourHistory(), [reading.timestamp]);
  const history7d = useMemo(() => sensorService.get7DayHistory(), [reading.timestamp]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 stroke-emerald-400';
    if (score >= 65) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  const chartPoints = useMemo(() => {
    if (timeframe === '24h') {
      return history24h.map((p, idx) => ({
        x: (idx / (history24h.length - 1)) * 500,
        y: p[selectedParam],
        label: p.timeLabel,
      }));
    } else {
      return history7d.map((p, idx) => {
        let val = p.avgMoisture;
        if (selectedParam === 'temperature') val = p.avgTemp;
        if (selectedParam === 'humidity') val = p.avgHumidity;
        if (selectedParam === 'sunlightLux') val = p.avgSunlightLux;
        if (selectedParam === 'soilPh') val = p.avgPh;
        return {
          x: (idx / (history7d.length - 1)) * 500,
          y: val,
          label: p.dayLabel,
        };
      });
    }
  }, [timeframe, selectedParam, history24h, history7d]);

  const minY = Math.min(...chartPoints.map(p => p.y));
  const maxY = Math.max(...chartPoints.map(p => p.y));
  const rangeY = (maxY - minY) || 1;

  const svgPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    return chartPoints.reduce((acc, pt, idx) => {
      const normalizedY = 130 - ((pt.y - minY) / rangeY) * 110;
      return idx === 0 ? `M ${pt.x} ${normalizedY}` : `${acc} L ${pt.x} ${normalizedY}`;
    }, '');
  }, [chartPoints, minY, rangeY]);

  const svgAreaPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const firstX = chartPoints[0].x;
    const lastX = chartPoints[chartPoints.length - 1].x;
    return `${svgPath} L ${lastX} 140 L ${firstX} 140 Z`;
  }, [svgPath, chartPoints]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-stone-100">
      {/* Title & Actions */}
      <div className="bg-stone-900 rounded-3xl p-6 border border-stone-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xl">📊</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Plant Health & Historical Report
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                Full diagnostic health scoring and environmental trend history for {plant.name}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition cursor-pointer self-start sm:self-auto border border-stone-700"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Print / Save PDF Report</span>
        </button>
      </div>

      {/* Main Score & Factor Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Circular Health Score Gauge */}
        <div className="rounded-3xl bg-stone-900 p-6 border border-stone-800 shadow-md flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-stone-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className={getScoreColor(health.score)}
                strokeWidth="10"
                strokeDasharray={263.89}
                strokeDashoffset={263.89 - (263.89 * health.score) / 100}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white tracking-tight">{health.score}</span>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mt-0.5">Health Index</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              health.score >= 80 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : health.score >= 50 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              Grade: {health.grade}
            </span>
            <p className="text-xs text-stone-400 max-w-xs mt-2">
              Based on active readings weighted for immediate plant survival, energy synthesis, and thermal limits.
            </p>
          </div>

          {health.missingSensors.length > 0 && (
            <div className="w-full text-left p-3 rounded-2xl bg-stone-950 border border-stone-800 text-[11px] text-stone-300">
              <span className="font-bold text-stone-200">Missing Sensors ({health.missingSensors.length}):</span>
              <p className="mt-0.5 text-stone-400 italic">
                {health.missingSensors.join(', ')} are not connected. Transparently excluded from 100-pt scoring.
              </p>
            </div>
          )}
        </div>

        {/* Right: Factor Breakdown */}
        <div className="lg:col-span-2 rounded-3xl bg-stone-900 p-6 border border-stone-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              <span>Factor-by-Factor Score Breakdown</span>
            </h3>
            <span className="text-xs font-bold text-stone-400">Weight & Deductions</span>
          </div>

          <div className="space-y-3">
            {health.factors.map(factor => (
              <div
                key={factor.factor}
                className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-200">{factor.factor}</span>
                    <span className="text-[10px] text-stone-500">(Weight: {factor.weight}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold ${
                      factor.status === 'optimal'
                        ? 'text-emerald-400'
                        : factor.status === 'missing'
                          ? 'text-stone-500'
                          : 'text-rose-400'
                    }`}>
                      {factor.score} / {factor.weight} pts
                    </span>
                  </div>
                </div>

                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      factor.status === 'optimal'
                        ? 'bg-emerald-500'
                        : factor.status === 'mild_deviation'
                          ? 'bg-amber-500'
                          : factor.status === 'severe_deviation'
                            ? 'bg-rose-500'
                            : 'bg-stone-700'
                    }`}
                    style={{ width: `${(factor.score / factor.weight) * 100}%` }}
                  />
                </div>

                <p className="text-[11px] text-stone-400">
                  {factor.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="rounded-3xl bg-stone-900 p-6 border border-stone-800 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Environmental Trend History</span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Track environmental fluctuations over the past 24 hours or past 7 days
            </p>
          </div>

          {/* Timeframe toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-950 rounded-2xl border border-stone-800 self-start sm:self-auto">
            <button
              onClick={() => setTimeframe('24h')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                timeframe === '24h' ? 'bg-stone-800 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>24 Hours</span>
            </button>
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                timeframe === '7d' ? 'bg-stone-800 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>7 Days</span>
            </button>
          </div>
        </div>

        {/* Parameter Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedParam('soilMoisture')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              selectedParam === 'soilMoisture'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-stone-950 border border-stone-800 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Soil Moisture (%)</span>
          </button>
          <button
            onClick={() => setSelectedParam('temperature')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              selectedParam === 'temperature'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-stone-950 border border-stone-800 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature (°C)</span>
          </button>
          <button
            onClick={() => setSelectedParam('humidity')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              selectedParam === 'humidity'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-stone-950 border border-stone-800 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Humidity (%)</span>
          </button>
          <button
            onClick={() => setSelectedParam('sunlightLux')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              selectedParam === 'sunlightLux'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-950 border border-stone-800 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Sunlight (Lux)</span>
          </button>
          <button
            onClick={() => setSelectedParam('soilPh')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              selectedParam === 'soilPh'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-stone-950 border border-stone-800 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Soil pH</span>
          </button>
        </div>

        {/* SVG Responsive Line Chart */}
        <div className="p-4 rounded-2xl bg-stone-950 text-white border border-stone-800">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span>Peak: {maxY}</span>
            <span className="font-semibold text-emerald-400">
              {timeframe === '24h' ? '24-Hour Continuous Telemetry' : '7-Day Rolling Trend'}
            </span>
            <span>Low: {minY}</span>
          </div>

          <div className="w-full h-40 relative">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="20" x2="500" y2="20" stroke="#262626" strokeDasharray="4 4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#262626" strokeDasharray="4 4" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#262626" strokeDasharray="4 4" />

              <path d={svgAreaPath} fill="url(#chartGradient)" />

              <path
                d={svgPath}
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chartPoints.map((pt, idx) => {
                if (timeframe === '24h' && idx % 4 !== 0) return null;
                const ny = 130 - ((pt.y - minY) / rangeY) * 110;
                return (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={ny}
                    r="3.5"
                    fill="#10b981"
                    stroke="#09090b"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-stone-500 pt-2 border-t border-stone-850">
            {chartPoints
              .filter((_, idx) => (timeframe === '24h' ? idx % 4 === 0 : true))
              .map((pt, idx) => (
                <span key={idx}>{pt.label}</span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
