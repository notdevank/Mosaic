import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, Plus, Trash2, Sparkles, ChevronLeft, ChevronRight, Award, AlertTriangle, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTodayStr, formatDateDisplay, formatDayHeader } from '../../utils/dateUtils';
import { parseISO, subYears, format } from 'date-fns';

export const DailyLogView: React.FC = () => {
  const { 
    dailyLogs, 
    updateDailyLog, 
    addWinToLog, 
    removeWinFromLog, 
    addProblemToLog, 
    removeProblemFromLog,
    tasks,
    activities,
    workoutLogs,
    getOrCreateDailyLog
  } = useStore();

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [newWin, setNewWin] = useState('');
  const [newProblem, setNewProblem] = useState('');

  const currentLog = getOrCreateDailyLog(selectedDate);
  const todayStr = getTodayStr();

  const handlePrevDay = () => {
    const d = parseISO(selectedDate);
    const prev = new Date(d.setDate(d.getDate() - 1));
    setSelectedDate(format(prev, 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const d = parseISO(selectedDate);
    const next = new Date(d.setDate(d.getDate() + 1));
    setSelectedDate(format(next, 'yyyy-MM-dd'));
  };

  // Automatically collated activities for selected date
  const dayActivities = activities.filter(a => a.timestamp.startsWith(selectedDate));
  const dayTasksDone = tasks.filter(t => t.completedAt && t.completedAt.startsWith(selectedDate));
  const dayWorkouts = workoutLogs.filter(w => w.date === selectedDate);

  // On This Day (1 year ago)
  const oneYearAgoStr = format(subYears(parseISO(selectedDate), 1), 'yyyy-MM-dd');
  const pastYearLog = dailyLogs[oneYearAgoStr];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 animate-in fade-in duration-200">
      {/* Date Switcher Bar */}
      <div className="flex items-center justify-between border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg border border-warm-border dark:border-warm-border-dark text-primary-secondary hover:text-primary-text transition-quiet"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="font-mono text-xs text-primary-secondary uppercase tracking-widest block">
              {formatDayHeader(selectedDate)}
            </span>
            <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">
              {selectedDate === todayStr ? 'Today\'s Daily Log' : formatDateDisplay(selectedDate)}
            </h1>
          </div>
          <button 
            onClick={handleNextDay}
            className="p-1.5 rounded-lg border border-warm-border dark:border-warm-border-dark text-primary-secondary hover:text-primary-text transition-quiet"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {selectedDate !== todayStr && (
          <button
            onClick={() => setSelectedDate(todayStr)}
            className="px-3 py-1 text-xs font-mono border border-warm-border dark:border-warm-border-dark rounded-lg text-sage-600 font-medium"
          >
            Go to Today
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Journal & Metrics (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Freeform Writing Box */}
          <div className="mosaic-card p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-primary-secondary">
              <span>Reflections & Thoughts</span>
              <span className="text-[10px] text-primary-secondary">Auto-saved</span>
            </div>
            <textarea
              value={currentLog.freeformNote}
              onChange={(e) => updateDailyLog(selectedDate, { freeformNote: e.target.value })}
              placeholder="What happened today? How did things feel? Write freely..."
              rows={8}
              className="w-full bg-transparent text-sm leading-relaxed text-primary-text dark:text-primary-text-dark placeholder-primary-secondary focus:outline-none resize-y"
            />
          </div>

          {/* Mood / Energy / Focus Sliders */}
          <div className="mosaic-card p-5 space-y-4">
            <div className="text-xs font-mono uppercase text-primary-secondary">
              Daily Metrics (1 - 10)
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Mood */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>Mood</span>
                  <span className="font-bold text-sage-600">{currentLog.mood || '-'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentLog.mood || 5}
                  onChange={(e) => updateDailyLog(selectedDate, { mood: Number(e.target.value) })}
                  className="w-full accent-sage-500 cursor-pointer"
                />
              </div>

              {/* Energy */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>Energy</span>
                  <span className="font-bold text-sage-600">{currentLog.energy || '-'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentLog.energy || 5}
                  onChange={(e) => updateDailyLog(selectedDate, { energy: Number(e.target.value) })}
                  className="w-full accent-sage-500 cursor-pointer"
                />
              </div>

              {/* Focus */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>Focus</span>
                  <span className="font-bold text-sage-600">{currentLog.focus || '-'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentLog.focus || 5}
                  onChange={(e) => updateDailyLog(selectedDate, { focus: Number(e.target.value) })}
                  className="w-full accent-sage-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Wins & Problems */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wins */}
            <div className="mosaic-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-sage-600">
                <Award className="w-4 h-4" />
                <span>Wins</span>
              </div>

              <div className="space-y-1.5">
                {currentLog.wins.map((win, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-warm-subtle dark:bg-warm-subtle-dark">
                    <span>• {win}</span>
                    <button onClick={() => removeWinFromLog(selectedDate, idx)} className="text-primary-secondary hover:text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add a win..."
                  value={newWin}
                  onChange={(e) => setNewWin(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newWin.trim()) {
                      e.preventDefault();
                      addWinToLog(selectedDate, newWin.trim());
                      setNewWin('');
                    }
                  }}
                  className="flex-1 bg-warm-subtle border-none rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Problems */}
            <div className="mosaic-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary-text dark:text-primary-text-dark">
                <AlertTriangle className="w-4 h-4 text-sage-600" />
                <span>Challenges / Friction</span>
              </div>

              <div className="space-y-1.5">
                {currentLog.problems.map((prob, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-warm-subtle dark:bg-warm-subtle-dark">
                    <span>• {prob}</span>
                    <button onClick={() => removeProblemFromLog(selectedDate, idx)} className="text-primary-secondary hover:text-primary-text">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add friction point..."
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newProblem.trim()) {
                      e.preventDefault();
                      addProblemToLog(selectedDate, newProblem.trim());
                      setNewProblem('');
                    }
                  }}
                  className="flex-1 bg-warm-subtle border-none rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Collated Activities & On This Day */}
        <div className="space-y-6">
          {/* Automatic Activities Stream */}
          <div className="mosaic-card p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-primary-secondary border-b border-warm-border pb-2">
              <span>Automatic Activity Record</span>
              <Sparkles className="w-3.5 h-3.5 text-sage-500" />
            </div>

            <div className="space-y-2 text-xs">
              {/* Workouts */}
              {dayWorkouts.map((w) => (
                <div key={w.id} className="p-2.5 rounded-lg border border-sage-500/30 bg-sage-500/5 space-y-1">
                  <div className="font-medium text-sage-700 dark:text-sage-300">🏋️ Workout: {w.name}</div>
                  <div className="text-[11px] font-mono text-primary-secondary">{w.durationMinutes} min session</div>
                </div>
              ))}

              {/* Study / Activities */}
              {dayActivities.map((act) => (
                <div key={act.id} className="p-2.5 rounded-lg border border-warm-border dark:border-warm-border-dark space-y-0.5">
                  <div className="font-medium text-primary-text dark:text-primary-text-dark">{act.title}</div>
                  {act.durationMinutes > 0 && (
                    <div className="text-[10px] font-mono text-primary-secondary">{act.durationMinutes} minutes</div>
                  )}
                </div>
              ))}

              {/* Tasks completed */}
              {dayTasksDone.map((t) => (
                <div key={t.id} className="p-2 rounded-lg bg-warm-subtle dark:bg-warm-subtle-dark text-primary-text">
                  ✓ {t.title}
                </div>
              ))}

              {dayActivities.length === 0 && dayTasksDone.length === 0 && dayWorkouts.length === 0 && (
                <div className="py-4 text-center text-xs text-primary-secondary">
                  No automated activity recorded for this day yet.
                </div>
              )}
            </div>
          </div>

          {/* On This Day Memory Drawer */}
          <div className="mosaic-card p-5 space-y-3 border-warm-border dark:border-warm-border-dark bg-warm-subtle/40 dark:bg-warm-subtle-dark/40">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-sage-600 dark:text-sage-300 font-medium">
              <BookOpen className="w-4 h-4" />
              <span>On This Day (1 Year Ago)</span>
            </div>

            {pastYearLog ? (
              <div className="space-y-2 text-xs">
                <div className="font-serif italic text-primary-text dark:text-primary-text-dark">
                  "{pastYearLog.freeformNote}"
                </div>
                <div className="text-[10px] font-mono text-primary-secondary">
                  Logged on {oneYearAgoStr}
                </div>
              </div>
            ) : (
              <div className="text-xs text-primary-secondary italic">
                No past logs recorded for this day in previous years. Keep logging to build your long-term memory!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
