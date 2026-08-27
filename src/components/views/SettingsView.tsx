import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Shield, 
  KeyRound, 
  Sparkles, 
  Trash2,
  RefreshCw,
  Cloud,
  FolderSync,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SyncProvider } from '../../types';

export const SettingsView: React.FC = () => {
  const { 
    userSettings, 
    updateUserSettings, 
    resetToSeedData, 
    importDataJSON,
    syncStatus,
    syncError,
    triggerSyncNow
  } = useStore();

  const [userName, setUserName] = useState(userSettings.userName);
  const [greeting, setGreeting] = useState(userSettings.greeting);
  const [pinCode, setPinCode] = useState(userSettings.pinCode || '');
  const [pinEnabled, setPinEnabled] = useState(Boolean(userSettings.pinEnabled));
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync Settings State
  const initialSync = userSettings.syncSettings || { provider: 'disabled', autoSync: false };
  const [syncProvider, setSyncProvider] = useState<SyncProvider>(initialSync.provider);
  const [localPath, setLocalPath] = useState(initialSync.localPath || '');
  const [remoteUrl, setRemoteUrl] = useState(initialSync.remoteUrl || '');
  const [secretToken, setSecretToken] = useState(initialSync.secretToken || '');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings({ 
      userName, 
      greeting,
      pinEnabled,
      pinCode: pinEnabled ? pinCode : undefined,
      syncSettings: {
        provider: syncProvider,
        localPath: syncProvider === 'local_folder' ? localPath : undefined,
        remoteUrl: syncProvider === 'remote_api' ? remoteUrl : undefined,
        secretToken: syncProvider === 'remote_api' ? secretToken : undefined,
        autoSync: true,
        lastSyncedAt: initialSync.lastSyncedAt
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await triggerSyncNow();
    setIsSyncing(false);
  };

  const handleExportData = () => {
    const stateStr = localStorage.getItem('mosaic-lifeos-store');
    if (!stateStr) return;
    const blob = new Blob([stateStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mosaic-lifeos-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
        if (ok) alert('Backup restored successfully!');
        else alert('Failed to restore backup. Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleWipeDatabase = () => {
    if (confirm('Are you sure you want to completely RESET your local database and start fresh? All data will be cleared.')) {
      localStorage.clear();
      resetToSeedData();
      updateUserSettings({ hasCompletedTutorial: false });
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-warm-border dark:border-warm-border-dark pb-4">
        <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Settings</h1>
      </div>

      {/* User Profile & Security Form */}
      <form onSubmit={handleSaveSettings} className="mosaic-card p-6 space-y-5">
        <h3 className="font-serif text-lg text-primary-text dark:text-primary-text-dark font-medium">Personalization & Profile</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Greeting Prompt</label>
            <input
              type="text"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
            />
          </div>
        </div>

        {/* Security PIN Section */}
        <div className="border-t border-warm-border dark:border-warm-border-dark/60 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-sage-500" />
              <span className="text-sm font-medium text-primary-text dark:text-primary-text-dark">4-Digit Security PIN Lock</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pinEnabled}
                onChange={(e) => setPinEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-warm-border dark:bg-warm-border-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sage-500"></div>
            </label>
          </div>

          {pinEnabled && (
            <div className="max-w-xs space-y-1">
              <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300">Set 4-Digit Passcode</label>
              <input
                type="password"
                maxLength={4}
                placeholder="****"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-sm font-mono tracking-widest text-primary-text dark:text-primary-text-dark focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Multi-Provider Sync Section */}
        <div className="border-t border-warm-border dark:border-warm-border-dark/60 pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-sage-500" />
              <span className="text-sm font-medium text-primary-text dark:text-primary-text-dark">Data Sync & Cloud Backup</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                syncStatus === 'synced' ? 'bg-sage-500/15 text-sage-600 dark:text-sage-300 border border-sage-500/30' :
                syncStatus === 'syncing' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30' :
                syncStatus === 'error' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30' :
                'bg-warm-subtle text-primary-secondary border border-warm-border'
              }`}>
                {syncStatus}
              </span>
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing || syncProvider === 'disabled'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark text-xs font-mono text-primary-text dark:text-white hover:bg-warm-card transition-quiet disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-sage-500 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Sync Provider</label>
              <select
                value={syncProvider}
                onChange={(e) => setSyncProvider(e.target.value as SyncProvider)}
                className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
              >
                <option value="disabled">Disabled (Local Only)</option>
                <option value="local_folder">Cloud Drive Folder (Nextcloud / Dropbox / Syncthing)</option>
                <option value="remote_api">Remote Server REST API (Self-Hosted / Cloud Endpoint)</option>
              </select>
            </div>

            {syncProvider === 'local_folder' && (
              <div>
                <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Sync Directory Path</label>
                <input
                  type="text"
                  placeholder="e.g. ~/Nextcloud/Mosaic or ~/Sync/Mosaic"
                  value={localPath}
                  onChange={(e) => setLocalPath(e.target.value)}
                  className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
                />
              </div>
            )}

            {syncProvider === 'remote_api' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Server Endpoint URL</label>
                  <input
                    type="url"
                    placeholder="https://api.yourdomain.com/v1/sync"
                    value={remoteUrl}
                    onChange={(e) => setRemoteUrl(e.target.value)}
                    className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Secret Token (Optional)</label>
                  <input
                    type="password"
                    placeholder="Bearer token..."
                    value={secretToken}
                    onChange={(e) => setSecretToken(e.target.value)}
                    className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
                  />
                </div>
              </div>
            )}

            {syncError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{syncError}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-warm-border dark:border-warm-border-dark/60">
          <div className="flex items-center gap-3">
            {savedSuccess && <span className="text-xs text-sage-600 dark:text-sage-300 font-medium flex items-center gap-1"><Check className="w-4 h-4" /> Saved!</span>}
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium transition-quiet"
            >
              Save Settings
            </button>
          </div>
        </div>
      </form>

      {/* Data Sovereignty & Local Storage */}
      <div className="mosaic-card p-6 space-y-4">
        <h3 className="font-serif text-lg text-primary-text dark:text-primary-text-dark font-medium">Local SQLite Database & Reset</h3>
        <p className="text-xs text-primary-secondary dark:text-stone-300">
          Mosaic stores 100% of your personal data locally inside your embedded SQLite database (<code className="font-mono text-sage-500">~/.local/share/mosaic/mosaic.db</code>).
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark text-xs font-medium text-primary-text dark:text-primary-text-dark hover:bg-warm-card transition-quiet"
          >
            <Download className="w-4 h-4 text-sage-500" />
            <span>Export Data (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark text-xs font-medium text-primary-text dark:text-primary-text-dark hover:bg-warm-card cursor-pointer transition-quiet">
            <Upload className="w-4 h-4 text-sage-500" />
            <span>Import Data</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          {/* Reset DB */}
          <button
            onClick={handleWipeDatabase}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500/30 text-xs font-medium text-rose-600 hover:bg-rose-500/10 transition-quiet ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset DB & Start Fresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
