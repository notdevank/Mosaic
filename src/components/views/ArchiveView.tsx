import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckSquare, FolderKanban, BookOpen, Target } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ArchiveView: React.FC = () => {
  const { 
    tasks, 
    projects, 
    journalEntries, 
    goals
  } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'projects' | 'tasks' | 'journal' | 'goals'>('all');

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const completedProjects = projects.filter(p => p.status === 'completed' || p.status === 'archived');
  const completedGoals = goals.filter(g => g.status === 'completed' || g.status === 'archived');

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-warm-border dark:border-warm-border-dark pb-4">
        <h1 className="font-serif text-3xl font-semibold text-primary-text dark:text-white tracking-tight">
          Archive
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-warm-border dark:border-warm-border-dark pb-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All' },
          { id: 'projects', label: `Projects (${completedProjects.length})` },
          { id: 'tasks', label: `Tasks (${completedTasks.length})` },
          { id: 'journal', label: `Journal (${journalEntries?.length || 0})` },
          { id: 'goals', label: `Goals (${completedGoals.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-quiet shrink-0 ${
              activeTab === tab.id
                ? 'bg-sage-500 text-white font-semibold'
                : 'text-primary-secondary hover:text-primary-text hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="space-y-6">
        {(activeTab === 'all' || activeTab === 'projects') && completedProjects.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary-secondary flex items-center gap-2">
              <FolderKanban className="w-3.5 h-3.5 text-sage-500" />
              Completed Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {completedProjects.map((p) => (
                <div key={p.id} className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary-text dark:text-white">{p.name}</span>
                    <span className="text-[10px] font-mono text-sage-600 bg-sage-500/10 px-2 py-0.5 rounded-full">Completed</span>
                  </div>
                  {p.description && <p className="text-xs text-primary-secondary">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'goals') && completedGoals.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary-secondary flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-sage-500" />
              Goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {completedGoals.map((g) => (
                <div key={g.id} className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary-text dark:text-white">{g.title}</span>
                    <span className="text-[10px] font-mono text-sage-600 bg-sage-500/10 px-2 py-0.5 rounded-full">Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'journal') && (journalEntries || []).length > 0 && (
          <section className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary-secondary flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-sage-500" />
              Journal
            </h2>
            <div className="space-y-2">
              {(journalEntries || []).slice(0, 10).map((j) => (
                <div key={j.id} className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl p-3 flex items-center justify-between">
                  <div className="space-y-0.5 min-w-0 pr-4">
                    <div className="text-xs font-semibold text-primary-text dark:text-white truncate">{j.title || 'Untitled Entry'}</div>
                    <p className="text-xs text-primary-secondary line-clamp-1">{j.content}</p>
                  </div>
                  <span className="text-[10px] font-mono text-primary-secondary shrink-0">
                    {format(new Date(j.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'tasks') && completedTasks.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary-secondary flex items-center gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-sage-500" />
              Completed Tasks
            </h2>
            <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl divide-y divide-warm-border dark:divide-warm-border-dark max-h-96 overflow-y-auto">
              {completedTasks.map((t) => (
                <div key={t.id} className="px-4 py-2.5 flex items-center justify-between text-xs opacity-75">
                  <div className="flex items-center gap-2">
                    <span className="text-sage-600 font-bold">✓</span>
                    <span className="line-through text-primary-text dark:text-white font-medium">{t.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
