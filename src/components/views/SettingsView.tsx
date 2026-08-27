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
  UserCheck,
  HardDrive,
  Lock,
  Smartphone,
  ChevronRight,
  Zap,
  Globe
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SyncProvider, GoogleDriveSettings } from '../../types';
import { syncEngine } from '../../services/syncEngine';
import { googleDriveSync, GoogleDriveUser } from '../../services/googleDriveSync';

type SettingsSection = 'profile' | 'security' | 'sync' | 'storage';

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

  // Sync State
  const initialSync = userSettings.syncSettings || { provider: 'disabled', autoSync: false };
  const [syncProvider, setSyncProvider] = useState<SyncProvider>(initialSync.provider);
  const [isSyncing, setIsSyncing] = useState(false);
  const [gdriveSettings, setGdriveSettings] = useState<GoogleDriveSettings>(initialSync.googleDrive || {});
  const [gdriveClientId, setGdriveClientId] = useState(initialSync.googleDrive?.clientId || '');
  const [gdriveStatusMsg, setGdriveStatusMsg] = useState<string | null>(null);
  const [showAdvancedClientId, setShowAdvancedClientId] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const DEFAULT_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '497003126067-pd08grc2tpba0br2m8219lv2sdksvsoe.apps.googleusercontent.com';

  useEffect(() => {
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
        setGdriveStatusMsg(`Connected as ${user.email || user.name || 'Google Account'}`);
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
      setGdriveStatusMsg(`Connected as ${user.email || user.name || 'Google Account'}`);
    });

    googleDriveSync.requestToken();
  };

  // Upload to Google Drive
  const handleGDriveUploadNow = async () => {
    if (!gdriveSettings.accessToken) {
      alert('Please sign in with Google first.');
      return;
    }

    setIsSyncing(true);
    setGdriveStatusMsg('Backing up database to Google Drive...');

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
      setGdriveStatusMsg(`✅ Backup saved to Google Drive (${new Date().toLocaleTimeString()})`);
    } else {
      setGdriveStatusMsg(`❌ Upload Error: ${res.error}`);
    }
  };

  // Restore from Google Drive
  const handleGDriveRestoreNow = async () => {
    if (!gdriveSettings.accessToken) {
      alert('Please sign in with Google first.');
      return;
    }

    if (!confirm('Restore your database from Google Drive? This will rehydrate your current workspace data.')) {
      return;
    }

    setIsSyncing(true);
    setGdriveStatusMsg('Downloading database snapshot from Google Drive...');

    const res = await googleDriveSync.downloadFromDrive(gdriveSettings.accessToken);
    setIsSyncing(false);

    if (res.success) {
      setGdriveStatusMsg('✅ Google Drive database restored successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 400);
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

  // Database Wipe
  const handleWipeDatabase = async () => {
    const isConfirmed = window.confirm('Are you sure you want to RESET your local database? All local data will be wiped and restored to seed state.');
    if (!isConfirmed) return;

    try {
      resetToSeedData();
      if (window.indexedDB && window.indexedDB.databases) {
        const dbs = await window.indexedDB.databases();
        for (const db of dbs) {
          if (db.name) window.indexedDB.deleteDatabase(db.name);
        }
      }
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      window.location.href = window.location.pathname;
    }, 150);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6 animate-in fade-in duration-200 select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-warm-border/60 dark:border-white/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-text dark:text-primary-text-dark">Settings</h1>
          <p className="text-xs font-mono text-primary-secondary mt-0.5">Manage preferences, security PIN, cloud sync, and data backups</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
            <Check className="w-3.5 h-3.5" />
            <span>Saved</span>
          </div>
        )}
      </div>

      {/* Modern 2-Column macOS / Raycast Style Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar Sub-Navigation */}
        <div className="space-y-1 md:col-span-1">
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
              <span>Profile</span>
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
              <Lock className="w-4 h-4" />
              <span>Security & PIN</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeSection === 'security' ? 'block' : 'hidden'}`} />
          </button>

          <button
            onClick={() => setActiveSection('sync')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeSection === 'sync'
                ? 'bg-sage-500 text-white font-bold shadow-xs'
                : 'text-primary-secondary hover:text-primary-text dark:hover:text-white hover:bg-warm-card dark:hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Cloud className="w-4 h-4" />
              <span>Google Drive Sync</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeSection === 'sync' ? 'block' : 'hidden'}`} />
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
              <span>Backup & Reset</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeSection === 'storage' ? 'block' : 'hidden'}`} />
          </button>
        </div>

        {/* Right Content Panel */}
        <div className="md:col-span-3">
          {/* SECTION 1: Profile */}
          {activeSection === 'profile' && (
            <form onSubmit={handleSaveProfile} className="rounded-2xl border border-warm-border/80 dark:border-white/10 bg-warm-card/80 dark:bg-zinc-900/80 p-6 space-y-6 shadow-xs backdrop-blur-md animate-in fade-in duration-150">
              <div className="border-b border-warm-border/60 dark:border-white/10 pb-3">
                <h3 className="font-serif text-base font-bold text-primary-text dark:text-primary-text-dark">User Profile</h3>
                <p className="text-xs font-mono text-primary-secondary">Personalize your display identity</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-warm-subtle/50 dark:bg-zinc-950/50 border border-warm-border/60 dark:border-zinc-800">
                  <div>
                    <div className="text-xs font-bold text-primary-text dark:text-primary-text-dark">Display Name</div>
                    <div className="text-[11px] font-mono text-primary-secondary">Shown in header greeting and welcome banner</div>
                  </div>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full sm:w-56 bg-warm-card dark:bg-zinc-900 border border-warm-border dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none focus:border-sage-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-warm-subtle/50 dark:bg-zinc-950/50 border border-warm-border/60 dark:border-zinc-800">
                  <div>
                    <div className="text-xs font-bold text-primary-text dark:text-primary-text-dark">Greeting Prompt</div>
                    <div className="text-[11px] font-mono text-primary-secondary">Custom greeting prefix (e.g. Good day, Welcome)</div>
                  </div>
                  <input
                    type="text"
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                    className="w-full sm:w-56 bg-warm-card dark:bg-zinc-900 border border-warm-border dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none focus:border-sage-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 active:scale-95 text-white text-xs font-bold shadow-xs transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* SECTION 2: Security & PIN */}
          {activeSection === 'security' && (
            <form onSubmit={handleSaveSecurity} className="rounded-2xl border border-warm-border/80 dark:border-white/10 bg-warm-card/80 dark:bg-zinc-900/80 p-6 space-y-6 shadow-xs backdrop-blur-md animate-in fade-in duration-150">
              <div className="border-b border-warm-border/60 dark:border-white/10 pb-3">
                <h3 className="font-serif text-base font-bold text-primary-text dark:text-primary-text-dark">Security & App Lock</h3>
                <p className="text-xs font-mono text-primary-secondary">Protect your workspace with a 4-digit passcode</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-warm-subtle/50 dark:bg-zinc-950/50 border border-warm-border/60 dark:border-zinc-800">
                  <div>
                    <div className="text-xs font-bold text-primary-text dark:text-primary-text-dark">Require PIN Lock on Launch</div>
                    <div className="text-[11px] font-mono text-primary-secondary">Prompt for a 4-digit PIN whenever Mosaic opens</div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pinEnabled}
                      onChange={(e) => setPinEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-warm-border peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sage-500"></div>
                  </label>
                </div>

                {pinEnabled && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-warm-subtle/50 dark:bg-zinc-950/50 border border-warm-border/60 dark:border-zinc-800 animate-in fade-in">
                    <div>
                      <div className="text-xs font-bold text-primary-text dark:text-primary-text-dark">Set 4-Digit Security Passcode</div>
                      <div className="text-[11px] font-mono text-primary-secondary">Enter your private 4-digit passcode</div>
                    </div>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="e.g. 1234"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full sm:w-36 bg-warm-card dark:bg-zinc-900 border border-warm-border dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-mono tracking-widest text-primary-text dark:text-primary-text-dark focus:outline-none focus:border-sage-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 active:scale-95 text-white text-xs font-bold shadow-xs transition-all"
                >
                  Save Security Settings
                </button>
              </div>
            </form>
          )}

          {/* SECTION 3: Google Drive Sync */}
          {activeSection === 'sync' && (
            <div className="rounded-2xl border border-warm-border/80 dark:border-white/10 bg-warm-card/80 dark:bg-zinc-900/80 p-6 space-y-6 shadow-xs backdrop-blur-md animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-warm-border/60 dark:border-white/10 pb-3">
                <div>
                  <h3 className="font-serif text-base font-bold text-primary-text dark:text-primary-text-dark">Google Drive Sync</h3>
                  <p className="text-xs font-mono text-primary-secondary">Store your database safely in your private Google Drive AppData folder</p>
                </div>

                {gdriveSettings.email && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {(gdriveSettings.accessToken || gdriveSettings.email) ? (
                  <div className="space-y-4">
                    {/* Account Badge */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-warm-subtle/60 dark:bg-zinc-950/60 border border-warm-border/60 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        {gdriveSettings.picture ? (
                          <img src={gdriveSettings.picture} alt="Google Avatar" className="w-9 h-9 rounded-full border border-warm-border" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-mono flex items-center justify-center font-bold">
                            {(gdriveSettings.email || gdriveSettings.name || 'G').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-primary-text dark:text-primary-text-dark">{gdriveSettings.name || 'Google Account'}</div>
                          <div className="text-[11px] font-mono text-primary-secondary">{gdriveSettings.email}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleDisconnect}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-mono font-bold transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Disconnect</span>
                      </button>
                    </div>

                    {/* Direct Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={handleGDriveUploadNow}
                        disabled={isSyncing}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all"
                      >
                        <Cloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                        <span>Sync Database to Drive</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGDriveRestoreNow}
                        disabled={isSyncing}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl border border-warm-border dark:border-zinc-700 bg-warm-subtle/40 dark:bg-zinc-950/40 text-xs font-mono font-bold text-primary-text dark:text-primary-text-dark hover:bg-warm-subtle dark:hover:bg-zinc-800 transition-all"
                      >
                        <Download className="w-4 h-4 text-blue-500" />
                        <span>Restore from Drive</span>
                      </button>
                    </div>

                    {gdriveSettings.lastSyncedAt && (
                      <div className="text-[11px] font-mono text-primary-secondary">
                        Last backup to Google Drive: {new Date(gdriveSettings.lastSyncedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-warm-subtle/50 dark:bg-zinc-950/50 border border-warm-border/60 dark:border-zinc-800 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-primary-text dark:text-primary-text-dark">1-Click Google Drive Backup</div>
                        <div className="text-[11px] font-mono text-primary-secondary mt-0.5">
                          Authenticate with your Google Account to back up your database to your private Google Drive AppData folder (`mosaic-lifeos-db.json`).
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all shrink-0"
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

                    <div className="pt-2 border-t border-warm-border/60 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setShowAdvancedClientId(!showAdvancedClientId)}
                        className="flex items-center gap-1 text-[11px] font-mono text-primary-secondary hover:text-blue-500 transition-all"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>{showAdvancedClientId ? 'Hide Custom Client ID' : 'Advanced: Custom Google OAuth Client ID'}</span>
                      </button>

                      {showAdvancedClientId && (
                        <div className="mt-2 animate-in fade-in">
                          <input
                            type="text"
                            placeholder="Custom Google Client ID..."
                            value={gdriveClientId}
                            onChange={(e) => setGdriveClientId(e.target.value)}
                            className="w-full bg-warm-card dark:bg-zinc-900 border border-warm-border dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-mono text-primary-text dark:text-primary-text-dark focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {gdriveStatusMsg && (
                  <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 font-bold animate-in fade-in">
                    {gdriveStatusMsg}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 4: Backup & Reset */}
          {activeSection === 'storage' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="rounded-2xl border border-warm-border/80 dark:border-white/10 bg-warm-card/80 dark:bg-zinc-900/80 p-6 space-y-4 shadow-xs backdrop-blur-md">
                <div className="border-b border-warm-border/60 dark:border-white/10 pb-3">
                  <h3 className="font-serif text-base font-bold text-primary-text dark:text-primary-text-dark">Manual JSON Backup & Restore</h3>
                  <p className="text-xs font-mono text-primary-secondary">Export or import your full database as a JSON snapshot file</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleExportData}
                    className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-warm-border dark:border-zinc-700 bg-warm-subtle/50 dark:bg-zinc-950/50 text-xs font-mono font-bold text-primary-text dark:text-primary-text-dark hover:bg-warm-subtle dark:hover:bg-zinc-800 transition-all"
                  >
                    <Download className="w-4 h-4 text-sage-500" />
                    <span>Export JSON Backup</span>
                  </button>

                  <label className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-warm-border dark:border-zinc-700 bg-warm-subtle/50 dark:bg-zinc-950/50 text-xs font-mono font-bold text-primary-text dark:text-primary-text-dark hover:bg-warm-subtle dark:hover:bg-zinc-800 cursor-pointer transition-all">
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

              <div className="rounded-2xl border border-rose-500/30 dark:border-rose-500/40 bg-warm-card/80 dark:bg-zinc-900/80 p-6 space-y-4 shadow-xs backdrop-blur-md">
                <h3 className="font-serif text-base text-rose-600 dark:text-rose-400 font-bold">Danger Zone</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-primary-text dark:text-primary-text-dark">Reset & Wipe Local Database</div>
                    <div className="text-[11px] text-primary-secondary font-mono">Purge local database state and restore clean seed state.</div>
                  </div>

                  <button
                    type="button"
                    onClick={handleWipeDatabase}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 active:scale-95 text-xs font-mono font-bold transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Wipe Database</span>
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
