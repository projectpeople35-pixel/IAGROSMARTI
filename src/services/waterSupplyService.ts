import { sensorService } from './sensorService';
import { Plant } from '../types';

export interface WaterSupplyState {
  tankLevelPercent: number; // 0 to 100%
  tankCapacityLiters: number; // e.g. 200 Liters
  waterSource: 'Rainwater Harvesting Tank' | 'Municipal Garden Supply' | 'Borewell / Ground Water';
  waterQualityTdsPpm: number; // Parts per million (e.g. 145 ppm)
  waterQualityGrade: 'Pure Rainwater' | 'Low Mineral' | 'Moderate' | 'Hard Water';
  isPumpActive: boolean;
  irrigationMode: 'AUTO_SMART' | 'MANUAL';
  totalWaterSavedLiters: number;
  totalWaterDeliveredLiters: number;
  lastWateringTime: number | null;
  flowRateLitersPerMin: number;
  zoningActive: {
    dripRoots: boolean;
    mistCanopy: boolean;
  };
  relayPinArduino: string;
  relayPinEsp32: string;
  floatSensorStatus: 'NORMAL_WATER' | 'LOW_RESERVOIR_ALERT';
}

class WaterSupplyService {
  private state: WaterSupplyState = {
    tankLevelPercent: 78,
    tankCapacityLiters: 200,
    waterSource: 'Rainwater Harvesting Tank',
    waterQualityTdsPpm: 135,
    waterQualityGrade: 'Pure Rainwater',
    isPumpActive: false,
    irrigationMode: 'AUTO_SMART',
    totalWaterSavedLiters: 1485,
    totalWaterDeliveredLiters: 340,
    lastWateringTime: Date.now() - 3600 * 1000 * 4, // 4 hours ago
    flowRateLitersPerMin: 2.4,
    zoningActive: {
      dripRoots: true,
      mistCanopy: false,
    },
    relayPinArduino: 'Digital Pin D8',
    relayPinEsp32: 'GPIO 18',
    floatSensorStatus: 'NORMAL_WATER',
  };

  private listeners: Array<(state: WaterSupplyState) => void> = [];
  private pulseTimer: any = null;

  public getState(): WaterSupplyState {
    return { ...this.state };
  }

  public subscribe(fn: (state: WaterSupplyState) => void): () => void {
    this.listeners.push(fn);
    fn(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify(): void {
    const s = this.getState();
    this.listeners.forEach(fn => fn(s));
  }

  public setMode(mode: 'AUTO_SMART' | 'MANUAL'): void {
    this.state.irrigationMode = mode;
    this.notify();
  }

  public stopPump(): void {
    if (this.pulseTimer) {
      clearTimeout(this.pulseTimer);
      this.pulseTimer = null;
    }
    this.state.isPumpActive = false;
    this.notify();
  }

  public setWaterSource(source: WaterSupplyState['waterSource']): void {
    this.state.waterSource = source;
    if (source === 'Rainwater Harvesting Tank') {
      this.state.waterQualityTdsPpm = 95;
      this.state.waterQualityGrade = 'Pure Rainwater';
    } else if (source === 'Municipal Garden Supply') {
      this.state.waterQualityTdsPpm = 220;
      this.state.waterQualityGrade = 'Low Mineral';
    } else {
      this.state.waterQualityTdsPpm = 410;
      this.state.waterQualityGrade = 'Moderate';
    }
    this.notify();
  }

  public refillTank(percent = 100): void {
    this.state.tankLevelPercent = percent;
    this.state.floatSensorStatus = 'NORMAL_WATER';
    this.notify();
  }

  /**
   * Triggers a smart watering pulse (e.g. 15-30 seconds).
   * Increases soil moisture in the sensor service realistically,
   * consumes reservoir water, and increments water saved counter!
   */
  public triggerWaterPulse(seconds = 15, currentPlant?: Plant): boolean {
    if (this.state.isPumpActive) return false;

    if (this.state.tankLevelPercent <= 5) {
      this.state.floatSensorStatus = 'LOW_RESERVOIR_ALERT';
      this.notify();
      return false;
    }

    this.state.isPumpActive = true;
    this.state.lastWateringTime = Date.now();
    this.notify();

    // Consume water from tank and increase soil moisture
    const waterConsumedLiters = +((this.state.flowRateLitersPerMin / 60) * seconds).toFixed(1);

    if (this.pulseTimer) clearTimeout(this.pulseTimer);
    this.pulseTimer = setTimeout(() => {
      this.state.isPumpActive = false;
      this.state.totalWaterDeliveredLiters += waterConsumedLiters;
      this.state.totalWaterSavedLiters += Math.round(waterConsumedLiters * 1.8); // 80% water saved vs flood irrigation!
      this.state.tankLevelPercent = Math.max(0, this.state.tankLevelPercent - 3);

      if (this.state.tankLevelPercent <= 5) {
        this.state.floatSensorStatus = 'LOW_RESERVOIR_ALERT';
      }

      // Update soil moisture in sensorService
      const currentReading = sensorService.getReading();
      const currentMoist = currentReading.soilMoisture ?? 50;
      const targetMoist = currentPlant ? Math.min(currentPlant.requirements.soilMoisture.idealMax, currentMoist + 15) : currentMoist + 12;
      sensorService.setDemoSlider('soilMoisture', Math.min(95, targetMoist));

      this.notify();
    }, seconds * 100); // Accelerated 1.5s for snappy UI experience
    if (this.pulseTimer && typeof (this.pulseTimer as any).unref === 'function') {
      (this.pulseTimer as any).unref();
    }
    return true;
  }

  public checkAutoIrrigation(plant: Plant, soilMoisture: number | null): boolean {
    if (this.state.irrigationMode !== 'AUTO_SMART') return false;
    if (soilMoisture === null || this.state.isPumpActive) return false;

    // If moisture drops below plant minimum threshold, trigger smart pulse automatically!
    if (soilMoisture < plant.requirements.soilMoisture.min && this.state.tankLevelPercent > 10) {
      return this.triggerWaterPulse(10, plant);
    }
    return false;
  }
}

export const waterSupplyService = new WaterSupplyService();
