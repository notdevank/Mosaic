import React, { useState, useMemo } from 'react';
import { Calendar, Flame, Award, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getPastYearDays, formatShortDate, calculateStreak } from '../../utils/dateUtils';
import { format } from 'date-fns';

export const HeatmapView: React.FC = () => {
  const { activities, habits, tasks, dailyLogs, areas, deleteActivity } = useStore();
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('all');
  const [selectedDayDetail, setSelectedDayDetail] = useState<string | null>(null);

  const pastYearDays = useMemo(() => getPastYearDays(), []);

  // Compute activity intensity per day (0 - 4 scale)
  const getDayIntensity = (dateStr: string): number => {
    let score = 0;

    const dayActs = activities.filter(a => {
      if (!a.timestamp.startsWith(dateStr)) return false;
      if (selectedAreaFilter === 'all') return true;
      return a.areaId === selectedAreaFilter;
    });
    score += dayActs.length;

    habits.forEach(h => {
      if (Boolean(h.completionHistory[dateStr])) {
        if (selectedAreaFilter === 'all' || h.areaId === selectedAreaFilter) {
          score += 1;
        }
      }
    });

    const dayTasks = tasks.filter(t => {
      if (!t.completedAt || !t.completedAt.startsWith(dateStr)) return false;
      if (selectedAreaFilter === 'all') return true;
      return t.areaId === selectedAreaFilter;
    });
    score += dayTasks.length;

    if (dailyLogs[dateStr]?.freeformNote) score += 1;

    if (score === 0) return 0;
    if (score <= 1) return 1;
    if (score <= 3) return 2;
    if (score <= 5) return 3;
    return 4;
  };

  // Build habit history map for streak calculation
  const habitCompletionMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    pastYearDays.forEach(d => {
      const dStr = format(d, 'yyyy-MM-dd');
      if (getDayIntensity(dStr) > 0) map[dStr] = true;
    });
    return map;
  }, [pastYearDays, activities, habits, tasks, dailyLogs, selectedAreaFilter]);

  const { current: currentStreak, best: bestStreak } = calculateStreak(habitCompletionMap);
  const activeDaysCount = Object.keys(habitCompletionMap).length;

  // Group past 365 days into 53 week columns
  const weeks = useMemo(() => {
    const w: Date[][] = [];
    let currentWeek: Date[] = [];

    pastYearDays.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === pastYearDays.length - 1) {
        w.push(currentWeek);
        currentWeek = [];
      }
    });
    return w;
  }, [pastYearDays]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Activity Heatmap</h1>
          <p className="text-xs text-primary-secondary dark:text-stone-300 mt-0.5 font-mono">
            Consistency matrix across study, gym, habits, and tasks
          </p>
        </div>

        {/* Filter Area Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-warm-subtle dark:bg-warm-subtle-dark rounded-xl border border-warm-border/50 dark:border-warm-border-dark/50 overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedAreaFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg uppercase tracking-wider transition-quiet ${
              selectedAreaFilter === 'all' 
                ? 'bg-warm-card dark:bg-warm-card-dark text-sage-600 dark:text-sage-300 font-bold shadow-subtle' 
                : 'text-primary-secondary dark:text-zinc-400 hover:text-primary-text dark:hover:text-white'
            }`}
          >
            All Activity
          </button>
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedAreaFilter(area.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg uppercase tracking-wider transition-quiet ${
                selectedAreaFilter === area.id 
                  ? 'bg-warm-card dark:bg-warm-card-dark text-sage-600 dark:text-sage-300 font-bold shadow-subtle' 
                  : 'text-primary-secondary dark:text-zinc-400 hover:text-primary-text dark:hover:text-white'
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="mosaic-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sage-500/10 dark:bg-sage-500/20 text-sage-600 dark:text-sage-300">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-serif font-medium text-primary-text dark:text-primary-text-dark">
              {activeDaysCount} Days
            </div>
            <div className="text-xs text-primary-secondary dark:text-stone-300 font-mono">Active past 365 days</div>
          </div>
        </div>

        <div className="mosaic-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sage-500/10 dark:bg-sage-500/20 text-sage-600 dark:text-sage-300">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-serif font-medium text-primary-text dark:text-primary-text-dark">
              {currentStreak} Days
            </div>
            <div className="text-xs text-primary-secondary dark:text-stone-300 font-mono">Current active streak</div>
          </div>
        </div>

        <div className="mosaic-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sage-500/10 dark:bg-sage-500/20 text-sage-600 dark:text-sage-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-serif font-medium text-primary-text dark:text-primary-text-dark">
              {bestStreak} Days
            </div>
            <div className="text-xs text-primary-secondary dark:text-stone-300 font-mono">Best active streak</div>
          </div>
        </div>
      </div>

      {/* Modern Full-Width Heatmap Card */}
      <div className="mosaic-card p-6 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-primary-secondary dark:text-stone-300">
          <span className="font-semibold uppercase tracking-wider text-[11px]">Past 365 Days</span>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>Less</span>
            <span className="w-3 h-3 rounded-[3px] bg-warm-subtle dark:bg-[#1A1A1E]" />
            <span className="w-3 h-3 rounded-[3px] bg-sage-500/30" />
            <span className="w-3 h-3 rounded-[3px] bg-sage-500/60" />
            <span className="w-3 h-3 rounded-[3px] bg-sage-500" />
            <span className="w-3 h-3 rounded-[3px] bg-sage-400 shadow-xs" />
            <span>More</span>
          </div>
        </div>

        {/* Clean Month Headers */}
        <div className="grid grid-cols-12 text-[11px] font-mono text-primary-secondary dark:text-stone-400 pl-6 text-center">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        {/* Full Width Grid with Mon/Wed/Fri labels */}
        <div className="flex items-center gap-3">
          {/* Day of week labels */}
          <div className="flex flex-col justify-between text-[10px] font-mono text-primary-secondary dark:text-stone-400 h-28 py-0.5 select-none shrink-0 w-4">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* 53 Columns spanning 100% width cleanly */}
          <div className="flex-1 grid grid-flow-col auto-cols-fr gap-1">
            {weeks.map((week, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1">
                {week.map((day) => {
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const intensity = getDayIntensity(dayStr);

                  let colorStyle = 'bg-warm-subtle dark:bg-[#1A1A1E] hover:bg-warm-border dark:hover:bg-[#25252A]';
                  if (intensity === 1) colorStyle = 'bg-sage-500/30 hover:bg-sage-500/40';
                  if (intensity === 2) colorStyle = 'bg-sage-500/60 hover:bg-sage-500/70';
                  if (intensity === 3) colorStyle = 'bg-sage-500 hover:bg-sage-600';
                  if (intensity === 4) colorStyle = 'bg-sage-400 hover:bg-sage-300 shadow-xs';

                  return (
                    <button
                      key={dayStr}
                      onClick={() => setSelectedDayDetail(dayStr)}
                      className={`w-full aspect-square rounded-[3px] transition-all duration-150 hover:scale-125 hover:z-10 focus:outline-none ${colorStyle}`}
                      title={`${formatShortDate(dayStr)}: ${intensity > 0 ? `${intensity} activities` : 'No activity'}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Day Detail Drawer */}
      {selectedDayDetail && (
        <div className="mosaic-card p-5 space-y-3 animate-in fade-in duration-150 border-sage-500/40">
          <div className="flex items-center justify-between border-b border-warm-border dark:border-warm-border-dark pb-2">
            <span className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark">
              Activity for {formatShortDate(selectedDayDetail)}
            </span>
            <button
              onClick={() => setSelectedDayDetail(null)}
              className="text-xs text-primary-secondary dark:text-stone-300 hover:text-primary-text dark:hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {activities.filter(a => a.timestamp.startsWith(selectedDayDetail)).length === 0 && !dailyLogs[selectedDayDetail]?.freeformNote && (
              <p className="text-primary-secondary dark:text-stone-400 italic py-2">No activity recorded on this day.</p>
            )}

            {activities.filter(a => a.timestamp.startsWith(selectedDayDetail)).map((act) => (
              <div key={act.id} className="group p-2.5 rounded-xl bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border/50 dark:border-warm-border-dark flex items-center justify-between">
                <span className="text-primary-text dark:text-primary-text-dark font-medium">{act.title}</span>
                <div className="flex items-center gap-2">
                  {act.durationMinutes > 0 && <span className="font-mono text-primary-secondary dark:text-stone-300">{act.durationMinutes}m</span>}
                  <button
                    onClick={() => deleteActivity(act.id)}
                    className="p-1 text-primary-secondary dark:text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-quiet"
                    title="Delete activity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {dailyLogs[selectedDayDetail]?.freeformNote && (
              <div className="p-3 rounded-xl bg-sage-500/10 dark:bg-sage-500/20 border border-sage-500/30 italic text-sage-800 dark:text-sage-200">
                "{dailyLogs[selectedDayDetail].freeformNote}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
