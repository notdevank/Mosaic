import React, { useState } from 'react';
import { Utensils, Plus, Flame, Activity, Droplets, Trash2, Settings, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { MealType } from '../../types';
import { getTodayStr, formatDateDisplay } from '../../utils/dateUtils';

export const NutritionArea: React.FC = () => {
  const { 
    mealLogs, 
    nutritionGoal, 
    addMealLog, 
    deleteMealLog, 
    updateNutritionGoal
  } = useStore();

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [calories, setCalories] = useState<number>(450);
  const [proteinGrams, setProteinGrams] = useState<number>(30);
  const [carbsGrams, setCarbsGrams] = useState<number>(50);
  const [fatsGrams, setFatsGrams] = useState<number>(15);

  // Nutrition Target goal edit modal states
  const [targetCals, setTargetCals] = useState(nutritionGoal.targetDailyCalories);
  const [targetProtein, setTargetProtein] = useState(nutritionGoal.targetDailyProteinGrams);
  const [targetWater, setTargetWater] = useState(nutritionGoal.targetDailyWaterLiters);

  const todayStr = getTodayStr();

  // Filter logs for selected day
  const dayLogs = mealLogs.filter((m) => m.date === selectedDate);

  // Calculate daily totals
  const totalCalories = dayLogs.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProtein = dayLogs.reduce((acc, m) => acc + (m.proteinGrams || 0), 0);
  const totalCarbs = dayLogs.reduce((acc, m) => acc + (m.carbsGrams || 0), 0);
  const totalFats = dayLogs.reduce((acc, m) => acc + (m.fatsGrams || 0), 0);

  // Water intake entries for selected date
  const waterLogs = dayLogs.filter((m) => m.mealType === 'snack' && m.title.toLowerCase().includes('water'));
  const totalWater = waterLogs.reduce((acc, m) => acc + (m.carbsGrams || 0.25), 0);

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMealLog({
      date: selectedDate,
      mealType,
      title: title.trim(),
      calories: Number(calories) || 0,
      proteinGrams: Number(proteinGrams) || 0,
      carbsGrams: Number(carbsGrams) || 0,
      fatsGrams: Number(fatsGrams) || 0,
    });

    setTitle('');
    setIsAddingMeal(false);
  };

  const handleQuickAddWater = () => {
    addMealLog({
      date: selectedDate,
      mealType: 'snack',
      title: 'Water Intake (+250ml)',
      calories: 0,
      proteinGrams: 0,
      carbsGrams: 0.25, // stores 0.25 liters
      fatsGrams: 0,
    });
  };

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    updateNutritionGoal({
      targetDailyCalories: Number(targetCals),
      targetDailyProteinGrams: Number(targetProtein),
      targetDailyWaterLiters: Number(targetWater)
    });
    setIsGoalModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sage-500/10 text-sage-600 dark:text-sage-300">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Diet & Nutrition</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="p-2 rounded-xl border border-warm-border dark:border-warm-border-dark text-primary-secondary dark:text-stone-300 hover:text-primary-text dark:hover:text-white hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark transition-quiet"
            title="Adjust target goals"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAddingMeal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
          >
            <Plus className="w-4 h-4" />
            <span>Log Meal</span>
          </button>
        </div>
      </div>

      {/* Daily Macros & Hydration Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Calories Card */}
        <div className="mosaic-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-primary-secondary dark:text-stone-300">
            <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-sage-500" /> Calories</span>
            <span className="font-bold text-primary-text dark:text-primary-text-dark">{totalCalories} / {nutritionGoal.targetDailyCalories} kcal</span>
          </div>
          <div className="w-full bg-warm-subtle dark:bg-warm-subtle-dark rounded-full h-2 overflow-hidden">
            <div 
              className="bg-sage-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((totalCalories / nutritionGoal.targetDailyCalories) * 100))}%` }}
            />
          </div>
        </div>

        {/* Protein Card */}
        <div className="mosaic-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-primary-secondary dark:text-stone-300">
            <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-sage-500" /> Protein</span>
            <span className="font-bold text-primary-text dark:text-primary-text-dark">{totalProtein} / {nutritionGoal.targetDailyProteinGrams} g</span>
          </div>
          <div className="w-full bg-warm-subtle dark:bg-warm-subtle-dark rounded-full h-2 overflow-hidden">
            <div 
              className="bg-sage-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((totalProtein / nutritionGoal.targetDailyProteinGrams) * 100))}%` }}
            />
          </div>
        </div>

        {/* Water Hydration Card */}
        <div className="mosaic-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-primary-secondary dark:text-stone-300">
            <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-sage-500" /> Water</span>
            <span className="font-bold text-primary-text dark:text-primary-text-dark">{totalWater.toFixed(2)} / {nutritionGoal.targetDailyWaterLiters} L</span>
          </div>
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex-1 bg-warm-subtle dark:bg-warm-subtle-dark rounded-full h-2 overflow-hidden">
              <div 
                className="bg-sage-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((totalWater / nutritionGoal.targetDailyWaterLiters) * 100))}%` }}
              />
            </div>
            <button
              onClick={handleQuickAddWater}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-sage-500/10 dark:bg-sage-500/20 text-sage-600 dark:text-sage-300 font-bold hover:bg-sage-500/20 transition-quiet"
              title="Add 250ml water glass"
            >
              + 250ml
            </button>
          </div>
        </div>
      </div>

      {/* Inline Log Meal Form */}
      {isAddingMeal && (
        <form onSubmit={handleAddMeal} className="mosaic-card p-5 space-y-4 border-sage-500/40">
          <div className="flex items-center justify-between border-b border-warm-border dark:border-warm-border-dark pb-2">
            <h3 className="font-serif text-lg text-primary-text dark:text-primary-text-dark font-medium">Log Meal / Eating Entry</h3>
            <span className="text-xs font-mono text-primary-secondary dark:text-stone-300">{selectedDate}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
              >
                <option value="breakfast">Breakfast 🍳</option>
                <option value="lunch">Lunch 🥗</option>
                <option value="dinner">Dinner 🍲</option>
                <option value="snack">Snack 🍏</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Description / Food</label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Oatmeal with protein powder, berries & almonds..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
              />
            </div>
          </div>

          {/* Macros input grid */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-1.5 text-xs text-primary-text dark:text-primary-text-dark font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Protein (g)</label>
              <input
                type="number"
                value={proteinGrams}
                onChange={(e) => setProteinGrams(Number(e.target.value))}
                className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-1.5 text-xs text-primary-text dark:text-primary-text-dark font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Carbs (g)</label>
              <input
                type="number"
                value={carbsGrams}
                onChange={(e) => setCarbsGrams(Number(e.target.value))}
                className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-1.5 text-xs text-primary-text dark:text-primary-text-dark font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Fats (g)</label>
              <input
                type="number"
                value={fatsGrams}
                onChange={(e) => setFatsGrams(Number(e.target.value))}
                className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-3 py-1.5 text-xs text-primary-text dark:text-primary-text-dark font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingMeal(false)}
              className="px-4 py-1.5 text-xs text-primary-secondary dark:text-stone-300 hover:bg-warm-subtle rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 text-xs bg-sage-500 text-white rounded-xl font-medium shadow-subtle hover:bg-sage-600 transition-quiet"
            >
              Save Meal Entry
            </button>
          </div>
        </form>
      )}

      {/* Logged Meals List */}
      <div className="mosaic-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-warm-border dark:border-warm-border-dark pb-3">
          <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark">
            Meals Logged for {formatDateDisplay(selectedDate)}
          </h3>

          <div className="flex items-center gap-2 text-xs font-mono text-primary-secondary dark:text-stone-300">
            <span>Macros: {totalProtein}g P | {totalCarbs}g C | {totalFats}g F</span>
          </div>
        </div>

        {dayLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-primary-secondary dark:text-stone-300 border border-dashed border-warm-border dark:border-warm-border-dark rounded-xl">
            No meals logged for this day yet. Tap "Log Meal" above to record your eating.
          </div>
        ) : (
          <div className="space-y-2">
            {dayLogs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-center justify-between p-3 rounded-xl bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border/50 dark:border-warm-border-dark/50 group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary-text dark:text-primary-text-dark capitalize">
                      {log.mealType}: {log.title}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-primary-secondary dark:text-stone-300">
                    {log.calories} kcal • {log.proteinGrams}g Protein • {log.carbsGrams}g Carbs • {log.fatsGrams}g Fat
                  </div>
                </div>

                <button
                  onClick={() => deleteMealLog(log.id)}
                  className="p-1.5 text-primary-secondary dark:text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-quiet"
                  title="Delete meal log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adjust Nutrition Goals Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl w-full max-w-md p-6 shadow-elevated animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark mb-4">
              Set Daily Nutrition Targets
            </h3>
            <form onSubmit={handleSaveGoals} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">
                  Target Daily Calories (kcal)
                </label>
                <input
                  type="number"
                  value={targetCals}
                  onChange={(e) => setTargetCals(Number(e.target.value))}
                  className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">
                  Target Daily Protein (g)
                </label>
                <input
                  type="number"
                  value={targetProtein}
                  onChange={(e) => setTargetProtein(Number(e.target.value))}
                  className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">
                  Target Daily Water (Liters)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={targetWater}
                  onChange={(e) => setTargetWater(Number(e.target.value))}
                  className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark font-mono focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsGoalModalOpen(false)} 
                  className="px-4 py-1.5 text-xs text-primary-secondary dark:text-stone-300 hover:bg-warm-subtle rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-1.5 bg-sage-500 text-white rounded-xl text-xs font-medium shadow-subtle hover:bg-sage-600 transition-quiet"
                >
                  Save Targets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
