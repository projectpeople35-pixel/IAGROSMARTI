import React, { useState } from 'react';
import { Plant, SensorReading } from '../types';
import { waterSupplyService, WaterSupplyState } from '../services/waterSupplyService';
import {
  Droplets,
  Zap,
  Gauge,
  Waves,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Cpu,
  Copy,
  Check,
  Code2,
  TrendingDown,
  Info,
} from 'lucide-react';

interface WaterSupplySectionProps {
  plant: Plant;
  reading: SensorReading;
  waterState: WaterSupplyState;
}

export const WaterSupplySection: React.FC<WaterSupplySectionProps> = ({
  plant,
  reading,
  waterState,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isWateringPulse, setIsWateringPulse] = useState(false);

  const handleWaterPulse = () => {
    setIsWateringPulse(true);
    waterSupplyService.triggerWaterPulse(15, plant);
    setTimeout(() => setIsWateringPulse(false), 2000);
  };

  const currentVolume = ((waterState.tankLevelPercent / 100) * waterState.tankCapacityLiters).toFixed(1);

  const RELAY_PUMP_CODE = `// ==========================================
// AGROSMART: Relay Water Pump Automation
// Microcontroller: Arduino UNO / ESP32
// Active-Low 5V Relay on Pin D8 (Arduino) or GPIO 18 (ESP32)
// ==========================================

#define RELAY_PIN 8      // Digital Pin 8 for Arduino UNO (or 18 for ESP32)
#define FLOAT_PIN A3     // Water Level Float Switch (LOW = Water OK, HIGH = Tank Empty)
#define SOIL_PIN A0      // Soil Moisture Sensor

const int DRY_THRESHOLD = 45;   // Trigger watering below 45% moisture
const int OPTIMAL_TARGET = 65;  // Stop watering when 65% is reached

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(FLOAT_PIN, INPUT_PULLUP);
  digitalWrite(RELAY_PIN, HIGH); // Active-Low Relay is OFF by default
  Serial.println("AGROSMART Smart Irrigation System Initialized.");
}

void loop() {
  int rawSoil = analogRead(SOIL_PIN);
  int moisturePercent = map(rawSoil, 650, 280, 0, 100);
  moisturePercent = constrain(moisturePercent, 0, 100);

  bool tankHasWater = (digitalRead(FLOAT_PIN) == LOW);

  // Safety Check: Never run pump if water tank is dry!
  if (!tankHasWater) {
    digitalWrite(RELAY_PIN, HIGH); // Turn off pump
    Serial.println("ALERT: Water Reservoir Empty! Pump Disabled.");
    delay(5000);
    return;
  }

  // Automatic Smart Irrigation Logic
  if (moisturePercent < DRY_THRESHOLD) {
    Serial.print("Soil Dry ("); Serial.print(moisturePercent);
    Serial.println("%). Triggering Drip Irrigation Pump...");
    
    digitalWrite(RELAY_PIN, LOW); // Turn ON pump (Active-Low)
    delay(10000);                 // Run 10-second precise drip pulse
    digitalWrite(RELAY_PIN, HIGH);// Turn OFF pump
    
    Serial.println("Pulse completed. Waiting for water absorption.");
    delay(15000);                // Wait 15s before re-checking
  } else {
    digitalWrite(RELAY_PIN, HIGH); // Ensure pump is OFF
    delay(3000);
  }
}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 text-xl border border-blue-500/30">
              💧
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Water Supply & Smart Irrigation Management
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                Automated drip irrigation, reservoir capacity monitoring, and water conservation for <strong className="text-emerald-400">{plant.name}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Irrigation Mode Toggle */}
        <div className="flex items-center gap-2 bg-stone-950 p-1.5 rounded-2xl border border-stone-800 self-start md:self-auto">
          <button
            onClick={() => waterSupplyService.setMode('AUTO_SMART')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              waterState.irrigationMode === 'AUTO_SMART'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Smart Auto</span>
          </button>
          <button
            onClick={() => waterSupplyService.setMode('MANUAL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              waterState.irrigationMode === 'MANUAL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Manual Mode
          </button>
        </div>
      </div>

      {/* Primary Water Status & Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Reservoir Tank Visual Gauge */}
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 text-white shadow-md flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Water Reservoir Tank</h3>
                <p className="text-[11px] text-stone-400">{waterState.waterSource}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              waterState.tankLevelPercent > 25 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {waterState.tankLevelPercent}% Full
            </span>
          </div>

          {/* Visual Tank Graphic */}
          <div className="flex items-center gap-6 justify-center py-2">
            <div className="relative w-28 h-40 rounded-3xl border-4 border-stone-700 bg-stone-950 p-1.5 overflow-hidden flex flex-col justify-end shadow-inner">
              {/* Water Volume Body with Wave Top */}
              <div
                className="w-full bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-400 rounded-b-2xl transition-all duration-700 relative overflow-hidden"
                style={{ height: `${waterState.tankLevelPercent}%` }}
              >
                <div className="absolute top-0 inset-x-0 h-2 bg-white/30 animate-pulse" />
              </div>

              {/* Measurement Marks */}
              <div className="absolute inset-y-2 left-2 flex flex-col justify-between text-[9px] font-mono text-stone-300 pointer-events-none">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="text-[10px] uppercase font-bold text-stone-300 tracking-wider">Current Volume</div>
                <div className="text-2xl font-black text-white">{currentVolume} <span className="text-sm font-normal text-stone-300">/ {waterState.tankCapacityLiters} L</span></div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-stone-300 tracking-wider">Water TDS Quality</div>
                <div className="font-semibold text-emerald-400">{waterState.waterQualityTdsPpm} PPM ({waterState.waterQualityGrade})</div>
              </div>
              <button
                onClick={() => waterSupplyService.refillTank(100)}
                className="mt-2 text-[11px] font-bold text-blue-400 hover:text-blue-300 underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Refill Reservoir to 100%</span>
              </button>
            </div>
          </div>

          {/* Source Selector Pills */}
          <div className="pt-2 border-t border-stone-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-300 block">Water Source:</span>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              <button
                onClick={() => waterSupplyService.setWaterSource('Rainwater Harvesting Tank')}
                className={`py-1.5 px-1 rounded-lg font-semibold transition cursor-pointer text-center ${
                  waterState.waterSource === 'Rainwater Harvesting Tank'
                    ? 'bg-blue-600 text-white'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                Rainwater
              </button>
              <button
                onClick={() => waterSupplyService.setWaterSource('Municipal Garden Supply')}
                className={`py-1.5 px-1 rounded-lg font-semibold transition cursor-pointer text-center ${
                  waterState.waterSource === 'Municipal Garden Supply'
                    ? 'bg-blue-600 text-white'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                Municipal
              </button>
              <button
                onClick={() => waterSupplyService.setWaterSource('Borewell / Ground Water')}
                className={`py-1.5 px-1 rounded-lg font-semibold transition cursor-pointer text-center ${
                  waterState.waterSource === 'Borewell / Ground Water'
                    ? 'bg-blue-600 text-white'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                Borewell
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Smart Irrigation Pump & Pulse Trigger */}
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 text-white shadow-md flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Irrigation Pump & Relay</h3>
                <p className="text-[11px] text-stone-400">5V Relay on {waterState.relayPinArduino}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              waterState.isPumpActive
                ? 'bg-blue-500 text-white animate-pulse'
                : 'bg-stone-800 text-stone-400'
            }`}>
              {waterState.isPumpActive ? 'PUMP ACTIVE (WATERING)' : 'PUMP IDLE'}
            </span>
          </div>

          {/* Plant Hydration Status */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Plant Target ({plant.name}):</span>
              <span className="font-bold text-emerald-400">
                {plant.requirements.soilMoisture.idealMin}% - {plant.requirements.soilMoisture.idealMax}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Current Soil Moisture:</span>
              <span className="font-bold text-white">{reading.soilMoisture !== null ? `${reading.soilMoisture}%` : 'Disconnected'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Pump Flow Rate:</span>
              <span className="font-mono text-cyan-400 font-bold">{waterState.flowRateLitersPerMin} Liters / Min</span>
            </div>
          </div>

          {/* Manual Pulse Button */}
          <div className="space-y-2">
            <button
              onClick={handleWaterPulse}
              disabled={waterState.isPumpActive}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                waterState.isPumpActive
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white active:scale-98'
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span>
                {waterState.isPumpActive ? 'Irrigation Pulse Active (Pumping...)' : 'Trigger Smart Water Pulse (15s)'}
              </span>
            </button>
            <p className="text-[11px] text-stone-400 text-center">
              Delivers 0.6 Liters of water directly to root zone and increases moisture by +15%.
            </p>
          </div>
        </div>

        {/* Card 3: Water Conservation Impact */}
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 text-white shadow-md flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Water Conservation Impact</h3>
                <p className="text-[11px] text-stone-400">Eco Savings vs Flood Irrigation</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Sustainable
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-stone-950 border border-emerald-800/40 text-center">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                {waterState.totalWaterSavedLiters.toLocaleString()} L
              </span>
              <p className="text-xs text-stone-300 font-semibold mt-1">
                Fresh Water Saved This Season
              </p>
            </div>

            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-center justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Total Delivered:</span>
                <span className="font-bold text-white">{waterState.totalWaterDeliveredLiters.toFixed(1)} Liters</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Water Efficiency:</span>
                <span className="font-bold text-emerald-400">82% Reduction in Run-off</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-stone-400">Root Health Protection:</span>
                <span className="font-bold text-cyan-400">Zero Waterlogging Suffocation</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400">
            <strong>Eco Fact:</strong> Traditional hose pipe watering wastes 15 Liters every minute. Smart sensor drip irrigation targets only thirsty roots!
          </div>
        </div>
      </div>

      {/* Hardware Relay Circuit Guide & Firmware Snippet */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 text-white shadow-md space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-extrabold text-white">
                Hardware Relay Module & Water Pump Circuit Guide
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Wiring instructions to connect a 5V relay module and 12V DC mini submersible pump to Arduino UNO or ESP32
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(RELAY_PUMP_CODE);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied Code!' : 'Copy Firmware'}</span>
          </button>
        </div>

        {/* Wiring Connection Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span>🔌</span> Arduino UNO Relay Connections:
            </h4>
            <ul className="space-y-1 text-stone-300 list-disc list-inside text-[11px]">
              <li><strong>Relay VCC:</strong> Connect to Arduino 5V Pin</li>
              <li><strong>Relay GND:</strong> Connect to Arduino GND</li>
              <li><strong>Relay IN (Control):</strong> Connect to Digital Pin D8</li>
              <li><strong>Water Float Switch:</strong> Pin A3 with Internal Pullup</li>
              <li><strong>Pump Power:</strong> 12V DC adapter (+) goes to Relay COM, Relay NO goes to 12V Pump (+), Pump (-) to Adapter (-)</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <h4 className="font-bold text-cyan-400 flex items-center gap-1.5">
              <span>📡</span> ESP32 Wi-Fi Relay Connections:
            </h4>
            <ul className="space-y-1 text-stone-300 list-disc list-inside text-[11px]">
              <li><strong>Relay VCC:</strong> Connect to ESP32 VIN (5V from USB)</li>
              <li><strong>Relay GND:</strong> Connect to ESP32 GND</li>
              <li><strong>Relay IN:</strong> Connect to GPIO 18</li>
              <li><strong>Float Switch:</strong> GPIO 36 (Sensor VP)</li>
              <li><strong>Flyback Diode:</strong> Place a 1N4007 diode across pump terminals to protect the relay from inductive voltage spikes!</li>
            </ul>
          </div>
        </div>

        {/* C++ Code Box */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-400">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Complete Relay Controller Firmware (Arduino & ESP32 Compatible):</span>
          </div>
          <pre className="text-[11px] font-mono bg-stone-950 p-4 rounded-2xl overflow-x-auto text-emerald-300 max-h-60 leading-relaxed border border-stone-800">
            {RELAY_PUMP_CODE}
          </pre>
        </div>
      </div>
    </div>
  );
};
