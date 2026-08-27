import React, { useState } from 'react';
import { Home, Calendar, CheckSquare, BookOpen, Menu, X, Target, Repeat, Activity, FolderKanban, BookCheck, Inbox, Settings, Utensils } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ViewType } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, areas, inbox, setNewAreaOpen } = useStore();
  const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);

  const mainTabs: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'daily-log', label: 'Log', icon: <BookOpen className="w-5 h-5" /> },
  ];

  const moreItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'goals', label: 'Goals', icon: <Target className="w-5 h-5" /> },
    { id: 'habits', label: 'Habits', icon: <Repeat className="w-5 h-5" /> },
    { id: 'heatmap', label: 'Activity & Heatmap', icon: <Activity className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-5 h-5" /> },
    { id: 'reviews', label: 'Reviews', icon: <BookCheck className="w-5 h-5" /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-5 h-5" /> },
    { id: 'academics', label: 'Academics', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'gym', label: 'Gym', icon: <Activity className="w-5 h-5" /> },
    { id: 'nutrition', label: 'Diet & Nutrition', icon: <Utensils className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Slide-out Drawer for More */}
      {isMoreMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
          onClick={() => setMoreMenuOpen(false)}
        >
          <div 
            className="absolute bottom-16 left-0 right-0 bg-warm-bg dark:bg-warm-bg-dark rounded-t-2xl p-5 border-t border-warm-border dark:border-warm-border-dark max-h-[75vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-warm-border dark:border-warm-border-dark">
              <span className="font-serif text-lg">MOSAIC Navigation</span>
              <button 
                onClick={() => setMoreMenuOpen(false)}
                className="p-1 text-primary-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMoreMenuOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-quiet ${
                    currentView === item.id 
                      ? 'bg-sage-500/10 border-sage-500 text-sage-700 dark:text-sage-300' 
                      : 'border-warm-border dark:border-warm-border-dark text-primary-text dark:text-primary-text-dark hover:bg-warm-subtle'
                  }`}
                >
                  {item.icon}
                  <span className="text-[11px] mt-1 font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-warm-bg dark:bg-warm-bg-dark border-t border-warm-border dark:border-warm-border-dark flex items-center justify-around z-30 px-2">
        {mainTabs.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentView(tab.id);
                setMoreMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-quiet ${
                isActive ? 'text-sage-600 dark:text-sage-300' : 'text-primary-secondary'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setMoreMenuOpen(!isMoreMenuOpen)}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-quiet ${
            isMoreMenuOpen ? 'text-sage-600 dark:text-sage-300' : 'text-primary-secondary'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">More</span>
        </button>
      </div>
    </>
  );
};
