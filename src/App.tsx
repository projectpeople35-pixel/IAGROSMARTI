import React, { useState, useEffect } from 'react';
import { Plant, SensorReading } from './types';
import { getAllPlants, getPlantById } from './data/plants';
import { sensorService, HardwareStatus } from './services/sensorService';
import { calculatePlantHealth } from './utils/plantHealth';
import { waterSupplyService, WaterSupplyState } from './services/waterSupplyService';
import { getTranslation, INDIAN_LANGUAGES } from './utils/translations';
import { Navbar } from './components/Navbar';
import { Sidebar, PageId } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { HardwareModal } from './components/HardwareModal';

// Pages
import { HomeDashboard } from './pages/HomeDashboard';
import { PlantSelector } from './pages/PlantSelector';
import { RequirementDetector } from './pages/RequirementDetector';
import { SensorMonitoring } from './pages/SensorMonitoring';
import { WaterSupplySection } from './pages/WaterSupplySection';
import { PlantHealthReport } from './pages/PlantHealthReport';
import { PlantCareAssistant } from './pages/PlantCareAssistant';
import { LearnToGrow } from './pages/LearnToGrow';
import { AboutProject } from './pages/AboutProject';

const ACTIVE_PLANT_STORAGE_KEY = 'agrosmart_active_plant_id';
const LANG_STORAGE_KEY = 'agrosmart_selected_lang';
const THEME_STORAGE_KEY = 'agrosmart_dark_theme';

export default function App() {
  const [allPlants, setAllPlants] = useState<Plant[]>(getAllPlants());
  const [currentPlant, setCurrentPlant] = useState<Plant>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ACTIVE_PLANT_STORAGE_KEY);
      if (saved) {
        return getPlantById(saved);
      }
    }
    return getAllPlants()[0];
  });

  const [currentLang, setCurrentLang] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
    }
    return 'en';
  });

  // Dark mode is enabled by default as explicitly requested ("put it in dark mode")
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const [reading, setReading] = useState<SensorReading>(sensorService.getReading());
  const [hardwareStatus, setHardwareStatus] = useState<HardwareStatus>(sensorService.getHardwareStatus());
  const [waterState, setWaterState] = useState<WaterSupplyState>(waterSupplyService.getState());
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);

  // Subscriptions
  useEffect(() => {
    const unsubReading = sensorService.subscribe(newReading => {
      setReading(newReading);
      // Auto irrigation safety check
      waterSupplyService.checkAutoIrrigation(currentPlant, newReading.soilMoisture);
    });
    const unsubStatus = sensorService.subscribeStatus(newStatus => {
      setHardwareStatus(newStatus);
    });
    const unsubWater = waterSupplyService.subscribe(newWater => {
      setWaterState(newWater);
    });

    return () => {
      unsubReading();
      unsubStatus();
    };
  }, [currentPlant]);

  const handleSelectPlant = (plant: Plant) => {
    setCurrentPlant(plant);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_PLANT_STORAGE_KEY, plant.id);
    }
  };

  const handleRefreshPlants = () => {
    const updated = getAllPlants();
    setAllPlants(updated);
  };

  const handleToggleMode = (mode: 'DEMO' | 'ESP32_WIFI') => {
    sensorService.setMode(mode);
  };

  const handleSelectLang = (code: string) => {
    setCurrentLang(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, code);
    }
  };

  const handleToggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, String(next));
    }
  };

  // Get current active translation dictionary
  const t = getTranslation(currentLang);

  // Compute live plant health evaluation
  const healthEvaluation = calculatePlantHealth(currentPlant, reading);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDarkMode
        ? 'dark bg-stone-950 text-stone-100 selection:bg-emerald-900 selection:text-emerald-200'
        : 'bg-stone-50 text-stone-900 selection:bg-emerald-200 selection:text-emerald-950'
    }`}>
      {/* Top Navbar with 22 Indian languages & dark toggle */}
      <Navbar
        currentPlant={currentPlant}
        allPlants={allPlants}
        onSelectPlant={handleSelectPlant}
        reading={reading}
        onToggleMode={handleToggleMode}
        onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
        currentLang={currentLang}
        onSelectLang={handleSelectLang}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        t={t}
      />

      {/* Main Layout Area: Sidebar on Desktop, Content in Center */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentPage={currentPage}
          onNavigate={page => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          healthScore={healthEvaluation.score}
          criticalAlertCount={healthEvaluation.criticalAlerts.length}
          t={t}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-full overflow-x-hidden">
          {currentPage === 'dashboard' && (
            <HomeDashboard
              plant={currentPlant}
              reading={reading}
              health={healthEvaluation}
              onNavigate={setCurrentPage}
              onSwitchToLiveMode={() => handleToggleMode('ESP32_WIFI')}
              onSwitchToDemoMode={() => handleToggleMode('DEMO')}
            />
          )}

          {currentPage === 'plants' && (
            <PlantSelector
              currentPlant={currentPlant}
              allPlants={allPlants}
              onSelectPlant={handleSelectPlant}
              onRefreshPlants={handleRefreshPlants}
            />
          )}

          {currentPage === 'detector' && (
            <RequirementDetector
              plant={currentPlant}
              reading={reading}
              health={healthEvaluation}
              onNavigateToPlantSelector={() => setCurrentPage('plants')}
            />
          )}

          {currentPage === 'water' && (
            <WaterSupplySection
              plant={currentPlant}
              reading={reading}
              waterState={waterState}
            />
          )}

          {currentPage === 'sensors' && (
            <SensorMonitoring
              reading={reading}
              status={hardwareStatus}
              onSwitchMode={handleToggleMode}
            />
          )}

          {currentPage === 'report' && (
            <PlantHealthReport
              plant={currentPlant}
              reading={reading}
              health={healthEvaluation}
            />
          )}

          {currentPage === 'assistant' && (
            <PlantCareAssistant
              plant={currentPlant}
              reading={reading}
              health={healthEvaluation}
            />
          )}

          {currentPage === 'education' && <LearnToGrow />}

          {currentPage === 'about' && (
            <AboutProject onNavigate={setCurrentPage} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentPage={currentPage}
        onNavigate={page => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        criticalAlertCount={healthEvaluation.criticalAlerts.length}
        t={t}
      />

      {/* Offline Connectivity Notification Banner */}
      <OfflineIndicator />

      {/* Quick Hardware Pinout Modal */}
      <HardwareModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        onNavigateToSensors={() => {
          setIsHardwareModalOpen(false);
          setCurrentPage('sensors');
        }}
      />
    </div>
  );
}
