export type SensorSource = 'DEMO' | 'ESP32_WIFI' | 'ARDUINO_SERIAL';

export interface PlantRequirements {
  temperature: {
    min: number; // e.g. 15°C
    max: number; // e.g. 32°C
    idealMin: number; // e.g. 20°C
    idealMax: number; // e.g. 26°C
    unit: '°C';
  };
  humidity: {
    min: number; // e.g. 40%
    max: number; // e.g. 80%
    idealMin: number; // e.g. 50%
    idealMax: number; // e.g. 70%
    unit: '%';
  };
  soilMoisture: {
    min: number; // e.g. 40%
    max: number; // e.g. 80%
    idealMin: number; // e.g. 55%
    idealMax: number; // e.g. 70%
    unit: '%';
  };
  sunlight: {
    minLux: number; // e.g. 10000
    maxLux: number; // e.g. 50000
    hoursPerDay: number;
    category: 'Full Sun' | 'Partial Sunlight' | 'Indirect Bright' | 'Low to Medium Light';
  };
  soilPh: {
    min: number; // e.g. 6.0
    max: number; // e.g. 6.8
    ideal: number; // e.g. 6.5
  };
  npk: {
    nitrogen: 'Low' | 'Medium' | 'High';
    phosphorus: 'Low' | 'Medium' | 'High';
    potassium: 'Low' | 'Medium' | 'High';
    ecRange: string; // e.g. "1.2 - 2.0 mS/cm"
  };
  wateringAdvice: string;
  sunlightAdvice: string;
  soilAdvice: string;
  feedingAdvice: string;
  commonIssues: Array<{
    symptom: string;
    cause: string;
    fix: string;
  }>;
  funFact: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  category: 'Vegetable' | 'Herb' | 'Flowering' | 'Indoor Folio' | 'Medicinal' | 'Succulent';
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  icon: string;
  image?: string;
  description: string;
  requirements: PlantRequirements;
  isCustom?: boolean;
}

export interface SensorReading {
  timestamp: number;
  temperature: number | null; // °C (DHT11/DHT22)
  humidity: number | null; // % (DHT11/DHT22)
  soilMoisture: number | null; // % (Capacitive/Resistive Soil Sensor)
  sunlightLux: number | null; // Lux (LDR/BH1750)
  soilPh: number | null; // pH 0-14 (Soil pH probe)
  soilEc: number | null; // mS/cm (Electrical conductivity)
  nitrogen: number | null; // mg/kg (NPK sensor)
  phosphorus: number | null; // mg/kg (NPK sensor)
  potassium: number | null; // mg/kg (NPK sensor)
  deviceId: string;
  source: SensorSource;
  isLiveConnected: boolean;
  batteryLevel?: number; // %
}

export type ParameterKey = 'soilMoisture' | 'sunlight' | 'temperature' | 'humidity' | 'soilPh' | 'fertility';

export type StatusLevel = 'LOW' | 'NORMAL' | 'HIGH' | 'MISSING';
export type SeverityLevel = 'ok' | 'warning' | 'critical' | 'unknown';

export interface RequirementAnalysis {
  parameter: ParameterKey;
  label: string;
  iconName: string;
  currentVal: number | null;
  unit: string;
  targetRange: string;
  status: StatusLevel;
  severity: SeverityLevel;
  simpleProblemText: string; // Plain English for 9th grader
  simpleActionText: string;  // Plain English action
  detailedExplanation: string;
  scoreImpact: number; // Points deducted (e.g. -15)
}

export interface FactorScore {
  factor: string;
  weight: number;
  score: number;
  status: 'optimal' | 'mild_deviation' | 'severe_deviation' | 'missing';
  reason: string;
}

export interface PlantHealthEvaluation {
  score: number; // 0-100
  grade: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
  factors: FactorScore[];
  analyses: RequirementAnalysis[];
  criticalAlerts: string[];
  recommendations: string[];
  missingSensors: string[];
  lastUpdated: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  relatedPlantId?: string;
  actionItems?: string[];
}
