import React, { useState } from 'react';
import { Dumbbell, Calendar, ClipboardList, Flame, Award, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { WeeklySplitPlanner } from '../gym/WeeklySplitPlanner';

interface InternetPlan {
  id: string;
  name: string;
  creator: string;
  category: string;
  description: string;
  frequency: string;
  exercises: { name: string; sets: string; weight: string }[];
}

const FAMOUS_INTERNET_PLANS: InternetPlan[] = [
  {
    id: 'plan-arnold',
    name: 'Arnold Golden Era Split',
    creator: 'Arnold Schwarzenegger (7x Mr. Olympia)',
    category: 'High Volume Antagonist Supersets',
    frequency: '6 Days / Week',
    description: 'The legendary 70s Golden Era workout split. Pairs antagonist muscle groups (Chest & Back) for maximum muscle pump, hypertrophy, and width.',
    exercises: [
      { name: 'Flat Barbell Bench Press', sets: '5 sets × 8–10 reps', weight: '85–95 kg' },
      { name: 'Wide-Grip Pull-Ups (Chins)', sets: '5 sets × 10 reps', weight: 'Bodyweight' },
      { name: 'Incline Dumbbell Press', sets: '4 sets × 10 reps', weight: '32 kg' },
      { name: 'T-Bar Barbell Row', sets: '4 sets × 10 reps', weight: '70 kg' },
      { name: 'Standing Barbell Bicep Curl', sets: '4 sets × 10 reps', weight: '35 kg' },
      { name: 'Lying Tricep Skullcrushers', sets: '4 sets × 12 reps', weight: '30 kg' },
    ]
  },
  {
    id: 'plan-gvt',
    name: 'German Volume Training (GVT 10×10)',
    creator: 'Charles Poliquin / German Weightlifting Federation',
    category: 'Extreme Hypertrophy Shock Protocol',
    frequency: '5 Days / Week',
    description: 'High-volume 10-set 10-rep German shock system designed to force deep muscle fiber hypertrophy through massive workload volume.',
    exercises: [
      { name: 'Barbell Bench Press (GVT 10×10)', sets: '10 sets × 10 reps', weight: '65 kg (60% 1RM)' },
      { name: 'Bent-Over Barbell Row (GVT 10×10)', sets: '10 sets × 10 reps', weight: '55 kg (60% 1RM)' },
      { name: 'Barbell Back Squat (GVT 10×10)', sets: '10 sets × 10 reps', weight: '80 kg (60% 1RM)' },
      { name: 'Incline Dumbbell Flyes', sets: '3 sets × 12 reps', weight: '16 kg' },
      { name: 'Standing Calf Raises', sets: '3 sets × 15 reps', weight: '50 kg' },
    ]
  },
  {
    id: 'plan-ppl',
    name: 'Science-Based Push / Pull / Legs (PPL)',
    creator: 'Dr. Mike Israetel / Renaissance Periodization',
    category: 'Science-Based Muscle Mass Split',
    frequency: '6 Days / Week',
    description: 'The gold-standard science-backed workout routine optimizing muscle protein synthesis and rest intervals for balanced muscle growth.',
    exercises: [
      { name: 'Barbell Bench Press (Push A)', sets: '4 sets × 8 reps', weight: '80 kg' },
      { name: 'Incline Dumbbell Press (Push A)', sets: '3 sets × 10 reps', weight: '28 kg' },
      { name: 'Overhead Barbell Press (Push A)', sets: '3 sets × 8 reps', weight: '50 kg' },
      { name: 'Barbell Deadlift (Pull A)', sets: '3 sets × 5 reps', weight: '140 kg' },
      { name: 'Wide Lat Pulldown (Pull A)', sets: '4 sets × 10 reps', weight: '65 kg' },
      { name: 'Barbell Back Squat (Legs A)', sets: '4 sets × 8 reps', weight: '100 kg' },
    ]
  },
  {
    id: 'plan-phat',
    name: 'PHAT: Power Hypertrophy Adaptive Training',
    creator: 'Dr. Layne Norton (PhD)',
    category: 'Powerbuilding (Strength + Hypertrophy)',
    frequency: '5 Days / Week',
    description: 'Blends 2 heavy powerlifting compound days with 3 high-velocity hypertrophy days to maximize raw strength and bodybuilding aesthetics.',
    exercises: [
      { name: 'Heavy Bent-Over Barbell Row', sets: '3 sets × 5 reps', weight: '85 kg' },
      { name: 'Weighted Pull-Ups', sets: '2 sets × 8 reps', weight: '+15 kg' },
      { name: 'Heavy Flat Dumbbell Press', sets: '3 sets × 5 reps', weight: '36 kg' },
      { name: 'Weighted Chest Dips', sets: '2 sets × 10 reps', weight: '+20 kg' },
      { name: 'Heavy Barbell Back Squat', sets: '3 sets × 5 reps', weight: '110 kg' },
    ]
  },
  {
    id: 'plan-531',
    name: 'Wendler 5/3/1 Powerlifting Protocol',
    creator: 'Jim Wendler (Elite Powerlifter)',
    category: 'Raw Barbell Compound Strength',
    frequency: '4 Days / Week',
    description: 'The ultimate percentage-based strength progression program built around the 4 big barbell lifts: Squat, Bench, Deadlift, and OHP.',
    exercises: [
      { name: 'Barbell Back Squat (5/3/1 Main)', sets: '3 sets × 5/3/1 reps', weight: '120 kg' },
      { name: 'Barbell Bench Press (5/3/1 Main)', sets: '3 sets × 5/3/1 reps', weight: '95 kg' },
      { name: 'Barbell Deadlift (5/3/1 Main)', sets: '3 sets × 5/3/1 reps', weight: '150 kg' },
      { name: 'Standing Military Press (5/3/1 Main)', sets: '3 sets × 5/3/1 reps', weight: '60 kg' },
    ]
  },
  {
    id: 'plan-bro',
    name: 'Classic 5-Day Bodybuilding Bro Split',
    creator: 'Old School Bodybuilding Standard',
    category: 'Single Muscle Group Isolation',
    frequency: '5 Days / Week',
    description: 'Classic single-muscle bodypart focus per day allowing maximum localized fatigue, deep pumps, and extended 7-day recovery windows.',
    exercises: [
      { name: 'Barbell Bench Press (Chest Day)', sets: '4 sets × 8 reps', weight: '80 kg' },
      { name: 'Lat Pulldown Wide (Back Day)', sets: '4 sets × 10 reps', weight: '60 kg' },
      { name: 'Seated DB Shoulder Press (Delts)', sets: '4 sets × 10 reps', weight: '24 kg' },
      { name: 'Barbell Bicep Curls (Arms Day)', sets: '4 sets × 10 reps', weight: '30 kg' },
      { name: 'Barbell Back Squat (Legs Day)', sets: '4 sets × 8 reps', weight: '95 kg' },
    ]
  }
];

export const GymArea: React.FC = () => {
  const { workoutPlans } = useStore();
  const [activeTab, setActiveTab] = useState<'split' | 'plans'>('split');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>('plan-arnold');

  // Combined plans: user custom store plans + famous internet plans
  const displayPlans = workoutPlans && workoutPlans.length > 0 ? workoutPlans : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sage-600 dark:bg-sage-600 text-white">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">
              Gym & Fitness
            </h1>
            <p className="text-xs text-primary-secondary dark:text-stone-400 font-mono mt-0.5">
              Personal Training Routine & Target Muscle Split
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-warm-subtle dark:bg-[#141416] rounded-2xl border border-warm-border dark:border-warm-border-dark">
          {[
            { id: 'split', label: 'Weekly Split', icon: Calendar },
            { id: 'plans', label: 'Workout Plans', icon: ClipboardList }
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold rounded-xl transition-all ${
                  isActive
                    ? 'bg-warm-card dark:bg-[#1E1E22] text-sage-600 dark:text-sage-300 border border-warm-border/60 dark:border-[#2C2C32]'
                    : 'text-primary-secondary dark:text-stone-400 hover:text-primary-text dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sage-600 dark:text-sage-300' : 'text-stone-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Interactive Weekly Workout Split Planner */}
      {activeTab === 'split' && <WeeklySplitPlanner />}

      {/* Tab 2: Famous Internet Workout Plans to Follow */}
      {activeTab === 'plans' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-warm-card dark:bg-[#141416] p-4 rounded-2xl border border-warm-border dark:border-warm-border-dark flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark">
                  Internet Pro Workout Routines
                </h3>
                <p className="text-xs text-primary-secondary dark:text-stone-400 font-mono">
                  Curated famous bodybuilding, powerbuilding & GVT shock plans from the fitness community
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-sage-500/15 text-sage-700 dark:text-sage-300 border border-sage-500/30">
              {FAMOUS_INTERNET_PLANS.length} Plans Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAMOUS_INTERNET_PLANS.map((plan) => {
              const isExpanded = expandedPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  className="bg-warm-card dark:bg-[#141416] p-5 rounded-2xl border border-warm-border dark:border-warm-border-dark space-y-4 hover:border-sage-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark">
                          {plan.name}
                        </h3>
                        <p className="text-[11px] font-mono text-sage-600 dark:text-sage-300 font-bold">
                          {plan.creator}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-warm-subtle dark:bg-[#1E1E22] text-primary-text dark:text-stone-300 border border-warm-border dark:border-[#2C2C32] whitespace-nowrap">
                        {plan.frequency}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        {plan.category}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-primary-secondary dark:text-stone-400 leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Exercise List */}
                    <div className="space-y-1.5 pt-2 border-t border-warm-border/60 dark:border-warm-border-dark/60 text-xs">
                      {plan.exercises.map((ex, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-warm-subtle/70 dark:bg-[#1A1A1E] border border-warm-border/40 dark:border-[#26262B]"
                        >
                          <span className="font-medium text-primary-text dark:text-stone-200">• {ex.name}</span>
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="text-primary-secondary dark:text-stone-400">{ex.sets}</span>
                            <span className="font-bold text-sage-600 dark:text-sage-300 bg-sage-500/10 px-2 py-0.5 rounded-md border border-sage-500/20">
                              {ex.weight}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
