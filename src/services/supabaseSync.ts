import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

class SupabaseSyncService {
  private client: SupabaseClient | null = null;
  private isConnected = false;

  init(config: SupabaseConfig): boolean {
    if (!config.url || !config.anonKey) {
      this.client = null;
      this.isConnected = false;
      return false;
    }

    try {
      this.client = createClient(config.url, config.anonKey);
      this.isConnected = true;
      return true;
    } catch (err) {
      console.error('[SupabaseSync] Failed to initialize Supabase client:', err);
      this.client = null;
      this.isConnected = false;
      return false;
    }
  }

  getClient(): SupabaseClient | null {
    return this.client;
  }

  isConfigured(): boolean {
    return this.isConnected && this.client !== null;
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.client) {
      return { success: false, message: 'Supabase client is not initialized' };
    }

    try {
      const { data, error } = await this.client.from('profiles').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is no rows found, which still proves connection works
        return { success: false, message: error.message };
      }
      return { success: true, message: 'Connected to Supabase successfully' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Connection test failed' };
    }
  }

  async pushLocalState(state: any): Promise<{ success: boolean; error?: string }> {
    if (!this.client) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const user = (await this.client.auth.getUser()).data.user;
      if (!user) {
        return { success: false, error: 'User not authenticated in Supabase' };
      }

      const userId = user.id;

      // Sync Tasks
      if (state.tasks && Array.isArray(state.tasks)) {
        const taskRows = state.tasks.map((t: any) => ({
          id: t.id,
          user_id: userId,
          project_id: t.projectId || null,
          area_id: t.areaId || null,
          goal_id: t.goalId || null,
          title: t.title,
          description: t.description || null,
          due_date: t.dueDate || null,
          due_time: t.dueTime || null,
          priority: t.priority || 'medium',
          status: t.status || 'todo',
          recurrence: t.recurrence || null,
          subtasks: t.subtasks || [],
          notes: t.notes || null,
          completed_at: t.completedAt || null,
        }));
        if (taskRows.length > 0) {
          await this.client.from('tasks').upsert(taskRows);
        }
      }

      // Sync Journal Entries
      if (state.journalEntries && Array.isArray(state.journalEntries)) {
        const journalRows = state.journalEntries.map((j: any) => ({
          id: j.id,
          user_id: userId,
          title: j.title || null,
          content: j.content,
          mood: j.mood || null,
          tags: j.tags || [],
          area_id: j.areaId || null,
          created_at: j.createdAt,
          updated_at: j.updatedAt || j.createdAt,
        }));
        if (journalRows.length > 0) {
          await this.client.from('journal_entries').upsert(journalRows);
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Sync failed' };
    }
  }
}

export const supabaseSync = new SupabaseSyncService();
