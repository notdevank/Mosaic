import React, { useState, useEffect } from 'react';
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
  LogOut,
  UserCheck
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SyncProvider, GoogleDriveSettings } from '../../types';
import { syncEngine } from '../../services/syncEngine';
import { googleDriveSync, GoogleDriveUser } from '../../services/googleDriveSync';

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
  const [remoteUrl, setRemoteUrl] = useState(initialSync.remoteUrl || 'http://localhost:3002/api/sync');
  const [secretToken, setSecretToken] = useState(initialSync.secretToken || 'mosaic-secret-key-123');
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ testing: boolean; success?: boolean; latencyMs?: number; error?: string }>({ testing: false });

  // Google Drive State
  const [gdriveSettings, setGdriveSettings] = useState<GoogleDriveSettings>(initialSync.googleDrive || {});
  const [gdriveClientId, setGdriveClientId] = useState(initialSync.googleDrive?.clientId || '');
  const [gdriveStatusMsg, setGdriveStatusMsg] = useState<string | null>(null);

  const DEFAULT_CLIENT_ID = '936573829012-mosaicdemo.apps.googleusercontent.com';

  useEffect(() => {
    // Init Google Auth SDK if Client ID is provided
    const cid = gdriveClientId.trim() || DEFAULT_CLIENT_ID;
    googleDriveSync.initAuth(cid, (user: GoogleDriveUser) => {
      setGdriveSettings({
        clientId: cid,
        email: user.email,
        name: user.name,
        picture: user.picture,
        accessToken: user.accessToken,
        expiresAt: user.expiresAt
      });
      setGdriveStatusMsg(`Successfully authenticated as ${user.email || user.name}`);
    });
  }, [gdriveClientId]);

  const handleGoogleLogin = () => {
    const cid = gdriveClientId.trim() || DEFAULT_CLIENT_ID;
    googleDriveSync.initAuth(cid, (user: GoogleDriveUser) => {
      const updatedGDrive: GoogleDriveSettings = {
        clientId: cid,
        email: user.email,
        name: user.name,
        picture: user.picture,
        accessToken: user.accessToken,
        expiresAt: user.expiresAt,
        lastSyncedAt: new Date().toISOString()
      };
      setGdriveSettings(updatedGDrive);
      setSyncProvider('gdrive');

      // Update store user settings
      updateUserSettings({
        syncSettings: {
          ...initialSync,
          provider: 'gdrive',
          autoSync: true,
          googleDrive: updatedGDrive
        }
      });
      setGdriveStatusMsg(`Signed in as ${user.email || 'Google User'}`);
    });

    googleDriveSync.requestToken();
  };

  const handleGDriveUploadNow = async () => {
    if (!gdriveSettings.accessToken) {
      alert('Please sign in with Google first.');
      return;
    }

    setIsSyncing(true);
    setGdriveStatusMsg('Uploading database to Google Drive AppData folder...');

    const res = await googleDriveSync.uploadToDrive(gdriveSettings.accessToken);
    setIsSyncing(false);

    if (res.success) {
      const nowStr = new Date().toISOString();
      const updatedGDrive = { ...gdriveSettings, lastSyncedAt: nowStr };
      setGdriveSettings(updatedGDrive);
      updateUserSettings({
        syncSettings: {
          ...initialSync,
          provider: 'gdrive',
          googleDrive: updatedGDrive
        }
      });
      setGdriveStatusMsg(`Database backed up to Google Drive successfully at ${new Date().toLocaleTimeString()}`);
    } else {
      setGdriveStatusMsg(`Upload Error: ${res.error}`);
    }
  };

  const handleGDriveRestoreNow = async () => {
    if (!gdriveSettings.accessToken) {
      alert('Please sign in with Google first.');
      return;
    }

    if (!confirm('Are you sure you want to download and restore your database from Google Drive? Local unsaved changes will be merged.')) {
      return;
    }

    setIsSyncing(true);
    setGdriveStatusMsg('Downloading database from Google Drive...');

    const res = await googleDriveSync.downloadFromDrive(gdriveSettings.accessToken);
    setIsSyncing(false);

    if (res.success) {
      alert('Google Drive database restored successfully! Reloading application state...');
      window.location.reload();
    } else {
      setGdriveStatusMsg(`Restore Error: ${res.error}`);
    }
  };

  const handleGoogleDisconnect = () => {
    setGdriveSettings({});
    setSyncProvider('disabled');
    updateUserSettings({
      syncSettings: {
        ...initialSync,
        provider: 'disabled',
        googleDrive: undefined
      }
    });
    setGdriveStatusMsg('Google account disconnected.');
  };

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
        lastSyncedAt: initialSync.lastSyncedAt,
        googleDrive: gdriveSettings
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
    if (syncProvider === 'gdrive' && gdriveSettings.accessToken) {
      await handleGDriveUploadNow();
    } else {
      await triggerSyncNow();
    }
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
          <p className="text-xs font-mono text-primary-secondary">User profile, security PIN, Google Drive & cloud sync</p>
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

        {/* Google Auth & Google Drive Sync Section */}
        <div className="border-t border-warm-border dark:border-warm-border-dark/60 pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-serif text-lg text-primary-text dark:text-primary-text-dark font-medium">Google Auth & Drive Integration</h3>
                <p className="text-xs text-primary-secondary font-mono">Store your database safely in your private Google Drive AppData folder</p>
              </div>
            </div>

            {gdriveSettings.email && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Connected</span>
              </span>
            )}
          </div>

          {/* Google Sync Provider Selector Card */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <label className={`p-3.5 rounded-xl border cursor-pointer transition-all ${syncProvider === 'gdrive' ? 'bg-blue-500/10 border-blue-500/40 text-blue-700 dark:text-blue-300 font-medium' : 'bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border-warm-border dark:border-warm-border-dark text-primary-secondary'}`}>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="syncProvider"
                  value="gdrive"
                  checked={syncProvider === 'gdrive'}
                  onChange={() => setSyncProvider('gdrive')}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="text-xs font-mono font-bold">Google Drive</span>
              </div>
              <p className="text-[10px] text-primary-secondary font-mono leading-relaxed pl-5">
                Private AppData folder GDrive backup.
              </p>
            </label>

            <label className={`p-3.5 rounded-xl border cursor-pointer transition-all ${syncProvider === 'remote_api' ? 'bg-sage-500/10 border-sage-500/40 text-sage-700 dark:text-sage-300 font-medium' : 'bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border-warm-border dark:border-warm-border-dark text-primary-secondary'}`}>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="syncProvider"
                  value="remote_api"
                  checked={syncProvider === 'remote_api'}
                  onChange={() => setSyncProvider('remote_api')}
                  className="text-sage-500 focus:ring-sage-500"
                />
                <span className="text-xs font-mono font-bold">Cloud Server API</span>
              </div>
              <p className="text-[10px] text-primary-secondary font-mono leading-relaxed pl-5">
                WebSocket & REST server endpoints.
              </p>
            </label>

            <label className={`p-3.5 rounded-xl border cursor-pointer transition-all ${syncProvider === 'local_folder' ? 'bg-sage-500/10 border-sage-500/40 text-sage-700 dark:text-sage-300 font-medium' : 'bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border-warm-border dark:border-warm-border-dark text-primary-secondary'}`}>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="syncProvider"
                  value="local_folder"
                  checked={syncProvider === 'local_folder'}
                  onChange={() => setSyncProvider('local_folder')}
                  className="text-sage-500 focus:ring-sage-500"
                />
                <span className="text-xs font-mono font-bold">Local File</span>
              </div>
              <p className="text-[10px] text-primary-secondary font-mono leading-relaxed pl-5">
                Manual JSON file export.
              </p>
            </label>

            <label className={`p-3.5 rounded-xl border cursor-pointer transition-all ${syncProvider === 'disabled' ? 'bg-sage-500/10 border-sage-500/40 text-sage-700 dark:text-sage-300 font-medium' : 'bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border-warm-border dark:border-warm-border-dark text-primary-secondary'}`}>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="syncProvider"
                  value="disabled"
                  checked={syncProvider === 'disabled'}
                  onChange={() => setSyncProvider('disabled')}
                  className="text-sage-500 focus:ring-sage-500"
                />
                <span className="text-xs font-mono font-bold">Disabled</span>
              </div>
              <p className="text-[10px] text-primary-secondary font-mono leading-relaxed pl-5">
                Local device storage only.
              </p>
            </label>
          </div>

          {/* Google Auth Active Control Panel */}
          <div className="p-5 rounded-2xl bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark space-y-4">
            {gdriveSettings.email ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-warm-card dark:bg-zinc-900 border border-warm-border/60 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    {gdriveSettings.picture ? (
                      <img src={gdriveSettings.picture} alt="Google Avatar" className="w-9 h-9 rounded-full border border-warm-border" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-mono flex items-center justify-center font-bold">
                        {gdriveSettings.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-primary-text dark:text-primary-text-dark">{gdriveSettings.name || 'Google User'}</div>
                      <div className="text-[11px] font-mono text-primary-secondary">{gdriveSettings.email}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleDisconnect}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-mono transition-quiet"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGDriveUploadNow}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-subtle transition-quiet"
                  >
                    <Cloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                    <span>Sync Database to Google Drive</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGDriveRestoreNow}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-warm-border dark:border-warm-border-dark text-xs font-mono text-primary-text dark:text-primary-text-dark hover:bg-warm-card dark:hover:bg-zinc-800 transition-quiet"
                  >
                    <Download className="w-4 h-4 text-blue-500" />
                    <span>Restore from Google Drive</span>
                  </button>
                </div>

                {gdriveSettings.lastSyncedAt && (
                  <div className="text-[11px] font-mono text-primary-secondary">
                    Last synced to GDrive: {new Date(gdriveSettings.lastSyncedAt).toLocaleString()}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-primary-text dark:text-primary-text-dark">Connect your Google Account</h4>
                    <p className="text-[11px] font-mono text-primary-secondary leading-relaxed">
                      Authenticate with Google to back up your database to your private Google Drive AppData folder (`mosaic-lifeos-db.json`).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-zinc-700 text-xs font-medium shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.0 10.04.0 12s.47 3.8 1.29 5.42l3.99-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24.0 12 .0 7.33.0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-warm-border dark:border-warm-border-dark/60">
                  <label className="block text-[11px] font-mono uppercase text-primary-secondary mb-1">
                    Google OAuth Client ID (Optional custom Client ID)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your custom Google OAuth Client ID..."
                    value={gdriveClientId}
                    onChange={(e) => setGdriveClientId(e.target.value)}
                    className="w-full bg-warm-bg dark:bg-warm-bg-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-1.5 text-xs font-mono text-primary-text dark:text-primary-text-dark focus:outline-none"
                  />
                </div>
              </div>
            )}

            {gdriveStatusMsg && (
              <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 animate-in fade-in">
                {gdriveStatusMsg}
              </div>
            )}
          </div>

          {/* Remote API Config Options */}
          {syncProvider === 'remote_api' && (
            <div className="space-y-4 p-4 rounded-2xl bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-primary-secondary mb-1">
                    Server API Endpoint URL
                  </label>
                  <input
                    type="text"
                    placeholder="http://localhost:3002/api/sync"
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
