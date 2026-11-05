import { Plant } from '../types';

export const INITIAL_PLANTS: Plant[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetable',
    difficulty: 'Easy',
    icon: '🍅',
    description: 'A popular garden fruit packed with vitamins. Loves bright sunshine and steady moisture to form sweet, juicy fruits.',
    requirements: {
      temperature: { min: 15, max: 35, idealMin: 20, idealMax: 28, unit: '°C' },
      humidity: { min: 40, max: 80, idealMin: 55, idealMax: 70, unit: '%' },
      soilMoisture: { min: 50, max: 80, idealMin: 60, idealMax: 75, unit: '%' },
      sunlight: { minLux: 25000, maxLux: 65000, hoursPerDay: 7, category: 'Full Sun' },
      soilPh: { min: 6.0, max: 6.8, ideal: 6.5 },
      npk: {
        nitrogen: 'Medium',
        phosphorus: 'High',
        potassium: 'High',
        ecRange: '2.0 - 3.5 mS/cm',
      },
      wateringAdvice: 'Water deeply around the base in the morning. Avoid wetting the leaves to prevent fungal spots.',
      sunlightAdvice: 'Needs 6 to 8 hours of direct sunlight every day to flower and set fruit.',
      soilAdvice: 'Rich, well-draining loamy soil with plenty of organic compost.',
      feedingAdvice: 'Give balanced compost early on, then switch to high potassium (wood ash/banana peel tea) during flowering.',
      commonIssues: [
        { symptom: 'Bottom of tomato turns black', cause: 'Blossom end rot caused by calcium deficiency and uneven watering', fix: 'Keep soil moisture steady and add crushed eggshells or lime to soil.' },
        { symptom: 'Leaves curling upward with purple veins', cause: 'Cold night temperatures or strong wind shock', fix: 'Shield young plants with a cloche or mulch the soil.' }
      ],
      funFact: 'Tomatoes were once feared in Europe because people thought they were poisonous nightshades!'
    }
  },
  {
    id: 'rose',
    name: 'Rose',
    scientificName: 'Rosa',
    category: 'Flowering',
    difficulty: 'Moderate',
    icon: '🌹',
    description: 'The queen of garden flowers. Known for velvety fragrant blooms that thrive with good airflow and warm sunlight.',
    requirements: {
      temperature: { min: 12, max: 32, idealMin: 18, idealMax: 26, unit: '°C' },
      humidity: { min: 45, max: 75, idealMin: 50, idealMax: 65, unit: '%' },
      soilMoisture: { min: 45, max: 75, idealMin: 55, idealMax: 70, unit: '%' },
      sunlight: { minLux: 20000, maxLux: 60000, hoursPerDay: 6, category: 'Full Sun' },
      soilPh: { min: 6.0, max: 6.8, ideal: 6.5 },
      npk: {
        nitrogen: 'Medium',
        phosphorus: 'High',
        potassium: 'Medium',
        ecRange: '1.5 - 2.5 mS/cm',
      },
      wateringAdvice: 'Water 2 to 3 times a week thoroughly. Roses hate wet leaves at night as it invites powdery mildew.',
      sunlightAdvice: 'Needs at least 6 hours of morning sun so dew evaporates quickly.',
      soilAdvice: 'Deep, rich soil with good drainage. Add aged cow manure or compost.',
      feedingAdvice: 'Feed with organic compost or bone meal once every month during blooming season.',
      commonIssues: [
        { symptom: 'White powder on leaves', cause: 'Powdery mildew fungus caused by high humidity and stagnant air', fix: 'Prune congested inner branches to let air flow through.' },
        { symptom: 'Yellow leaves with black spots', cause: 'Black spot fungal spores spreading through water splashes', fix: 'Remove affected leaves and avoid overhead watering.' }
      ],
      funFact: 'Fossil evidence shows that wild roses have lived on Earth for over 35 million years!'
    }
  },
  {
    id: 'money-plant',
    name: 'Money Plant',
    scientificName: 'Epipremnum aureum',
    category: 'Indoor Folio',
    difficulty: 'Easy',
    icon: '🌿',
    description: 'Also called Golden Pothos. Extremely forgiving indoor creeper with glossy heart-shaped leaves that cleans indoor air.',
    requirements: {
      temperature: { min: 16, max: 32, idealMin: 20, idealMax: 28, unit: '°C' },
      humidity: { min: 40, max: 85, idealMin: 50, idealMax: 70, unit: '%' },
      soilMoisture: { min: 35, max: 65, idealMin: 40, idealMax: 55, unit: '%' },
      sunlight: { minLux: 2500, maxLux: 15000, hoursPerDay: 5, category: 'Indirect Bright' },
      soilPh: { min: 6.0, max: 7.0, ideal: 6.4 },
      npk: {
        nitrogen: 'High',
        phosphorus: 'Low',
        potassium: 'Medium',
        ecRange: '1.0 - 1.8 mS/cm',
      },
      wateringAdvice: 'Allow the top 2 inches of soil to dry out before watering again. Yellow mushy leaves mean too much water.',
      sunlightAdvice: 'Thrives in medium to bright indirect light. Direct scorching sun will bleach the green leaves.',
      soilAdvice: 'Light, airy potting mix with perlite or coco-peat to prevent waterlogging.',
      feedingAdvice: 'A gentle diluted liquid seaweed or vermicompost once every 6 weeks is plenty.',
      commonIssues: [
        { symptom: 'Leaves turning limp and pale yellow', cause: 'Overwatering causing root suffocation', fix: 'Let soil dry completely and check pot drain holes.' },
        { symptom: 'Brown crispy leaf tips', cause: 'Very dry indoor air from air conditioning or heaters', fix: 'Mist occasionally or place on a pebble tray with water.' }
      ],
      funFact: 'Money plant stems can grow directly in a jar of plain tap water without any soil!'
    }
  },
  {
    id: 'tulsi',
    name: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum tenuiflorum',
    category: 'Medicinal',
    difficulty: 'Easy',
    icon: '🌱',
    description: 'Venerated sacred medicinal herb in Indian households. Rich in essential oils that boost immunity and ward off pests.',
    requirements: {
      temperature: { min: 18, max: 38, idealMin: 22, idealMax: 32, unit: '°C' },
      humidity: { min: 45, max: 80, idealMin: 55, idealMax: 75, unit: '%' },
      soilMoisture: { min: 45, max: 70, idealMin: 50, idealMax: 65, unit: '%' },
      sunlight: { minLux: 18000, maxLux: 55000, hoursPerDay: 6, category: 'Full Sun' },
      soilPh: { min: 6.0, max: 7.5, ideal: 6.8 },
      npk: {
        nitrogen: 'Medium',
        phosphorus: 'Medium',
        potassium: 'Medium',
        ecRange: '1.2 - 2.0 mS/cm',
      },
      wateringAdvice: 'Water when topsoil feels slightly dry. Never let the pot sit in a pool of standing water.',
      sunlightAdvice: 'Needs 4 to 6 hours of bright sunlight every day to generate its aromatic healing oils.',
      soilAdvice: 'Sandy loam soil mixed with compost. Must drain fast.',
      feedingAdvice: 'Add a handful of vermicompost or cow dung manure once every month.',
      commonIssues: [
        { symptom: 'Leaves drying up and falling in winter', cause: 'Cold drafts and low temperatures below 15°C', fix: 'Move pot indoors or under a shelter during chilly nights.' },
        { symptom: 'Plant becoming tall and woody with small leaves', cause: 'Flowering seeds taking all energy', fix: 'Pinch off the top flower buds (Manjari) to encourage bushy leaves.' }
      ],
      funFact: 'Tulsi emits oxygen for nearly 20 hours a day and contains eugenol, a natural insect repellent!'
    }
  },
  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    category: 'Succulent',
    difficulty: 'Easy',
    icon: '🌵',
    description: 'Hardy desert succulent storing cool soothing gel in its thick leaves. Needs minimal water and loves bright light.',
    requirements: {
      temperature: { min: 13, max: 40, idealMin: 20, idealMax: 32, unit: '°C' },
      humidity: { min: 30, max: 60, idealMin: 35, idealMax: 50, unit: '%' },
      soilMoisture: { min: 15, max: 45, idealMin: 20, idealMax: 35, unit: '%' },
      sunlight: { minLux: 15000, maxLux: 50000, hoursPerDay: 6, category: 'Full Sun' },
      soilPh: { min: 6.5, max: 8.0, ideal: 7.2 },
      npk: {
        nitrogen: 'Low',
        phosphorus: 'Low',
        potassium: 'Medium',
        ecRange: '0.8 - 1.5 mS/cm',
      },
      wateringAdvice: 'Water soak-and-dry: water thoroughly once every 2 to 3 weeks. Always let soil dry out 100% between waterings.',
      sunlightAdvice: 'Loves 6 hours of bright light. If kept in dark rooms, leaves turn thin, pale, and flop over.',
      soilAdvice: 'Cactus or succulent gritty mix with 50% coarse sand, perlite, and pumice.',
      feedingAdvice: 'Hardly needs fertilizer. Half-strength succulent food once in spring is plenty.',
      commonIssues: [
        { symptom: 'Brown, soft, mushy jelly leaves', cause: 'Severe root rot from overwatering', fix: 'Stop watering immediately. Remove rotting leaves and repot in dry gritty soil.' },
        { symptom: 'Leaves turning reddish-brown', cause: 'Sun stress from sudden shift to intense afternoon sun', fix: 'Move to bright morning sun with afternoon shade.' }
      ],
      funFact: 'Aloe vera gel has been used for over 4,000 years — ancient Egyptians called it the "Plant of Immortality"!'
    }
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    scientificName: 'Helianthus annuus',
    category: 'Flowering',
    difficulty: 'Easy',
    icon: '🌻',
    description: 'Towering cheerful bloom with bright yellow petals that physically tracks the sun across the sky each day.',
    requirements: {
      temperature: { min: 18, max: 36, idealMin: 22, idealMax: 30, unit: '°C' },
      humidity: { min: 40, max: 75, idealMin: 50, idealMax: 65, unit: '%' },
      soilMoisture: { min: 45, max: 75, idealMin: 50, idealMax: 65, unit: '%' },
      sunlight: { minLux: 30000, maxLux: 75000, hoursPerDay: 8, category: 'Full Sun' },
      soilPh: { min: 6.0, max: 7.5, ideal: 6.5 },
      npk: {
        nitrogen: 'Medium',
        phosphorus: 'High',
        potassium: 'High',
        ecRange: '1.5 - 2.8 mS/cm',
      },
      wateringAdvice: 'Water regularly while young. Once established, deep watering once or twice a week is ideal.',
      sunlightAdvice: 'Needs maximum full sun (7 to 8+ hours). Will not bloom properly in shade.',
      soilAdvice: 'Nutrient-rich, deep soil so its long taproot can anchor the heavy stem in windy weather.',
      feedingAdvice: 'Feed with high potassium and phosphorus organic fertilizer when flower head begins to form.',
      commonIssues: [
        { symptom: 'Heavy flower head drooping down', cause: 'Normal weight of mature seed head, or lack of water in hot sun', fix: 'Stake the tall stem with a bamboo pole to prevent snapping.' },
        { symptom: 'Holes eaten through large leaves', cause: 'Caterpillars or snails', fix: 'Hand-pick pests in early morning or spray neem oil mixture.' }
      ],
      funFact: 'Young sunflowers exhibit "heliotropism" — their buds face east at dawn and follow the sun all the way west by sunset!'
    }
  },
  {
    id: 'mint',
    name: 'Mint (Pudina)',
    scientificName: 'Mentha',
    category: 'Herb',
    difficulty: 'Easy',
    icon: '🍃',
    description: 'Refreshing aromatic herb with cool menthol flavor. Super fast grower that spreads joyfully in pots.',
    requirements: {
      temperature: { min: 14, max: 32, idealMin: 18, idealMax: 26, unit: '°C' },
      humidity: { min: 50, max: 85, idealMin: 60, idealMax: 75, unit: '%' },
      soilMoisture: { min: 55, max: 85, idealMin: 65, idealMax: 80, unit: '%' },
      sunlight: { minLux: 10000, maxLux: 35000, hoursPerDay: 5, category: 'Partial Sunlight' },
      soilPh: { min: 6.0, max: 7.0, ideal: 6.5 },
      npk: {
        nitrogen: 'High',
        phosphorus: 'Low',
        potassium: 'Medium',
        ecRange: '1.2 - 2.0 mS/cm',
      },
      wateringAdvice: 'Loves constant moisture. Keep the soil evenly damp like a squeezed sponge.',
      sunlightAdvice: 'Prefers 4 to 5 hours of morning sun. Harsh hot afternoon sun can scorch tender leaves.',
      soilAdvice: 'Rich moist soil with compost and coco-peat that holds water without turning swampy.',
      feedingAdvice: 'Give nitrogen-rich compost tea every 3 to 4 weeks to keep growing lush green leaves.',
      commonIssues: [
        { symptom: 'Stems stretching long and thin with tiny leaves', cause: 'Not enough sunlight; plant is searching for light', fix: 'Move to a brighter windowsill or balcony spot.' },
        { symptom: 'Plant taking over entire pot and killing neighboring herbs', cause: 'Aggressive runners (stolons)', fix: 'Always grow mint in its own separate container!' }
      ],
      funFact: 'Mint contains menthol, which triggers the cold-sensitive receptors in our mouth to make our tongue feel icy cold!'
    }
  },
  {
    id: 'spinach',
    name: 'Spinach (Palak)',
    scientificName: 'Spinacia oleracea',
    category: 'Vegetable',
    difficulty: 'Easy',
    icon: '🥬',
    description: 'Nutrient-dense green vegetable packed with iron and calcium. Loves cool weather and fast-growing moisture.',
    requirements: {
      temperature: { min: 10, max: 25, idealMin: 15, idealMax: 22, unit: '°C' },
      humidity: { min: 50, max: 80, idealMin: 60, idealMax: 75, unit: '%' },
      soilMoisture: { min: 55, max: 80, idealMin: 60, idealMax: 75, unit: '%' },
      sunlight: { minLux: 12000, maxLux: 35000, hoursPerDay: 5, category: 'Partial Sunlight' },
      soilPh: { min: 6.5, max: 7.5, ideal: 6.8 },
      npk: {
        nitrogen: 'High',
        phosphorus: 'Medium',
        potassium: 'Medium',
        ecRange: '1.4 - 2.2 mS/cm',
      },
      wateringAdvice: 'Water lightly and regularly. Keep topsoil cool and moist to avoid bitter tasting leaves.',
      sunlightAdvice: '4 to 6 hours of gentle sunlight. If temperatures exceed 26°C, provide shade cloth.',
      soilAdvice: 'Deep, crumbly soil rich in organic nitrogen compost.',
      feedingAdvice: 'Side-dress with vermicompost or compost tea 2 weeks after seedlings sprout.',
      commonIssues: [
        { symptom: 'Plant shoots up a tall flowering stalk and leaves turn bitter (Bolting)', cause: 'High heat (>25°C) and long days trigger early seeding', fix: 'Harvest leaves early and grow in partial shade during warm months.' },
        { symptom: 'Pale yellowish leaf edges', cause: 'Nitrogen deficiency or alkaline soil (pH > 7.5)', fix: 'Add compost and verify pH is below 7.2.' }
      ],
      funFact: 'Spinach was introduced to China around 647 AD, where it was called the "Persian Herb"!'
    }
  },
  {
    id: 'chilli',
    name: 'Chilli Pepper (Mirchi)',
    scientificName: 'Capsicum annuum',
    category: 'Vegetable',
    difficulty: 'Moderate',
    icon: '🌶️',
    description: 'Spicy culinary staple that thrives in warm tropical weather. Produces loads of fiery peppers when treated to sun and balanced watering.',
    requirements: {
      temperature: { min: 18, max: 36, idealMin: 22, idealMax: 30, unit: '°C' },
      humidity: { min: 45, max: 75, idealMin: 55, idealMax: 68, unit: '%' },
      soilMoisture: { min: 40, max: 70, idealMin: 50, idealMax: 65, unit: '%' },
      sunlight: { minLux: 22000, maxLux: 60000, hoursPerDay: 6, category: 'Full Sun' },
      soilPh: { min: 6.0, max: 7.0, ideal: 6.5 },
      npk: {
        nitrogen: 'Medium',
        phosphorus: 'High',
        potassium: 'High',
        ecRange: '1.8 - 2.8 mS/cm',
      },
      wateringAdvice: 'Water moderately. Allow topsoil to dry slightly between waterings. Mild water stress when fruiting actually makes peppers spicier!',
      sunlightAdvice: 'Needs 6 or more hours of direct sunlight for blossoms to pollinate.',
      soilAdvice: 'Well-aerated sandy loam with compost. Chillies cannot stand soggy waterlogged roots.',
      feedingAdvice: 'High phosphorus and potassium fertilizer once flowers appear to boost fruit set.',
      commonIssues: [
        { symptom: 'Flowers drop off without turning into chillies', cause: 'Temperature extremes (over 35°C or under 15°C) or too much nitrogen fertilizer', fix: 'Reduce high-nitrogen feeds and mist flowers gently in the morning.' },
        { symptom: 'Leaves curling upward like little canoes', cause: 'Aphids sucking sap from underside of leaves or high heat', fix: 'Spray with mild soapy water or neem oil.' }
      ],
      funFact: 'The heat in chillies comes from "capsaicin", a chemical that birds cannot feel at all, allowing them to spread seeds safely!'
    }
  },
  {
    id: 'coriander',
    name: 'Coriander (Dhaniya)',
    scientificName: 'Coriandrum sativum',
    category: 'Herb',
    difficulty: 'Easy',
    icon: '🌿',
    description: 'Essential kitchen herb with fresh citrusy fragrance. Both its delicate green leaves and dried round seeds are used worldwide.',
    requirements: {
      temperature: { min: 12, max: 26, idealMin: 16, idealMax: 22, unit: '°C' },
      humidity: { min: 45, max: 75, idealMin: 55, idealMax: 70, unit: '%' },
      soilMoisture: { min: 45, max: 75, idealMin: 55, idealMax: 70, unit: '%' },
      sunlight: { minLux: 10000, maxLux: 32000, hoursPerDay: 5, category: 'Partial Sunlight' },
      soilPh: { min: 6.2, max: 7.2, ideal: 6.6 },
      npk: {
        nitrogen: 'Medium',
        phosphorus: 'Low',
        potassium: 'Medium',
        ecRange: '1.0 - 1.8 mS/cm',
      },
      wateringAdvice: 'Keep soil evenly moist. Never let the shallow roots completely dry out.',
      sunlightAdvice: 'Morning sunlight for 4 to 5 hours. Protect from scorching afternoon sun which triggers fast bolting.',
      soilAdvice: 'Fast-draining soil mixed with coco-peat and worm castings.',
      feedingAdvice: 'Give a light organic liquid feed after first harvest of outer leaves.',
      commonIssues: [
        { symptom: 'Plant rapidly flowers and stops making leaves', cause: 'Heat stress (>25°C) or soil drying out', fix: 'Harvest frequently and sow seeds in a shady cooler corner during sunny summer.' },
        { symptom: 'Seedlings flopping over at soil level', cause: 'Damping off fungus from cold, wet soil', fix: 'Ensure bright light and good airflow; do not oversaturate soil.' }
      ],
      funFact: 'Did you know? Coriander seeds and cilantro leaves come from the exact same plant!'
    }
  }
];

const STORAGE_KEY = 'agrosmart_custom_plants_v1';

export function getCustomPlants(): Plant[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomPlant(plant: Plant): void {
  if (typeof window === 'undefined') return;
  const current = getCustomPlants();
  const filtered = current.filter(p => p.id !== plant.id);
  filtered.push(plant);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getAllPlants(): Plant[] {
  const custom = getCustomPlants();
  return [...INITIAL_PLANTS, ...custom];
}

export function getPlantById(id: string): Plant {
  const all = getAllPlants();
  return all.find(p => p.id === id) || INITIAL_PLANTS[0];
}
