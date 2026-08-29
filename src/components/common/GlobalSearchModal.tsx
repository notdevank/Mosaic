import React, { useState, useEffect } from 'react';
import { Search, X, CheckSquare, Target, Calendar, FolderKanban, BookOpen, User, Dumbbell, GraduationCap } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ViewType } from '../../types';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  view: ViewType;
  customAreaId?: string;
  icon: React.ReactNode;
}

export const GlobalSearchModal: React.FC = () => {
  const { 
    isGlobalSearchOpen, 
    setGlobalSearchOpen, 
    setCurrentView,
    tasks, 
    events, 
    goals, 
    projects, 
    dailyLogs, 
    courses, 
    workoutLogs, 
    people 
  } = useStore();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!isGlobalSearchOpen);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const results: SearchResult[] = [];

  if (query.trim().length > 0) {
    const q = query.toLowerCase();

    tasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)).forEach(t => {
      results.push({
        id: t.id,
        type: 'Task',
        title: t.title,
        subtitle: t.dueDate ? `Due ${t.dueDate}` : 'Task',
        view: 'tasks',
        icon: <CheckSquare className="w-4 h-4 text-sage-500" />
      });
    });

    events.filter(e => e.title.toLowerCase().includes(q)).forEach(e => {
      results.push({
        id: e.id,
        type: 'Event',
        title: e.title,
        subtitle: e.startDate,
        view: 'calendar',
        icon: <Calendar className="w-4 h-4 text-sage-500" />
      });
    });

    goals.filter(g => g.title.toLowerCase().includes(q) || g.description?.toLowerCase().includes(q)).forEach(g => {
      results.push({
        id: g.id,
        type: 'Goal',
        title: g.title,
        subtitle: `${g.progress}% completed`,
        view: 'goals',
        icon: <Target className="w-4 h-4 text-sage-500" />
      });
    });

    projects.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)).forEach(p => {
      results.push({
        id: p.id,
        type: 'Project',
        title: p.name,
        subtitle: p.status,
        view: 'projects',
        icon: <FolderKanban className="w-4 h-4 text-sage-500" />
      });
    });

    courses.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)).forEach(c => {
      results.push({
        id: c.id,
        type: 'Course',
        title: `${c.code} — ${c.name}`,
        subtitle: c.instructor,
        view: 'academics',
        icon: <GraduationCap className="w-4 h-4 text-sage-500" />
      });
    });

    workoutLogs.filter(w => w.name.toLowerCase().includes(q) || w.notes?.toLowerCase().includes(q)).forEach(w => {
      results.push({
        id: w.id,
        type: 'Workout',
        title: w.name,
        subtitle: `${w.date} (${w.durationMinutes}m)`,
        view: 'gym',
        icon: <Dumbbell className="w-4 h-4 text-sage-500" />
      });
    });

    people.filter(p => p.name.toLowerCase().includes(q) || p.relationshipContext.toLowerCase().includes(q)).forEach(p => {
      results.push({
        id: p.id,
        type: 'Person',
        title: p.name,
        subtitle: p.relationshipContext,
        view: 'communication',
        icon: <User className="w-4 h-4 text-sage-500" />
      });
    });

    Object.values(dailyLogs).filter(l => l.freeformNote?.toLowerCase().includes(q)).forEach(l => {
      results.push({
        id: l.date,
        type: 'Daily Log',
        title: `Daily Log: ${l.date}`,
        subtitle: l.freeformNote.slice(0, 60) + '...',
        view: 'daily-log',
        icon: <BookOpen className="w-4 h-4 text-sage-500" />
      });
    });
  }

  const handleSelect = (res: SearchResult) => {
    setCurrentView(res.view, res.customAreaId);
    setGlobalSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div 
        className="bg-warm-bg dark:bg-warm-bg-dark border border-warm-border dark:border-warm-border-dark rounded-2xl w-full max-w-xl shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-warm-border dark:border-warm-border-dark gap-3">
          <Search className="w-4 h-4 text-primary-secondary dark:text-stone-300" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, goals, courses, logs, people..."
            className="w-full bg-transparent text-sm text-primary-text dark:text-primary-text-dark placeholder-primary-secondary focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-primary-secondary hover:text-primary-text dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List / Command Palette Actions */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim().length === 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-primary-secondary">
                Quick Actions
              </div>
              <button
                onClick={() => { setGlobalSearchOpen(false); useStore.getState().setQuickCaptureOpen(true); }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark text-left"
              >
                <div className="flex items-center gap-3 text-xs font-medium text-primary-text dark:text-white">
                  <CheckSquare className="w-4 h-4 text-sage-500" />
                  <span>Quick Capture (Thought, Task, Note)</span>
                </div>
                <span className="text-[10px] font-mono text-primary-secondary">Ctrl + C</span>
              </button>

              <button
                onClick={() => { setGlobalSearchOpen(false); setCurrentView('journal'); }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark text-left"
              >
                <div className="flex items-center gap-3 text-xs font-medium text-primary-text dark:text-white">
                  <BookOpen className="w-4 h-4 text-sage-500" />
                  <span>Write Journal Entry</span>
                </div>
                <span className="text-[10px] font-mono text-primary-secondary">Go to Journal</span>
              </button>

              <button
                onClick={() => { setGlobalSearchOpen(false); setCurrentView('today'); }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark text-left"
              >
                <div className="flex items-center gap-3 text-xs font-medium text-primary-text dark:text-white">
                  <Calendar className="w-4 h-4 text-sage-500" />
                  <span>Open Today’s Canvas</span>
                </div>
                <span className="text-[10px] font-mono text-primary-secondary">Go to Today</span>
              </button>

              <button
                onClick={() => { setGlobalSearchOpen(false); setCurrentView('archive'); }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark text-left"
              >
                <div className="flex items-center gap-3 text-xs font-medium text-primary-text dark:text-white">
                  <FolderKanban className="w-4 h-4 text-sage-500" />
                  <span>Open Life Archive</span>
                </div>
                <span className="text-[10px] font-mono text-primary-secondary">Go to Archive</span>
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-primary-secondary dark:text-stone-300">
              No results found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res) => (
                <button
                  key={`${res.type}-${res.id}`}
                  onClick={() => handleSelect(res)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark transition-quiet text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-warm-subtle dark:bg-warm-subtle-dark group-hover:bg-warm-bg">
                      {res.icon}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-primary-text dark:text-primary-text-dark">
                        {res.title}
                      </div>
                      {res.subtitle && (
                        <div className="text-[11px] text-primary-secondary dark:text-stone-300">
                          {res.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300 px-2 py-0.5 rounded border border-warm-border dark:border-warm-border-dark">
                    {res.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
