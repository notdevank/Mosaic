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
  AlertCircle,
  Wifi,
  Terminal,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SyncProvider } from '../../types';
import { syncEngine } from '../../services/syncEngine';

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
  const [remoteUrl, setRemoteUrl] = useState(initialSync.remoteUrl || 'http://localhost:3001/api/sync');
  const [secretToken, setSecretToken] = useState(initialSync.secretToken || 'mosaic-secret-key-123');
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ testing: boolean; success?: boolean; latencyMs?: number; error?: string }>({ testing: false });

  const [copiedServerCmd, setCopiedServerCmd] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings({ 
      userName, 
      greeting,
      pinEnabled,
      pinCode: pinEnabled ? pinCode : undefined,
      syncSettings: {
        provider: syncProvider,
        remoteUrl: syncProvider === 'remote_api' ? remoteUrl : undefined,
        secretToken: syncProvider === 'remote_api' ? secretToken : undefined,
        autoSync: syncProvider !== 'disabled',
        lastSyncedAt: initialSync.lastSyncedAt
      }
    });

    if (syncProvider === 'remote_api' && remoteUrl) {
      syncEngine.connectWebSocket({
        provider: 'remote_api',
        remoteUrl,
        secretToken,
        autoSync: true
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await triggerSyncNow();
    setIsSyncing(false);
  };

  const handleTestConnection = async () => {
    setTestResult({ testing: true });
    const res = await syncEngine.testConnection({
      provider: 'remote_api',
      remoteUrl,
      secretToken,
      autoSync: true
    });
    setTestResult({ testing: false, ...res });
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText('node server/sync-server.js');
    setCopiedServerCmd(true);
    setTimeout(() => setCopiedServerCmd(false), 2000);
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
      <div className="border-b border-warm-border dark:border-warm-border-dark pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Settings & Configuration</h1>
          <p className="text-xs font-mono text-primary-secondary">User profile, security PIN, data synchronization & backups</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      {/* User Profile & Security Form */}
      <form onSubmit={handleSaveSettings} className="mosaic-card p-6 space-y-6">
        {/* Personalization Section */}
        <div className="space-y-4">
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
        </div>

        {/* Security PIN Section */}
        <div className="border-t border-warm-border dark:border-warm-border-dark/60 pt-5 space-y-3">
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
              <div className="w-9 h-5 bg-warm-border peer-focus:outline-none rounded-full peer dark:bg-warm-border-dark peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sage-500"></div>
            </label>
          </div>

          {pinEnabled && (
            <div className="pl-6 animate-in fade-in duration-150">
              <input
                type="password"
                maxLength={4}
                placeholder="Set 4-digit PIN..."
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-48 bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs font-mono tracking-widest text-primary-text dark:text-primary-text-dark focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Realtime Data Synchronization Section */}
        <div className="border-t border-warm-border dark:border-warm-border-dark/60 pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-sage-600 dark:text-sage-400" />
              <div>
                <h3 className="font-serif text-lg text-primary-text dark:text-primary-text-dark font-medium">Real-time Multi-Device Sync</h3>
                <p className="text-xs text-primary-secondary font-mono">Sync data across devices via WebSocket or REST API</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing || syncProvider === 'disabled'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-warm-border dark:border-warm-border-dark text-xs font-mono text-primary-text dark:text-primary-text-dark hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark disabled:opacity-50 transition-quiet"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sage-500' : ''}`} />
                <span>Sync Now</span>
              </button>
            </div>
          </div>

          {/* Sync Provider Radio Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className={`p-4 rounded-xl border cursor-pointer transition-all ${syncProvider === 'remote_api' ? 'bg-sage-500/10 border-sage-500/40 text-sage-700 dark:text-sage-300 font-medium' : 'bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border-warm-border dark:border-warm-border-dark text-primary-secondary'}`}>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="syncProvider"
                  value="remote_api"
                  checked={syncProvider === 'remote_api'}
                  onChange={() => setSyncProvider('remote_api')}
                  className="text-sage-500 focus:ring-sage-500"
                />
                <span className="text-xs font-mono font-bold">Cloud / Remote API</span>
              </div>
              <p className="text-[10px] text-primary-secondary font-mono leading-relaxed pl-5">
                Real-time WebSocket & REST sync for multi-device streaming.
              </p>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer transition-all ${syncProvider === 'local_folder' ? 'bg-sage-500/10 border-sage-500/40 text-sage-700 dark:text-sage-300 font-medium' : 'bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border-warm-border dark:border-warm-border-dark text-primary-secondary'}`}>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="syncProvider"
                  value="local_folder"
                  checked={syncProvider === 'local_folder'}
                  onChange={() => setSyncProvider('local_folder')}
                  className="text-sage-500 focus:ring-sage-500"
                />
                <span className="text-xs font-mono font-bold">Local File Backup</span>
              </div>
              <p className="text-[10px] text-primary-secondary font-mono leading-relaxed pl-5">
                Automatic JSON snapshot export to local files.
              </p>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer transition-all ${syncProvider === 'disabled' ? 'bg-sage-500/10 border-sage-500/40 text-sage-700 dark:text-sage-300 font-medium' : 'bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border-warm-border dark:border-warm-border-dark text-primary-secondary'}`}>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="syncProvider"
                  value="disabled"
                  checked={syncProvider === 'disabled'}
                  onChange={() => setSyncProvider('disabled')}
                  className="text-sage-500 focus:ring-sage-500"
                />
                <span className="text-xs font-mono font-bold">Disabled (Local)</span>
              </div>
              <p className="text-[10px] text-primary-secondary font-mono leading-relaxed pl-5">
                Data stays strictly offline on this browser device.
              </p>
            </label>
          </div>

          {/* Remote Server Details */}
          {syncProvider === 'remote_api' && (
            <div className="space-y-4 p-4 rounded-2xl bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-primary-secondary mb-1">
                    Server API Endpoint URL
                  </label>
                  <input
                    type="text"
                    placeholder="http://localhost:3001/api/sync or ws://localhost:3001"
                    value={remoteUrl}
                    onChange={(e) => setRemoteUrl(e.target.value)}
                    className="w-full bg-warm-bg dark:bg-warm-bg-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-2 text-xs font-mono text-primary-text dark:text-primary-text-dark focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-primary-secondary mb-1">
                    Secret Auth Token
                  </label>
                  <input
                    type="password"
                    placeholder="mosaic-secret-key-123"
                    value={secretToken}
                    onChange={(e) => setSecretToken(e.target.value)}
                    className="w-full bg-warm-bg dark:bg-warm-bg-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-2 text-xs font-mono text-primary-text dark:text-primary-text-dark focus:outline-none"
                  />
                </div>
              </div>

              {/* Test Connection Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-warm-border dark:border-warm-border-dark/60">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testResult.testing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
                >
                  <Wifi className={`w-3.5 h-3.5 ${testResult.testing ? 'animate-ping' : ''}`} />
                  <span>{testResult.testing ? 'Testing Ping...' : 'Test Connection Ping'}</span>
                </button>

                {testResult.success !== undefined && (
                  <div className={`text-xs font-mono flex items-center gap-1.5 ${testResult.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {testResult.success ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Connected successfully ({testResult.latencyMs}ms latency)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>{testResult.error || 'Connection failed'}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Node.js Server Run Guide */}
              <div className="pt-3 border-t border-warm-border dark:border-warm-border-dark/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-primary-secondary">
                    <Terminal className="w-3.5 h-3.5 text-sage-500" />
                    <span>Local / Wi-Fi Sync Server Command</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCmd}
                    className="flex items-center gap-1 text-[11px] font-mono text-sage-600 dark:text-sage-400 hover:underline"
                  >
                    {copiedServerCmd ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedServerCmd ? 'Copied!' : 'Copy Script Command'}</span>
                  </button>
                </div>

                <div className="bg-slate-900 text-slate-200 rounded-xl p-3 text-[11px] font-mono border border-slate-800 space-y-1">
                  <div>$ node server/sync-server.js</div>
                  <div className="text-slate-400 text-[10px]">
                    # Starts WebSocket & REST API server on http://localhost:3001/api/sync
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Settings Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
          >
            Save All Settings
          </button>
        </div>
      </form>

      {/* Manual Data Backup & Restore */}
      <div className="mosaic-card p-6 space-y-4">
        <h3 className="font-serif text-lg text-primary-text dark:text-primary-text-dark font-medium">Backup & Restore</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 p-4 rounded-xl border border-warm-border dark:border-warm-border-dark bg-warm-subtle/40 dark:bg-warm-subtle-dark/40 text-xs font-mono font-medium text-primary-text dark:text-primary-text-dark hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark transition-quiet"
          >
            <Download className="w-4 h-4 text-sage-500" />
            <span>Export Full JSON Backup</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-4 rounded-xl border border-warm-border dark:border-warm-border-dark bg-warm-subtle/40 dark:bg-warm-subtle-dark/40 text-xs font-mono font-medium text-primary-text dark:text-primary-text-dark hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark cursor-pointer transition-quiet">
            <Upload className="w-4 h-4 text-sage-500" />
            <span>Restore JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mosaic-card p-6 space-y-4 border-rose-500/20 dark:border-rose-500/30">
        <h3 className="font-serif text-lg text-rose-600 dark:text-rose-400 font-medium">Danger Zone</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-primary-text dark:text-primary-text-dark">Reset & Wipe Local Database</div>
            <div className="text-[11px] text-primary-secondary font-mono">Wipe all local tasks, logs, habits, and restore fresh seed state.</div>
          </div>

          <button
            type="button"
            onClick={handleWipeDatabase}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-mono transition-quiet"
          >
            <Trash2 className="w-4 h-4" />
            <span>Wipe Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};
