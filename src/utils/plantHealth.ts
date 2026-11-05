import { Plant, SensorReading, RequirementAnalysis, PlantHealthEvaluation, FactorScore, StatusLevel, SeverityLevel } from '../types';

/**
 * Pure calculation module for AGROSMART.
 * Analyzes sensor readings against plant-specific ideal envelopes,
 * determines LOW / NORMAL / HIGH status, provides 9th-grade friendly explanations,
 * and computes a transparent 0-100 health score with deductions explained.
 */

export function analyzeSoilMoisture(plant: Plant, moisture: number | null): RequirementAnalysis {
  const req = plant.requirements.soilMoisture;
  const targetRange = `${req.idealMin}% - ${req.idealMax}% (Safe: ${req.min}% - ${req.max}%)`;

  if (moisture === null || isNaN(moisture)) {
    return {
      parameter: 'soilMoisture',
      label: 'Soil Moisture',
      iconName: 'Droplets',
      currentVal: null,
      unit: '%',
      targetRange,
      status: 'MISSING',
      severity: 'unknown',
      simpleProblemText: 'Soil moisture sensor is not connected.',
      simpleActionText: 'Plug in the soil moisture sensor probe into the soil root zone.',
      detailedExplanation: 'Without a soil moisture probe, AGROSMART cannot check if the roots are thirsty or waterlogged.',
      scoreImpact: 0,
    };
  }

  let status: StatusLevel = 'NORMAL';
  let severity: SeverityLevel = 'ok';
  let simpleProblemText = `Soil moisture is healthy for your ${plant.name}.`;
  let simpleActionText = 'No watering needed right now. Keep monitoring.';
  let detailedExplanation = `The soil is holding optimal moisture between ${req.idealMin}% and ${req.idealMax}%. Roots have easy access to dissolved nutrients without suffocating.`;
  let scoreImpact = 0;

  if (moisture < req.min) {
    status = 'LOW';
    severity = 'critical';
    simpleProblemText = 'Your plant needs water. The soil is currently dry.';
    simpleActionText = `Water your ${plant.name} slowly around its base until moisture reaches around ${req.idealMin}%.`;
    detailedExplanation = `Soil moisture is at ${moisture}%, below the minimum survival limit of ${req.min}%. When soil dries out, root hairs collapse and the plant cannot transport water to its leaves.`;
    scoreImpact = 25;
  } else if (moisture < req.idealMin) {
    status = 'LOW';
    severity = 'warning';
    simpleProblemText = 'The soil is getting dry. Water soon.';
    simpleActionText = `Give a light watering today to keep the roots comfortable.`;
    detailedExplanation = `Moisture is ${moisture}%, which is slightly below the ideal comfort zone (${req.idealMin}%-${req.idealMax}%).`;
    scoreImpact = 10;
  } else if (moisture > req.max) {
    status = 'HIGH';
    severity = 'critical';
    simpleProblemText = 'The soil is waterlogged! Too much water.';
    simpleActionText = 'Stop watering immediately. Check that the bottom drainage holes are not blocked.';
    detailedExplanation = `Moisture is at ${moisture}%, surpassing the safe limit of ${req.max}%. Excess water displaces air pockets in the dirt, causing root cells to suffocate and rot.`;
    scoreImpact = 25;
  } else if (moisture > req.idealMax) {
    status = 'HIGH';
    severity = 'warning';
    simpleProblemText = 'Soil is a bit soggy.';
    simpleActionText = 'Hold off on watering for a day or two until the top layer dries slightly.';
    detailedExplanation = `Moisture is ${moisture}%, a little above the ideal target (${req.idealMin}%-${req.idealMax}%).`;
    scoreImpact = 8;
  }

  return {
    parameter: 'soilMoisture',
    label: 'Soil Moisture',
    iconName: 'Droplets',
    currentVal: moisture,
    unit: '%',
    targetRange,
    status,
    severity,
    simpleProblemText,
    simpleActionText,
    detailedExplanation,
    scoreImpact,
  };
}

export function analyzeSunlight(plant: Plant, lux: number | null): RequirementAnalysis {
  const req = plant.requirements.sunlight;
  const targetRange = `${req.minLux.toLocaleString()} - ${req.maxLux.toLocaleString()} Lux (${req.category})`;

  if (lux === null || isNaN(lux)) {
    return {
      parameter: 'sunlight',
      label: 'Sunlight Intensity',
      iconName: 'Sun',
      currentVal: null,
      unit: 'Lux',
      targetRange,
      status: 'MISSING',
      severity: 'unknown',
      simpleProblemText: 'Sunlight light sensor (BH1750/LDR) is disconnected.',
      simpleActionText: 'Point the light sensor upward near the plant foliage.',
      detailedExplanation: 'Light intensity dictates how fast the plant can make food via photosynthesis.',
      scoreImpact: 0,
    };
  }

  let status: StatusLevel = 'NORMAL';
  let severity: SeverityLevel = 'ok';
  let simpleProblemText = `Sunlight is great for your ${plant.name}.`;
  let simpleActionText = 'Current light levels are ideal for photosynthesis.';
  let detailedExplanation = `The plant is receiving ${lux.toLocaleString()} Lux, well within its target range of ${req.minLux.toLocaleString()}-${req.maxLux.toLocaleString()} Lux. Leaves can efficiently synthesize glucose.`;
  let scoreImpact = 0;

  if (lux < req.minLux * 0.4) {
    status = 'LOW';
    severity = 'critical';
    simpleProblemText = 'Your plant needs more sunlight.';
    simpleActionText = `Move your ${plant.name} to a sunny balcony, open windowsill, or under an LED grow lamp.`;
    detailedExplanation = `Current light is only ${lux.toLocaleString()} Lux, far below ${req.minLux.toLocaleString()} Lux. Without enough photons, chlorophyll cannot split water and produce food, leading to weak, stretching stems.`;
    scoreImpact = 22;
  } else if (lux < req.minLux) {
    status = 'LOW';
    severity = 'warning';
    simpleProblemText = 'Light is somewhat dim for this plant.';
    simpleActionText = 'Try shifting it closer to the window or clearing curtains.';
    detailedExplanation = `Reading is ${lux.toLocaleString()} Lux, slightly below the recommended ${req.minLux.toLocaleString()} Lux for ${req.category}.`;
    scoreImpact = 10;
  } else if (lux > req.maxLux * 1.3) {
    status = 'HIGH';
    severity = 'critical';
    simpleProblemText = 'The sunlight is scorching hot and could burn leaves!';
    simpleActionText = 'Provide a sheer curtain, green shade net, or move slightly back from direct midday sun.';
    detailedExplanation = `Reading is ${lux.toLocaleString()} Lux (safe ceiling: ${req.maxLux.toLocaleString()} Lux). Intense ultraviolet radiation destroys chlorophyll pigments and causes leaf bleaching.`;
    scoreImpact = 18;
  } else if (lux > req.maxLux) {
    status = 'HIGH';
    severity = 'warning';
    simpleProblemText = 'Light is on the higher side.';
    simpleActionText = 'Watch for bleached or curling leaf edges during peak afternoon hours.';
    detailedExplanation = `Reading is ${lux.toLocaleString()} Lux, somewhat above ideal ${req.maxLux.toLocaleString()} Lux.`;
    scoreImpact = 6;
  }

  return {
    parameter: 'sunlight',
    label: 'Sunlight Intensity',
    iconName: 'Sun',
    currentVal: lux,
    unit: 'Lux',
    targetRange,
    status,
    severity,
    simpleProblemText,
    simpleActionText,
    detailedExplanation,
    scoreImpact,
  };
}

export function analyzeTemperature(plant: Plant, temp: number | null): RequirementAnalysis {
  const req = plant.requirements.temperature;
  const targetRange = `${req.idealMin}°C - ${req.idealMax}°C (Limit: ${req.min}°C - ${req.max}°C)`;

  if (temp === null || isNaN(temp)) {
    return {
      parameter: 'temperature',
      label: 'Surrounding Temperature',
      iconName: 'Thermometer',
      currentVal: null,
      unit: '°C',
      targetRange,
      status: 'MISSING',
      severity: 'unknown',
      simpleProblemText: 'Temperature sensor (DHT11/DHT22) is disconnected.',
      simpleActionText: 'Verify DHT sensor wiring to microcontroller pin D4 or GPIO4.',
      detailedExplanation: 'Temperature governs enzymatic activity and transpiration in plant cells.',
      scoreImpact: 0,
    };
  }

  let status: StatusLevel = 'NORMAL';
  let severity: SeverityLevel = 'ok';
  let simpleProblemText = `Temperature (${temp}°C) is comfortable for ${plant.name}.`;
  let simpleActionText = 'Keep maintaining this steady thermal environment.';
  let detailedExplanation = `Temperature is in the optimal growth zone of ${req.idealMin}°C to ${req.idealMax}°C. Metabolic enzymes operate at peak biological efficiency.`;
  let scoreImpact = 0;

  if (temp > req.max) {
    status = 'HIGH';
    severity = 'critical';
    simpleProblemText = 'The surroundings are too hot for this plant. Try moving it to a cooler place.';
    simpleActionText = 'Move to a shaded, ventilated room or mist the surrounding air with water.';
    detailedExplanation = `Ambient temperature of ${temp}°C exceeds the plant limit of ${req.max}°C. Extreme heat triggers stomatal closure, stops growth, and can cause flower drop.`;
    scoreImpact = 20;
  } else if (temp > req.idealMax) {
    status = 'HIGH';
    severity = 'warning';
    simpleProblemText = 'It is warm for this plant.';
    simpleActionText = 'Ensure good ventilation and protect from stuffy heat pockets.';
    detailedExplanation = `At ${temp}°C, the plant transpires water faster than usual.`;
    scoreImpact = 8;
  } else if (temp < req.min) {
    status = 'LOW';
    severity = 'critical';
    simpleProblemText = 'It is too cold! Your plant is shivering.';
    simpleActionText = 'Bring the plant indoors away from cold drafts, chilly wind, and cold floors.';
    detailedExplanation = `Temperature of ${temp}°C is below the minimum survival limit of ${req.min}°C. Cold slows fluid movement and can rupture tender cellular membranes.`;
    scoreImpact = 20;
  } else if (temp < req.idealMin) {
    status = 'LOW';
    severity = 'warning';
    simpleProblemText = 'A bit chilly for optimum growth.';
    simpleActionText = 'Shelter the plant from cold night drafts.';
    detailedExplanation = `Temperature is ${temp}°C (optimal is ${req.idealMin}°C - ${req.idealMax}°C). Growth will simply be slower.`;
    scoreImpact = 8;
  }

  return {
    parameter: 'temperature',
    label: 'Surrounding Temperature',
    iconName: 'Thermometer',
    currentVal: temp,
    unit: '°C',
    targetRange,
    status,
    severity,
    simpleProblemText,
    simpleActionText,
    detailedExplanation,
    scoreImpact,
  };
}

export function analyzeHumidity(plant: Plant, hum: number | null): RequirementAnalysis {
  const req = plant.requirements.humidity;
  const targetRange = `${req.idealMin}% - ${req.idealMax}% (Safe: ${req.min}% - ${req.max}%)`;

  if (hum === null || isNaN(hum)) {
    return {
      parameter: 'humidity',
      label: 'Air Humidity',
      iconName: 'CloudRain',
      currentVal: null,
      unit: '%',
      targetRange,
      status: 'MISSING',
      severity: 'unknown',
      simpleProblemText: 'Humidity sensor is disconnected.',
      simpleActionText: 'Connect DHT11 / DHT22 sensor to measure relative moisture in the air.',
      detailedExplanation: 'Humidity determines how rapidly water vapor evaporates from leaf stomata.',
      scoreImpact: 0,
    };
  }

  let status: StatusLevel = 'NORMAL';
  let severity: SeverityLevel = 'ok';
  let simpleProblemText = `Air humidity (${hum}%) is just right.`;
  let simpleActionText = 'Air moisture supports balanced transpiration.';
  let detailedExplanation = `Humidity of ${hum}% matches the sweet spot (${req.idealMin}%-${req.idealMax}%). Leaves neither lose water too fast nor stay dangerously wet.`;
  let scoreImpact = 0;

  if (hum < req.min) {
    status = 'LOW';
    severity = 'critical';
    simpleProblemText = 'The air is too dry. Consider improving humidity.';
    simpleActionText = 'Mist the leaves with a gentle spray bottle or place a shallow tray of water with pebbles nearby.';
    detailedExplanation = `Humidity is ${hum}% (safe minimum is ${req.min}%). Extremely dry air pulls moisture out of leaf tips faster than roots can drink, causing crispy brown edges.`;
    scoreImpact = 15;
  } else if (hum < req.idealMin) {
    status = 'LOW';
    severity = 'warning';
    simpleProblemText = 'Air is moderately dry.';
    simpleActionText = 'Occasional misting or grouping plants together helps maintain moisture.';
    detailedExplanation = `Reading is ${hum}%, below the ideal target of ${req.idealMin}%.`;
    scoreImpact = 6;
  } else if (hum > req.max) {
    status = 'HIGH';
    severity = 'critical';
    simpleProblemText = 'Air is very humid and stuffy! Risk of mold and fungus.';
    simpleActionText = 'Increase airflow with a gentle fan or open a nearby window. Keep leaves dry.';
    detailedExplanation = `Humidity is ${hum}% (safe ceiling is ${req.max}%). Constant stagnant moisture creates the ideal breeding ground for powdery mildew and fungal leaf rot.`;
    scoreImpact = 15;
  } else if (hum > req.idealMax) {
    status = 'HIGH';
    severity = 'warning';
    simpleProblemText = 'Air is somewhat moist.';
    simpleActionText = 'Ensure leaves dry before nightfall by watering in the morning.';
    detailedExplanation = `Humidity is ${hum}%, slightly above ideal ${req.idealMax}%.`;
    scoreImpact = 5;
  }

  return {
    parameter: 'humidity',
    label: 'Air Humidity',
    iconName: 'CloudRain',
    currentVal: hum,
    unit: '%',
    targetRange,
    status,
    severity,
    simpleProblemText,
    simpleActionText,
    detailedExplanation,
    scoreImpact,
  };
}

export function analyzeSoilPh(plant: Plant, ph: number | null): RequirementAnalysis {
  const req = plant.requirements.soilPh;
  const targetRange = `${req.min.toFixed(1)} - ${req.max.toFixed(1)} pH (Ideal: ${req.ideal.toFixed(1)})`;

  if (ph === null || isNaN(ph)) {
    return {
      parameter: 'soilPh',
      label: 'Soil pH Level',
      iconName: 'FlaskConical',
      currentVal: null,
      unit: 'pH',
      targetRange,
      status: 'MISSING',
      severity: 'unknown',
      simpleProblemText: 'Soil pH sensor probe is not connected.',
      simpleActionText: 'Insert an analog/digital soil pH sensor into moist soil to measure acidity.',
      detailedExplanation: 'Soil pH measures whether the soil is acidic, neutral, or alkaline, which controls nutrient absorption.',
      scoreImpact: 0,
    };
  }

  let status: StatusLevel = 'NORMAL';
  let severity: SeverityLevel = 'ok';
  let simpleProblemText = `Soil pH (${ph.toFixed(1)}) is well balanced for ${plant.name}.`;
  let simpleActionText = 'Nutrients in the soil are fully dissolvable and accessible to roots.';
  let detailedExplanation = `A pH of ${ph.toFixed(1)} falls right within the plant preferred band of ${req.min.toFixed(1)} to ${req.max.toFixed(1)}. Essential minerals dissolve properly in ground water.`;
  let scoreImpact = 0;

  if (ph < req.min - 0.7) {
    status = 'LOW';
    severity = 'critical';
    simpleProblemText = 'Your soil pH may not be suitable. Check the soil before making changes.';
    simpleActionText = 'Soil is strongly acidic. Add a pinch of garden lime or crushed eggshell powder gradually.';
    detailedExplanation = `Soil pH is ${ph.toFixed(1)} (minimum recommended is ${req.min.toFixed(1)}). Acidic soil locks up phosphorus, magnesium, and calcium so roots cannot absorb them.`;
    scoreImpact = 18;
  } else if (ph < req.min) {
    status = 'LOW';
    severity = 'warning';
    simpleProblemText = 'Soil is slightly too acidic.';
    simpleActionText = 'Mix in some aged compost or crushed eggshells next time you repot.';
    detailedExplanation = `pH is ${ph.toFixed(1)}, marginally below ${req.min.toFixed(1)}.`;
    scoreImpact = 7;
  } else if (ph > req.max + 0.7) {
    status = 'HIGH';
    severity = 'critical';
    simpleProblemText = 'Your soil pH may not be suitable. Check the soil before making changes.';
    simpleActionText = 'Soil is overly alkaline. Gently mix in leaf mold, peat moss, or diluted compost tea to lower pH.';
    detailedExplanation = `Soil pH is ${ph.toFixed(1)} (maximum recommended is ${req.max.toFixed(1)}). Alkaline soil ties up iron and manganese, causing leaves to turn yellow between their veins.`;
    scoreImpact = 18;
  } else if (ph > req.max) {
    status = 'HIGH';
    severity = 'warning';
    simpleProblemText = 'Soil is slightly alkaline.';
    simpleActionText = 'Mulch with organic leaves or coffee grounds to gently bring down pH over time.';
    detailedExplanation = `pH is ${ph.toFixed(1)}, marginally above ${req.max.toFixed(1)}.`;
    scoreImpact = 7;
  }

  return {
    parameter: 'soilPh',
    label: 'Soil pH Level',
    iconName: 'FlaskConical',
    currentVal: ph,
    unit: 'pH',
    targetRange,
    status,
    severity,
    simpleProblemText,
    simpleActionText,
    detailedExplanation,
    scoreImpact,
  };
}

export function analyzeSoilFertility(plant: Plant, readings: SensorReading): RequirementAnalysis {
  const req = plant.requirements.npk;
  const targetRange = `EC: ${req.ecRange} | N:${req.nitrogen} P:${req.phosphorus} K:${req.potassium}`;
  const ec = readings.soilEc;

  if (ec === null || isNaN(ec)) {
    return {
      parameter: 'fertility',
      label: 'Soil Fertility & EC',
      iconName: 'Sparkles',
      currentVal: null,
      unit: 'mS/cm',
      targetRange,
      status: 'MISSING',
      severity: 'unknown',
      simpleProblemText: 'Soil EC / NPK fertility sensor is not connected.',
      simpleActionText: 'Attach an RS485 / Analog soil EC & nutrient sensor to measure electrical conductivity.',
      detailedExplanation: 'Soil moisture sensors only measure water content! Soil EC measures dissolved mineral salts and fertilizers.',
      scoreImpact: 0,
    };
  }

  let status: StatusLevel = 'NORMAL';
  let severity: SeverityLevel = 'ok';
  let simpleProblemText = `Soil nutrient conductivity (${ec.toFixed(1)} mS/cm) is in good shape.`;
  let simpleActionText = 'Nutrient levels are safe. Avoid over-fertilizing.';
  let detailedExplanation = `Conductivity reading of ${ec.toFixed(1)} mS/cm indicates a healthy concentration of dissolved salts and minerals without root burning danger.`;
  let scoreImpact = 0;

  if (ec < 0.6) {
    status = 'LOW';
    severity = 'warning';
    simpleProblemText = 'Soil nutrient conductivity is low.';
    simpleActionText = 'Add organic compost or gentle vermicompost tea to replenish minerals naturally.';
    detailedExplanation = `Soil EC of ${ec.toFixed(1)} mS/cm shows low mineral ion presence. Plants may grow slowly without sufficient nutrition.`;
    scoreImpact = 10;
  } else if (ec > 3.8) {
    status = 'HIGH';
    severity = 'critical';
    simpleProblemText = 'Danger: Excessive fertilizer salt build-up in soil!';
    simpleActionText = 'Flush the soil with clean rainwater or distilled water to leach out excess fertilizer salts.';
    detailedExplanation = `Soil EC of ${ec.toFixed(1)} mS/cm is dangerously high! Too much chemical fertilizer creates osmotic pressure that pulls water backwards out of the roots, causing "fertilizer burn".`;
    scoreImpact = 20;
  } else if (ec > 2.8) {
    status = 'HIGH';
    severity = 'warning';
    simpleProblemText = 'Soil salts are slightly elevated.';
    simpleActionText = 'Do not add any fertilizer for the next 4-6 weeks.';
    detailedExplanation = `Soil EC is ${ec.toFixed(1)} mS/cm. Keep watering with plain water.`;
    scoreImpact = 6;
  }

  return {
    parameter: 'fertility',
    label: 'Soil Fertility & EC',
    iconName: 'Sparkles',
    currentVal: ec,
    unit: 'mS/cm',
    targetRange,
    status,
    severity,
    simpleProblemText,
    simpleActionText,
    detailedExplanation,
    scoreImpact,
  };
}

export function analyzePlantRequirements(plant: Plant, readings: SensorReading): RequirementAnalysis[] {
  return [
    analyzeSoilMoisture(plant, readings.soilMoisture),
    analyzeSunlight(plant, readings.sunlightLux),
    analyzeTemperature(plant, readings.temperature),
    analyzeHumidity(plant, readings.humidity),
    analyzeSoilPh(plant, readings.soilPh),
    analyzeSoilFertility(plant, readings),
  ];
}

/**
 * Calculates a reliable plant health score out of 100 based on active, connected sensors.
 * Missing sensors are NOT treated as normal/optimal, but scored transparently.
 */
export function calculatePlantHealth(plant: Plant, readings: SensorReading): PlantHealthEvaluation {
  const analyses = analyzePlantRequirements(plant, readings);

  // Weights for connected factors
  const weights: Record<string, number> = {
    soilMoisture: 30, // Most immediate survival factor
    sunlight: 25,     // Energy production
    temperature: 20,  // Enzymatic tolerance
    humidity: 15,     // Transpiration rate
    soilPh: 10,       // Long-term nutrient absorption
  };

  const factors: FactorScore[] = [];
  const criticalAlerts: string[] = [];
  const recommendations: string[] = [];
  const missingSensors: string[] = [];

  let totalWeightAvailable = 0;
  let earnedScoreRaw = 0;

  for (const analysis of analyses) {
    if (analysis.parameter === 'fertility') continue; // Fertility modifies score as an advisory or when EC is present

    const weight = weights[analysis.parameter] || 10;

    if (analysis.status === 'MISSING') {
      missingSensors.push(analysis.label);
      factors.push({
        factor: analysis.label,
        weight,
        score: 0,
        status: 'missing',
        reason: `Sensor disconnected (${analysis.label}). Not included in calculation.`,
      });
      continue;
    }

    totalWeightAvailable += weight;

    let factorEarned = weight;
    let factorStatus: 'optimal' | 'mild_deviation' | 'severe_deviation' = 'optimal';
    let reason = `${analysis.label} is optimal for ${plant.name}.`;

    if (analysis.severity === 'critical') {
      factorEarned = Math.round(weight * 0.15); // Lost 85% of points for critical
      factorStatus = 'severe_deviation';
      reason = `${analysis.status}: ${analysis.simpleProblemText}`;
      criticalAlerts.push(`${analysis.label}: ${analysis.simpleProblemText}`);
      recommendations.push(analysis.simpleActionText);
    } else if (analysis.severity === 'warning') {
      factorEarned = Math.round(weight * 0.65); // Lost 35% of points for mild
      factorStatus = 'mild_deviation';
      reason = `${analysis.status}: ${analysis.simpleProblemText}`;
      recommendations.push(analysis.simpleActionText);
    } else {
      // Optimal
      recommendations.push(analysis.simpleActionText);
    }

    earnedScoreRaw += factorEarned;
    factors.push({
      factor: analysis.label,
      weight,
      score: factorEarned,
      status: factorStatus,
      reason,
    });
  }

  // EC deduction if available and critical
  const fertilityAnalysis = analyses.find(a => a.parameter === 'fertility');
  if (fertilityAnalysis && fertilityAnalysis.status !== 'MISSING') {
    if (fertilityAnalysis.severity === 'critical') {
      criticalAlerts.push(`Soil Fertility: ${fertilityAnalysis.simpleProblemText}`);
      recommendations.push(fertilityAnalysis.simpleActionText);
    }
  }

  // Calculate final score scaled to 100
  let finalScore = 100;
  if (totalWeightAvailable > 0) {
    finalScore = Math.round((earnedScoreRaw / totalWeightAvailable) * 100);
  } else {
    // No sensors connected at all
    finalScore = 0;
  }

  // Clamp 0 to 100
  finalScore = Math.max(0, Math.min(100, finalScore));

  let grade: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical' = 'Excellent';
  if (finalScore >= 88) {
    grade = 'Excellent';
  } else if (finalScore >= 72) {
    grade = 'Good';
  } else if (finalScore >= 50) {
    grade = 'Needs Attention';
  } else {
    grade = 'Critical';
  }

  return {
    score: finalScore,
    grade,
    factors,
    analyses,
    criticalAlerts,
    recommendations: Array.from(new Set(recommendations)),
    missingSensors,
    lastUpdated: Date.now(),
  };
}
