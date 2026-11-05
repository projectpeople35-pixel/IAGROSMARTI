import React, { useState } from 'react';
import { Plant, PlantRequirements } from '../types';
import { Search, Plus, Check, Droplets, Sun, Thermometer, CloudRain, FlaskConical, Sparkles, Filter, X } from 'lucide-react';
import { saveCustomPlant } from '../data/plants';

interface PlantSelectorProps {
  currentPlant: Plant;
  allPlants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onRefreshPlants: () => void;
}

export const PlantSelector: React.FC<PlantSelectorProps> = ({
  currentPlant,
  allPlants,
  onSelectPlant,
  onRefreshPlants,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Custom Plant Form State
  const [newName, setNewName] = useState('');
  const [newScientific, setNewScientific] = useState('');
  const [newCategory, setNewCategory] = useState<Plant['category']>('Herb');
  const [newDifficulty, setNewDifficulty] = useState<Plant['difficulty']>('Easy');
  const [newIcon, setNewIcon] = useState('🌿');
  const [newDescription, setNewDescription] = useState('');
  const [minTemp, setMinTemp] = useState(15);
  const [maxTemp, setMaxTemp] = useState(30);
  const [minMoisture, setMinMoisture] = useState(40);
  const [maxMoisture, setMaxMoisture] = useState(70);
  const [minSunLux, setMinSunLux] = useState(15000);
  const [maxSunLux, setMaxSunLux] = useState(40000);
  const [sunCategory, setSunCategory] = useState<PlantRequirements['sunlight']['category']>('Full Sun');
  const [soilPhIdeal, setSoilPhIdeal] = useState(6.5);
  const [wateringAdvice, setWateringAdvice] = useState('');

  const categories = ['All', 'Vegetable', 'Herb', 'Flowering', 'Indoor Folio', 'Medicinal', 'Succulent'];

  const filteredPlants = allPlants.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddCustomPlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const id = `custom-${Date.now()}`;
    const customPlant: Plant = {
      id,
      name: newName.trim(),
      scientificName: newScientific.trim() || 'Botanical sp.',
      category: newCategory,
      difficulty: newDifficulty,
      icon: newIcon || '🌱',
      description: newDescription.trim() || 'Custom plant added by student gardener.',
      isCustom: true,
      requirements: {
        temperature: {
          min: Math.max(0, minTemp - 5),
          max: maxTemp + 5,
          idealMin: minTemp,
          idealMax: maxTemp,
          unit: '°C',
        },
        humidity: {
          min: 35,
          max: 85,
          idealMin: 50,
          idealMax: 70,
          unit: '%',
        },
        soilMoisture: {
          min: Math.max(10, minMoisture - 10),
          max: Math.min(95, maxMoisture + 10),
          idealMin: minMoisture,
          idealMax: maxMoisture,
          unit: '%',
        },
        sunlight: {
          minLux: minSunLux,
          maxLux: maxSunLux,
          hoursPerDay: 6,
          category: sunCategory,
        },
        soilPh: {
          min: +(soilPhIdeal - 0.7).toFixed(1),
          max: +(soilPhIdeal + 0.7).toFixed(1),
          ideal: soilPhIdeal,
        },
        npk: {
          nitrogen: 'Medium',
          phosphorus: 'Medium',
          potassium: 'Medium',
          ecRange: '1.2 - 2.2 mS/cm',
        },
        wateringAdvice: wateringAdvice || 'Check soil moisture before watering.',
        sunlightAdvice: `Provide ${sunCategory.toLowerCase()} for best foliage development.`,
        soilAdvice: 'Well-draining rich garden potting soil with organic compost.',
        feedingAdvice: 'Mild organic fertilizer once a month during active growth.',
        commonIssues: [
          {
            symptom: 'Leaves looking pale',
            cause: 'Insufficient light or mild nutrient shortage',
            fix: 'Shift to brighter spot and add compost.',
          },
        ],
        funFact: 'Custom plants let young botanists experiment with local flora!',
      },
    };

    saveCustomPlant(customPlant);
    onRefreshPlants();
    onSelectPlant(customPlant);
    setShowAddModal(false);
    setNewName('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-stone-100">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>🌿</span>
            <span>Select Your Plant</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Choose from our pre-configured botanical database or add your own custom plant species
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Plant</span>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search plant by name, botanical genus, or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Plants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlants.map(plant => {
          const isSelected = plant.id === currentPlant.id;
          return (
            <div
              key={plant.id}
              className={`relative rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-lg ring-2 ring-emerald-500/20'
                  : 'bg-stone-900 border-stone-800 hover:border-emerald-600/50 hover:shadow-md'
              }`}
            >
              {/* Card Top */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-stone-950 border border-stone-800">
                      {plant.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-white text-base">{plant.name}</h3>
                        {plant.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800 uppercase">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 italic">{plant.scientificName}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                    {plant.category}
                  </span>
                </div>

                <p className="mt-3 text-xs text-stone-300 leading-relaxed line-clamp-2">
                  {plant.description}
                </p>

                {/* Key Requirements Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-stone-400">Moisture</div>
                      <div className="font-bold text-white">
                        {plant.requirements.soilMoisture.idealMin}%-{plant.requirements.soilMoisture.idealMax}%
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-stone-400">Sunlight</div>
                      <div className="font-bold text-white truncate">
                        {plant.requirements.sunlight.category}
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2">
                    <Thermometer className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-stone-400">Ideal Temp</div>
                      <div className="font-bold text-white">
                        {plant.requirements.temperature.idealMin}°C - {plant.requirements.temperature.idealMax}°C
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2">
                    <FlaskConical className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-stone-400">Soil pH</div>
                      <div className="font-bold text-white">
                        {plant.requirements.soilPh.min.toFixed(1)} - {plant.requirements.soilPh.max.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fun Fact */}
                <div className="mt-3 p-2 rounded-xl bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-200 flex items-start gap-1.5">
                  <span className="text-xs">💡</span>
                  <span className="line-clamp-2">{plant.requirements.funFact}</span>
                </div>
              </div>

              {/* Select Button */}
              <div className="mt-4 pt-3 border-t border-stone-800">
                <button
                  onClick={() => onSelectPlant(plant)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-800 hover:bg-emerald-600 hover:text-white text-stone-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Currently Monitoring</span>
                    </>
                  ) : (
                    <span>Monitor {plant.name}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPlants.length === 0 && (
        <div className="text-center py-12 bg-stone-900 rounded-3xl border border-stone-800 p-6">
          <p className="text-3xl">🔍</p>
          <h3 className="text-base font-bold text-white mt-2">No plants found</h3>
          <p className="text-xs text-stone-400 mt-1">Try a different search term or add your custom plant species.</p>
        </div>
      )}

      {/* Add Custom Plant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-stone-900 rounded-3xl shadow-2xl border border-stone-800 p-6 my-8 text-stone-100">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌱</span>
                <h3 className="text-base font-bold text-white">Add New Plant Species</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomPlant} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-stone-300">Plant Common Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Basil, Lemongrass, Marigold"
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-300">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={newIcon}
                    onChange={e => setNewIcon(e.target.value)}
                    maxLength={2}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-center text-base"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-300">Scientific Name (Genus species)</label>
                <input
                  type="text"
                  value={newScientific}
                  onChange={e => setNewScientific(e.target.value)}
                  placeholder="e.g. Ocimum basilicum"
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as Plant['category'])}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100"
                  >
                    <option value="Vegetable">Vegetable</option>
                    <option value="Herb">Herb</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Indoor Folio">Indoor Folio</option>
                    <option value="Medicinal">Medicinal</option>
                    <option value="Succulent">Succulent</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-300">Sunlight Category</label>
                  <select
                    value={sunCategory}
                    onChange={e => setSunCategory(e.target.value as PlantRequirements['sunlight']['category'])}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100"
                  >
                    <option value="Full Sun">Full Sun (6+ hrs)</option>
                    <option value="Partial Sunlight">Partial Sunlight (4-6 hrs)</option>
                    <option value="Indirect Bright">Indirect Bright</option>
                    <option value="Low to Medium Light">Low to Medium Light</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-300">Ideal Temp Range (°C)</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={minTemp}
                      onChange={e => setMinTemp(+e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-800 bg-stone-950 text-stone-100"
                      placeholder="Min"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={maxTemp}
                      onChange={e => setMaxTemp(+e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-800 bg-stone-950 text-stone-100"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-300">Ideal Soil Moisture (%)</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={minMoisture}
                      onChange={e => setMinMoisture(+e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-800 bg-stone-950 text-stone-100"
                      placeholder="Min %"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={maxMoisture}
                      onChange={e => setMaxMoisture(+e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-800 bg-stone-950 text-stone-100"
                      placeholder="Max %"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-300">Preferred Soil pH</label>
                <input
                  type="number"
                  step="0.1"
                  value={soilPhIdeal}
                  onChange={e => setSoilPhIdeal(+e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100"
                  placeholder="e.g. 6.5"
                />
              </div>

              <div>
                <label className="font-bold text-stone-300">Short Description & Care Advice</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Describe your plant and how much care it needs..."
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100"
                />
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-800 text-stone-300 font-semibold hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-sm"
                >
                  Save & Select Plant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
