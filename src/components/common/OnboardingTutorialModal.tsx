import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckSquare, 
  Target, 
  Repeat, 
  Activity, 
  Calendar, 
  GraduationCap, 
  Dumbbell, 
  Utensils, 
  MessageSquare, 
  Search, 
  ArrowRight, 
  ArrowLeft, 
  X,
  Check
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export const OnboardingTutorialModal: React.FC = () => {
  const { userSettings, updateUserSettings } = useStore();
  const [currentStep, setCurrentStep] = useState(0);

  if (userSettings.hasCompletedTutorial) return null;

  const handleFinish = () => {
    updateUserSettings({ hasCompletedTutorial: true });
  };

  const tutorialSteps = [
    {
      title: "Welcome to Mosaic LifeOS",
      subtitle: "Your unified personal operating system",
      icon: <Sparkles className="w-8 h-8 text-sage-400" />,
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p>
            Mosaic is designed around the <strong className="text-white font-medium">PARA methodology</strong> to bring order, clarity, and peace of mind to your daily workflow.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#222222] border border-[#2A2A2A]">
              <div className="font-bold text-white text-xs uppercase mb-1">🎯 Actionable</div>
              <div className="text-xs text-zinc-400">Tasks, Goals, Habits & Calendar Agenda</div>
            </div>
            <div className="p-3 rounded-xl bg-[#222222] border border-[#2A2A2A]">
              <div className="font-bold text-white text-xs uppercase mb-1">🏛️ Specialized Areas</div>
              <div className="text-xs text-zinc-400">Academics, Gym, Diet, Communication</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Tasks & Agenda",
      subtitle: "Stay organized day by day",
      icon: <CheckSquare className="w-8 h-8 text-sage-400" />,
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p>
            Track your tasks with subtasks, due dates, and priority filters. Manage your schedule in **Month**, **Week**, or **Day** views with an hour-by-hour timeline.
          </p>
          <div className="p-3 rounded-xl bg-[#222222] border border-[#2A2A2A] text-xs space-y-1">
            <div className="font-mono text-sage-300">• Tasks link directly to Goals & Areas</div>
            <div className="font-mono text-sage-300">• Calendar agenda aggregates Events & Deadlines</div>
          </div>
        </div>
      )
    },
    {
      title: "Habits & Consistency Heatmap",
      subtitle: "Build atomic habits that stick",
      icon: <Repeat className="w-8 h-8 text-sage-400" />,
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p>
            Log daily habit completions and watch your **365-Day Consistency Heatmap** light up!
          </p>
          <div className="p-3 rounded-xl bg-[#222222] border border-[#2A2A2A] text-xs font-mono space-y-1">
            <div>🔥 Calculates active & best streaks</div>
            <div>📊 Interactive daily detail drawer</div>
          </div>
        </div>
      )
    },
    {
      title: "Specialized Life Areas",
      subtitle: "Academics, Gym, Diet & Communication",
      icon: <GraduationCap className="w-8 h-8 text-sage-400" />,
      content: (
        <div className="space-y-2 text-xs text-zinc-300">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-[#222222] border border-[#2A2A2A]">
              <span className="font-bold text-white block mb-0.5">📚 Academics</span>
              <span>Course grades, assignments & exams</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#222222] border border-[#2A2A2A]">
              <span className="font-bold text-white block mb-0.5">🏋️ Gym & Fitness</span>
              <span>Workout plans & exercise logs</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#222222] border border-[#2A2A2A]">
              <span className="font-bold text-white block mb-0.5">🥗 Diet & Nutrition</span>
              <span>Meal logging, macros & hydration</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#222222] border border-[#2A2A2A]">
              <span className="font-bold text-white block mb-0.5">💬 Communication</span>
              <span>People CRM & interaction history</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Quick Commands & Shortcuts",
      subtitle: "Lightning fast navigation",
      icon: <Search className="w-8 h-8 text-sage-400" />,
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p>
            Press <kbd className="px-2 py-1 bg-[#2A2A2A] border border-[#3A3A3A] rounded text-white font-mono text-xs">Ctrl + K</kbd> anywhere in Mosaic to launch <strong>Global Search</strong> or <strong>Quick Capture</strong>!
          </p>
          <div className="p-3 rounded-xl bg-sage-500/10 border border-sage-500/30 text-xs text-sage-200 font-medium">
            You're all set! Enjoy mastering your life with Mosaic.
          </div>
        </div>
      )
    }
  ];

  const activeStep = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-[#161616] border border-[#2A2A2A] shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sage-500/10 border border-sage-500/30">
              {activeStep.icon}
            </div>
            <div>
              <h2 className="font-serif text-xl text-white font-medium">{activeStep.title}</h2>
              <p className="text-xs text-zinc-400 font-mono">{activeStep.subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#222222] transition-quiet"
            title="Skip tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="min-h-[140px] flex items-center">
          {activeStep.content}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-4">
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {tutorialSteps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  currentStep === idx ? 'w-6 bg-sage-400' : 'w-1.5 bg-[#333333]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-[#222222] transition-quiet"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {currentStep < tutorialSteps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-medium bg-sage-500 hover:bg-sage-600 text-white shadow-subtle transition-quiet"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-medium bg-sage-500 hover:bg-sage-600 text-white shadow-subtle transition-quiet"
              >
                <Check className="w-4 h-4" />
                <span>Get Started</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
