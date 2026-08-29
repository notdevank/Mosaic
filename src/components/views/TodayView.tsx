import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  BookOpen, 
  Plus
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTodayStr } from '../../utils/dateUtils';

export const TodayView: React.FC = () => {
  const {
    tasks,
    habits,
    events,
    dailyLogs,
    updateDailyLog,
    toggleTaskStatus,
    toggleHabitDate,
    parseAndAddTask,
    setCurrentView,
  } = useStore();

  const todayStr = getTodayStr();
  const todayDate = new Date();
  const [quickTaskInput, setQuickTaskInput] = useState('');

  const todayLog = dailyLogs[todayStr] || {
    date: todayStr,
    freeformNote: '',
    mood: 7,
    energy: 7,
    wins: [],
    problems: [],
    tomorrowIntention: '',
    manualTimeline: [],
    updatedAt: new Date().toISOString()
  };

  const todayTasks = tasks.filter(t => (!t.dueDate || t.dueDate === todayStr) && t.status !== 'completed');
  const completedTodayTasks = tasks.filter(t => t.status === 'completed' && (!t.dueDate || t.dueDate === todayStr));
  const todayEvents = events.filter(e => e.startDate === todayStr);
  const habitsCompletedToday = habits.filter(h => Boolean(h.completionHistory[todayStr])).length;

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskInput.trim()) return;
    parseAndAddTask(quickTaskInput);
    setQuickTaskInput('');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 animate-in fade-in duration-200">
      {/* Date Header */}
      <header className="border-b border-warm-border dark:border-warm-border-dark pb-5 flex items-end justify-between">
        <div>
          <div className="font-mono text-xs text-primary-secondary uppercase tracking-widest mb-1">
            {format(todayDate, 'EEEE, MMMM d, yyyy')}
          </div>
          <h1 className="font-serif text-3xl font-semibold text-primary-text dark:text-white tracking-tight">
            Today
          </h1>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-primary-secondary">
          <span>{completedTodayTasks.length}/{completedTodayTasks.length + todayTasks.length} Tasks</span>
          <span>•</span>
          <span>{habitsCompletedToday}/{habits.length} Habits</span>
        </div>
      </header>

      {/* Daily Freeform Log */}
      <section className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-primary-secondary">
          <span className="flex items-center gap-2 font-medium text-primary-text dark:text-white">
            <BookOpen className="w-4 h-4 text-sage-500" />
            Daily Log
          </span>
          <span className="text-[10px] opacity-60">Auto-saved</span>
        </div>

        <textarea
          value={todayLog.freeformNote}
          onChange={(e) => updateDailyLog(todayStr, { freeformNote: e.target.value })}
          placeholder="How was today?"
          rows={5}
          className="w-full bg-transparent text-sm leading-relaxed text-primary-text dark:text-white placeholder-primary-secondary focus:outline-none resize-none"
        />

        {/* Mood & Energy */}
        <div className="pt-3 border-t border-warm-border dark:border-warm-border-dark/60 grid grid-cols-2 gap-6 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex justify-between text-primary-secondary">
              <span>Mood</span>
              <span className="text-primary-text dark:text-white font-medium">{todayLog.mood || 7}/10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={todayLog.mood || 7}
              onChange={(e) => updateDailyLog(todayStr, { mood: parseInt(e.target.value, 10) })}
              className="w-full accent-sage-500 h-1.5 bg-warm-subtle dark:bg-warm-subtle-dark rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-primary-secondary">
              <span>Energy</span>
              <span className="text-primary-text dark:text-white font-medium">{todayLog.energy || 7}/10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={todayLog.energy || 7}
              onChange={(e) => updateDailyLog(todayStr, { energy: parseInt(e.target.value, 10) })}
              className="w-full accent-sage-500 h-1.5 bg-warm-subtle dark:bg-warm-subtle-dark rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Today Tasks */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="uppercase tracking-widest text-primary-secondary font-medium">Tasks</span>
          <button onClick={() => setCurrentView('tasks')} className="text-sage-600 dark:text-sage-400 hover:underline">
            All Tasks →
          </button>
        </div>

        <form onSubmit={handleTaskSubmit} className="relative">
          <input
            type="text"
            value={quickTaskInput}
            onChange={(e) => setQuickTaskInput(e.target.value)}
            placeholder="Add task..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark text-xs focus:outline-none focus:border-sage-500 text-primary-text dark:text-white placeholder-primary-secondary"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-sage-600 font-bold">
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl overflow-hidden divide-y divide-warm-border dark:divide-warm-border-dark">
          {todayTasks.length === 0 && completedTodayTasks.length === 0 ? (
            <div className="p-4 text-center text-xs text-primary-secondary font-mono">
              No tasks for today.
            </div>
          ) : (
            <>
              {todayTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-4 py-3 hover:bg-warm-subtle/50 dark:hover:bg-warm-subtle-dark/50 transition-quiet">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleTaskStatus(t.id)}
                      className="w-4 h-4 rounded border border-warm-border dark:border-warm-border-dark hover:border-sage-500 flex items-center justify-center shrink-0"
                    />
                    <span className="text-xs font-medium text-primary-text dark:text-white truncate">{t.title}</span>
                  </div>
                  {t.dueTime && <span className="text-[10px] font-mono text-primary-secondary">{t.dueTime}</span>}
                </div>
              ))}

              {completedTodayTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-4 py-3 opacity-50 bg-warm-subtle/20">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleTaskStatus(t.id)}
                      className="w-4 h-4 rounded bg-sage-500 text-white flex items-center justify-center shrink-0 text-[10px]"
                    >
                      ✓
                    </button>
                    <span className="text-xs font-medium line-through text-primary-secondary truncate">{t.title}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Habits & Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Habits */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="uppercase tracking-widest text-primary-secondary font-medium">Habits</span>
            <span className="text-primary-secondary">{habitsCompletedToday}/{habits.length}</span>
          </div>

          <div className="space-y-2">
            {habits.map((habit) => {
              const done = Boolean(habit.completionHistory[todayStr]);
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabitDate(habit.id, todayStr)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-quiet ${
                    done
                      ? 'bg-sage-500/10 border-sage-500/30 text-sage-700 dark:text-sage-300 font-medium'
                      : 'bg-warm-card dark:bg-warm-card-dark border-warm-border dark:border-warm-border-dark text-primary-text dark:text-white hover:border-sage-500/40'
                  }`}
                >
                  <span className={`truncate ${done ? 'line-through opacity-70' : ''}`}>{habit.name}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    done ? 'bg-sage-500 border-sage-500 text-white text-[9px]' : 'border-warm-border dark:border-warm-border-dark'
                  }`}>
                    {done && '✓'}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Schedule */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="uppercase tracking-widest text-primary-secondary font-medium">Schedule</span>
            <button onClick={() => setCurrentView('calendar')} className="text-sage-600 dark:text-sage-400 hover:underline">
              Calendar →
            </button>
          </div>

          {todayEvents.length === 0 ? (
            <div className="p-4 rounded-xl border border-warm-border dark:border-warm-border-dark text-center text-xs text-primary-secondary font-mono">
              No events today
            </div>
          ) : (
            <div className="space-y-2">
              {todayEvents.map((evt) => (
                <div key={evt.id} className="p-3 rounded-xl bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary-text dark:text-white truncate">{evt.title}</span>
                    <span className="text-[10px] font-mono text-primary-secondary">{evt.startTime || 'All Day'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};
