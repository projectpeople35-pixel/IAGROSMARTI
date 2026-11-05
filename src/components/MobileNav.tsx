import React, { useState } from 'react';
import { PageId, getNavItems } from './Sidebar';
import { LayoutDashboard, Sprout, Activity, MoreHorizontal, X, Droplets } from 'lucide-react';
import { TranslationStrings } from '../utils/translations';

interface MobileNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  criticalAlertCount: number;
  t: TranslationStrings;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onNavigate,
  criticalAlertCount,
  t,
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const navItems = getNavItems(t);

  const primaryTabs: Array<{ id: PageId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'detector', label: 'Detector', icon: Activity },
    { id: 'water', label: 'Water', icon: Droplets },
    { id: 'plants', label: 'Plants', icon: Sprout },
  ];

  return (
    <>
      {/* Bottom Nav Bar for Mobile in Dark Mode */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-stone-950/95 backdrop-blur-lg border-t border-stone-800 md:hidden pb-safe">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {primaryTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentPage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onNavigate(tab.id);
                  setShowDrawer(false);
                }}
                className={`flex flex-col items-center justify-center py-1 transition-all ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-stone-400 font-medium hover:text-stone-200'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {tab.id === 'detector' && criticalAlertCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </div>
                <span className="text-[10px] mt-1 truncate max-w-[60px]">{tab.label}</span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setShowDrawer(true)}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              ['sensors', 'report', 'assistant', 'education', 'about'].includes(currentPage)
                ? 'text-emerald-400 font-bold'
                : 'text-stone-400 font-medium hover:text-stone-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-1">Menu</span>
          </button>
        </div>
      </nav>

      {/* Slide-up Drawer for all pages */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-950 rounded-t-3xl border-t border-stone-800 p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌱</span>
                <span className="font-bold text-white text-base">AGROSMART Menu</span>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-xl bg-stone-900 text-stone-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-4">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setShowDrawer(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-2xl flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white font-bold'
                        : 'bg-stone-900 text-stone-200 hover:bg-stone-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                      <div>
                        <div className="text-xs font-semibold">{item.label}</div>
                        <div className="text-[11px] text-stone-400">{item.sublabel}</div>
                      </div>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
