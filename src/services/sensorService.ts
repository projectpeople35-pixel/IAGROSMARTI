import { SensorReading, SensorSource } from '../types';

export interface HistoricalDataPoint {
  timeLabel: string;
  timestamp: number;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  sunlightLux: number;
  soilPh: number;
  soilEc: number;
}

export interface HardwareStatus {
  source: SensorSource;
  isLiveConnected: boolean;
  esp32IpAddress: string;
  esp32Port: number;
  lastPingTime: number | null;
  signalStrengthDbm: number | null;
  batteryPercent: number;
  firmwareVersion: string;
  activeSensors: {
    dht: boolean;
    soilMoisture: boolean;
    sunlight: boolean;
    soilPh: boolean;
    soilEc: boolean;
  };
}

const DEFAULT_DEMO_READING: SensorReading = {
  timestamp: Date.now(),
  temperature: 24.2,
  humidity: 62.5,
  soilMoisture: 64.0,
  sunlightLux: 36500,
  soilPh: 6.5,
  soilEc: 1.8,
  nitrogen: 65,
  phosphorus: 45,
  potassium: 85,
  deviceId: 'ESP32_DEMO_NODE_01',
  source: 'DEMO',
  isLiveConnected: true,
  batteryLevel: 94,
};

export class SensorService {
  private currentReading: SensorReading = { ...DEFAULT_DEMO_READING };
  private mode: SensorSource = 'DEMO';
  private esp32Ip = '192.168.1.105';
  private lastHardwarePing: number | null = null;
  private isLiveConnected = false;
  private listeners: Array<(reading: SensorReading) => void> = [];
  private statusListeners: Array<(status: HardwareStatus) => void> = [];
  private simulationInterval: any = null;
  private simulationSliders = {
    temperature: 24.2,
    humidity: 62.5,
    soilMoisture: 64.0,
    sunlightLux: 36500,
    soilPh: 6.5,
    soilEc: 1.8,
  };

  constructor() {
    this.startSimulation();
  }

  public getReading(): SensorReading {
    return { ...this.currentReading };
  }

  public getHardwareStatus(): HardwareStatus {
    return {
      source: this.mode,
      isLiveConnected: this.mode === 'DEMO' ? true : this.isLiveConnected,
      esp32IpAddress: this.esp32Ip,
      esp32Port: 80,
      lastPingTime: this.lastHardwarePing,
      signalStrengthDbm: this.mode === 'DEMO' ? -42 : (this.isLiveConnected ? -58 : null),
      batteryPercent: 92,
      firmwareVersion: 'AGROSMART-ESP32-v2.1',
      activeSensors: {
        dht: true,
        soilMoisture: true,
        sunlight: true,
        soilPh: true,
        soilEc: true,
      },
    };
  }

  public setMode(mode: SensorSource): void {
    this.mode = mode;
    if (mode === 'DEMO') {
      this.isLiveConnected = true;
      this.currentReading = {
        ...this.currentReading,
        source: 'DEMO',
        isLiveConnected: true,
      };
      this.startSimulation();
    } else {
      // Switched to LIVE SENSOR MODE (ESP32/Arduino)
      // Check if we received a recent ping; if not, mark disconnected
      const now = Date.now();
      const isRecent = this.lastHardwarePing !== null && (now - this.lastHardwarePing) < 30000;
      this.isLiveConnected = isRecent;
      this.currentReading = {
        ...this.currentReading,
        source: mode,
        isLiveConnected: isRecent,
        // If not connected, sensors are null to be scientifically honest
        temperature: isRecent ? this.currentReading.temperature : null,
        humidity: isRecent ? this.currentReading.humidity : null,
        soilMoisture: isRecent ? this.currentReading.soilMoisture : null,
        sunlightLux: isRecent ? this.currentReading.sunlightLux : null,
        soilPh: isRecent ? this.currentReading.soilPh : null,
        soilEc: isRecent ? this.currentReading.soilEc : null,
      };
      if (this.simulationInterval) {
        clearInterval(this.simulationInterval);
        this.simulationInterval = null;
      }
    }
    this.notify();
    this.notifyStatus();
  }

  public setEsp32Ip(ip: string): void {
    this.esp32Ip = ip;
    this.notifyStatus();
  }

  /**
   * Called when real ESP32 or simulated hardware pushes a JSON payload
   */
  public receiveHardwarePayload(data: Partial<SensorReading>): void {
    this.lastHardwarePing = Date.now();
    this.isLiveConnected = true;

    this.currentReading = {
      timestamp: Date.now(),
      temperature: data.temperature ?? this.currentReading.temperature,
      humidity: data.humidity ?? this.currentReading.humidity,
      soilMoisture: data.soilMoisture ?? this.currentReading.soilMoisture,
      sunlightLux: data.sunlightLux ?? this.currentReading.sunlightLux,
      soilPh: data.soilPh ?? this.currentReading.soilPh,
      soilEc: data.soilEc ?? this.currentReading.soilEc,
      nitrogen: data.nitrogen ?? this.currentReading.nitrogen,
      phosphorus: data.phosphorus ?? this.currentReading.phosphorus,
      potassium: data.potassium ?? this.currentReading.potassium,
      deviceId: data.deviceId || 'ESP32_WIFI_NODE_A1',
      source: this.mode === 'DEMO' ? 'DEMO' : 'ESP32_WIFI',
      isLiveConnected: true,
      batteryLevel: data.batteryLevel ?? 92,
    };

    this.notify();
    this.notifyStatus();
  }

  /**
   * For interactive Demo Mode: user can adjust a slider to test plant reactions!
   */
  public setDemoSlider(param: keyof typeof this.simulationSliders, value: number): void {
    this.simulationSliders[param] = value;
    if (this.mode === 'DEMO') {
      this.currentReading = {
        ...this.currentReading,
        [param]: value,
        timestamp: Date.now(),
      };
      this.notify();
    }
  }

  public getDemoSliders() {
    return { ...this.simulationSliders };
  }

  public subscribe(fn: (reading: SensorReading) => void): () => void {
    this.listeners.push(fn);
    fn(this.getReading());
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  public subscribeStatus(fn: (status: HardwareStatus) => void): () => void {
    this.statusListeners.push(fn);
    fn(this.getHardwareStatus());
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== fn);
    };
  }

  private notify(): void {
    const reading = this.getReading();
    this.listeners.forEach(fn => fn(reading));
  }

  private notifyStatus(): void {
    const status = this.getHardwareStatus();
    this.statusListeners.forEach(fn => fn(status));
  }

  private startSimulation(): void {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
    this.simulationInterval = setInterval(() => {
      if (this.mode !== 'DEMO') return;
      const tJitter = (Math.random() - 0.5) * 0.2;
      const hJitter = (Math.random() - 0.5) * 0.4;
      const mJitter = (Math.random() - 0.5) * 0.15;
      const lJitter = Math.floor((Math.random() - 0.5) * 150);

      this.currentReading = {
        ...this.currentReading,
        timestamp: Date.now(),
        temperature: +(this.simulationSliders.temperature + tJitter).toFixed(1),
        humidity: +(this.simulationSliders.humidity + hJitter).toFixed(1),
        soilMoisture: +(this.simulationSliders.soilMoisture + mJitter).toFixed(1),
        sunlightLux: Math.max(0, this.simulationSliders.sunlightLux + lJitter),
        soilPh: this.simulationSliders.soilPh,
        soilEc: this.simulationSliders.soilEc,
      };
      this.notify();
    }, 3500);
    if (this.simulationInterval && typeof (this.simulationInterval as any).unref === 'function') {
      (this.simulationInterval as any).unref();
    }
  }

  /**
   * Generates realistic 24-hour historical records for interactive charts
   */
  public get24HourHistory(): HistoricalDataPoint[] {
    const points: HistoricalDataPoint[] = [];
    const now = Date.now();
    const current = this.currentReading;
    const baseTemp = current.temperature ?? 24;
    const baseHum = current.humidity ?? 60;
    const baseMoist = current.soilMoisture ?? 65;
    const baseLux = current.sunlightLux ?? 30000;
    const basePh = current.soilPh ?? 6.5;

    for (let i = 24; i >= 0; i--) {
      const time = new Date(now - i * 3600 * 1000);
      const hour = time.getHours();
      const hourStr = `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`;

      // Realistic diurnal curve: sunlight peaks at 1 PM, low at night
      let luxFactor = 0;
      if (hour >= 6 && hour <= 18) {
        // Daytime sine arc
        const daylightAngle = ((hour - 6) / 12) * Math.PI;
        luxFactor = Math.sin(daylightAngle);
      }
      const lux = Math.round(luxFactor * (baseLux * 1.2) + Math.random() * 800);

      // Temperature warms up in afternoon
      const tempDelta = (hour >= 12 && hour <= 16) ? 3.5 : (hour >= 2 && hour <= 6 ? -3.0 : 0);
      const temp = +(baseTemp + tempDelta + (Math.random() - 0.5) * 0.8).toFixed(1);

      // Humidity is inverse to temp
      const humDelta = -tempDelta * 1.5;
      const hum = +(Math.min(95, Math.max(25, baseHum + humDelta + (Math.random() - 0.5) * 2))).toFixed(1);

      // Soil moisture slowly decreases over the day unless watered
      const moistureDecay = (i % 12) * 0.4;
      const moist = +(Math.max(20, Math.min(90, baseMoist - moistureDecay + (Math.random() - 0.5) * 0.5))).toFixed(1);

      points.push({
        timeLabel: hourStr,
        timestamp: time.getTime(),
        temperature: temp,
        humidity: hum,
        soilMoisture: moist,
        sunlightLux: lux,
        soilPh: +(basePh + (Math.random() - 0.5) * 0.1).toFixed(2),
        soilEc: +(1.8 + (Math.random() - 0.5) * 0.1).toFixed(2),
      });
    }

    return points;
  }

  /**
   * Generates 7-day trend history
   */
  public get7DayHistory() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const points = [];
    const now = new Date();
    const current = this.currentReading;
    const baseTemp = current.temperature ?? 24;
    const baseHum = current.humidity ?? 60;
    const baseMoist = current.soilMoisture ?? 65;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
      const dayName = days[d.getDay()];

      points.push({
        dayLabel: dayName,
        dateStr: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        avgTemp: +(baseTemp + (Math.random() - 0.5) * 2.5).toFixed(1),
        avgHumidity: +(baseHum + (Math.random() - 0.5) * 5).toFixed(1),
        avgMoisture: +(baseMoist + (Math.random() - 0.5) * 6).toFixed(1),
        avgSunlightLux: Math.round(28000 + (Math.random() - 0.5) * 8000),
        avgPh: +(6.5 + (Math.random() - 0.5) * 0.2).toFixed(2),
        healthScoreAvg: Math.round(Math.min(100, Math.max(70, 92 + (Math.random() - 0.5) * 12))),
      });
    }

    return points;
  }
}

export const sensorService = new SensorService();
