import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  AlertTriangle, 
  Check,
  Sparkles
} from 'lucide-react';
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
    workoutLogs
  } = useStore();

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [newWin, setNewWin] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const todayStr = getTodayStr();

  // Reactive current log computation with safe fallbacks
  const rawLog = dailyLogs[selectedDate];
  const currentLog = {
    date: selectedDate,
    freeformNote: rawLog?.freeformNote || '',
    mood: rawLog?.mood || 7,
    energy: rawLog?.energy || 7,
    focus: rawLog?.focus || 7,
    wins: rawLog?.wins || [],
    problems: rawLog?.problems || [],
    tomorrowIntention: rawLog?.tomorrowIntention || '',
    manualTimeline: rawLog?.manualTimeline || [],
    updatedAt: rawLog?.updatedAt || new Date().toISOString()
  };

  const triggerSaveStatus = () => {
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 1500);
  };

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

  const handleAddWin = () => {
    if (!newWin.trim()) return;
    addWinToLog(selectedDate, newWin.trim());
    setNewWin('');
    triggerSaveStatus();
  };

  const handleAddProblem = () => {
    if (!newProblem.trim()) return;
    addProblemToLog(selectedDate, newProblem.trim());
    setNewProblem('');
    triggerSaveStatus();
  };

  // Automatically collated activities for selected date
  const dayActivities = activities.filter(a => a.timestamp && a.timestamp.startsWith(selectedDate));
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
              {selectedDate === todayStr ? "Today's Daily Log" : formatDateDisplay(selectedDate)}
            </h1>
          </div>
          <button 
            onClick={handleNextDay}
            className="p-1.5 rounded-lg border border-warm-border dark:border-warm-border-dark text-primary-secondary hover:text-primary-text transition-quiet"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {showSavedMsg && (
            <span className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          {selectedDate !== todayStr && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="px-3 py-1 text-xs font-mono border border-warm-border dark:border-warm-border-dark rounded-lg text-sage-600 font-medium hover:border-sage-500"
            >
              Go to Today
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Journal & Metrics (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Freeform Writing Box */}
          <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono text-primary-secondary">
              <span className="font-medium text-primary-text dark:text-white">Reflections</span>
              <span className="text-[10px] opacity-60">Auto-saved</span>
            </div>
            <textarea
              value={currentLog.freeformNote}
              onChange={(e) => {
                updateDailyLog(selectedDate, { freeformNote: e.target.value });
                triggerSaveStatus();
              }}
              placeholder="What happened today? How did things feel? Write freely..."
              rows={7}
              className="w-full bg-transparent text-sm leading-relaxed text-primary-text dark:text-primary-text-dark placeholder-primary-secondary focus:outline-none resize-y"
            />
          </div>

          {/* Mood / Energy / Focus Sliders */}
          <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="text-xs font-mono text-primary-secondary font-medium">
              Daily Metrics (1 – 10)
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Mood */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-primary-secondary">Mood</span>
                  <span className="font-bold text-sage-600">{currentLog.mood}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentLog.mood}
                  onChange={(e) => {
                    updateDailyLog(selectedDate, { mood: Number(e.target.value) });
                    triggerSaveStatus();
                  }}
                  className="w-full accent-sage-500 cursor-pointer h-1.5 bg-warm-subtle dark:bg-warm-subtle-dark rounded-lg appearance-none"
                />
              </div>

              {/* Energy */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-primary-secondary">Energy</span>
                  <span className="font-bold text-sage-600">{currentLog.energy}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentLog.energy}
                  onChange={(e) => {
                    updateDailyLog(selectedDate, { energy: Number(e.target.value) });
                    triggerSaveStatus();
                  }}
                  className="w-full accent-sage-500 cursor-pointer h-1.5 bg-warm-subtle dark:bg-warm-subtle-dark rounded-lg appearance-none"
                />
              </div>

              {/* Focus */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-primary-secondary">Focus</span>
                  <span className="font-bold text-sage-600">{currentLog.focus}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentLog.focus}
                  onChange={(e) => {
                    updateDailyLog(selectedDate, { focus: Number(e.target.value) });
                    triggerSaveStatus();
                  }}
                  className="w-full accent-sage-500 cursor-pointer h-1.5 bg-warm-subtle dark:bg-warm-subtle-dark rounded-lg appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Wins & Problems */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Wins */}
            <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-sage-600 dark:text-sage-400 font-semibold">
                <Award className="w-4 h-4 text-sage-500" />
                <span>Wins</span>
              </div>

              <div className="space-y-1.5">
                {currentLog.wins.length === 0 ? (
                  <div className="text-[11px] font-mono text-primary-secondary py-1">No wins added yet</div>
                ) : (
                  currentLog.wins.map((win, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-warm-subtle/60 dark:bg-warm-subtle-dark/60 text-primary-text dark:text-white">
                      <span className="truncate pr-2">• {win}</span>
                      <button 
                        onClick={() => {
                          removeWinFromLog(selectedDate, idx);
                          triggerSaveStatus();
                        }} 
                        className="text-primary-secondary hover:text-red-500 shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Input + Button */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add a win..."
                  value={newWin}
                  onChange={(e) => setNewWin(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddWin();
                    }
                  }}
                  className="flex-1 bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-1.5 text-xs text-primary-text dark:text-white focus:outline-none focus:border-sage-500"
                />
                <button
                  type="button"
                  onClick={handleAddWin}
                  className="p-1.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold transition-quiet"
                  title="Add win"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Challenges / Friction */}
            <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary-text dark:text-primary-text-dark font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Challenges / Friction</span>
              </div>

              <div className="space-y-1.5">
                {currentLog.problems.length === 0 ? (
                  <div className="text-[11px] font-mono text-primary-secondary py-1">No friction points added</div>
                ) : (
                  currentLog.problems.map((prob, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-warm-subtle/60 dark:bg-warm-subtle-dark/60 text-primary-text dark:text-white">
                      <span className="truncate pr-2">• {prob}</span>
                      <button 
                        onClick={() => {
                          removeProblemFromLog(selectedDate, idx);
                          triggerSaveStatus();
                        }} 
                        className="text-primary-secondary hover:text-red-500 shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Input + Button */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add friction point..."
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddProblem();
                    }
                  }}
                  className="flex-1 bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-1.5 text-xs text-primary-text dark:text-white focus:outline-none focus:border-sage-500"
                />
                <button
                  type="button"
                  onClick={handleAddProblem}
                  className="p-1.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold transition-quiet"
                  title="Add friction point"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar: Collated Activities & On This Day */}
        <div className="space-y-6">
          {/* Automatic Activities Stream */}
          <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-primary-secondary border-b border-warm-border dark:border-warm-border-dark pb-2">
              <span>Activity Stream</span>
              <Sparkles className="w-3.5 h-3.5 text-sage-500" />
            </div>

            <div className="space-y-2 text-xs">
              {/* Workouts */}
              {dayWorkouts.map((w) => (
                <div key={w.id} className="p-2.5 rounded-xl border border-sage-500/30 bg-sage-500/5 space-y-1">
                  <div className="font-medium text-sage-700 dark:text-sage-300">🏋️ Workout: {w.name}</div>
                  <div className="text-[10px] font-mono text-primary-secondary">{w.exercises?.length || 0} exercises completed</div>
                </div>
              ))}

              {/* Tasks Completed */}
              {dayTasksDone.map((t) => (
                <div key={t.id} className="p-2 rounded-xl bg-warm-subtle/40 dark:bg-warm-subtle-dark/40 flex items-center gap-2">
                  <span className="text-emerald-500 font-bold text-xs">✓</span>
                  <span className="text-primary-text dark:text-white font-medium truncate">{t.title}</span>
                </div>
              ))}

              {/* Manual activities */}
              {dayActivities.map((act) => (
                <div key={act.id} className="p-2 rounded-xl bg-warm-subtle/40 dark:bg-warm-subtle-dark/40 flex items-center justify-between">
                  <span className="text-primary-text dark:text-white font-medium truncate">{act.title}</span>
                  <span className="text-[10px] font-mono text-primary-secondary">{act.durationMinutes}m</span>
                </div>
              ))}

              {dayWorkouts.length === 0 && dayTasksDone.length === 0 && dayActivities.length === 0 && (
                <div className="text-center py-4 text-xs font-mono text-primary-secondary">
                  No activity recorded on this date.
                </div>
              )}
            </div>
          </div>

          {/* On This Day (Past Year) */}
          {pastYearLog && (
            <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="text-[10px] font-mono text-sage-600 dark:text-sage-400 uppercase tracking-widest font-bold">
                1 Year Ago Today
              </div>
              <p className="text-xs text-primary-text dark:text-white italic leading-relaxed">
                "{pastYearLog.freeformNote || 'No notes recorded.'}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
