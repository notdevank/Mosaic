import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  ChevronRight,
  HardDrive,
  Lock,
  Sparkles,
  Check
} from 'lucide-react';
import { useStore } from '../../store/useStore';

type SettingsSection = 'profile' | 'security' | 'storage';

export const SettingsView: React.FC = () => {
  const { 
    userSettings, 
    updateUserSettings, 
    resetToSeedData, 
    importDataJSON
  } = useStore();

  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  // Personalization State
  const [userName, setUserName] = useState(userSettings.userName);
  const [greeting, setGreeting] = useState(userSettings.greeting);

  // Security State
  const [pinCode, setPinCode] = useState(userSettings.pinCode || '');
  const [pinEnabled, setPinEnabled] = useState(Boolean(userSettings.pinEnabled));

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Save Settings Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings({ userName, greeting });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings({ 
      pinEnabled, 
      pinCode: pinCode || userSettings.pinCode 
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Export & Import JSON
  const handleExportData = () => {
    const stateStr = localStorage.getItem('mosaic-lifeos-store');
    if (!stateStr) return;
    const blob = new Blob([stateStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mosaic-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDataJSON(content);
        if (ok) {
          alert('Backup restored successfully! Reloading...');
          window.location.reload();
        } else {
          alert('Invalid JSON file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Database Reset
  const handleWipeDatabase = async () => {
    const isConfirmed = window.confirm('Are you sure you want to RESET your local database? All local data will be restored to default seed state.');
    if (!isConfirmed) return;

    try {
      resetToSeedData();
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      window.location.href = window.location.pathname;
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-warm-border dark:border-warm-border-dark pb-6 flex items-center justify-between">
        <div>
          <div className="font-mono text-xs text-sage-600 dark:text-sage-400 uppercase tracking-widest font-semibold mb-1">
            System & Personalization
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary-text dark:text-primary-text-dark tracking-tight">
            Settings
          </h1>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold animate-in fade-in">
            <Check className="w-4 h-4" /> Saved Successfully
          </div>
        )}
      </div>

      {/* Navigation Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Navigation Menu */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeSection === 'profile'
                ? 'bg-sage-500 text-white font-bold shadow-xs'
                : 'text-primary-secondary hover:text-primary-text dark:hover:text-white hover:bg-warm-card dark:hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span>User Profile</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeSection === 'profile' ? 'block' : 'hidden'}`} />
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeSection === 'security'
                ? 'bg-sage-500 text-white font-bold shadow-xs'
                : 'text-primary-secondary hover:text-primary-text dark:hover:text-white hover:bg-warm-card dark:hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4" />
              <span>Security & Passcode</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeSection === 'security' ? 'block' : 'hidden'}`} />
          </button>

          <button
            onClick={() => setActiveSection('storage')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeSection === 'storage'
                ? 'bg-sage-500 text-white font-bold shadow-xs'
                : 'text-primary-secondary hover:text-primary-text dark:hover:text-white hover:bg-warm-card dark:hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4" />
              <span>Local Storage & Backup</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeSection === 'storage' ? 'block' : 'hidden'}`} />
          </button>
        </div>

        {/* Right Content Panel */}
        <div className="md:col-span-3">
          
          {/* SECTION 1: Profile */}
          {activeSection === 'profile' && (
            <form onSubmit={handleSaveProfile} className="rounded-2xl border border-warm-border dark:border-warm-border-dark bg-warm-card dark:bg-warm-card-dark p-6 space-y-6 shadow-xs animate-in fade-in duration-150">
              <div className="border-b border-warm-border dark:border-warm-border-dark pb-3">
                <h3 className="font-serif text-base font-bold text-primary-text dark:text-white">User Profile</h3>
                <p className="text-xs font-mono text-primary-secondary">Personalize your display identity</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border border-warm-border dark:border-warm-border-dark">
                  <div>
                    <div className="text-xs font-bold text-primary-text dark:text-white">Display Name</div>
                    <div className="text-[11px] font-mono text-primary-secondary">Shown in header greeting and welcome banner</div>
                  </div>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full sm:w-56 bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-lg px-3 py-1.5 text-xs text-primary-text dark:text-white focus:outline-none focus:border-sage-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border border-warm-border dark:border-warm-border-dark">
                  <div>
                    <div className="text-xs font-bold text-primary-text dark:text-white">Greeting Prompt</div>
                    <div className="text-[11px] font-mono text-primary-secondary">Custom greeting (e.g. Welcome, Peace, or leave empty for time-based)</div>
                  </div>
                  <input
                    type="text"
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                    placeholder="Auto (time-based)"
                    className="w-full sm:w-56 bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-lg px-3 py-1.5 text-xs text-primary-text dark:text-white focus:outline-none focus:border-sage-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold shadow-xs transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* SECTION 2: Security & PIN */}
          {activeSection === 'security' && (
            <form onSubmit={handleSaveSecurity} className="rounded-2xl border border-warm-border dark:border-warm-border-dark bg-warm-card dark:bg-warm-card-dark p-6 space-y-6 shadow-xs animate-in fade-in duration-150">
              <div className="border-b border-warm-border dark:border-warm-border-dark pb-3">
                <h3 className="font-serif text-base font-bold text-primary-text dark:text-white">Security & App Lock</h3>
                <p className="text-xs font-mono text-primary-secondary">Protect your workspace with a 4-digit passcode</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border border-warm-border dark:border-warm-border-dark">
                  <div>
                    <div className="text-xs font-bold text-primary-text dark:text-white">Require PIN Lock on Launch</div>
                    <div className="text-[11px] font-mono text-primary-secondary">Prompt for a 4-digit PIN whenever Mosaic opens</div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pinEnabled}
                      onChange={(e) => setPinEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-warm-border peer-focus:outline-none rounded-full peer dark:bg-warm-border-dark peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sage-500"></div>
                  </label>
                </div>

                {pinEnabled && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border border-warm-border dark:border-warm-border-dark animate-in fade-in">
                    <div>
                      <div className="text-xs font-bold text-primary-text dark:text-white">Set 4-Digit Security Passcode</div>
                      <div className="text-[11px] font-mono text-primary-secondary">Enter your private 4-digit passcode</div>
                    </div>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="e.g. 1234"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full sm:w-36 bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-lg px-3 py-1.5 text-xs font-mono tracking-widest text-primary-text dark:text-white focus:outline-none focus:border-sage-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold shadow-xs transition-all"
                >
                  Save Security Settings
                </button>
              </div>
            </form>
          )}

          {/* SECTION 3: Storage & Backup */}
          {activeSection === 'storage' && (
            <div className="rounded-2xl border border-warm-border dark:border-warm-border-dark bg-warm-card dark:bg-warm-card-dark p-6 space-y-6 shadow-xs animate-in fade-in duration-150">
              <div className="border-b border-warm-border dark:border-warm-border-dark pb-3">
                <h3 className="font-serif text-base font-bold text-primary-text dark:text-white">Local-First Storage & Backup</h3>
                <p className="text-xs font-mono text-primary-secondary">Your data is stored 100% locally on your device in SQLite & IndexedDB</p>
              </div>

              <div className="space-y-4">
                {/* Mode Indicator */}
                <div className="p-4 rounded-xl bg-sage-500/10 border border-sage-500/20 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sage-700 dark:text-sage-300 font-mono">
                    <HardDrive className="w-4 h-4 text-sage-500" />
                    100% Local-First Engine Active
                  </div>
                  <p className="text-xs text-primary-text dark:text-zinc-300">
                    Tasks, journal entries, habits, daily reflections, and goals remain completely on your local device.
                  </p>
                </div>

                {/* Backup Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={handleExportData}
                    className="p-4 rounded-xl border border-warm-border dark:border-warm-border-dark bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 hover:border-sage-500/40 text-left transition-quiet space-y-2 group"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-primary-text dark:text-white group-hover:text-sage-600">
                      <Download className="w-4 h-4 text-sage-500" />
                      <span>Export JSON Snapshot</span>
                    </div>
                    <p className="text-[11px] text-primary-secondary">
                      Download a 1-click full workspace backup file to your computer.
                    </p>
                  </button>

                  <label className="p-4 rounded-xl border border-warm-border dark:border-warm-border-dark bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 hover:border-sage-500/40 text-left transition-quiet space-y-2 cursor-pointer group">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary-text dark:text-white group-hover:text-sage-600">
                      <Upload className="w-4 h-4 text-sage-500" />
                      <span>Restore JSON Backup</span>
                    </div>
                    <p className="text-[11px] text-primary-secondary">
                      Import a previously exported JSON backup file.
                    </p>
                    <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                  </label>
                </div>

                {/* Reset Section */}
                <div className="pt-6 border-t border-warm-border dark:border-warm-border-dark/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-red-500">Reset Local Database</div>
                    <div className="text-[11px] font-mono text-primary-secondary">Restore workspace to initial clean state</div>
                  </div>
                  <button
                    onClick={handleWipeDatabase}
                    className="px-4 py-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-medium transition-quiet"
                  >
                    Reset Workspace
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
