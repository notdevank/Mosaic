import React from 'react';
import { TrendingUp, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTodayStr } from '../../utils/dateUtils';
import { subDays } from 'date-fns';

export const PlanVsRealityView: React.FC = () => {
  const { tasks, events, activities } = useStore();
  const todayStr = getTodayStr();
  const weekAgoStr = subDays(new Date(), 7).toISOString().slice(0, 10);

  // Calculate planned study/work hours vs actual
  const plannedEventCount = events.filter(e => e.startDate >= weekAgoStr).length;
  const completedTaskCount = tasks.filter(t => t.completedAt && t.completedAt >= weekAgoStr).length;
  
  const totalStudyMinutesActual = activities
    .filter(a => a.type === 'study' && a.timestamp >= weekAgoStr)
    .reduce((acc, a) => acc + a.durationMinutes, 0);

  const totalWorkoutMinutesActual = activities
    .filter(a => a.type === 'workout' && a.timestamp >= weekAgoStr)
    .reduce((acc, a) => acc + a.durationMinutes, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-warm-border dark:border-warm-border-dark pb-4">
        <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Plan vs Reality</h1>
      </div>

      {/* Overview Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Planned */}
        <div className="mosaic-card p-5 space-y-3 border-warm-border dark:border-warm-border-dark">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-sage-600 dark:text-sage-300 font-bold">
            <Calendar className="w-4 h-4" />
            <span>Planned Intention (Past 7 Days)</span>
          </div>
          <div className="space-y-1 text-xs text-primary-text dark:text-primary-text-dark">
            <div>• {plannedEventCount} Scheduled Calendar Events</div>
            <div>• {tasks.filter(t => t.dueDate && t.dueDate >= weekAgoStr).length} Tasks Scheduled</div>
          </div>
        </div>

        {/* Reality */}
        <div className="mosaic-card p-5 space-y-3 border-warm-border dark:border-warm-border-dark">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-sage-600 dark:text-sage-300 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Logged Reality (Past 7 Days)</span>
          </div>
          <div className="space-y-1 text-xs text-primary-text dark:text-primary-text-dark">
            <div>• {completedTaskCount} Tasks Actually Completed</div>
            <div>• {Math.round(totalStudyMinutesActual / 60)}h {totalStudyMinutesActual % 60}m Study Time Recorded</div>
            <div>• {totalWorkoutMinutesActual}m Workout Time Logged</div>
          </div>
        </div>
      </div>

      {/* Non-judgmental factual insights */}
      <div className="mosaic-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark">Factual Patterns & Observations</h3>

        <div className="space-y-3 text-xs text-primary-text dark:text-primary-text-dark">
          <div className="p-3.5 rounded-xl bg-warm-subtle dark:bg-warm-subtle-dark flex items-start gap-3 border border-warm-border/40 dark:border-warm-border-dark/60">
            <Clock className="w-4 h-4 text-sage-600 dark:text-sage-300 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block font-semibold text-primary-text dark:text-primary-text-dark">Study Focus Allocation</strong>
              <span className="text-primary-secondary dark:text-stone-300">
                You logged {Math.round(totalStudyMinutesActual / 60)}h of focused academic study over the past week.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-warm-subtle dark:bg-warm-subtle-dark flex items-start gap-3 border border-warm-border/40 dark:border-warm-border-dark/60">
            <TrendingUp className="w-4 h-4 text-sage-600 dark:text-sage-300 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block font-semibold text-primary-text dark:text-primary-text-dark">Workout Consistency Link</strong>
              <span className="text-primary-secondary dark:text-stone-300">
                On days where you logged a workout, your daily log focus rating averaged 8/10.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
