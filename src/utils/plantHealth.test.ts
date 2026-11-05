import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PLANTS } from '../data/plants';
import {
  analyzeSoilMoisture,
  analyzeSunlight,
  analyzeTemperature,
  analyzeSoilPh,
  calculatePlantHealth,
} from './plantHealth';
import { SensorReading } from '../types';
import { waterSupplyService } from '../services/waterSupplyService';
import { INDIAN_LANGUAGES, TRANSLATIONS } from './translations';

const tomato = INITIAL_PLANTS.find(p => p.id === 'tomato')!;

test('Soil Moisture Detector identifies dry soil with 9th-grade phrasing', () => {
  // Tomato minimum moisture is 50%, ideal is 60-75%
  const result = analyzeSoilMoisture(tomato, 25);
  assert.equal(result.status, 'LOW');
  assert.equal(result.severity, 'critical');
  assert.equal(result.simpleProblemText, 'Your plant needs water. The soil is currently dry.');
  assert.match(result.simpleActionText, /Water your Tomato/);
});

test('Soil Moisture Detector recognizes optimal moisture', () => {
  const result = analyzeSoilMoisture(tomato, 65);
  assert.equal(result.status, 'NORMAL');
  assert.equal(result.severity, 'ok');
  assert.match(result.simpleProblemText, /Soil moisture is healthy/);
});

test('Sunlight Detector warns when light is insufficient', () => {
  // Tomato minLux is 25,000 Lux
  const result = analyzeSunlight(tomato, 5000);
  assert.equal(result.status, 'LOW');
  assert.equal(result.severity, 'critical');
  assert.equal(result.simpleProblemText, 'Your plant needs more sunlight.');
});

test('Temperature Detector warns when ambient heat is excessive', () => {
  // Tomato max is 35°C
  const result = analyzeTemperature(tomato, 39);
  assert.equal(result.status, 'HIGH');
  assert.equal(result.severity, 'critical');
  assert.equal(
    result.simpleProblemText,
    'The surroundings are too hot for this plant. Try moving it to a cooler place.'
  );
});

test('Soil pH Detector flags out-of-range acidic soil', () => {
  // Tomato preferred is 6.0 - 6.8
  const result = analyzeSoilPh(tomato, 4.8);
  assert.equal(result.status, 'LOW');
  assert.equal(result.severity, 'critical');
  assert.equal(
    result.simpleProblemText,
    'Your soil pH may not be suitable. Check the soil before making changes.'
  );
});

test('Plant Health Score gives high score for optimal parameters', () => {
  const optimalReading: SensorReading = {
    timestamp: Date.now(),
    temperature: 24,
    humidity: 62,
    soilMoisture: 68,
    sunlightLux: 35000,
    soilPh: 6.5,
    soilEc: 2.2,
    nitrogen: 60,
    phosphorus: 40,
    potassium: 80,
    deviceId: 'ESP32_DEMO_01',
    source: 'DEMO',
    isLiveConnected: true,
  };

  const evalResult = calculatePlantHealth(tomato, optimalReading);
  assert.ok(evalResult.score >= 95, `Expected score >= 95, got ${evalResult.score}`);
  assert.equal(evalResult.grade, 'Excellent');
  assert.equal(evalResult.criticalAlerts.length, 0);
});

test('Plant Health Score degrades when multiple critical stress factors occur', () => {
  const stressedReading: SensorReading = {
    timestamp: Date.now(),
    temperature: 38, // Too hot
    humidity: 30,    // Too dry
    soilMoisture: 20, // Critically dry
    sunlightLux: 4000, // Dim
    soilPh: 5.0, // Too acidic
    soilEc: 1.5,
    nitrogen: null,
    phosphorus: null,
    potassium: null,
    deviceId: 'ESP32_DEMO_01',
    source: 'DEMO',
    isLiveConnected: true,
  };

  const evalResult = calculatePlantHealth(tomato, stressedReading);
  assert.ok(evalResult.score < 50, `Expected score < 50, got ${evalResult.score}`);
  assert.ok(evalResult.criticalAlerts.length >= 3);
  assert.ok(evalResult.recommendations.length >= 2);
});

test('Plant Health Score does not treat missing sensors as optimal', () => {
  const missingReading: SensorReading = {
    timestamp: Date.now(),
    temperature: 24,
    humidity: 60,
    soilMoisture: null, // Missing!
    sunlightLux: null,  // Missing!
    soilPh: null,
    soilEc: null,
    nitrogen: null,
    phosphorus: null,
    potassium: null,
    deviceId: 'ESP32_DEMO_01',
    source: 'DEMO',
    isLiveConnected: false,
  };

  const evalResult = calculatePlantHealth(tomato, missingReading);
  assert.ok(evalResult.missingSensors.includes('Soil Moisture'));
  assert.ok(evalResult.missingSensors.includes('Sunlight Intensity'));
});

test('Water Supply Service auto-irrigation activates when soil moisture is critically low', () => {
  // Reset state to auto mode and pump off
  waterSupplyService.setMode('AUTO_SMART');
  waterSupplyService.refillTank(80);
  waterSupplyService.stopPump();
  
  // Tomato minMoisture is 50%. With moisture at 30%, auto irrigation should trigger
  const triggered = waterSupplyService.checkAutoIrrigation(tomato, 30);
  assert.equal(triggered, true);
  
  const state = waterSupplyService.getState();
  assert.equal(state.isPumpActive, true);
  
  // When moisture is satisfied (e.g. 65%), auto irrigation should not retrigger
  waterSupplyService.stopPump();
  const triggeredWhenWet = waterSupplyService.checkAutoIrrigation(tomato, 65);
  assert.equal(triggeredWhenWet, false);
  
  waterSupplyService.stopPump();
});

test('Translations cover all 22 official Eighth Schedule languages of India', () => {
  assert.equal(INDIAN_LANGUAGES.length, 23); // 22 official + English default
  
  for (const lang of INDIAN_LANGUAGES) {
    assert.ok(lang.code, `Missing code`);
    assert.ok(lang.name, `Missing name for ${lang.code}`);
    assert.ok(lang.nativeName, `Missing nativeName for ${lang.code}`);
    assert.ok(lang.region, `Missing region for ${lang.code}`);
    
    const strings = TRANSLATIONS[lang.code];
    assert.ok(strings, `Missing translations map for ${lang.code}`);
    assert.ok(strings.home, `Missing home string in ${lang.code}`);
    assert.ok(strings.waterSupply, `Missing waterSupply string in ${lang.code}`);
    assert.ok(strings.soilMoisture, `Missing soilMoisture string in ${lang.code}`);
    assert.ok(strings.optimal, `Missing optimal string in ${lang.code}`);
    assert.ok(strings.dailyCare, `Missing dailyCare string in ${lang.code}`);
  }
});

