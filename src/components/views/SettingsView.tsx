import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Cloud, 
  Database, 
  KeyRound, 
  Check, 
  AlertCircle, 
  Download, 
  Upload, 
  Trash2, 
  LogOut, 
  RefreshCw, 
  Wifi, 
  Copy, 
  Info,
  ExternalLink,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SyncProvider, GoogleDriveSettings } from '../../types';
import { syncEngine } from '../../services/syncEngine';
import { googleDriveSync, GoogleDriveUser } from '../../services/googleDriveSync';

type SettingsTab = 'profile' | 'sync' | 'storage';

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

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Personalization & Security State
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
  const [showAdvancedClientId, setShowAdvancedClientId] = useState(false);

  const DEFAULT_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '497003126067-pd08grc2tpba0br2m8219lv2sdksvsoe.apps.googleusercontent.com';

  useEffect(() => {
    // Initialize Google Auth Client
    const activeCid = gdriveClientId.trim() || DEFAULT_CLIENT_ID;
    if (activeCid) {
      googleDriveSync.initAuth(activeCid, (user: GoogleDriveUser) => {
        setGdriveSettings({
          clientId: activeCid,
          email: user.email,
          name: user.name,
          picture: user.picture,
          accessToken: user.accessToken,
          expiresAt: user.expiresAt
        });
        setGdriveStatusMsg(`Successfully authenticated as ${user.email || user.name || 'Google Account'}`);
      });
    }
  }, [gdriveClientId]);

  // Google Login Handler
  const handleGoogleLogin = () => {
    const activeCid = gdriveClientId.trim() || DEFAULT_CLIENT_ID;

    googleDriveSync.initAuth(activeCid, (user: GoogleDriveUser) => {
      const updatedGDrive: GoogleDriveSettings = {
        clientId: activeCid,
        email: user.email,
        name: user.name,
        picture: user.picture,
        accessToken: user.accessToken,
        expiresAt: user.expiresAt,
        lastSyncedAt: new Date().toISOString()
      };
      setGdriveSettings(updatedGDrive);
      setSyncProvider('gdrive');

      updateUserSettings({
        syncSettings: {
          ...initialSync,
          provider: 'gdrive',
          autoSync: true,
          googleDrive: updatedGDrive
        }
      });
      setGdriveStatusMsg(`Signed in as ${user.email || user.name || 'Google Account'}`);
    });

    googleDriveSync.requestToken();
  };

  // Upload to Google Drive Handler
  const handleGDriveUploadNow = async () => {
    if (!gdriveSettings.accessToken) {
      alert('Please sign in with Google first.');
      return;
    }

    setIsSyncing(true);
    setGdriveStatusMsg('Uploading database to Google Drive...');

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
      setGdriveStatusMsg(`✅ Database backed up to Google Drive at ${new Date().toLocaleTimeString()}`);
    } else {
      setGdriveStatusMsg(`❌ Upload Error: ${res.error}`);
    }
  };

  // Restore from Google Drive Handler
  const handleGDriveRestoreNow = async () => {
    if (!gdriveSettings.accessToken) {
      alert('Please sign in with Google first.');
      return;
    }

    if (!confirm('Download and restore database from Google Drive? Your local state will be updated.')) {
      return;
    }

    setIsSyncing(true);
    setGdriveStatusMsg('Downloading database from Google Drive...');

    const res = await googleDriveSync.downloadFromDrive(gdriveSettings.accessToken);
    setIsSyncing(false);

    if (res.success) {
      setGdriveStatusMsg('✅ Google Drive database restored successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      setGdriveStatusMsg(`❌ Restore Error: ${res.error}`);
    }
  };

  // Disconnect Google Account
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

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings({ 
      userName, 
      greeting,
      pinEnabled,
      pinCode: pinCode || userSettings.pinCode
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Save Sync Provider Settings
  const handleSaveSyncSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings({ 
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

  // Export JSON File
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

  // Import JSON File
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
          alert('Failed to restore backup. Invalid JSON file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Complete Database Wipe
  const handleWipeDatabase = async () => {
    const isConfirmed = window.confirm('Are you sure you want to completely RESET your local database and start fresh? All tasks, logs, and settings will be wiped.');
    if (!isConfirmed) return;

    try {
      resetToSeedData();
      if (window.indexedDB && window.indexedDB.databases) {
        try {
          const dbs = await window.indexedDB.databases();
          for (const db of dbs) {
            if (db.name) window.indexedDB.deleteDatabase(db.name);
          }
        } catch (err) {
          console.warn('[Settings] IndexedDB cleanup warning:', err);
        }
      }
    } catch (e) {
      console.error('[Settings] Wipe database error:', e);
    }

    setTimeout(() => {
      window.location.href = window.location.pathname;
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      {/* Header Title */}
      <div className="border-b border-warm-border/80 dark:border-warm-border-dark/80 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-text dark:text-primary-text-dark">Settings & Workspace Control</h1>
          <p className="text-xs font-mono text-primary-secondary mt-0.5">Manage profile preferences, security PIN, cloud sync, and database backups</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      {/* Sleek Top Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-warm-card/60 dark:bg-zinc-900/60 border border-warm-border/60 dark:border-white/5 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'profile'
              ? 'bg-sage-500 text-white font-bold shadow-sm'
              : 'text-primary-secondary hover:text-primary-text dark:hover:text-white hover:bg-warm-subtle/50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Security</span>
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'sync'
              ? 'bg-sage-500 text-white font-bold shadow-sm'
              : 'text-primary-secondary hover:text-primary-text dark:hover:text-white hover:bg-warm-subtle/50'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>Cloud & Drive Sync</span>
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'storage'
              ? 'bg-sage-500 text-white font-bold shadow-sm'
              : 'text-primary-secondary hover:text-primary-text dark:hover:text-white hover:bg-warm-subtle/50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Backup & Database</span>
        </button>
      </div>

      {/* TAB 1: Profile & Security */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfileSettings} className="mosaic-card p-6 space-y-6 animate-in fade-in duration-150">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-warm-border/60 dark:border-warm-border-dark/60 pb-3">
              <User className="w-5 h-5 text-sage-600 dark:text-sage-400" />
              <h3 className="font-serif text-lg font-bold text-primary-text dark:text-primary-text-dark">Personal Profile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-primary-secondary mb-1.5">Your Display Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-warm-subtle dark:bg-zinc-900 border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2.5 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none focus:border-sage-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-primary-secondary mb-1.5">Custom Greeting Prompt</label>
                <input
                  type="text"
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  className="w-full bg-warm-subtle dark:bg-zinc-900 border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2.5 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none focus:border-sage-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-warm-border/60 dark:border-warm-border-dark/60 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary-text dark:text-primary-text-dark">4-Digit Security PIN Lock</h3>
                  <p className="text-xs font-mono text-primary-secondary">Require a passcode prompt whenever Mosaic launches</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinEnabled}
                  onChange={(e) => setPinEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-warm-border peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500"></div>
              </label>
            </div>

            {pinEnabled && (
              <div className="pl-7 pt-2 animate-in fade-in">
                <label className="block text-xs font-mono uppercase text-primary-secondary mb-1.5">Set 4-Digit Passcode</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="e.g. 1234"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-48 bg-warm-subtle dark:bg-zinc-900 border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2.5 text-sm font-mono tracking-widest text-primary-text dark:text-primary-text-dark focus:outline-none focus:border-sage-500"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-warm-border/60 dark:border-warm-border-dark/60">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold shadow-subtle transition-all"
            >
              Save Profile & Security
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Cloud & Drive Sync */}
      {activeTab === 'sync' && (
        <form onSubmit={handleSaveSyncSettings} className="mosaic-card p-6 space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-warm-border/60 dark:border-warm-border-dark/60 pb-4">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-serif text-lg font-bold text-primary-text dark:text-primary-text-dark">Sync Engine Provider</h3>
                <p className="text-xs font-mono text-primary-secondary">Choose how Mosaic syncs your workspace across devices</p>
              </div>
            </div>

            {gdriveSettings.email && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span>Connected</span>
              </span>
            )}
          </div>

          {/* Sync Provider Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <label className={`p-4 rounded-2xl border cursor-pointer transition-all ${syncProvider === 'gdrive' ? 'bg-blue-500/10 border-blue-500/50 text-blue-700 dark:text-blue-300 font-bold' : 'bg-warm-subtle/50 dark:bg-zinc-900/50 border-warm-border dark:border-warm-border-dark text-primary-secondary'}`}>
              <div className="flex items-center gap-2 mb-1.5">
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

            <label className={`p-4 rounded-2xl border cursor-pointer transition-all ${syncProvider === 'remote_api' ? 'bg-sage-500/10 border-sage-500/50 text-sage-700 dark:text-sage-300 font-bold' : 'bg-warm-subtle/50 dark:bg-zinc-900/50 border-warm-border dark:border-warm-border-dark text-primary-secondary'}`}>
              <div className="flex items-center gap-2 mb-1.5">
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

            <label className={`p-4 rounded-2xl border cursor-pointer transition-all ${syncProvider === 'local_folder' ? 'bg-sage-500/10 border-sage-500/50 text-sage-700 dark:text-sage-300 font-bold' : 'bg-warm-subtle/50 dark:bg-zinc-900/50 border-warm-border dark:border-warm-border-dark text-primary-secondary'}`}>
              <div className="flex items-center gap-2 mb-1.5">
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
                Manual JSON snapshot export.
              </p>
            </label>

            <label className={`p-4 rounded-2xl border cursor-pointer transition-all ${syncProvider === 'disabled' ? 'bg-sage-500/10 border-sage-500/50 text-sage-700 dark:text-sage-300 font-bold' : 'bg-warm-subtle/50 dark:bg-zinc-900/50 border-warm-border dark:border-warm-border-dark text-primary-secondary'}`}>
              <div className="flex items-center gap-2 mb-1.5">
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

          {/* Google Auth Integration Panel */}
          <div className="p-5 rounded-2xl bg-warm-subtle/60 dark:bg-zinc-900/60 border border-warm-border dark:border-white/5 space-y-4">
            {(gdriveSettings.accessToken || gdriveSettings.email) ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-warm-card dark:bg-zinc-900 border border-warm-border/60 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    {gdriveSettings.picture ? (
                      <img src={gdriveSettings.picture} alt="Google Avatar" className="w-10 h-10 rounded-full border border-warm-border" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-mono flex items-center justify-center font-bold">
                        {(gdriveSettings.email || gdriveSettings.name || 'G').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-primary-text dark:text-primary-text-dark">{gdriveSettings.name || 'Google Account'}</div>
                      <div className="text-[11px] font-mono text-primary-secondary">{gdriveSettings.email || 'Authenticated User'}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleDisconnect}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-mono transition-all"
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-subtle transition-all"
                  >
                    <Cloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                    <span>Sync Database to Google Drive</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGDriveRestoreNow}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-warm-border dark:border-warm-border-dark text-xs font-mono text-primary-text dark:text-primary-text-dark hover:bg-warm-card dark:hover:bg-zinc-800 transition-all"
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
                    <h4 className="text-xs font-bold text-primary-text dark:text-primary-text-dark">1-Click Google Sign In</h4>
                    <p className="text-[11px] font-mono text-primary-secondary leading-relaxed">
                      Authenticate with your Google Account to back up your database to your private Google Drive AppData folder (`mosaic-lifeos-db.json`).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-subtle transition-all shrink-0"
                  >
                    <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.0 10.04.0 12s.47 3.8 1.29 5.42l3.99-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24.0 12 .0 7.33.0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedClientId(!showAdvancedClientId)}
                    className="flex items-center gap-1 text-[11px] font-mono text-primary-secondary hover:text-blue-500 transition-quiet"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{showAdvancedClientId ? 'Hide Custom Client ID Field' : 'Advanced: Custom Google OAuth Client ID'}</span>
                  </button>

                  {showAdvancedClientId && (
                    <div className="mt-2 space-y-2 animate-in fade-in">
                      <input
                        type="text"
                        placeholder="Custom Google OAuth Client ID..."
                        value={gdriveClientId}
                        onChange={(e) => setGdriveClientId(e.target.value)}
                        className="w-full bg-warm-card dark:bg-zinc-900 border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-2 text-xs font-mono text-primary-text dark:text-primary-text-dark focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {gdriveStatusMsg && (
              <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 animate-in fade-in">
                {gdriveStatusMsg}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-warm-border/60 dark:border-warm-border-dark/60">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold shadow-subtle transition-all"
            >
              Save Sync Configuration
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Backup & Database */}
      {activeTab === 'storage' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="mosaic-card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-warm-border/60 dark:border-warm-border-dark/60 pb-3">
              <Database className="w-5 h-5 text-sage-600 dark:text-sage-400" />
              <h3 className="font-serif text-lg font-bold text-primary-text dark:text-primary-text-dark">Manual JSON Backup & Restore</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleExportData}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-warm-border dark:border-warm-border-dark bg-warm-subtle/40 dark:bg-zinc-900/40 text-xs font-mono font-bold text-primary-text dark:text-primary-text-dark hover:bg-warm-subtle dark:hover:bg-zinc-800 transition-all"
              >
                <Download className="w-4 h-4 text-sage-500" />
                <span>Export Full JSON Backup</span>
              </button>

              <label className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-warm-border dark:border-warm-border-dark bg-warm-subtle/40 dark:bg-zinc-900/40 text-xs font-mono font-bold text-primary-text dark:text-primary-text-dark hover:bg-warm-subtle dark:hover:bg-zinc-800 cursor-pointer transition-all">
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

          <div className="mosaic-card p-6 space-y-4 border-rose-500/30 dark:border-rose-500/40">
            <h3 className="font-serif text-lg text-rose-600 dark:text-rose-400 font-bold">Danger Zone</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-primary-text dark:text-primary-text-dark">Reset & Wipe Local Database</div>
                <div className="text-[11px] text-primary-secondary font-mono">Wipe all local tasks, logs, habits, and restore fresh seed state.</div>
              </div>

              <button
                type="button"
                onClick={handleWipeDatabase}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-mono font-bold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Wipe Database</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
