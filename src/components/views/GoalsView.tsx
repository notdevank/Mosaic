import React, { useState } from 'react';
import { Target, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { GoalTier } from '../../types';
import { getTodayStr } from '../../utils/dateUtils';
import { triggerMosaicCompletionEffect } from '../../utils/mosaicEffects';

export const GoalsView: React.FC = () => {
  const { goals, areas, addGoal, updateGoal, deleteGoal } = useStore();
  const [selectedTier, setSelectedTier] = useState<GoalTier | 'all'>('all');
  
  // Add Goal state
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tier, setTier] = useState<GoalTier>('monthly');
  const [areaId, setAreaId] = useState('');
  const [targetDate, setTargetDate] = useState(getTodayStr());

  const tiers: { id: GoalTier; label: string }[] = [
    { id: 'long_term', label: 'Long-term' },
    { id: 'yearly', label: 'Yearly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'daily', label: 'Daily' },
  ];

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addGoal({
      title: title.trim(),
      description: description.trim(),
      tier,
      areaId: areaId || undefined,
      targetDate,
      status: 'active'
    });

    setTitle('');
    setDescription('');
    setIsAdding(false);
  };

  const filteredGoals = selectedTier === 'all' 
    ? goals 
    : goals.filter(g => g.tier === selectedTier);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Goals</h1>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedTier('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-quiet ${
            selectedTier === 'all' 
              ? 'bg-sage-500 text-white' 
              : 'text-primary-secondary dark:text-stone-300 hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark'
          }`}
        >
          All Tiers
        </button>
        {tiers.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTier(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-quiet ${
              selectedTier === t.id 
                ? 'bg-sage-500 text-white' 
                : 'text-primary-secondary dark:text-stone-300 hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Add Goal Modal / Form */}
      {isAdding && (
        <form onSubmit={handleCreateGoal} className="mosaic-card p-5 space-y-4 border-sage-500/40">
          <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark">Create Goal</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Goal title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2.5 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
            />
            <input
              type="text"
              placeholder="Description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
            />

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as GoalTier)}
                  className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-lg px-3 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
                >
                  {tiers.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Area</label>
                <select
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-lg px-3 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
                >
                  <option value="">No Area</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-lg px-3 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-primary-secondary dark:text-stone-300 hover:bg-warm-subtle rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs bg-sage-500 text-white rounded-xl shadow-subtle hover:bg-sage-600"
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.map((goal) => {
          const area = areas.find(a => a.id === goal.areaId);

          return (
            <div key={goal.id} className="mosaic-card space-y-3 group">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-sage-600 dark:text-sage-300 font-bold">
                      {goal.tier.replace('_', ' ')}
                    </span>
                    {area && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-warm-subtle dark:bg-warm-subtle-dark text-primary-secondary dark:text-stone-300 border border-warm-border/60 dark:border-warm-border-dark">
                        {area.name}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-xs text-primary-secondary dark:text-stone-300 line-clamp-2">
                      {goal.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-xs text-primary-secondary dark:text-stone-400 hover:text-primary-text dark:hover:text-white opacity-0 group-hover:opacity-100 transition-quiet"
                >
                  Delete
                </button>
              </div>

              {/* Progress Slider / Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-primary-secondary dark:text-stone-300">
                  <span>Progress</span>
                  <span className="font-bold text-primary-text dark:text-primary-text-dark">{goal.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateGoal(goal.id, { progress: val });
                    if (val === 100 && goal.progress !== 100) {
                      triggerMosaicCompletionEffect('goal', e);
                    }
                  }}
                  className="w-full accent-sage-500 cursor-pointer h-1.5 bg-warm-subtle dark:bg-warm-subtle-dark rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-primary-secondary dark:text-stone-300">
                <span>Target Date:</span>
                <input
                  type="date"
                  value={goal.targetDate || ''}
                  onChange={(e) => updateGoal(goal.id, { targetDate: e.target.value || undefined })}
                  className="bg-warm-subtle dark:bg-[#1E1E1E] border border-warm-border/50 dark:border-[#2A2A2A] rounded px-2 py-0.5 text-[11px] text-primary-secondary dark:text-stone-300 focus:outline-none font-mono"
                  title="Set or change target date"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
