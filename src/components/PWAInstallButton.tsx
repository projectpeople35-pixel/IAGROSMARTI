import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedNotice, setInstalledNotice] = useState(false);

  // If running as standalone app, show a subtle green checkmark badge
  if (isInstalled) {
    return (
      <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Installed App</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={async () => {
          const success = await install();
          if (success) setInstalledNotice(true);
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-teal-800 active:scale-95 transition-all cursor-pointer"
        aria-label="Install AGROSMART App to device"
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span className="hidden sm:inline">Install AGROSMART</span>
        <span className="sm:hidden">Install</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 dark:border-stone-700 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          aria-label="Install guide for iOS"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    🌱
                  </div>
                  <h3 className="text-base font-bold text-stone-900">Install AGROSMART</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                  aria-label="Close guide"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-stone-600 leading-relaxed">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">1</span>
                  <p>In Safari, tap the <strong>Share</strong> button <span className="inline-block px-1.5 py-0.5 bg-stone-200 rounded text-[11px]">⎋</span> at bottom of screen.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">2</span>
                  <p>Scroll down and select <strong>"Add to Home Screen"</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">3</span>
                  <p>Tap <strong>Add</strong> in top-right corner to launch AGROSMART like a native app!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / browser install badge button
  return (
    <button
      onClick={() => {
        alert('To install AGROSMART on your device, click the Install icon in your browser address bar (top right in Chrome/Edge) or add this page to your home screen on mobile!');
      }}
      className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs transition"
      aria-label="Install App Information"
      title="Install AGROSMART as a Progressive Web App"
    >
      <Download className="w-3.5 h-3.5 text-emerald-600" />
      <span>Install PWA</span>
    </button>
  );
};
