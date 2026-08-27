import { useStore } from '../store/useStore';
import { mosaicSQLiteStorage } from '../db/sqliteStorage';

export interface GoogleDriveUser {
  email?: string;
  name?: string;
  picture?: string;
  accessToken: string;
  expiresAt: number;
}

export interface GoogleDriveSyncResult {
  success: boolean;
  fileId?: string;
  lastSyncedAt?: string;
  error?: string;
}

const GDRIVE_FILENAME = 'mosaic-lifeos-db.json';

class GoogleDriveSyncService {
  private static instance: GoogleDriveSyncService;
  private tokenClient: any = null;
  private accessToken: string | null = null;
  private tokenCallback: ((user: GoogleDriveUser) => void) | null = null;

  private constructor() {}

  public static getInstance(): GoogleDriveSyncService {
    if (!GoogleDriveSyncService.instance) {
      GoogleDriveSyncService.instance = new GoogleDriveSyncService();
    }
    return GoogleDriveSyncService.instance;
  }

  // Load Google GIS script dynamically if needed
  public loadGisScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google?.accounts?.oauth2) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });
  }

  // Initialize GIS Token Client
  public async initAuth(clientId: string, onSuccess: (user: GoogleDriveUser) => void): Promise<void> {
    this.tokenCallback = onSuccess;
    await this.loadGisScript();

    if ((window as any).google?.accounts?.oauth2) {
      this.tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
        callback: async (response: any) => {
          if (response.error) {
            console.error('[GoogleDriveSync] OAuth token error:', response);
            return;
          }
          if (response.access_token) {
            this.accessToken = response.access_token;
            const expiresAt = Date.now() + (response.expires_in || 3600) * 1000;
            const profile = await this.fetchUserProfile(response.access_token);

            const user: GoogleDriveUser = {
              email: profile?.email,
              name: profile?.name,
              picture: profile?.picture,
              accessToken: response.access_token,
              expiresAt
            };

            if (this.tokenCallback) {
              this.tokenCallback(user);
            }
          }
        }
      });
    }
  }

  // Prompt user for OAuth Token
  public requestToken(): void {
    if (this.tokenClient) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      console.warn('[GoogleDriveSync] Token client not initialized.');
    }
  }

  // Fetch Profile Info
  private async fetchUserProfile(accessToken: string) {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[GoogleDriveSync] Could not fetch profile info:', e);
    }
    return null;
  }

  // Search file ID across appDataFolder, drive, and global query
  private async findBackupFileId(accessToken: string): Promise<string | null> {
    try {
      const queryStr = encodeURIComponent(`name = '${GDRIVE_FILENAME}' and trashed = false`);
      
      // 1. Search appDataFolder
      const urlAppData = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${queryStr}&fields=files(id,name,modifiedTime)`;
      const res1 = await fetch(urlAppData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (res1.ok) {
        const data1 = await res1.json();
        if (data1.files && data1.files.length > 0) {
          return data1.files[0].id;
        }
      }

      // 2. Search drive space
      const urlDrive = `https://www.googleapis.com/drive/v3/files?spaces=drive&q=${queryStr}&fields=files(id,name,modifiedTime)`;
      const res2 = await fetch(urlDrive, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (res2.ok) {
        const data2 = await res2.json();
        if (data2.files && data2.files.length > 0) {
          return data2.files[0].id;
        }
      }

      // 3. Fallback search all visible files
      const urlAll = `https://www.googleapis.com/drive/v3/files?q=${queryStr}&fields=files(id,name,modifiedTime)`;
      const res3 = await fetch(urlAll, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (res3.ok) {
        const data3 = await res3.json();
        if (data3.files && data3.files.length > 0) {
          return data3.files[0].id;
        }
      }
    } catch (e) {
      console.error('[GoogleDriveSync] Error searching file:', e);
    }
    return null;
  }

  // Upload database snapshot to Google Drive AppData
  async uploadToDrive(accessToken: string): Promise<GoogleDriveSyncResult> {
    try {
      const currentState = useStore.getState();
      const statePayload = {
        state: {
          userSettings: currentState.userSettings,
          areas: currentState.areas,
          tasks: currentState.tasks,
          events: currentState.events,
          habits: currentState.habits,
          goals: currentState.goals,
          projects: currentState.projects,
          activities: currentState.activities,
          dailyLogs: currentState.dailyLogs,
          courses: currentState.courses,
          assignments: currentState.assignments,
          exams: currentState.exams,
          exercises: currentState.exercises,
          workoutPlans: currentState.workoutPlans,
          workoutLogs: currentState.workoutLogs,
          people: currentState.people,
          mealLogs: currentState.mealLogs,
          nutritionGoal: currentState.nutritionGoal,
          inbox: currentState.inbox,
          reviews: currentState.reviews
        },
        version: 5
      };

      const fileContent = JSON.stringify(statePayload);
      const existingFileId = await this.findBackupFileId(accessToken);

      const metadata = {
        name: GDRIVE_FILENAME,
        mimeType: 'application/json',
        parents: existingFileId ? undefined : ['appDataFolder']
      };

      if (existingFileId) {
        const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`;
        const res = await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: fileContent
        });

        if (res.status === 401) {
          this.requestToken();
          return { success: false, error: 'Session expired. Requesting fresh Google token...' };
        }

        if (!res.ok) {
          throw new Error(`Google Drive API error: ${res.status} ${res.statusText}`);
        }

        return {
          success: true,
          fileId: existingFileId,
          lastSyncedAt: new Date().toISOString()
        };
      } else {
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([fileContent], { type: 'application/json' }));

        const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        const res = await fetch(createUrl, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form
        });

        if (res.status === 401) {
          this.requestToken();
          return { success: false, error: 'Session expired. Requesting fresh Google token...' };
        }

        if (!res.ok) {
          throw new Error(`Google Drive API upload error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return {
          success: true,
          fileId: data.id,
          lastSyncedAt: new Date().toISOString()
        };
      }
    } catch (e: any) {
      console.error('[GoogleDriveSync] Upload failed:', e);
      return { success: false, error: e?.message || 'Google Drive upload failed' };
    }
  }

  // Download & restore database state from Google Drive
  async downloadFromDrive(accessToken: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const existingFileId = await this.findBackupFileId(accessToken);
      if (!existingFileId) {
        return { 
          success: false, 
          error: 'No backup file (mosaic-lifeos-db.json) found in your Google Drive. Click "Sync Database to Drive" first to upload a backup.' 
        };
      }

      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${existingFileId}?alt=media`;
      const res = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (res.status === 401) {
        this.requestToken();
        return { success: false, error: 'Google session expired. Re-authenticating...' };
      }

      if (!res.ok) {
        throw new Error(`Google Drive download HTTP ${res.status}: ${res.statusText}`);
      }

      const contentStr = await res.text();
      const parsed = JSON.parse(contentStr);

      if (parsed) {
        await mosaicSQLiteStorage.setItem('mosaic-lifeos-store', contentStr);
        useStore.getState().importDataJSON(contentStr);
        return { success: true, data: parsed };
      }

      return { success: false, error: 'Invalid backup file content' };
    } catch (e: any) {
      console.error('[GoogleDriveSync] Download failed:', e);
      return { success: false, error: e?.message || 'Google Drive download failed' };
    }
  }
}

export const googleDriveSync = GoogleDriveSyncService.getInstance();
