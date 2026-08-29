import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckSquare, BookOpen, ArrowRight, Repeat } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTodayStr } from '../../utils/dateUtils';

function getGreetingText(customGreeting?: string) {
  if (customGreeting && customGreeting.trim()) {
    return customGreeting.trim();
  }
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good Morning';
  if (h >= 12 && h < 17) return 'Good Afternoon';
  if (h >= 17 && h < 21) return 'Good Evening';
  return 'Late Night';
}

export const HomeView: React.FC = () => {
  const {
    userSettings,
    tasks,
    habits,
    goals,
    dailyLogs,
    events,
    toggleTaskStatus,
    toggleHabitDate,
    setCurrentView,
    setQuickCaptureOpen,
  } = useStore();

  const todayStr = getTodayStr();

  // Live clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Data
  const todayTasks = tasks.filter(t => (!t.dueDate || t.dueDate === todayStr) && t.status !== 'completed');
  const completedToday = tasks.filter(t => t.status === 'completed' && (!t.dueDate || t.dueDate === todayStr));
  const todayEvents = events.filter(e => e.startDate === todayStr);
  const habitsDone = habits.filter(h => Boolean(h.completionHistory[todayStr])).length;
  const activeGoals = goals.filter(g => g.status === 'active');
  const todayLog = dailyLogs[todayStr];

  // Day progress (how far through the waking day — 6am to midnight)
  const dayProgress = Math.min(100, Math.max(0, ((time.getHours() - 6) / 18) * 100));

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-14 animate-in fade-in duration-300">

      {/* ── EDITORIAL HEADER ── open, no box, just typography */}
      <header className="space-y-6">
        {/* Dateline */}
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-secondary dark:text-stone-500">
          {format(time, 'EEEE, MMMM d, yyyy')}
        </div>

        {/* Giant greeting */}
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-primary-text dark:text-primary-text-dark tracking-tight leading-[1.1]">
            {getGreetingText(userSettings.greeting)},
          </h1>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-sage-600 dark:text-sage-400 tracking-tight leading-[1.1]">
            {userSettings.userName || 'Devank'}.
          </h1>
        </div>

        {/* Day progress — thin subtle line */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-primary-secondary dark:text-stone-500 uppercase tracking-widest">
            <span>{format(time, 'hh:mm a')}</span>
            <span>Day Progress</span>
          </div>
          <div className="w-full h-[2px] rounded-full bg-warm-border/60 dark:bg-[#1E1E22] overflow-hidden">
            <div
              className="h-full rounded-full bg-sage-500/60 dark:bg-sage-500/40 transition-all duration-1000"
              style={{ width: `${dayProgress}%` }}
            />
          </div>
        </div>
      </header>

      {/* ── SNAPSHOT TILES ── warm, rounded, open feel */}
      <section className="grid grid-cols-3 gap-3">
        <SnapshotTile
          label="Tasks"
          value={`${completedToday.length}`}
          sub={`of ${completedToday.length + todayTasks.length}`}
          onClick={() => setCurrentView('tasks')}
        />
        <SnapshotTile
          label="Habits"
          value={`${habitsDone}`}
          sub={`of ${habits.length}`}
          onClick={() => setCurrentView('habits')}
        />
        <SnapshotTile
          label="Goals"
          value={`${activeGoals.length}`}
          sub="active"
          onClick={() => setCurrentView('goals')}
        />
      </section>

      {/* ── UPCOMING EVENTS ── */}
      {todayEvents.length > 0 && (
        <Section title="Today's Schedule" action="Calendar" onAction={() => setCurrentView('calendar')}>
          <div className="space-y-2">
            {todayEvents.map(evt => (
              <div
                key={evt.id}
                className="flex items-center gap-4 py-3 px-4 rounded-xl bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark"
              >
                <div
                  className="w-1 h-8 rounded-full shrink-0"
                  style={{ backgroundColor: evt.color || 'var(--accent-sage)' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-primary-text dark:text-primary-text-dark truncate">{evt.title}</div>
                  {evt.location && <div className="text-[10px] text-primary-secondary truncate">{evt.location}</div>}
                </div>
                <span className="text-[10px] font-mono text-primary-secondary shrink-0">{evt.startTime || 'All Day'}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── TASKS ── */}
      <Section title="Tasks" action={todayTasks.length + completedToday.length > 0 ? 'View All' : undefined} onAction={() => setCurrentView('tasks')}>
        {todayTasks.length === 0 && completedToday.length === 0 ? (
          <button
            onClick={() => setQuickCaptureOpen(true)}
            className="w-full py-6 rounded-xl border border-dashed border-warm-border dark:border-warm-border-dark text-xs text-primary-secondary hover:text-sage-600 dark:hover:text-sage-400 transition-quiet font-mono"
          >
            + Capture a task
          </button>
        ) : (
          <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl overflow-hidden divide-y divide-warm-border dark:divide-warm-border-dark">
            {todayTasks.map(task => (
              <TaskRow key={task.id} title={task.title} done={false} time={task.dueTime} priority={task.priority} onToggle={() => toggleTaskStatus(task.id)} />
            ))}
            {completedToday.map(task => (
              <TaskRow key={task.id} title={task.title} done time={task.dueTime} priority={task.priority} onToggle={() => toggleTaskStatus(task.id)} />
            ))}
          </div>
        )}
      </Section>

      {/* ── HABITS ── */}
      {habits.length > 0 && (
        <Section title="Habits" trailing={<span className="text-sage-600 dark:text-sage-400 font-mono text-[10px]">{habitsDone} / {habits.length}</span>}>
          <div className="grid grid-cols-2 gap-2">
            {habits.map(habit => {
              const done = Boolean(habit.completionHistory[todayStr]);
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabitDate(habit.id, todayStr)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition-quiet ${
                    done
                      ? 'bg-sage-500/8 dark:bg-sage-500/12 border-sage-500/25 text-sage-700 dark:text-sage-300'
                      : 'bg-warm-card dark:bg-warm-card-dark border-warm-border dark:border-warm-border-dark text-primary-text dark:text-primary-text-dark hover:border-sage-500/30'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-quiet ${
                    done ? 'bg-sage-500 border-sage-500 text-white' : 'border-warm-border dark:border-warm-border-dark'
                  }`}>
                    {done && <span className="text-[8px]">✓</span>}
                  </div>
                  <span className={`font-medium truncate ${done ? 'line-through opacity-50' : ''}`}>{habit.name}</span>
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {/* ── GOALS ── */}
      {activeGoals.length > 0 && (
        <Section title="Focus Goals" action="All" onAction={() => setCurrentView('goals')}>
          <div className="space-y-3">
            {activeGoals.slice(0, 3).map(goal => (
              <div key={goal.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary-text dark:text-primary-text-dark truncate">{goal.title}</span>
                  <span className="text-[10px] font-mono text-primary-secondary tabular-nums ml-3 shrink-0">{goal.progress}%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-warm-subtle dark:bg-warm-subtle-dark overflow-hidden">
                  <div
                    className="h-full rounded-full bg-sage-500 transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── DAILY LOG REFLECTION ── */}
      <div
        onClick={() => setCurrentView('daily-log')}
        className="group cursor-pointer rounded-2xl border border-warm-border dark:border-warm-border-dark bg-warm-card dark:bg-warm-card-dark p-5 flex items-center justify-between transition-all duration-200 hover:border-sage-500/40 shadow-xs"
      >
        <div className="space-y-1.5 min-w-0 pr-4">
          <div className="flex items-center gap-2 text-xs font-mono text-primary-secondary">
            <BookOpen className="w-3.5 h-3.5 text-sage-500" />
            <span className="font-medium">Daily Reflection</span>
            {todayLog?.mood && (
              <>
                <span>•</span>
                <span className="text-sage-600 dark:text-sage-400 font-semibold">Mood {todayLog.mood}/10</span>
              </>
            )}
          </div>
          <p className="font-serif italic text-sm text-primary-text dark:text-zinc-200 line-clamp-2 leading-relaxed">
            {todayLog?.freeformNote || 'Write your thoughts and reflections for today...'}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-warm-subtle dark:bg-warm-subtle-dark flex items-center justify-center group-hover:bg-sage-500 group-hover:text-white text-sage-600 transition-all shrink-0">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

/* ── Subcomponents ─────────────────────────────────────────── */

const Section: React.FC<{
  title: string;
  action?: string;
  onAction?: () => void;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, action, onAction, trailing, children }) => (
  <section className="space-y-3">
    <div className="flex items-center justify-between">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-secondary dark:text-stone-500">{title}</h2>
      {trailing}
      {action && onAction && (
        <button onClick={onAction} className="text-[10px] font-mono text-sage-600 dark:text-sage-400 hover:underline uppercase tracking-widest">
          {action} →
        </button>
      )}
    </div>
    {children}
  </section>
);

const SnapshotTile: React.FC<{
  label: string;
  value: string;
  sub: string;
  onClick?: () => void;
}> = ({ label, value, sub, onClick }) => (
  <button
    onClick={onClick}
    className="text-left p-4 rounded-xl bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark hover:border-sage-500/30 transition-quiet space-y-1"
  >
    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary-secondary dark:text-stone-500">{label}</div>
    <div className="flex items-baseline gap-1">
      <span className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark tabular-nums">{value}</span>
      <span className="text-[10px] font-mono text-primary-secondary">{sub}</span>
    </div>
  </button>
);

const TaskRow: React.FC<{
  title: string;
  done: boolean;
  time?: string;
  priority?: string;
  onToggle: () => void;
}> = ({ title, done, time, priority, onToggle }) => (
  <div className={`flex items-center justify-between px-4 py-3 transition-quiet ${
    done ? 'opacity-40' : 'hover:bg-warm-subtle/50 dark:hover:bg-warm-subtle-dark/50'
  }`}>
    <div className="flex items-center gap-3 min-w-0">
      <button
        onClick={onToggle}
        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-quiet ${
          done ? 'bg-sage-500 border-sage-500 text-white' : 'border-warm-border dark:border-warm-border-dark hover:border-sage-500'
        }`}
      >
        {done && <CheckSquare className="w-2.5 h-2.5" />}
      </button>
      <span className={`text-xs truncate ${done ? 'line-through text-primary-secondary' : 'font-medium text-primary-text dark:text-primary-text-dark'}`}>
        {title}
      </span>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {time && <span className="text-[10px] font-mono text-primary-secondary">{time}</span>}
      {priority === 'high' && !done && <span className="w-1.5 h-1.5 rounded-full bg-sage-600 dark:bg-sage-400" />}
    </div>
  </div>
);
