import { SyncSettings, SyncStatusType } from '../types';

export interface SyncPayload {
  version: string;
  timestamp: string;
  client: string;
  data: Record<string, any>;
}

export class SyncEngine {
  private static instance: SyncEngine;
  private currentStatus: SyncStatusType = 'idle';
  private lastSyncError: string | null = null;
  private debounceTimer: any = null;
  private ws: WebSocket | null = null;

  static getInstance(): SyncEngine {
    if (!SyncEngine.instance) {
      SyncEngine.instance = new SyncEngine();
    }
    return SyncEngine.instance;
  }

  getStatus(): SyncStatusType {
    return this.currentStatus;
  }

  getError(): string | null {
    return this.lastSyncError;
  }

  // Create state payload snapshot
  createSnapshot(): SyncPayload {
    const rawStore = localStorage.getItem('mosaic-lifeos-store');
    let parsedData = {};
    if (rawStore) {
      try {
        parsedData = JSON.parse(rawStore);
      } catch (e) {
        console.error('[SyncEngine] Failed to parse local store:', e);
      }
    }

    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      client: 'Mosaic Web App',
      data: parsedData
    };
  }

  // Test connection ping helper
  async testConnection(settings: SyncSettings): Promise<{ success: boolean; latencyMs?: number; error?: string }> {
    if (!settings.remoteUrl) {
      return { success: false, error: 'Server URL is missing' };
    }

    const start = performance.now();
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (settings.secretToken) {
        headers['Authorization'] = `Bearer ${settings.secretToken}`;
      }

      const baseUrl = settings.remoteUrl.replace(/\/api\/sync\/?$/, '').replace(/\/ws\/?$/, '');
      const healthUrl = `${baseUrl}/health`;

      const res = await fetch(healthUrl, { method: 'GET', headers }).catch(() => null);
      
      const latencyMs = Math.round(performance.now() - start);

      if (res && res.ok) {
        return { success: true, latencyMs };
      }

      // Fallback to sync endpoint GET
      const syncRes = await fetch(settings.remoteUrl, { method: 'GET', headers });
      if (syncRes.ok) {
        return { success: true, latencyMs };
      }

      return { success: false, error: `HTTP ${syncRes.status}: ${syncRes.statusText}` };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Connection failed' };
    }
  }

  // Real-time Event-Driven Debounced Auto Sync
  scheduleRealtimeAutoSync(settings: SyncSettings, onStatusChange?: (status: SyncStatusType, err?: string) => void) {
    if (!settings || settings.provider === 'disabled' || !settings.autoSync) return;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.sync(settings, onStatusChange);
    }, 600);
  }

  // Connect WebSocket for Instant Multi-Device Real-time Streaming
  connectWebSocket(settings: SyncSettings, onRemoteUpdate?: (data: any) => void) {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    if (!settings.remoteUrl || (!settings.remoteUrl.startsWith('ws://') && !settings.remoteUrl.startsWith('wss://'))) return;

    try {
      this.ws = new WebSocket(settings.remoteUrl);

      this.ws.onopen = () => {
        console.log('[SyncEngine] Real-time WebSocket Stream Connected');
        if (settings.secretToken) {
          this.ws?.send(JSON.stringify({ type: 'auth', token: settings.secretToken }));
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'sync_update' && msg.data) {
            this.mergeRemoteData(msg.data);
            onRemoteUpdate?.(msg.data);
          }
        } catch (e) {
          console.error('[SyncEngine] WebSocket message parse error:', e);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[SyncEngine] WebSocket stream warning:', err);
      };
    } catch (e) {
      console.warn('[SyncEngine] Could not initialize WebSocket:', e);
    }
  }

  // Primary Sync Execution Handler
  async sync(settings: SyncSettings, onStatusChange?: (status: SyncStatusType, err?: string) => void): Promise<boolean> {
    if (!settings || settings.provider === 'disabled') {
      this.currentStatus = 'idle';
      onStatusChange?.('idle');
      return true;
    }

    this.currentStatus = 'syncing';
    this.lastSyncError = null;
    onStatusChange?.('syncing');

    try {
      const payload = this.createSnapshot();

      if (settings.provider === 'remote_api') {
        if (!settings.remoteUrl) {
          throw new Error('Remote Server API URL is required');
        }

        // If WebSocket is active, send live payload through WebSocket
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'state_push', payload }));
        } else {
          // Standard HTTP REST endpoint push
          const headers: Record<string, string> = {
            'Content-Type': 'application/json'
          };
          if (settings.secretToken) {
            headers['Authorization'] = `Bearer ${settings.secretToken}`;
          }

          const res = await fetch(settings.remoteUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
          });

          if (!res.ok) {
            throw new Error(`Server HTTP ${res.status}: ${res.statusText}`);
          }

          const remoteResult = await res.json();
          if (remoteResult && remoteResult.data) {
            this.mergeRemoteData(remoteResult.data);
          }
        }
      } else if (settings.provider === 'gdrive' && settings.googleDrive?.accessToken) {
        // Google Drive AppData Sync
        const { googleDriveSync } = await import('./googleDriveSync');
        const res = await googleDriveSync.uploadToDrive(settings.googleDrive.accessToken);
        if (!res.success) {
          throw new Error(res.error || 'Google Drive upload failed');
        }
      } else if (settings.provider === 'local_folder') {
        // Local Folder Backup Sync
        const fileName = `mosaic-sync-latest.json`;
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }

      this.currentStatus = 'synced';
      onStatusChange?.('synced');
      return true;

    } catch (err: any) {
      this.currentStatus = 'error';
      this.lastSyncError = err?.message || 'Real-time sync failed';
      onStatusChange?.('error', this.lastSyncError || undefined);
      return false;
    }
  }

  // Smart state merger for incoming remote items
  private mergeRemoteData(remoteData: any) {
    try {
      const localRaw = localStorage.getItem('mosaic-lifeos-store');
      if (!localRaw) return;

      const localStore = JSON.parse(localRaw);
      const localState = localStore.state || {};
      const remoteState = remoteData.state || remoteData;

      const mergeArrayById = (localArr: any[] = [], remoteArr: any[] = []) => {
        const map = new Map<string, any>();
        localArr.forEach(item => item && item.id && map.set(item.id, item));
        remoteArr.forEach(item => item && item.id && map.set(item.id, { ...map.get(item.id), ...item }));
        return Array.from(map.values());
      };

      const mergedState = {
        ...localState,
        tasks: mergeArrayById(localState.tasks, remoteState.tasks),
        habits: mergeArrayById(localState.habits, remoteState.habits),
        goals: mergeArrayById(localState.goals, remoteState.goals),
        events: mergeArrayById(localState.events, remoteState.events),
        dailyLogs: { ...(localState.dailyLogs || {}), ...(remoteState.dailyLogs || {}) }
      };

      localStorage.setItem('mosaic-lifeos-store', JSON.stringify({ ...localStore, state: mergedState }));
    } catch (e) {
      console.error('[SyncEngine] Failed to merge remote data:', e);
    }
  }
}

export const syncEngine = SyncEngine.getInstance();
