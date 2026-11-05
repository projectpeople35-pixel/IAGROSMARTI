import React, { useState } from 'react';
import { Plant, SensorReading } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { Cpu, Sparkles, ChevronDown, Radio, AlertTriangle, Languages, Sun, Moon, Check } from 'lucide-react';
import { INDIAN_LANGUAGES, TranslationStrings } from '../utils/translations';

interface NavbarProps {
  currentPlant: Plant;
  allPlants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  reading: SensorReading;
  onToggleMode: (mode: 'DEMO' | 'ESP32_WIFI') => void;
  onOpenHardwareModal: () => void;
  currentLang: string;
  onSelectLang: (langCode: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  t: TranslationStrings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPlant,
  allPlants,
  onSelectPlant,
  reading,
  onToggleMode,
  onOpenHardwareModal,
  currentLang,
  onSelectLang,
  isDarkMode,
  onToggleDarkMode,
  t,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const activeLangObj = INDIAN_LANGUAGES.find(l => l.code === currentLang) || INDIAN_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      {/* Top Banner when in DEMO mode vs LIVE mode */}
      <div className={`px-4 py-1 text-xs font-medium text-center flex items-center justify-center gap-2 ${
        reading.source === 'DEMO'
          ? 'bg-amber-950/80 text-amber-200 border-b border-amber-800/60'
          : reading.isLiveConnected
            ? 'bg-emerald-900/90 text-emerald-100 border-b border-emerald-700/60'
            : 'bg-rose-950/80 text-rose-200 border-b border-rose-800/60'
      }`}>
        {reading.source === 'DEMO' ? (
          <>
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              <strong>{t.demoMode.toUpperCase()}:</strong> Displaying simulated sensor readings for educational demonstration.
            </span>
            <button
              onClick={() => onToggleMode('ESP32_WIFI')}
              className="ml-2 underline font-semibold hover:text-white cursor-pointer text-[11px]"
            >
              Switch to Live ESP32 Mode →
            </button>
          </>
        ) : reading.isLiveConnected ? (
          <>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              <strong>{t.liveMode.toUpperCase()}:</strong> Connected to microcontroller telemetry via Wi-Fi ({reading.deviceId}).
            </span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 inline" />
            <span>
              <strong>HARDWARE DISCONNECTED:</strong> Waiting for ESP32 / Arduino UNO ping on Wi-Fi.
            </span>
            <button
              onClick={() => onToggleMode('DEMO')}
              className="ml-2 underline font-semibold hover:text-white cursor-pointer text-[11px]"
            >
              Use Demo Mode Instead
            </button>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950 text-xl border border-emerald-500/30">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white tracking-tight text-lg">AGROSMART</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider">v2.5</span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Center: Plant Selector & 22 Indian Languages */}
        <div className="flex items-center gap-2">
          {/* Plant Selector Dropdown in Header */}
          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 hover:bg-stone-850 rounded-xl border border-stone-800 transition cursor-pointer">
              <span className="text-xl">{currentPlant.icon}</span>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Monitoring</div>
                <div className="text-xs font-bold text-stone-100 leading-tight truncate max-w-[90px]">{currentPlant.name}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-stone-400 ml-0.5" />
            </div>

            <div className="absolute right-0 sm:left-0 top-full mt-2 w-64 bg-stone-900 rounded-2xl shadow-2xl border border-stone-800 py-2 hidden group-hover:block hover:block z-50 animate-in fade-in slide-in-from-top-1 text-stone-200">
              <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800">
                {t.selectPlant}
              </div>
              <div className="max-h-72 overflow-y-auto py-1 divide-y divide-stone-800">
                {allPlants.map(p => (
                  <button
                    key={p.id}
                    onClick={() => onSelectPlant(p)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-stone-800 transition cursor-pointer ${
                      p.id === currentPlant.id ? 'bg-emerald-950/80 font-bold text-emerald-300' : 'text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{p.icon}</span>
                      <span>{p.name}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 px-1.5 py-0.5 rounded bg-stone-800">{p.category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 22 Main Languages of India Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-stone-900 hover:bg-stone-850 rounded-xl border border-stone-800 text-xs font-bold text-stone-200 transition cursor-pointer"
              title="Select Language (22 Official Indian Languages Available)"
            >
              <Languages className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">{activeLangObj.nativeName}</span>
              <span className="md:hidden uppercase text-[11px]">{activeLangObj.code}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-stone-900 rounded-2xl shadow-2xl border border-stone-800 py-2 z-50 animate-in fade-in slide-in-from-top-1 text-stone-200">
                  <div className="px-4 py-2 border-b border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>🇮🇳</span>
                        <span>22 Scheduled Languages of India</span>
                      </div>
                      <div className="text-[10px] text-stone-400">Select language for interface translation</div>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto py-1 divide-y divide-stone-800/60">
                    {INDIAN_LANGUAGES.map(lang => {
                      const isSelected = lang.code === currentLang;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            onSelectLang(lang.code);
                            setShowLangMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-left flex items-center justify-between text-xs hover:bg-stone-800 transition cursor-pointer ${
                            isSelected ? 'bg-emerald-950/80 text-emerald-300 font-bold' : 'text-stone-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{lang.nativeName}</span>
                              <span className="text-[10px] text-stone-400">({lang.name})</span>
                            </div>
                            <div className="text-[10px] text-stone-500">{lang.region}</div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Actions: Mode Switcher, Hardware, Theme Toggle, Install PWA */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mode Switcher Pill */}
          <button
            onClick={() => onToggleMode(reading.source === 'DEMO' ? 'ESP32_WIFI' : 'DEMO')}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              reading.source === 'DEMO'
                ? 'bg-amber-950/80 text-amber-300 border-amber-800/70 hover:bg-amber-900/60'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/70 hover:bg-emerald-900/60'
            }`}
            title="Toggle between Live Hardware and Demo Simulation"
          >
            {reading.source === 'DEMO' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline">{t.demoMode}</span>
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden lg:inline">{t.liveMode}</span>
              </>
            )}
          </button>

          {/* Hardware Connection Guide Button */}
          <button
            onClick={onOpenHardwareModal}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-300 bg-stone-900 hover:bg-stone-800 border border-stone-800 transition cursor-pointer"
            title="Hardware pinouts and ESP32 connection setup"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">{t.hardwareWiring}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <>
                <Moon className="w-4 h-4 text-emerald-400" />
                <span className="hidden 2xl:inline text-[11px]">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden 2xl:inline text-[11px]">Light</span>
              </>
            )}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
