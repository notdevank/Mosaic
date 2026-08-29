import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Calendar, 
  ClipboardList, 
  Plus, 
  Trash2, 
  Check, 
  Clock,
  Activity,
  TrendingUp,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { WeeklySplitPlanner } from '../gym/WeeklySplitPlanner';
import { getTodayStr, formatDateDisplay } from '../../utils/dateUtils';
import { MuscleGroup } from '../../types';

interface SetItem {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

interface ExerciseEntry {
  id: string;
  name: string;
  category: string;
  sets: SetItem[];
}

const DEFAULT_TEMPLATES_BY_MUSCLE: Record<MuscleGroup, { title: string; exercises: { name: string; category: string; sets: SetItem[] }[] }> = {
  chest: {
    title: 'Push / Chest Session',
    exercises: [
      { name: 'Barbell Bench Press', category: 'Chest', sets: [{ setNumber: 1, weightKg: 80, reps: 8, completed: false }, { setNumber: 2, weightKg: 80, reps: 8, completed: false }, { setNumber: 3, weightKg: 85, reps: 6, completed: false }] },
      { name: 'Incline Dumbbell Press', category: 'Chest', sets: [{ setNumber: 1, weightKg: 28, reps: 10, completed: false }, { setNumber: 2, weightKg: 30, reps: 8, completed: false }] },
      { name: 'Tricep Rope Pushdown', category: 'Arms', sets: [{ setNumber: 1, weightKg: 30, reps: 12, completed: false }, { setNumber: 2, weightKg: 35, reps: 10, completed: false }] }
    ]
  },
  back: {
    title: 'Pull / Back Session',
    exercises: [
      { name: 'Wide Grip Pull-Ups', category: 'Back', sets: [{ setNumber: 1, weightKg: 0, reps: 10, completed: false }, { setNumber: 2, weightKg: 0, reps: 8, completed: false }] },
      { name: 'Bent-Over Barbell Row', category: 'Back', sets: [{ setNumber: 1, weightKg: 70, reps: 8, completed: false }, { setNumber: 2, weightKg: 75, reps: 8, completed: false }] },
      { name: 'Barbell Bicep Curl', category: 'Arms', sets: [{ setNumber: 1, weightKg: 30, reps: 10, completed: false }, { setNumber: 2, weightKg: 35, reps: 8, completed: false }] }
    ]
  },
  legs: {
    title: 'Legs & Lower Body Session',
    exercises: [
      { name: 'Barbell Back Squat', category: 'Legs', sets: [{ setNumber: 1, weightKg: 100, reps: 8, completed: false }, { setNumber: 2, weightKg: 105, reps: 6, completed: false }] },
      { name: 'Romanian Deadlift', category: 'Legs', sets: [{ setNumber: 1, weightKg: 90, reps: 8, completed: false }, { setNumber: 2, weightKg: 95, reps: 8, completed: false }] },
      { name: 'Standing Calf Raises', category: 'Legs', sets: [{ setNumber: 1, weightKg: 50, reps: 15, completed: false }, { setNumber: 2, weightKg: 60, reps: 12, completed: false }] }
    ]
  },
  shoulders: {
    title: 'Shoulders & Delts Session',
    exercises: [
      { name: 'Overhead Military Press', category: 'Shoulders', sets: [{ setNumber: 1, weightKg: 50, reps: 8, completed: false }, { setNumber: 2, weightKg: 55, reps: 6, completed: false }] },
      { name: 'Dumbbell Lateral Raises', category: 'Shoulders', sets: [{ setNumber: 1, weightKg: 12, reps: 12, completed: false }, { setNumber: 2, weightKg: 14, reps: 10, completed: false }] },
      { name: 'Face Pulls', category: 'Shoulders', sets: [{ setNumber: 1, weightKg: 25, reps: 15, completed: false }, { setNumber: 2, weightKg: 30, reps: 12, completed: false }] }
    ]
  },
  arms: {
    title: 'Arms & Core Session',
    exercises: [
      { name: 'Standing Barbell Curls', category: 'Arms', sets: [{ setNumber: 1, weightKg: 35, reps: 10, completed: false }, { setNumber: 2, weightKg: 35, reps: 8, completed: false }] },
      { name: 'Tricep Skullcrushers', category: 'Arms', sets: [{ setNumber: 1, weightKg: 30, reps: 10, completed: false }, { setNumber: 2, weightKg: 35, reps: 8, completed: false }] },
      { name: 'Weighted Ab Curls', category: 'Core', sets: [{ setNumber: 1, weightKg: 20, reps: 15, completed: false }, { setNumber: 2, weightKg: 25, reps: 12, completed: false }] }
    ]
  },
  abs: {
    title: 'Core & Conditioning',
    exercises: [
      { name: 'Hanging Leg Raises', category: 'Core', sets: [{ setNumber: 1, weightKg: 0, reps: 15, completed: false }, { setNumber: 2, weightKg: 0, reps: 15, completed: false }] },
      { name: 'Planks', category: 'Core', sets: [{ setNumber: 1, weightKg: 0, reps: 60, completed: false }, { setNumber: 2, weightKg: 0, reps: 60, completed: false }] }
    ]
  },
  rest: {
    title: 'Active Recovery & Rest Day',
    exercises: [
      { name: 'Light Mobility & Stretching', category: 'Rest', sets: [{ setNumber: 1, weightKg: 0, reps: 15, completed: false }] }
    ]
  }
};

export const GymArea: React.FC = () => {
  const { 
    weeklySplit,
    workoutLogs, 
    recordWorkoutLog, 
    deleteWorkoutLog 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'log' | 'split' | 'history'>('log');
  
  // Today's Target in Weekly Split
  const todayAbbr = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dayNameMap: Record<string, string> = { 'MON': 'MON', 'TUE': 'TUE', 'WED': 'WED', 'THU': 'THU', 'FRI': 'FRI', 'SAT': 'SAT', 'SUN': 'SUN' };
  const currentTodayKey = dayNameMap[todayAbbr] || 'MON';
  const todaySplitDay = (weeklySplit || []).find(d => d.day === currentTodayKey) || { day: currentTodayKey, muscleGroup: 'chest' as MuscleGroup };

  const [workoutTitle, setWorkoutTitle] = useState('Workout Session');
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);

  // Sync exercises with today's Weekly Split on initial load
  const syncWithWeeklySplit = () => {
    const template = DEFAULT_TEMPLATES_BY_MUSCLE[todaySplitDay.muscleGroup] || DEFAULT_TEMPLATES_BY_MUSCLE.chest;
    setWorkoutTitle(template.title);
    setExercises(template.exercises.map((e, idx) => ({
      id: `ex-template-${idx}-${Date.now()}`,
      name: e.name,
      category: e.category,
      sets: e.sets.map(s => ({ ...s }))
    })));
  };

  useEffect(() => {
    syncWithWeeklySplit();
  }, [todaySplitDay.muscleGroup]);

  const [newExName, setNewExName] = useState('');
  const [newExCategory, setNewExCategory] = useState('Chest');

  // Session Statistics
  const totalVolumeKg = exercises.reduce((acc, ex) => {
    return acc + ex.sets.reduce((sAcc, s) => s.completed ? sAcc + (s.weightKg * s.reps) : sAcc, 0);
  }, 0);

  const completedSets = exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  const handleAddExercise = () => {
    if (!newExName.trim()) return;
    setExercises([
      ...exercises,
      {
        id: `ex-${Date.now()}`,
        name: newExName.trim(),
        category: newExCategory,
        sets: [{ setNumber: 1, weightKg: 20, reps: 10, completed: false }]
      }
    ]);
    setNewExName('');
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  const handleAddSet = (exId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        const lastSet = ex.sets[ex.sets.length - 1] || { weightKg: 20, reps: 10, completed: false };
        return {
          ...ex,
          sets: [
            ...ex.sets,
            { setNumber: ex.sets.length + 1, weightKg: lastSet.weightKg, reps: lastSet.reps, completed: false }
          ]
        };
      }
      return ex;
    }));
  };

  const handleRemoveSet = (exId: string, setIdx: number) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        const filtered = ex.sets.filter((_, idx) => idx !== setIdx);
        return {
          ...ex,
          sets: filtered.map((s, i) => ({ ...s, setNumber: i + 1 }))
        };
      }
      return ex;
    }));
  };

  const handleUpdateSet = (exId: string, setIdx: number, field: keyof SetItem, val: any) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        const newSets = [...ex.sets];
        newSets[setIdx] = { ...newSets[setIdx], [field]: val };
        return { ...ex, sets: newSets };
      }
      return ex;
    }));
  };

  const handleSaveWorkout = () => {
    if (exercises.length === 0) return;
    recordWorkoutLog({
      name: workoutTitle || 'Workout Session',
      date: getTodayStr(),
      durationMinutes: 45,
      exercises: exercises.map(e => ({
        exerciseId: e.id,
        exerciseName: e.name,
        sets: e.sets.map((s, idx) => ({
          setNumber: idx + 1,
          weightKg: s.weightKg,
          reps: s.reps,
          completed: s.completed
        }))
      }))
    });
    alert('Workout session recorded!');
    setActiveTab('history');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-primary-text dark:text-white tracking-tight">
            Gym & Workout
          </h1>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-warm-subtle dark:bg-warm-subtle-dark rounded-xl border border-warm-border dark:border-warm-border-dark">
          <button
            onClick={() => setActiveTab('log')}
            className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-quiet ${
              activeTab === 'log'
                ? 'bg-sage-500 text-white font-bold shadow-xs'
                : 'text-primary-secondary hover:text-primary-text'
            }`}
          >
            Workout Logger
          </button>
          <button
            onClick={() => setActiveTab('split')}
            className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-quiet ${
              activeTab === 'split'
                ? 'bg-sage-500 text-white font-bold shadow-xs'
                : 'text-primary-secondary hover:text-primary-text'
            }`}
          >
            Weekly Split
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-quiet ${
              activeTab === 'history'
                ? 'bg-sage-500 text-white font-bold shadow-xs'
                : 'text-primary-secondary hover:text-primary-text'
            }`}
          >
            History ({workoutLogs?.length || 0})
          </button>
        </div>
      </div>

      {/* TAB 1: Professional Workout Logger */}
      {activeTab === 'log' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Top Session Dashboard Card */}
          <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-border/60 dark:border-warm-border-dark/60 pb-4">
              <input
                type="text"
                value={workoutTitle}
                onChange={(e) => setWorkoutTitle(e.target.value)}
                placeholder="Routine Name..."
                className="font-serif text-2xl font-semibold bg-transparent text-primary-text dark:text-white focus:outline-none"
              />
              <span className="text-xs font-mono text-primary-secondary">{formatDateDisplay(getTodayStr())}</span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-primary-secondary">
              <div className="flex items-center gap-6">
                <div>
                  <span className="block text-[10px] uppercase text-primary-secondary">Total Volume</span>
                  <span className="text-base font-serif font-bold text-sage-600 dark:text-sage-400">
                    {totalVolumeKg.toLocaleString()} kg
                  </span>
                </div>
                <div className="h-6 w-[1px] bg-warm-border dark:bg-warm-border-dark" />
                <div>
                  <span className="block text-[10px] uppercase text-primary-secondary">Progress</span>
                  <span className="text-sm font-bold text-primary-text dark:text-white">
                    {completedSets} / {totalSets} sets
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Exercise Cards */}
          <div className="space-y-4">
            {exercises.map((ex, exIdx) => (
              <div 
                key={ex.id} 
                className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-5 space-y-4 shadow-xs"
              >
                {/* Exercise Header */}
                <div className="flex items-center justify-between border-b border-warm-border/60 dark:border-warm-border-dark/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-sage-500/10 text-sage-600 dark:text-sage-300 text-xs font-mono font-bold flex items-center justify-center">
                      {exIdx + 1}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-primary-text dark:text-white">
                        {ex.name}
                      </h3>
                      <span className="text-[10px] font-mono text-primary-secondary uppercase tracking-widest">
                        {ex.category}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleRemoveExercise(ex.id)} 
                    className="p-1 text-primary-secondary hover:text-red-500 transition-quiet"
                    title="Remove Exercise"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Clean Professional Table */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-primary-secondary uppercase tracking-widest px-3 pb-1">
                    <span className="col-span-2">SET</span>
                    <span className="col-span-4 text-center">WEIGHT (KG)</span>
                    <span className="col-span-4 text-center">REPS</span>
                    <span className="col-span-2 text-right">DONE</span>
                  </div>

                  {ex.sets.map((s, setIdx) => (
                    <div 
                      key={setIdx} 
                      className={`grid grid-cols-12 gap-2 items-center px-3 py-2 rounded-xl border transition-all font-mono text-xs ${
                        s.completed
                          ? 'bg-sage-500/10 border-sage-500/30'
                          : 'bg-warm-subtle/40 dark:bg-warm-subtle-dark/40 border-warm-border/40 dark:border-warm-border-dark/40'
                      }`}
                    >
                      <span className="col-span-2 font-bold text-primary-secondary">
                        {s.setNumber}
                      </span>

                      {/* Weight Input */}
                      <div className="col-span-4 flex items-center justify-center">
                        <input
                          type="number"
                          step="2.5"
                          value={s.weightKg}
                          onChange={(e) => handleUpdateSet(ex.id, setIdx, 'weightKg', Number(e.target.value))}
                          className="w-20 bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-lg py-1 text-center font-bold text-primary-text dark:text-white focus:outline-none focus:border-sage-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      {/* Reps Input */}
                      <div className="col-span-4 flex items-center justify-center">
                        <input
                          type="number"
                          value={s.reps}
                          onChange={(e) => handleUpdateSet(ex.id, setIdx, 'reps', Number(e.target.value))}
                          className="w-20 bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-lg py-1 text-center font-bold text-primary-text dark:text-white focus:outline-none focus:border-sage-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      {/* Checkbox Action */}
                      <div className="col-span-2 flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateSet(ex.id, setIdx, 'completed', !s.completed)}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                            s.completed
                              ? 'bg-sage-500 border-sage-500 text-white font-bold shadow-xs'
                              : 'border-warm-border dark:border-warm-border-dark text-primary-secondary hover:border-sage-500'
                          }`}
                        >
                          ✓
                        </button>
                        {ex.sets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSet(ex.id, setIdx)}
                            className="text-primary-secondary hover:text-red-500 text-xs px-1"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddSet(ex.id)}
                  className="text-xs font-mono text-sage-600 dark:text-sage-400 hover:underline flex items-center gap-1 font-medium pt-1"
                >
                  + Add Set
                </button>
              </div>
            ))}
          </div>

          {/* Clean Add Exercise Control Bar */}
          <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 shadow-xs">
            <input
              type="text"
              value={newExName}
              onChange={(e) => setNewExName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddExercise()}
              placeholder="Add exercise name..."
              className="w-full sm:flex-1 bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-white focus:outline-none focus:border-sage-500"
            />
            <select
              value={newExCategory}
              onChange={(e) => setNewExCategory(e.target.value)}
              className="bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-2 text-xs font-mono text-primary-text dark:text-white focus:outline-none"
            >
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Legs">Legs</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Arms">Arms</option>
              <option value="Core">Core</option>
            </select>
            <button
              type="button"
              onClick={handleAddExercise}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark text-xs font-mono font-medium hover:border-sage-500"
            >
              + Add Exercise
            </button>
          </div>

          {/* Finish Session Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveWorkout}
              className="px-6 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Finish & Save Workout</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: Weekly Split Planner */}
      {activeTab === 'split' && <WeeklySplitPlanner />}

      {/* TAB 3: History */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {(workoutLogs || []).length === 0 ? (
            <div className="p-8 rounded-2xl border border-warm-border dark:border-warm-border-dark bg-warm-card dark:bg-warm-card-dark text-center space-y-3 text-primary-secondary">
              <Dumbbell className="w-10 h-10 mx-auto stroke-[1.5] text-sage-500/50" />
              <div className="font-serif text-base text-primary-text dark:text-white">No workout logs recorded</div>
              <button
                onClick={() => setActiveTab('log')}
                className="px-4 py-2 rounded-xl bg-sage-500 text-white text-xs font-medium"
              >
                Log First Session
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {workoutLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-5 rounded-2xl bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-base font-semibold text-primary-text dark:text-white">{log.name}</h3>
                      <span className="text-[11px] font-mono text-primary-secondary">{formatDateDisplay(log.date)}</span>
                    </div>

                    <button
                      onClick={() => deleteWorkoutLog(log.id)}
                      className="p-1 text-primary-secondary hover:text-red-500 transition-quiet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {log.exercises.map((ex, idx) => {
                      const completedCount = ex.sets?.filter(s => s.completed).length || ex.sets?.length || 0;
                      const topSet = ex.sets?.[0];
                      return (
                        <div key={idx} className="p-2.5 rounded-xl bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 flex items-center justify-between">
                          <span className="text-primary-text dark:text-white truncate font-medium">• {ex.exerciseName}</span>
                          <span className="text-primary-secondary text-[11px] shrink-0">
                            {completedCount} sets {topSet ? `(${topSet.weightKg} kg × ${topSet.reps})` : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
