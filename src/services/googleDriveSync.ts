/**
 * Mosaic Life OS — Google OAuth2 & Google Drive Private AppData Sync Engine
 * 
 * Uses Google Identity Services (GIS) + Google Drive REST API v3 to store
 * mosaic-lifeos-db.json securely in the user's private Google Drive appDataFolder.
 */

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
const GDRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';

export class GoogleDriveSyncService {
  private static instance: GoogleDriveSyncService;
  private tokenClient: any = null;
  private currentUser: GoogleDriveUser | null = null;

  static getInstance(): GoogleDriveSyncService {
    if (!GoogleDriveSyncService.instance) {
      GoogleDriveSyncService.instance = new GoogleDriveSyncService();
    }
    return GoogleDriveSyncService.instance;
  }

  // Load Google Identity Services SDK script dynamically if not present
  async loadGoogleSDK(): Promise<boolean> {
    if ((window as any).google?.accounts?.oauth2) {
      return true;
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  // Initialize Google Token Client with Client ID
  async initAuth(clientId: string, onTokenReceived: (user: GoogleDriveUser) => void): Promise<boolean> {
    const loaded = await this.loadGoogleSDK();
    if (!loaded || !(window as any).google?.accounts?.oauth2) {
      console.error('[GoogleDriveSync] Failed to load Google Identity Services SDK');
      return false;
    }

    try {
      this.tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: GDRIVE_SCOPE,
        callback: async (response: any) => {
          if (response.error) {
            console.error('[GoogleDriveSync] OAuth token error:', response.error);
            return;
          }

          const accessToken = response.access_token;
          const expiresIn = response.expires_in || 3600;
          const expiresAt = Date.now() + (expiresIn * 1000);

          // Fetch user profile info
          const profile = await this.fetchUserProfile(accessToken);

          const user: GoogleDriveUser = {
            accessToken,
            expiresAt,
            email: profile?.email,
            name: profile?.name,
            picture: profile?.picture
          };

          this.currentUser = user;
          onTokenReceived(user);
        }
      });
      return true;
    } catch (e) {
      console.error('[GoogleDriveSync] Failed to init token client:', e);
      return false;
    }
  }

  // Prompt user for Google Login
  requestToken() {
    if (this.tokenClient) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      alert('Google Auth client not initialized. Please enter a valid Google OAuth Client ID in Settings.');
    }
  }

  // Fetch Google User Profile info
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

  // Find file ID in Google Drive AppData folder
  private async findBackupFileId(accessToken: string): Promise<string | null> {
    try {
      const query = encodeURIComponent(`name = '${GDRIVE_FILENAME}' and 'appDataFolder' in parents and trashed = false`);
      const url = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id,name,modifiedTime)`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.files && data.files.length > 0) {
          return data.files[0].id;
        }
      }
    } catch (e) {
      console.error('[GoogleDriveSync] Error searching file:', e);
    }
    return null;
  }

  // Upload local database state snapshot to Google Drive AppData
  async uploadToDrive(accessToken: string): Promise<GoogleDriveSyncResult> {
    try {
      const localStoreStr = localStorage.getItem('mosaic-lifeos-store');
      if (!localStoreStr) {
        return { success: false, error: 'No local store data found to upload' };
      }

      const existingFileId = await this.findBackupFileId(accessToken);

      const metadata = {
        name: GDRIVE_FILENAME,
        mimeType: 'application/json',
        parents: existingFileId ? undefined : ['appDataFolder']
      };

      const fileContent = localStoreStr;

      if (existingFileId) {
        // Update existing file
        const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`;
        const res = await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: fileContent
        });

        if (!res.ok) {
          throw new Error(`Google Drive API error: ${res.status} ${res.statusText}`);
        }

        return {
          success: true,
          fileId: existingFileId,
          lastSyncedAt: new Date().toISOString()
        };
      } else {
        // Create new file with multipart upload
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([fileContent], { type: 'application/json' }));

        const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        const res = await fetch(createUrl, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form
        });

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

  // Download & restore database state from Google Drive AppData
  async downloadFromDrive(accessToken: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const existingFileId = await this.findBackupFileId(accessToken);
      if (!existingFileId) {
        return { success: false, error: 'No Mosaic backup file found in your Google Drive AppData folder' };
      }

      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${existingFileId}?alt=media`;
      const res = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!res.ok) {
        throw new Error(`Download error: ${res.status} ${res.statusText}`);
      }

      const contentStr = await res.text();
      const parsed = JSON.parse(contentStr);

      if (parsed) {
        localStorage.setItem('mosaic-lifeos-store', contentStr);
        return { success: true, data: parsed };
      }

      return { success: false, error: 'Invalid Google Drive backup format' };
    } catch (e: any) {
      console.error('[GoogleDriveSync] Download failed:', e);
      return { success: false, error: e?.message || 'Google Drive download failed' };
    }
  }
}

export const googleDriveSync = GoogleDriveSyncService.getInstance();
