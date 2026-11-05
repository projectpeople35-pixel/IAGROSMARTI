import React, { useState } from 'react';
import { SensorReading } from '../types';
import { sensorService, HardwareStatus } from '../services/sensorService';
import {
  Cpu,
  Radio,
  Wifi,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Send,
  RefreshCw,
  Sliders,
  HelpCircle,
  Code2,
} from 'lucide-react';

interface SensorMonitoringProps {
  reading: SensorReading;
  status: HardwareStatus;
  onSwitchMode: (mode: 'DEMO' | 'ESP32_WIFI') => void;
}

export const SensorMonitoring: React.FC<SensorMonitoringProps> = ({
  reading,
  status,
  onSwitchMode,
}) => {
  const [copiedArduino, setCopiedArduino] = useState(false);
  const [copiedEsp, setCopiedEsp] = useState(false);
  const [customIp, setCustomIp] = useState(status.esp32IpAddress);
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        temperature: 26.5,
        humidity: 58.0,
        soilMoisture: 62.0,
        sunlightLux: 34000,
        soilPh: 6.6,
        soilEc: 1.9,
        deviceId: 'ESP32_NODE_ROOM_01',
      },
      null,
      2
    )
  );
  const [payloadSuccess, setPayloadSuccess] = useState(false);

  const copyCode = (type: 'arduino' | 'esp', code: string) => {
    navigator.clipboard.writeText(code);
    if (type === 'arduino') {
      setCopiedArduino(true);
      setTimeout(() => setCopiedArduino(false), 2000);
    } else {
      setCopiedEsp(true);
      setTimeout(() => setCopiedEsp(false), 2000);
    }
  };

  const handleSendTestPayload = () => {
    try {
      const parsed = JSON.parse(testPayload);
      sensorService.receiveHardwarePayload(parsed);
      setPayloadSuccess(true);
      setTimeout(() => setPayloadSuccess(false), 3000);
    } catch {
      alert('Invalid JSON in test payload!');
    }
  };

  const ARDUINO_UNO_CODE = `// ==========================================
// AGROSMART: Arduino UNO Sensor Collector
// Reads Analog Sensors & Sends via Serial to ESP32
// Baud Rate: 115200 bps
// ==========================================

#include <DHT.h>

#define DHTPIN 4          // DHT11 or DHT22 connected to Digital Pin 4
#define DHTTYPE DHT11     // or DHT22
#define SOIL_PIN A0       // Capacitive Soil Moisture Sensor on Analog 0
#define LDR_PIN A1        // Light Dependent Resistor (LDR) on Analog 1
#define PH_PIN A2         // Analog Soil pH Probe on Analog 2

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);   // Communication with ESP32 (Hardware Serial)
  dht.begin();
  pinMode(SOIL_PIN, INPUT);
  pinMode(LDR_PIN, INPUT);
  pinMode(PH_PIN, INPUT);
}

void loop() {
  // 1. Read Soil Moisture (0 to 1023 -> 0% to 100%)
  int rawSoil = analogRead(SOIL_PIN);
  int soilPercent = map(rawSoil, 650, 280, 0, 100);
  soilPercent = constrain(soilPercent, 0, 100);

  // 2. Read Temp & Humidity from DHT
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  // 3. Read Light LDR (approx Lux)
  int rawLdr = analogRead(LDR_PIN);
  int lux = map(rawLdr, 0, 1023, 100, 65000);

  // 4. Read pH (Calibration formula)
  int rawPh = analogRead(PH_PIN);
  float voltage = rawPh * (5.0 / 1023.0);
  float ph = 3.5 * voltage; // Adjusted per probe calibration

  // Format as comma-separated or JSON to ESP32
  if (!isnan(temp) && !isnan(hum)) {
    Serial.print("AGRO:");
    Serial.print(temp); Serial.print(",");
    Serial.print(hum); Serial.print(",");
    Serial.print(soilPercent); Serial.print(",");
    Serial.print(lux); Serial.print(",");
    Serial.println(ph);
  }

  delay(3000); // 3-second cycle
}`;

  const ESP32_WIFI_CODE = `// ==========================================
// AGROSMART: ESP32 Wi-Fi Gateway
// Receives Arduino Serial & POSTs JSON to AGROSMART
// ==========================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// AGROSMART Webhook / API URL
const char* serverUrl = "http://192.168.1.100:3000/api/sensors/reading";

void setup() {
  Serial.begin(115200);   // USB Monitor
  Serial2.begin(115200, SERIAL_8N1, 16, 17); // RX2=Pin 16 from Arduino TX

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void loop() {
  if (Serial2.available()) {
    String line = Serial2.readStringUntil('\\n');
    if (line.startsWith("AGRO:")) {
      line.replace("AGRO:", "");
      
      int c1 = line.indexOf(',');
      int c2 = line.indexOf(',', c1 + 1);
      int c3 = line.indexOf(',', c2 + 1);
      int c4 = line.indexOf(',', c3 + 1);

      float temp = line.substring(0, c1).toFloat();
      float hum = line.substring(c1 + 1, c2).toFloat();
      float soil = line.substring(c2 + 1, c3).toFloat();
      int lux = line.substring(c3 + 1, c4).toInt();
      float ph = line.substring(c4 + 1).toFloat();

      if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverUrl);
        http.addHeader("Content-Type", "application/json");

        StaticJsonDocument<256> doc;
        doc["temperature"] = temp;
        doc["humidity"] = hum;
        doc["soilMoisture"] = soil;
        doc["sunlightLux"] = lux;
        doc["soilPh"] = ph;
        doc["deviceId"] = "ESP32_AGRO_01";

        String jsonPayload;
        serializeJson(doc, jsonPayload);
        http.POST(jsonPayload);
        http.end();
      }
    }
  }
  delay(100);
}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-stone-100">
      {/* Header */}
      <div className="bg-stone-900 rounded-3xl p-6 border border-stone-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xl">📡</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Sensor Monitoring & Microcontroller Hub
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                Real-time telemetry architecture for ESP32 Wi-Fi & Arduino UNO hardware
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selector Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-stone-950 p-1 rounded-2xl border border-stone-800">
          <button
            onClick={() => onSwitchMode('DEMO')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              reading.source === 'DEMO'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            DEMO MODE (Simulated)
          </button>
          <button
            onClick={() => onSwitchMode('ESP32_WIFI')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              reading.source !== 'DEMO'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE SENSOR MODE</span>
          </button>
        </div>
      </div>

      {/* Mode Status Warning / Banner */}
      {reading.source === 'DEMO' ? (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 flex items-start gap-3 shadow-md">
          <div className="p-2 rounded-xl bg-amber-900/60 text-amber-300 flex-shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Honest Science Notice: Demo Mode Active
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              AGROSMART is currently generating realistic sample telemetry with gentle natural fluctuations for demonstration. <strong>These values are not from physical probes.</strong> When you connect your ESP32 on your local Wi-Fi, switch to "LIVE SENSOR MODE" above.
            </p>
          </div>
        </div>
      ) : (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 shadow-md ${
          reading.isLiveConnected
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
            : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
        }`}>
          <div className={`p-2 rounded-xl flex-shrink-0 ${
            reading.isLiveConnected ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
          }`}>
            <Wifi className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider">
              {reading.isLiveConnected ? 'Live ESP32 Telemetry Active' : 'Waiting for ESP32 Wi-Fi Signal'}
            </h3>
            <p className="text-xs leading-relaxed text-stone-300">
              {reading.isLiveConnected
                ? `Receiving continuous packets from microcontroller ID ${reading.deviceId}. Hardware readings are directly mapped to the plant requirement detector.`
                : 'No hardware packet received in the last 30 seconds. Verify that your ESP32 is powered on, connected to your Wi-Fi router, and pointing to this application IP.'}
            </p>
          </div>
        </div>
      )}

      {/* Hardware Connection Guide & Wiring Pinouts */}
      <div className="rounded-3xl bg-stone-900 p-6 border border-stone-800 shadow-md space-y-5">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>Hardware Wiring & Sensor Pinout Guide</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Step-by-step connection table for student science projects and school exhibitions
          </p>
        </div>

        {/* Wiring Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-950 text-stone-300">
                <th className="py-2.5 px-3 font-bold">Sensor Component</th>
                <th className="py-2.5 px-3 font-bold">Physical Variable Measured</th>
                <th className="py-2.5 px-3 font-bold">What it CANNOT Measure</th>
                <th className="py-2.5 px-3 font-bold">Arduino UNO Pin</th>
                <th className="py-2.5 px-3 font-bold">ESP32 Pin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              <tr className="hover:bg-stone-850">
                <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                  <span>💧</span> Capacitive Soil Moisture v1.2
                </td>
                <td className="py-2.5 px-3">Dielectric permittivity of water in soil (0-100%)</td>
                <td className="py-2.5 px-3 text-rose-400 font-medium">Cannot measure soil nutrients or fertility!</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">Analog A0</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">GPIO 34 (ADC1)</td>
              </tr>
              <tr className="hover:bg-stone-850">
                <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                  <span>🌡️</span> DHT11 / DHT22 Sensor
                </td>
                <td className="py-2.5 px-3">Ambient Temperature (°C) & Relative Humidity (%)</td>
                <td className="py-2.5 px-3 text-stone-400">Measures surrounding air, not internal leaf temp</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">Digital Pin 4</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">GPIO 4</td>
              </tr>
              <tr className="hover:bg-stone-850">
                <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                  <span>☀️</span> BH1750 / LDR Photoresistor
                </td>
                <td className="py-2.5 px-3">Visible Light Intensity in Lux (Lumens/m²)</td>
                <td className="py-2.5 px-3 text-stone-400">LDR is non-linear; BH1750 provides calibrated Lux</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">A1 (LDR) or A4/A5 (I2C)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">GPIO 21 (SDA), 22 (SCL)</td>
              </tr>
              <tr className="hover:bg-stone-850">
                <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                  <span>🧪</span> Soil pH Probe (Analog)
                </td>
                <td className="py-2.5 px-3">Hydrogen ion activity (pH 3.0 to 10.0)</td>
                <td className="py-2.5 px-3 text-stone-400">Requires moist soil; cannot measure dry dirt</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">Analog A2</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">GPIO 35 (ADC1)</td>
              </tr>
              <tr className="hover:bg-stone-850">
                <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                  <span>⚡</span> Soil EC & NPK Sensor (RS485)
                </td>
                <td className="py-2.5 px-3">Electrical conductivity (mS/cm) & dissolved ions</td>
                <td className="py-2.5 px-3 text-stone-400">Measures total dissolved salts; not individual atoms</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">SoftwareSerial (D2/D3)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">UART2 (GPIO 16/17)</td>
              </tr>
              <tr className="hover:bg-stone-850 bg-emerald-950/20">
                <td className="py-2.5 px-3 font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>🔗</span> Serial Bridge (UNO → ESP32)
                </td>
                <td className="py-2.5 px-3">Serial UART transmission at 115,200 baud</td>
                <td className="py-2.5 px-3 text-stone-400">Requires common GND between both boards!</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">TX Pin 1</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">RX2 (GPIO 16)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Snippets for Arduino IDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Arduino UNO Code */}
        <div className="rounded-3xl bg-stone-900 text-stone-100 p-5 border border-stone-800 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                1. Arduino UNO Firmware (C++)
              </h3>
            </div>
            <button
              onClick={() => copyCode('arduino', ARDUINO_UNO_CODE)}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              {copiedArduino ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedArduino ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <p className="text-[11px] text-stone-400">
            Collects analog readings from DHT, Soil Moisture, LDR, and pH, and transmits formatted packets via UART.
          </p>
          <pre className="text-[11px] font-mono bg-stone-950 p-3.5 rounded-2xl overflow-x-auto text-emerald-300 max-h-56 leading-relaxed border border-stone-800">
            {ARDUINO_UNO_CODE}
          </pre>
        </div>

        {/* ESP32 Wi-Fi Gateway Code */}
        <div className="rounded-3xl bg-stone-900 text-stone-100 p-5 border border-stone-800 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                2. ESP32 Wi-Fi Gateway Firmware (C++)
              </h3>
            </div>
            <button
              onClick={() => copyCode('esp', ESP32_WIFI_CODE)}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              {copiedEsp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEsp ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <p className="text-[11px] text-stone-400">
            Receives serial packets on Serial2, packages them into JSON, and dispatches HTTP POST requests to AGROSMART.
          </p>
          <pre className="text-[11px] font-mono bg-stone-950 p-3.5 rounded-2xl overflow-x-auto text-teal-300 max-h-56 leading-relaxed border border-stone-800">
            {ESP32_WIFI_CODE}
          </pre>
        </div>
      </div>

      {/* Live Webhook / Injection Console for Demonstrations */}
      <div className="rounded-3xl bg-stone-900 p-6 border border-stone-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">ESP32 Webhook & Packet Injection Console</h3>
              <p className="text-xs text-stone-400">
                Test live telemetry reception by simulating an ESP32 HTTP POST payload
              </p>
            </div>
          </div>
          {payloadSuccess && (
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Packet Received & Applied!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-300">ESP32 Hardware IP Address on Wi-Fi</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customIp}
                onChange={e => setCustomIp(e.target.value)}
                placeholder="192.168.1.105"
                className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => sensorService.setEsp32Ip(customIp)}
                className="px-3 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-700 transition cursor-pointer"
              >
                Save
              </button>
            </div>
            <p className="text-[11px] text-stone-400">
              When connected to your local Wi-Fi, the ESP32 prints its local IP in the Arduino Serial Monitor.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-300">Simulate ESP32 POST Payload (JSON)</label>
              <button
                onClick={handleSendTestPayload}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Inject Packet Now</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={testPayload}
              onChange={e => setTestPayload(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-800 font-mono text-[11px] bg-stone-950 text-emerald-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
