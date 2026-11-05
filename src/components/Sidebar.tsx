import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  Activity,
  Radio,
  FileText,
  Bot,
  GraduationCap,
  Users,
  HeartPulse,
  Droplets,
} from 'lucide-react';
import { TranslationStrings } from '../utils/translations';

export type PageId =
  | 'dashboard'
  | 'plants'
  | 'detector'
  | 'sensors'
  | 'water'
  | 'report'
  | 'assistant'
  | 'education'
  | 'about';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  healthScore: number;
  criticalAlertCount: number;
  t: TranslationStrings;
}

export const getNavItems = (t: TranslationStrings): Array<{
  id: PageId;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}> => [
  {
    id: 'dashboard',
    label: t.home,
    sublabel: 'Overview & Vital Signs',
    icon: LayoutDashboard,
  },
  {
    id: 'plants',
    label: t.selectPlant,
    sublabel: '10+ Plant Requirements',
    icon: Sprout,
  },
  {
    id: 'detector',
    label: t.requirementDetector,
    sublabel: 'Smart Low/Normal/High',
    icon: Activity,
    badge: 'Core',
    badgeColor: 'bg-emerald-600 text-white',
  },
  {
    id: 'water',
    label: t.waterSupply,
    sublabel: 'Reservoir & Smart Pump',
    icon: Droplets,
    badge: 'New',
    badgeColor: 'bg-blue-600 text-white',
  },
  {
    id: 'sensors',
    label: t.sensorMonitoring,
    sublabel: 'ESP32 & Arduino UNO',
    icon: Radio,
  },
  {
    id: 'report',
    label: t.plantHealthReport,
    sublabel: 'Score & 24h/7d Charts',
    icon: FileText,
  },
  {
    id: 'assistant',
    label: t.plantCareAssistant,
    sublabel: 'Q&A for Yellow Leaves & More',
    icon: Bot,
  },
  {
    id: 'education',
    label: t.learnToGrow,
    sublabel: '9th Grade Science & Quiz',
    icon: GraduationCap,
  },
  {
    id: 'about',
    label: t.aboutProject,
    sublabel: 'Our Green Mission & Team',
    icon: Users,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  healthScore,
  criticalAlertCount,
  t,
}) => {
  const navItems = getNavItems(t);

  return (
    <aside className="w-64 bg-stone-950 text-stone-100 flex-shrink-0 flex-col justify-between hidden md:flex border-r border-stone-800 p-4 select-none">
      <div className="space-y-6">
        {/* Quick Health Status Card in Sidebar */}
        <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800/80 shadow-inner">
          <div className="flex items-center justify-between text-xs text-stone-400 font-medium mb-1">
            <span className="flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
              {t.plantHealth}
            </span>
            <span className="font-bold text-stone-200">{healthScore} / 100</span>
          </div>
          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full transition-all duration-500 ${
                healthScore >= 80 ? 'bg-emerald-500' : healthScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
          {criticalAlertCount > 0 && (
            <div className="mt-2.5 text-[11px] text-rose-300 bg-rose-950/70 border border-rose-800/70 rounded-lg px-2 py-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              <span>{criticalAlertCount} requirement alert(s)</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
            Main Navigation
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-950'
                    : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                  <div>
                    <div className="leading-tight">{item.label}</div>
                    <div className={`text-[10px] font-normal mt-0.5 ${isActive ? 'text-emerald-100' : 'text-stone-400'}`}>
                      {item.sublabel}
                    </div>
                  </div>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-stone-800 text-stone-200'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info in Sidebar */}
      <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400 space-y-1">
        <p className="font-semibold text-stone-200">AGROSMART Initiative</p>
        <p className="text-[10px] text-emerald-400">Smart Care for Every Plant 🌱</p>
        <p className="text-[10px] text-stone-400">By Ranvijay, Ayush & Rishabh</p>
      </div>
    </aside>
  );
};
