import React from 'react';
import { Sparkles, CheckSquare, Target, Repeat, Calendar, FolderKanban, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatDateDisplay } from '../../utils/dateUtils';

export const CustomAreaView: React.FC = () => {
  const { selectedCustomAreaId, areas, tasks, goals, habits, projects, events, setQuickCaptureOpen } = useStore();

  const area = areas.find(a => a.id === selectedCustomAreaId);
  if (!area) return <div className="py-12 text-center text-xs text-primary-secondary">Area not found.</div>;

  const areaTasks = tasks.filter(t => t.areaId === area.id);
  const areaGoals = goals.filter(g => g.areaId === area.id);
  const areaHabits = habits.filter(h => h.areaId === area.id);
  const areaProjects = projects.filter(p => p.areaId === area.id);
  const areaEvents = events.filter(e => e.areaId === area.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sage-500 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">{area.name}</h1>
            <p className="text-xs text-primary-secondary font-mono">{area.description || 'Custom Area Domain'}</p>
          </div>
        </div>

        <button
          onClick={() => setQuickCaptureOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Grid of linked entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="mosaic-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary-secondary">
            <CheckSquare className="w-4 h-4 text-sage-500" />
            <span>Tasks ({areaTasks.length})</span>
          </div>

          <div className="space-y-1.5">
            {areaTasks.map((t) => (
              <div key={t.id} className="p-2.5 rounded-lg bg-warm-subtle flex items-center justify-between text-xs">
                <span>{t.title}</span>
                <span className="font-mono text-[10px] text-primary-secondary">{t.dueDate}</span>
              </div>
            ))}
            {areaTasks.length === 0 && <div className="text-xs text-primary-secondary italic">No tasks in this area.</div>}
          </div>
        </div>

        {/* Goals */}
        <div className="mosaic-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary-secondary">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Goals ({areaGoals.length})</span>
          </div>

          <div className="space-y-1.5">
            {areaGoals.map((g) => (
              <div key={g.id} className="p-2.5 rounded-lg bg-warm-subtle text-xs space-y-1">
                <div className="font-medium">{g.title}</div>
                <div className="w-full bg-warm-border h-1 rounded-full overflow-hidden">
                  <div className="bg-sage-500 h-full" style={{ width: `${g.progress}%` }} />
                </div>
              </div>
            ))}
            {areaGoals.length === 0 && <div className="text-xs text-primary-secondary italic">No goals in this area.</div>}
          </div>
        </div>

        {/* Projects */}
        <div className="mosaic-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary-secondary">
            <FolderKanban className="w-4 h-4 text-blue-600" />
            <span>Projects ({areaProjects.length})</span>
          </div>

          <div className="space-y-1.5">
            {areaProjects.map((p) => (
              <div key={p.id} className="p-2.5 rounded-lg bg-warm-subtle text-xs font-medium">
                {p.name}
              </div>
            ))}
            {areaProjects.length === 0 && <div className="text-xs text-primary-secondary italic">No projects in this area.</div>}
          </div>
        </div>

        {/* Habits */}
        <div className="mosaic-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary-secondary">
            <Repeat className="w-4 h-4 text-amber-600" />
            <span>Habits ({areaHabits.length})</span>
          </div>

          <div className="space-y-1.5">
            {areaHabits.map((h) => (
              <div key={h.id} className="p-2.5 rounded-lg bg-warm-subtle text-xs font-medium">
                {h.name}
              </div>
            ))}
            {areaHabits.length === 0 && <div className="text-xs text-primary-secondary italic">No habits in this area.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
