import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div className="fixed bottom-20 md:bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-emerald-700 text-white px-4 py-2 text-xs font-semibold shadow-xl border border-emerald-600 animate-in fade-in slide-in-from-bottom-2">
        <Wifi className="w-4 h-4 text-emerald-200" />
        <span>Back online! Telemetry synchronized.</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-amber-600 text-white px-4 py-2 text-xs font-semibold shadow-xl border border-amber-500 animate-in fade-in slide-in-from-bottom-2">
      <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
      <span>Offline Mode — Displaying cached plant care & guides.</span>
    </div>
  );
};
