import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { MuscleGroup, WeeklySplitDay } from '../../types';
import { RotateCcw, Check, Edit2 } from 'lucide-react';

interface MuscleOption {
  id: MuscleGroup;
  label: string;
}

const MUSCLE_OPTIONS: MuscleOption[] = [
  { id: 'chest', label: 'Push / Chest' },
  { id: 'back', label: 'Pull / Back' },
  { id: 'legs', label: 'Legs' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'arms', label: 'Arms & Core' },
  { id: 'abs', label: 'Core / Abs' },
  { id: 'rest', label: 'Rest & Recovery' },
];

const FULL_DAY_NAMES: Record<string, string> = {
  'MON': 'Monday',
  'TUE': 'Tuesday',
  'WED': 'Wednesday',
  'THU': 'Thursday',
  'FRI': 'Friday',
  'SAT': 'Saturday',
  'SUN': 'Sunday'
};

export const WeeklySplitPlanner: React.FC = () => {
  const { weeklySplit, updateWeeklySplitDay } = useStore();
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [tempCustomFocus, setTempCustomFocus] = useState<string>('');

  const todayAbbr = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dayNameMap: Record<string, string> = { 'MON': 'MON', 'TUE': 'TUE', 'WED': 'WED', 'THU': 'THU', 'FRI': 'FRI', 'SAT': 'SAT', 'SUN': 'SUN' };
  const currentTodayKey = dayNameMap[todayAbbr] || 'MON';

  const splitDays: WeeklySplitDay[] = weeklySplit && weeklySplit.length > 0 ? weeklySplit : [
    { day: 'MON', muscleGroup: 'chest' },
    { day: 'TUE', muscleGroup: 'back' },
    { day: 'WED', muscleGroup: 'legs' },
    { day: 'THU', muscleGroup: 'shoulders' },
    { day: 'FRI', muscleGroup: 'arms' },
    { day: 'SAT', muscleGroup: 'rest' },
    { day: 'SUN', muscleGroup: 'rest' },
  ];

  const applyPreset = (type: 'ppl' | 'upper_lower' | 'bro' | 'rest') => {
    let newSplit: { day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'; muscleGroup: MuscleGroup }[] = [];

    if (type === 'ppl') {
      newSplit = [
        { day: 'MON', muscleGroup: 'chest' },
        { day: 'TUE', muscleGroup: 'back' },
        { day: 'WED', muscleGroup: 'legs' },
        { day: 'THU', muscleGroup: 'chest' },
        { day: 'FRI', muscleGroup: 'back' },
        { day: 'SAT', muscleGroup: 'legs' },
        { day: 'SUN', muscleGroup: 'rest' },
      ];
    } else if (type === 'upper_lower') {
      newSplit = [
        { day: 'MON', muscleGroup: 'chest' },
        { day: 'TUE', muscleGroup: 'legs' },
        { day: 'WED', muscleGroup: 'rest' },
        { day: 'THU', muscleGroup: 'chest' },
        { day: 'FRI', muscleGroup: 'legs' },
        { day: 'SAT', muscleGroup: 'arms' },
        { day: 'SUN', muscleGroup: 'rest' },
      ];
    } else if (type === 'bro') {
      newSplit = [
        { day: 'MON', muscleGroup: 'chest' },
        { day: 'TUE', muscleGroup: 'back' },
        { day: 'WED', muscleGroup: 'shoulders' },
        { day: 'THU', muscleGroup: 'arms' },
        { day: 'FRI', muscleGroup: 'legs' },
        { day: 'SAT', muscleGroup: 'rest' },
        { day: 'SUN', muscleGroup: 'rest' },
      ];
    } else {
      newSplit = [
        { day: 'MON', muscleGroup: 'rest' },
        { day: 'TUE', muscleGroup: 'rest' },
        { day: 'WED', muscleGroup: 'rest' },
        { day: 'THU', muscleGroup: 'rest' },
        { day: 'FRI', muscleGroup: 'rest' },
        { day: 'SAT', muscleGroup: 'rest' },
        { day: 'SUN', muscleGroup: 'rest' },
      ];
    }

    newSplit.forEach(d => updateWeeklySplitDay(d.day, d.muscleGroup));
  };

  const handleStartEdit = (item: WeeklySplitDay) => {
    if (editingDay === item.day) {
      setEditingDay(null);
    } else {
      setEditingDay(item.day);
      setTempCustomFocus(item.customFocus || '');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Presets Header */}
      <div className="bg-warm-card dark:bg-warm-card-dark p-5 rounded-2xl border border-warm-border dark:border-warm-border-dark space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-warm-border dark:border-warm-border-dark pb-3">
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary-text dark:text-white">
              Weekly Workout Split
            </h2>
            <p className="text-xs text-primary-secondary font-mono">
              7-Day training schedule and custom muscle group allocation
            </p>
          </div>

          <button
            onClick={() => applyPreset('ppl')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark text-xs font-mono text-primary-secondary hover:text-primary-text transition-quiet"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset PPL</span>
          </button>
        </div>

        {/* Clean Presets */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <span className="text-primary-secondary font-medium mr-1">Presets:</span>
          <button
            onClick={() => applyPreset('ppl')}
            className="px-3.5 py-1.5 rounded-xl border border-warm-border dark:border-warm-border-dark hover:border-sage-500 bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 text-primary-text dark:text-white transition-quiet"
          >
            Push / Pull / Legs
          </button>
          <button
            onClick={() => applyPreset('upper_lower')}
            className="px-3.5 py-1.5 rounded-xl border border-warm-border dark:border-warm-border-dark hover:border-sage-500 bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 text-primary-text dark:text-white transition-quiet"
          >
            Upper / Lower
          </button>
          <button
            onClick={() => applyPreset('bro')}
            className="px-3.5 py-1.5 rounded-xl border border-warm-border dark:border-warm-border-dark hover:border-sage-500 bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 text-primary-text dark:text-white transition-quiet"
          >
            5-Day Bodypart Split
          </button>
          <button
            onClick={() => applyPreset('rest')}
            className="px-3.5 py-1.5 rounded-xl border border-warm-border dark:border-warm-border-dark hover:border-sage-500 bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 text-primary-secondary transition-quiet"
          >
            Rest All
          </button>
        </div>
      </div>

      {/* Minimalist 7-Day Table Card */}
      <div className="bg-warm-card dark:bg-warm-card-dark rounded-2xl border border-warm-border dark:border-warm-border-dark overflow-hidden shadow-xs">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-warm-subtle/60 dark:bg-warm-subtle-dark/60 border-b border-warm-border dark:border-warm-border-dark text-[10px] font-mono text-primary-secondary uppercase tracking-widest font-semibold">
          <span className="col-span-3">Day</span>
          <span className="col-span-4">Target Muscle</span>
          <span className="col-span-4 hidden sm:block">Custom Focus / Notes</span>
          <span className="col-span-5 sm:col-span-1 text-right">Edit</span>
        </div>

        {/* 7-Day Rows */}
        <div className="divide-y divide-warm-border dark:divide-warm-border-dark">
          {splitDays.map((item) => {
            const muscleInfo = MUSCLE_OPTIONS.find(m => m.id === item.muscleGroup) || MUSCLE_OPTIONS[6];
            const isToday = item.day === currentTodayKey;
            const isEditing = editingDay === item.day;
            const isRest = item.muscleGroup === 'rest';

            return (
              <div key={item.day} className="space-y-0">
                <div 
                  className={`grid grid-cols-12 gap-4 px-5 py-4 items-center transition-all duration-150 ${
                    isToday ? 'bg-sage-500/10' : 'hover:bg-warm-subtle/40 dark:hover:bg-warm-subtle-dark/40'
                  }`}
                >
                  {/* Day Name */}
                  <div className="col-span-3 flex items-center gap-2 font-mono text-xs">
                    <span className={`font-semibold ${isToday ? 'text-sage-600 dark:text-sage-400 font-bold' : 'text-primary-text dark:text-white'}`}>
                      {FULL_DAY_NAMES[item.day] || item.day}
                    </span>
                    {isToday && (
                      <span className="px-1.5 py-0.2 rounded bg-sage-500 text-white text-[9px] font-sans uppercase font-bold tracking-wider">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Muscle Badge */}
                  <div className="col-span-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-mono font-medium ${
                      isRest 
                        ? 'bg-warm-subtle dark:bg-warm-subtle-dark text-primary-secondary border-warm-border dark:border-warm-border-dark'
                        : 'bg-sage-500/10 text-sage-700 dark:text-sage-300 border-sage-500/30'
                    }`}>
                      {muscleInfo.label}
                    </span>
                  </div>

                  {/* Focus Summary / Custom Note */}
                  <div className="col-span-4 hidden sm:block text-xs font-mono text-primary-secondary truncate">
                    {item.customFocus || <span className="opacity-40 italic">Add focus note...</span>}
                  </div>

                  {/* Edit Action Button */}
                  <div className="col-span-5 sm:col-span-1 text-right">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className={`p-1.5 rounded-lg border text-xs transition-quiet ${
                        isEditing
                          ? 'bg-sage-500 text-white border-sage-500'
                          : 'border-warm-border dark:border-warm-border-dark text-primary-secondary hover:text-primary-text hover:border-sage-500'
                      }`}
                      title="Change target"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inline Target & Custom Focus Selector Panel */}
                {isEditing && (
                  <div className="px-5 py-4 bg-warm-subtle/80 dark:bg-warm-subtle-dark/80 border-t border-b border-warm-border dark:border-warm-border-dark animate-in fade-in duration-150 space-y-3">
                    <div className="text-[11px] font-mono text-primary-secondary font-medium">
                      Select target muscle for <strong>{FULL_DAY_NAMES[item.day]}</strong>:
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {MUSCLE_OPTIONS.map((m) => {
                        const isSelected = item.muscleGroup === m.id;
                        const isOptionRest = m.id === 'rest';
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              updateWeeklySplitDay(item.day, m.id, tempCustomFocus);
                            }}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-sage-500 text-white border-sage-500 font-bold shadow-xs'
                                : isOptionRest
                                ? 'bg-warm-subtle dark:bg-warm-subtle-dark text-primary-secondary border-warm-border dark:border-warm-border-dark hover:border-sage-500'
                                : 'bg-warm-card dark:bg-warm-card-dark text-primary-text dark:text-white border-warm-border dark:border-warm-border-dark hover:border-sage-500'
                            }`}
                          >
                            <span>{m.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Focus Note Input */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={tempCustomFocus}
                        onChange={(e) => setTempCustomFocus(e.target.value)}
                        placeholder="Custom focus note (e.g. Heavy Incline Bench & Triceps)..."
                        className="flex-1 bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-1.5 text-xs font-mono text-primary-text dark:text-white focus:outline-none focus:border-sage-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateWeeklySplitDay(item.day, item.muscleGroup, tempCustomFocus);
                          setEditingDay(null);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-sage-500 text-white text-xs font-mono font-bold hover:bg-sage-600 shadow-xs"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
