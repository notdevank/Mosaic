import Database from '@tauri-apps/plugin-sql';
import { StateStorage } from 'zustand/middleware';

let dbInstance: Database | null = null;
let isInitAttempted = false;

// Initialize SQLite database instance
export async function getSQLiteDB(): Promise<Database | null> {
  if (dbInstance) return dbInstance;
  if (isInitAttempted) return null;

  try {
    // Connect to sqlite:mosaic.db stored in ~/.local/share/mosaic/mosaic.db
    dbInstance = await Database.load('sqlite:mosaic.db');
    
    // Create KV store table for structured JSON state persistence
    await dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS kv_store (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create normalized relational tables for analytics & backup queries
    await dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        area_id TEXT,
        due_date TEXT,
        completed INTEGER DEFAULT 0
      );
    `);

    console.log('[SQLite DB] Connected & Initialized mosaic.db successfully');
    return dbInstance;
  } catch (err) {
    console.warn('[SQLite DB] Running in web/fallback mode or Tauri SQL not ready:', err);
    isInitAttempted = true;
    return null;
  }
}

// Clear all SQLite database tables & local web storage
export async function clearSQLiteStorage(): Promise<void> {
  try {
    const db = await getSQLiteDB();
    if (db) {
      await db.execute('DELETE FROM kv_store').catch(() => {});
      await db.execute('DELETE FROM tasks').catch(() => {});
    }
  } catch (e) {
    console.error('[SQLite DB] Wipe error:', e);
  }

  localStorage.clear();
  sessionStorage.clear();
}

// Custom Zustand Storage Adapter for SQLite + LocalStorage Fallback
export const mosaicSQLiteStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const localVal = localStorage.getItem(name);
    const db = await getSQLiteDB();
    if (db) {
      try {
        const result = await db.select<{ value: string }[]>('SELECT value FROM kv_store WHERE key = $1', [name]);
        if (result && result.length > 0) {
          return result[0].value;
        } else if (localVal) {
          // Auto-seed SQLite database with web localStorage data if SQLite entry is empty
          await db.execute(
            'INSERT INTO kv_store (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP',
            [name, localVal]
          );
          return localVal;
        }
      } catch (err) {
        console.error('[SQLite Storage] Error reading item:', err);
      }
    }
    // Fallback to localStorage if not in Tauri
    return localVal;
  },

  setItem: async (name: string, value: string): Promise<void> => {
    const db = await getSQLiteDB();
    if (db) {
      try {
        await db.execute(
          'INSERT INTO kv_store (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP',
          [name, value]
        );
      } catch (err) {
        console.error('[SQLite Storage] Error writing item:', err);
      }
    }
    // Mirror to localStorage for instant web compatibility
    localStorage.setItem(name, value);
  },

  removeItem: async (name: string): Promise<void> => {
    const db = await getSQLiteDB();
    if (db) {
      try {
        await db.execute('DELETE FROM kv_store WHERE key = $1', [name]);
      } catch (err) {
        console.error('[SQLite Storage] Error removing item:', err);
      }
    }
    localStorage.removeItem(name);
  }
};
