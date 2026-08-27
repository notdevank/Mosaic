import React, { useState } from 'react';
import { Plus, Trash2, Check, Flame, Award } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTodayStr, calculateStreak } from '../../utils/dateUtils';
import { format, startOfWeek, addDays } from 'date-fns';

export const HabitsView: React.FC = () => {
  const { habits, areas, addHabit, toggleHabitDate, deleteHabit } = useStore();
  const todayStr = getTodayStr();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [areaId, setAreaId] = useState('');

  // Get current week days (Monday - Sunday)
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      frequency: 'daily',
      targetCount: 5,
      startDate: todayStr,
      areaId: areaId || undefined
    });

    setName('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Habits</h1>
          <p className="text-xs text-primary-secondary dark:text-stone-400 mt-0.5">
            Consistency over intensity. Build rituals that stick.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Inline Add Habit Form */}
      {isAdding && (
        <form onSubmit={handleAddHabit} className="mosaic-card p-4 space-y-3 border-sage-500/40">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Habit name (e.g. Read 20 pages, Journal)..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none w-full"
            />
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className="bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none w-full sm:w-auto"
            >
              <option value="">No Area</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-1.5 text-xs text-primary-secondary dark:text-stone-300 hover:bg-warm-subtle rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 text-xs bg-sage-500 text-white rounded-lg font-medium shadow-subtle"
            >
              Create Habit
            </button>
          </div>
        </form>
      )}

      {/* Habits Matrix Grid */}
      <div className="mosaic-card p-5 space-y-4">
        {/* Header row: Days of the current week */}
        <div className="grid grid-cols-12 gap-2 items-center text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 border-b border-warm-border dark:border-warm-border-dark pb-3">
          <div className="col-span-4 sm:col-span-4">Habit</div>
          <div className="col-span-6 sm:col-span-5 grid grid-cols-7 text-center gap-1">
            {weekDays.map((d) => {
              const dStr = format(d, 'yyyy-MM-dd');
              const isTodayDay = dStr === todayStr;
              return (
                <div key={dStr} className={`text-[10px] ${isTodayDay ? 'text-sage-600 dark:text-sage-300 font-bold' : 'text-primary-secondary dark:text-stone-300'}`}>
                  {format(d, 'EEE')[0]}
                </div>
              );
            })}
          </div>
          <div className="col-span-2 sm:col-span-3 text-right">Streak</div>
        </div>

        {/* Habit Rows */}
        <div className="space-y-3">
          {habits.map((habit) => {
            const streak = calculateStreak(habit.completionHistory);
            const totalChecks = Object.values(habit.completionHistory).filter(Boolean).length;

            return (
              <div key={habit.id} className="grid grid-cols-12 gap-2 items-center group py-2.5 border-b border-warm-border/40 dark:border-warm-border-dark/40 last:border-0">
                {/* Habit info */}
                <div className="col-span-4 sm:col-span-4 space-y-0.5">
                  <div className="text-xs font-medium text-primary-text dark:text-primary-text-dark truncate">
                    {habit.name}
                  </div>
                  <div className="text-[10px] text-primary-secondary dark:text-stone-400 font-mono">
                    {totalChecks} total check-ins
                  </div>
                </div>

                {/* Week Day Checkboxes */}
                <div className="col-span-6 sm:col-span-5 grid grid-cols-7 gap-1 text-center">
                  {weekDays.map((d) => {
                    const dStr = format(d, 'yyyy-MM-dd');
                    const isDone = Boolean(habit.completionHistory[dStr]);

                    return (
                      <button
                        key={dStr}
                        onClick={() => toggleHabitDate(habit.id, dStr)}
                        className={`w-7 h-7 mx-auto rounded-lg border flex items-center justify-center transition-quiet ${
                          isDone 
                            ? 'bg-sage-500 border-sage-500 text-white shadow-subtle scale-105' 
                            : 'border-warm-border dark:border-warm-border-dark hover:border-sage-500 text-transparent'
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Right Streak Badge + Delete */}
                <div className="col-span-2 sm:col-span-3 flex items-center justify-end gap-2.5 text-right">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border/60 dark:border-warm-border-dark text-xs font-mono font-bold text-sage-600 dark:text-sage-300">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{streak.current}d</span>
                  </div>

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-primary-secondary dark:text-stone-400 hover:text-primary-text dark:hover:text-white opacity-0 group-hover:opacity-100 transition-quiet p-1"
                    title="Delete habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
