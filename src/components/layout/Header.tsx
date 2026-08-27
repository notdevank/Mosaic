import React from 'react';
import { Search, Plus, Moon, Sun, Cloud, RefreshCw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatDayHeader, getTodayStr } from '../../utils/dateUtils';

export const Header: React.FC = () => {
  const { 
    setQuickCaptureOpen, 
    setGlobalSearchOpen, 
    userSettings, 
    updateUserSettings,
    syncStatus,
    triggerSyncNow,
    setCurrentView
  } = useStore();

  const todayStr = getTodayStr();
  const syncSettings = userSettings.syncSettings;

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      updateUserSettings({ theme: 'light' });
    } else {
      document.documentElement.classList.add('dark');
      updateUserSettings({ theme: 'dark' });
    }
  };

  return (
    <header 
      data-tauri-drag-region
      className="h-14 border-b border-warm-border dark:border-warm-border-dark px-6 flex items-center justify-between bg-warm-bg/90 dark:bg-warm-bg-dark/90 backdrop-blur-md sticky top-0 z-20 transition-quiet select-none"
    >
      {/* Date Header */}
      <div className="flex items-center gap-3" data-tauri-drag-region>
        <span className="font-mono text-xs text-primary-secondary dark:text-stone-300 tracking-widest uppercase pointer-events-none">
          {formatDayHeader(todayStr)}
        </span>
      </div>

      {/* Global Actions & Window Controls */}
      <div className="flex items-center gap-2">
        {/* Sync Status Badge */}
        {syncSettings && syncSettings.provider !== 'disabled' && (
          <button
            onClick={() => triggerSyncNow()}
            onContextMenu={(e) => {
              e.preventDefault();
              setCurrentView('settings');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-warm-border dark:border-warm-border-dark text-[10px] font-mono text-primary-secondary hover:text-primary-text dark:hover:text-primary-text-dark hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark transition-quiet"
            title={`Sync Status: ${syncStatus} (Click to Sync, Right-Click Settings)`}
          >
            <Cloud className={`w-3 h-3 ${syncStatus === 'synced' ? 'text-sage-500' : syncStatus === 'syncing' ? 'text-amber-500 animate-spin' : syncStatus === 'error' ? 'text-rose-500' : 'text-primary-secondary'}`} />
            <span className="capitalize hidden md:inline">{syncStatus}</span>
          </button>
        )}

        {/* Global Search Button */}
        <button
          onClick={() => setGlobalSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-warm-border dark:border-warm-border-dark text-xs text-primary-secondary hover:text-primary-text dark:hover:text-primary-text-dark hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark transition-quiet"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded text-primary-secondary">
            ⌘K
          </kbd>
        </button>

        {/* Quick Capture Button */}
        <button
          onClick={() => setQuickCaptureOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Capture</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-primary-secondary hover:text-primary-text hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark transition-quiet"
          title="Toggle light/dark theme"
        >
          <Sun className="w-4 h-4 hidden dark:block text-amber-300" />
          <Moon className="w-4 h-4 block dark:hidden text-slate-600" />
        </button>
      </div>
    </header>
  );
};
