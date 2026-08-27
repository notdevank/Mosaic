import React from 'react';
import { useStore } from '../../store/useStore';
import { MuscleGroup, WeeklySplitDay } from '../../types';
import { Sparkles, RefreshCw, Flame, Zap } from 'lucide-react';

interface MuscleInfo {
  id: MuscleGroup;
  name: string;
  subtitle: string;
  iconSvg: React.ReactNode;
}

// Vector SVG Illustrations for Anatomical Muscle Groups
const MuscleGraphic: React.FC<{ type: MuscleGroup; className?: string }> = ({ type, className = "w-16 h-20" }) => {
  switch (type) {
    case 'chest':
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="18" r="10" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M44 28 L44 34 M56 28 L56 34" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M30 36 C35 34 65 34 70 36 L78 46 L72 75 L62 105 L38 105 L28 75 L22 46 Z" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M34 42 C42 40 48 44 49 58 C44 64 34 62 30 52 Z" fill="#68735C" className="dark:fill-[#9BB088]" stroke="#545E4A" strokeWidth="1.5" />
          <path d="M66 42 C58 40 52 44 51 58 C56 64 66 62 70 52 Z" fill="#68735C" className="dark:fill-[#9BB088]" stroke="#545E4A" strokeWidth="1.5" />
          <line x1="50" y1="36" x2="50" y2="70" stroke="currentColor" strokeWidth="1.5" className="text-stone-300 dark:text-stone-600" />
        </svg>
      );
    case 'back':
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="18" r="10" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M44 28 L44 34 M56 28 L56 34" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M30 36 C35 34 65 34 70 36 L78 46 L72 75 L62 105 L38 105 L28 75 L22 46 Z" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M34 40 L48 38 L48 68 C38 68 32 58 34 40 Z" fill="#68735C" className="dark:fill-[#9BB088]" stroke="#545E4A" strokeWidth="1.5" />
          <path d="M66 40 L52 38 L52 68 C62 68 68 58 66 40 Z" fill="#68735C" className="dark:fill-[#9BB088]" stroke="#545E4A" strokeWidth="1.5" />
          <path d="M40 36 L50 48 L60 36 Z" fill="#7E8B6E" className="dark:fill-[#849274]" />
          <line x1="50" y1="34" x2="50" y2="90" stroke="currentColor" strokeWidth="1.5" className="text-stone-300 dark:text-stone-600" />
        </svg>
      );
    case 'legs':
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 15 L68 15 L62 32 L38 32 Z" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M34 32 L26 70 L30 110 L44 110 L46 70 L48 32" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M66 32 L74 70 L70 110 L56 110 L54 70 L52 32" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M34 36 C42 36 44 55 42 66 C34 66 30 52 32 38 Z" fill="#68735C" className="dark:fill-[#9BB088]" stroke="#545E4A" strokeWidth="1.5" />
          <path d="M66 36 C58 36 56 55 58 66 C66 66 70 52 68 38 Z" fill="#68735C" className="dark:fill-[#9BB088]" stroke="#545E4A" strokeWidth="1.5" />
        </svg>
      );
    case 'shoulders':
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="18" r="10" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M44 28 L44 34 M56 28 L56 34" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M30 36 C35 34 65 34 70 36 L78 46 L72 75 L62 105 L38 105 L28 75 L22 46 Z" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M22 44 C20 36 30 34 36 38 C34 48 28 54 22 44 Z" fill="#68735C" className="dark:fill-[#9BB088]" stroke="#545E4A" strokeWidth="1.5" />
          <path d="M78 44 C80 36 70 34 64 38 C66 48 72 54 78 44 Z" fill="#68735C" className="dark:fill-[#9BB088]" stroke="#545E4A" strokeWidth="1.5" />
        </svg>
      );
    case 'arms':
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36 30 L64 30 L60 85 L40 85 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" className="text-stone-300 dark:text-stone-600" />
          <path d="M22 32 C30 32 34 50 30 65 L20 65 C16 50 18 34 22 32 Z" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M24 36 C30 38 31 48 28 56 C22 56 20 44 24 36 Z" fill="#68735C" className="dark:fill-[#9BB088]" stroke="#545E4A" strokeWidth="1.5" />
          <path d="M78 32 C70 32 66 50 70 65 L80 65 C84 50 82 34 78 32 Z" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <path d="M76 36 C70 38 69 48 72 56 C78 56 80 44 76 36 Z" fill="#68735C" className="dark:fill-[#9BB088]" stroke="#545E4A" strokeWidth="1.5" />
        </svg>
      );
    case 'abs':
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 36 C35 34 65 34 70 36 L74 65 L64 100 L36 100 L26 65 Z" stroke="currentColor" strokeWidth="2.5" className="text-stone-400 dark:text-stone-500" />
          <rect x="41" y="45" width="8" height="12" rx="2" fill="#68735C" className="dark:fill-[#9BB088]" />
          <rect x="51" y="45" width="8" height="12" rx="2" fill="#68735C" className="dark:fill-[#9BB088]" />
          <rect x="41" y="60" width="8" height="12" rx="2" fill="#68735C" className="dark:fill-[#9BB088]" />
          <rect x="51" y="60" width="8" height="12" rx="2" fill="#68735C" className="dark:fill-[#9BB088]" />
          <rect x="42" y="75" width="7" height="10" rx="2" fill="#68735C" className="dark:fill-[#9BB088]" />
          <rect x="51" y="75" width="7" height="10" rx="2" fill="#68735C" className="dark:fill-[#9BB088]" />
        </svg>
      );
    case 'rest':
    default:
      return (
        <div className={`${className} flex items-center justify-center`}>
          <div className="w-14 h-14 rounded-full bg-sage-500/15 dark:bg-sage-500/25 border border-sage-500/40 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-sage-600 dark:text-sage-300 fill-current">
              <path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm7.5 13.5l-2.2-4.4c-.4-.8-1.2-1.3-2.1-1.3h-6.4c-.9 0-1.7.5-2.1 1.3l-2.2 4.4c-.4.8-.2 1.8.5 2.3s1.8.2 2.3-.5l1.6-3.3v4.5c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-4.5l1.6 3.3c.5.9 1.6 1.2 2.3.5.7-.5.9-1.5.5-2.3z" />
            </svg>
          </div>
        </div>
      );
  }
};

const MUSCLE_PALETTE: MuscleInfo[] = [
  { id: 'chest', name: 'CHEST', subtitle: 'Pectorals', iconSvg: <MuscleGraphic type="chest" /> },
  { id: 'back', name: 'BACK', subtitle: 'Lats & Traps', iconSvg: <MuscleGraphic type="back" /> },
  { id: 'legs', name: 'LEGS', subtitle: 'Quads & Hams', iconSvg: <MuscleGraphic type="legs" /> },
  { id: 'shoulders', name: 'SHOULDERS', subtitle: 'Deltoids', iconSvg: <MuscleGraphic type="shoulders" /> },
  { id: 'arms', name: 'ARMS', subtitle: 'Biceps & Triceps', iconSvg: <MuscleGraphic type="arms" /> },
  { id: 'abs', name: 'ABS', subtitle: 'Core Abdominals', iconSvg: <MuscleGraphic type="abs" /> },
  { id: 'rest', name: 'REST', subtitle: 'Recovery', iconSvg: <MuscleGraphic type="rest" /> },
];

export const WeeklySplitPlanner: React.FC = () => {
  const { weeklySplit, updateWeeklySplitDay } = useStore();

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

  const applyPresetSplit = (preset: 'ppl' | 'gvt' | 'arnold' | 'bro' | 'beast' | 'upper_lower' | 'rest') => {
    let newSplit: { day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'; muscleGroup: MuscleGroup }[] = [];
    
    if (preset === 'ppl') {
      newSplit = [
        { day: 'MON', muscleGroup: 'chest' },
        { day: 'TUE', muscleGroup: 'back' },
        { day: 'WED', muscleGroup: 'legs' },
        { day: 'THU', muscleGroup: 'shoulders' },
        { day: 'FRI', muscleGroup: 'arms' },
        { day: 'SAT', muscleGroup: 'abs' },
        { day: 'SUN', muscleGroup: 'rest' },
      ];
    } else if (preset === 'gvt') {
      newSplit = [
        { day: 'MON', muscleGroup: 'chest' },
        { day: 'TUE', muscleGroup: 'rest' },
        { day: 'WED', muscleGroup: 'back' },
        { day: 'THU', muscleGroup: 'rest' },
        { day: 'FRI', muscleGroup: 'legs' },
        { day: 'SAT', muscleGroup: 'shoulders' },
        { day: 'SUN', muscleGroup: 'rest' },
      ];
    } else if (preset === 'arnold') {
      newSplit = [
        { day: 'MON', muscleGroup: 'chest' },
        { day: 'TUE', muscleGroup: 'back' },
        { day: 'WED', muscleGroup: 'shoulders' },
        { day: 'THU', muscleGroup: 'arms' },
        { day: 'FRI', muscleGroup: 'legs' },
        { day: 'SAT', muscleGroup: 'abs' },
        { day: 'SUN', muscleGroup: 'rest' },
      ];
    } else if (preset === 'bro') {
      newSplit = [
        { day: 'MON', muscleGroup: 'chest' },
        { day: 'TUE', muscleGroup: 'back' },
        { day: 'WED', muscleGroup: 'shoulders' },
        { day: 'THU', muscleGroup: 'arms' },
        { day: 'FRI', muscleGroup: 'legs' },
        { day: 'SAT', muscleGroup: 'rest' },
        { day: 'SUN', muscleGroup: 'rest' },
      ];
    } else if (preset === 'beast') {
      newSplit = [
        { day: 'MON', muscleGroup: 'chest' },
        { day: 'TUE', muscleGroup: 'back' },
        { day: 'WED', muscleGroup: 'legs' },
        { day: 'THU', muscleGroup: 'shoulders' },
        { day: 'FRI', muscleGroup: 'arms' },
        { day: 'SAT', muscleGroup: 'legs' },
        { day: 'SUN', muscleGroup: 'rest' },
      ];
    } else if (preset === 'upper_lower') {
      newSplit = [
        { day: 'MON', muscleGroup: 'chest' },
        { day: 'TUE', muscleGroup: 'legs' },
        { day: 'WED', muscleGroup: 'back' },
        { day: 'THU', muscleGroup: 'legs' },
        { day: 'FRI', muscleGroup: 'shoulders' },
        { day: 'SAT', muscleGroup: 'arms' },
        { day: 'SUN', muscleGroup: 'rest' },
      ];
    } else if (preset === 'rest') {
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Crazy Preset Selector */}
      <div className="bg-warm-card dark:bg-[#141416] p-5 rounded-2xl border border-warm-border dark:border-warm-border-dark space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-warm-border/60 dark:border-warm-border-dark/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sage-500/10 text-sage-600 dark:text-sage-300 border border-sage-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-medium text-primary-text dark:text-primary-text-dark">
                  Weekly Workout Split
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-sage-500/15 text-sage-700 dark:text-sage-300 border border-sage-500/30">
                  7-Day Routine
                </span>
              </div>
              <p className="text-xs text-primary-secondary dark:text-stone-400 font-mono mt-0.5">
                Target muscle group allocation across your training week
              </p>
            </div>
          </div>

          <button
            onClick={() => applyPresetSplit('ppl')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-warm-subtle dark:bg-[#1E1E22] border border-warm-border dark:border-warm-border-dark text-xs font-mono text-primary-text dark:text-stone-300 hover:text-sage-600 dark:hover:text-sage-300 hover:border-sage-500/40 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset PPL</span>
          </button>
        </div>

        {/* Famous Internet Split Presets */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-primary-secondary dark:text-stone-300 font-mono">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-bold uppercase tracking-wider">Famous Internet Split Presets:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              onClick={() => applyPresetSplit('gvt')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sage-500/10 text-sage-700 dark:text-sage-300 border border-sage-500/30 font-mono text-xs hover:bg-sage-500/20 transition-all font-bold"
            >
              🔥 GVT (German 10×10)
            </button>

            <button
              onClick={() => applyPresetSplit('arnold')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-mono text-xs hover:bg-amber-500/20 transition-all font-bold"
            >
              🏆 Arnold Golden Era
            </button>

            <button
              onClick={() => applyPresetSplit('ppl')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-warm-subtle dark:bg-[#1E1E22] border border-warm-border dark:border-warm-border-dark font-mono text-xs text-primary-text dark:text-stone-300 hover:border-sage-500/50 hover:bg-sage-500/10 transition-all"
            >
              ⚡ PPL 6-Day Hypertrophy
            </button>

            <button
              onClick={() => applyPresetSplit('bro')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-warm-subtle dark:bg-[#1E1E22] border border-warm-border dark:border-warm-border-dark font-mono text-xs text-primary-text dark:text-stone-300 hover:border-sage-500/50 hover:bg-sage-500/10 transition-all"
            >
              💪 Classic 5-Day Bro Split
            </button>

            <button
              onClick={() => applyPresetSplit('beast')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-mono text-xs hover:bg-rose-500/20 transition-all font-bold"
            >
              🦍 Heavy Metal Beast Mode
            </button>

            <button
              onClick={() => applyPresetSplit('upper_lower')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-warm-subtle dark:bg-[#1E1E22] border border-warm-border dark:border-warm-border-dark font-mono text-xs text-primary-text dark:text-stone-300 hover:border-sage-500/50 hover:bg-sage-500/10 transition-all"
            >
              🏋️ Upper / Lower Power
            </button>

            <button
              onClick={() => applyPresetSplit('rest')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-warm-subtle dark:bg-[#1E1E22] border border-warm-border dark:border-warm-border-dark font-mono text-xs text-primary-text dark:text-stone-300 hover:border-sage-500/50 hover:bg-sage-500/10 transition-all"
            >
              🧘 Rest Heavy
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Weekly Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {splitDays.map((item) => {
          const muscleInfo = MUSCLE_PALETTE.find(m => m.id === item.muscleGroup) || MUSCLE_PALETTE[0];
          const isToday = item.day === currentTodayKey;

          return (
            <div
              key={item.day}
              className={`bg-warm-card dark:bg-[#141416] rounded-2xl overflow-hidden flex flex-col justify-between border transition-all duration-200 ${
                isToday
                  ? 'border-sage-500 dark:border-sage-400 ring-2 ring-sage-500/20'
                  : 'border-warm-border dark:border-warm-border-dark hover:border-sage-500/40'
              }`}
            >
              {/* Day Header Banner (Flush top) */}
              <div className={`w-full font-mono text-center text-xs font-bold uppercase py-2 tracking-widest flex items-center justify-center gap-1.5 ${
                isToday
                  ? 'bg-sage-600 dark:bg-sage-600 text-white'
                  : 'bg-warm-subtle dark:bg-[#1E1E22] text-primary-text dark:text-stone-300 border-b border-warm-border dark:border-warm-border-dark'
              }`}>
                <span>{item.day}</span>
                {isToday && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-white/20 text-white rounded-full font-sans tracking-normal">
                    TODAY
                  </span>
                )}
              </div>

              {/* Muscle Title */}
              <div className="text-center pt-4 px-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-text dark:text-primary-text-dark block">
                  {muscleInfo.name}
                </span>
                <span className="text-[10px] font-mono text-primary-secondary dark:text-stone-400 block mt-0.5">
                  {muscleInfo.subtitle}
                </span>
              </div>

              {/* Grounded Muscle Graphic Showcase */}
              <div className="flex items-center justify-center py-4 px-2">
                <div className="p-3.5 rounded-2xl bg-warm-subtle/80 dark:bg-[#1A1A1E] border border-warm-border/60 dark:border-[#26262B] flex items-center justify-center">
                  {muscleInfo.iconSvg}
                </div>
              </div>

              {/* Target Muscle Selector Button/Dropdown */}
              <div className="p-2 border-t border-warm-border dark:border-warm-border-dark bg-warm-subtle/40 dark:bg-[#101012]">
                <select
                  value={item.muscleGroup}
                  onChange={(e) => updateWeeklySplitDay(item.day, e.target.value as MuscleGroup)}
                  style={{ color: 'inherit' }}
                  className="w-full bg-warm-card dark:!bg-[#1E1E22] border border-warm-border dark:border-[#2C2C32] rounded-xl text-[11px] font-mono font-medium text-center py-2 px-2 text-primary-text dark:!text-white focus:outline-none focus:border-sage-500 cursor-pointer hover:border-sage-500/50 transition-colors"
                >
                  {MUSCLE_PALETTE.map((m) => (
                    <option key={m.id} value={m.id} className="bg-white dark:!bg-[#1E1E22] text-black dark:!text-white" style={{ color: 'inherit' }}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
