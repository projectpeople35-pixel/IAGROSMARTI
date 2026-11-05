import React from 'react';
import { Cpu, X, Wifi, Radio, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HardwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSensors: () => void;
}

export const HardwareModal: React.FC<HardwareModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSensors,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200 text-stone-100">
      <div className="w-full max-w-xl bg-stone-900 rounded-3xl shadow-2xl border border-stone-800 p-6 my-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Hardware Connection Quick Guide
              </h3>
              <p className="text-[11px] text-stone-400">Arduino UNO & ESP32 Wi-Fi Setup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
            <span className="font-bold text-white block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              1. Architecture Flow
            </span>
            <p className="text-stone-300">
              <strong>Sensors (Soil Moisture, DHT, Light, pH)</strong> connect to <strong>Arduino UNO</strong> analog/digital pins. Arduino formats readings and sends them via Serial (TX → RX2) to the <strong>ESP32</strong>, which connects to local Wi-Fi and pushes JSON telemetry to the AGROSMART app.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
            <span className="font-bold text-white block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              2. Key Pin Connections
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-stone-300">
              <li>Capacitive Soil Moisture: <strong>VCC to 3.3V/5V, GND to GND, AOUT to Arduino A0</strong></li>
              <li>DHT11 / DHT22: <strong>VCC to 5V, GND to GND, DATA to Arduino D4</strong> (with 10k resistor)</li>
              <li>BH1750 / LDR: <strong>VCC, GND, Signal to Arduino A1 or I2C SDA/SCL</strong></li>
              <li>Water Pump Relay: <strong>Control to Arduino D8 / ESP32 GPIO 18</strong></li>
              <li>Serial Link: <strong>Arduino TX (Pin 1) to ESP32 RX2 (Pin 16) + Shared Ground (GND)</strong></li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 space-y-1">
            <span className="font-bold block flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              3. Demo Mode vs Live Mode
            </span>
            <p className="text-[11px] text-emerald-300">
              If your microcontrollers are not physically connected right now, keep AGROSMART in <strong>DEMO MODE</strong>. You can use our interactive simulation sliders to test all edge cases!
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-800 text-stone-300 font-semibold text-xs hover:bg-stone-800"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigateToSensors();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <span>Full Pinout & C++ Code</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
