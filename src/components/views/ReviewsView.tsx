import React, { useState } from 'react';
import { BookCheck, Plus, Sparkles, CheckCircle2, History } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTodayStr } from '../../utils/dateUtils';
import { subDays, format } from 'date-fns';

export const ReviewsView: React.FC = () => {
  const { reviews, tasks, habits, activities, workoutLogs, addReview } = useStore();
  const [periodType, setPeriodType] = useState<'weekly' | 'monthly'>('weekly');
  const [isCreating, setIsCreating] = useState(false);

  // Reflection form states
  const [wentWell, setWentWell] = useState('');
  const [didNotGoWell, setDidNotGoWell] = useState('');
  const [shouldChange, setShouldChange] = useState('');
  const [prioritiesNextPeriod, setPrioritiesNextPeriod] = useState('');

  const todayStr = getTodayStr();
  const startDateStr = format(subDays(new Date(), periodType === 'weekly' ? 7 : 30), 'yyyy-MM-dd');

  // Auto-calculated summary metrics
  const completedTasksCount = tasks.filter(t => t.completedAt && t.completedAt >= startDateStr).length;
  const studyMinutes = activities
    .filter(a => a.type === 'study' && a.timestamp >= startDateStr)
    .reduce((acc, a) => acc + a.durationMinutes, 0);
  const workoutCount = workoutLogs.filter(w => w.date >= startDateStr).length;
  
  // Calculate habit percentage
  let habitCheckIns = 0;
  habits.forEach(h => {
    Object.keys(h.completionHistory).forEach(d => {
      if (d >= startDateStr && h.completionHistory[d]) habitCheckIns++;
    });
  });
  const totalHabitOpportunities = (habits.length || 1) * (periodType === 'weekly' ? 7 : 30);
  const habitPercentage = Math.min(100, Math.round((habitCheckIns / totalHabitOpportunities) * 100));

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();

    addReview({
      periodType,
      startDate: startDateStr,
      endDate: todayStr,
      completedTasksCount,
      studyMinutes,
      workoutCount,
      habitPercentage,
      wentWell: wentWell.trim(),
      didNotGoWell: didNotGoWell.trim(),
      shouldChange: shouldChange.trim(),
      prioritiesNextPeriod: prioritiesNextPeriod.trim()
    });

    setWentWell('');
    setDidNotGoWell('');
    setShouldChange('');
    setPrioritiesNextPeriod('');
    setIsCreating(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Reviews</h1>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
        >
          <Plus className="w-4 h-4" />
          <span>Start {periodType === 'weekly' ? 'Weekly' : 'Monthly'} Review</span>
        </button>
      </div>

      {/* Review Type Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPeriodType('weekly')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-quiet ${
            periodType === 'weekly' ? 'bg-sage-500 text-white' : 'text-primary-secondary hover:bg-warm-subtle'
          }`}
        >
          Weekly Review
        </button>
        <button
          onClick={() => setPeriodType('monthly')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-quiet ${
            periodType === 'monthly' ? 'bg-sage-500 text-white' : 'text-primary-secondary hover:bg-warm-subtle'
          }`}
        >
          Monthly Review
        </button>
      </div>

      {/* Review Creation Wizard */}
      {isCreating && (
        <form onSubmit={handleSaveReview} className="mosaic-card p-6 space-y-6 border-sage-500/50">
          <div className="flex items-center justify-between border-b border-warm-border dark:border-warm-border-dark pb-3">
            <h3 className="font-serif text-xl font-medium text-primary-text dark:text-primary-text-dark">
              {periodType === 'weekly' ? 'Weekly' : 'Monthly'} Reflection ({startDateStr} to {todayStr})
            </h3>
            <Sparkles className="w-4 h-4 text-sage-500" />
          </div>

          {/* Auto Collated Stats */}
          <div className="grid grid-cols-4 gap-3 text-center p-3 bg-warm-subtle dark:bg-warm-subtle-dark rounded-xl border border-warm-border dark:border-warm-border-dark">
            <div>
              <div className="text-lg font-serif font-bold text-sage-600 dark:text-sage-300">{completedTasksCount}</div>
              <div className="text-[10px] font-mono text-primary-secondary dark:text-stone-300">Tasks Completed</div>
            </div>
            <div>
              <div className="text-lg font-serif font-bold text-sage-600 dark:text-sage-300">{Math.round(studyMinutes / 60)}h {studyMinutes % 60}m</div>
              <div className="text-[10px] font-mono text-primary-secondary dark:text-stone-300">Study Time</div>
            </div>
            <div>
              <div className="text-lg font-serif font-bold text-sage-600 dark:text-sage-300">{workoutCount}</div>
              <div className="text-[10px] font-mono text-primary-secondary dark:text-stone-300">Workouts</div>
            </div>
            <div>
              <div className="text-lg font-serif font-bold text-sage-600 dark:text-sage-300">{habitPercentage}%</div>
              <div className="text-[10px] font-mono text-primary-secondary dark:text-stone-300">Habit Consistency</div>
            </div>
          </div>

          {/* Qualitative Reflection Prompts */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-primary-text dark:text-primary-text-dark mb-1">1. What went well?</label>
              <textarea
                value={wentWell}
                onChange={(e) => setWentWell(e.target.value)}
                placeholder="Wins, breakthroughs, positive routines..."
                rows={2}
                className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl p-3 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text dark:text-primary-text-dark mb-1">2. What didn't go well?</label>
              <textarea
                value={didNotGoWell}
                onChange={(e) => setDidNotGoWell(e.target.value)}
                placeholder="Friction points, obstacles, missed habits..."
                rows={2}
                className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl p-3 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text dark:text-primary-text-dark mb-1">3. What should change?</label>
              <textarea
                value={shouldChange}
                onChange={(e) => setShouldChange(e.target.value)}
                placeholder="Adjustments to make for next week/month..."
                rows={2}
                className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl p-3 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text dark:text-primary-text-dark mb-1">4. Primary priorities for next period?</label>
              <textarea
                value={prioritiesNextPeriod}
                onChange={(e) => setPrioritiesNextPeriod(e.target.value)}
                placeholder="Key goals, focal points..."
                rows={2}
                className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl p-3 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs font-medium text-primary-secondary hover:bg-warm-subtle rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-medium bg-sage-500 text-white rounded-xl shadow-subtle hover:bg-sage-600"
            >
              Save Review
            </button>
          </div>
        </form>
      )}

      {/* Review Archive */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-primary-text">Past Reviews Archive</h3>
        {reviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-primary-secondary border border-dashed border-warm-border rounded-xl">
            No saved reviews yet. Complete a weekly or monthly reflection to build your history!
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="mosaic-card p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="uppercase font-bold text-sage-600">{r.periodType} Review</span>
                  <span className="text-primary-secondary">{r.startDate} to {r.endDate}</span>
                </div>
                {r.wentWell && (
                  <div className="text-xs text-primary-text">
                    <strong className="text-sage-700">Went Well:</strong> {r.wentWell}
                  </div>
                )}
                {r.shouldChange && (
                  <div className="text-xs text-primary-text">
                    <strong className="text-sage-700">Key Adjustment:</strong> {r.shouldChange}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
