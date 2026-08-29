import React from 'react';
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  Target, 
  Repeat, 
  BookOpen, 
  Activity as HeatmapIcon, 
  FolderKanban, 
  BookCheck, 
  Inbox, 
  Settings, 
  GraduationCap, 
  Dumbbell, 
  MessageSquare, 
  Trash2,
  Sparkles,
  Compass,
  Utensils,
  Archive
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ViewType } from '../../types';
import { MosaicAmbientBG } from '../common/MosaicAmbientBG';
import { MosaicPixelGrid } from '../common/MosaicPixelGrid';

export const Sidebar: React.FC = () => {
  const { 
    currentView, 
    selectedCustomAreaId, 
    setCurrentView, 
    areas, 
    deleteCustomArea, 
    inbox
  } = useStore();

  const unprocessedInboxCount = inbox.filter(i => i.status === 'inbox').length;

  const navItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-4 h-4" />, badge: unprocessedInboxCount },
    { id: 'today', label: 'Today', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'journal', label: 'Journal', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'habits', label: 'Habits', icon: <Repeat className="w-4 h-4" /> },
    { id: 'heatmap', label: 'Life Heatmap', icon: <HeatmapIcon className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'archive', label: 'Archive', icon: <Archive className="w-4 h-4" /> },
  ];

  const getAreaIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
      case 'Dumbbell': return <Dumbbell className="w-4 h-4" />;
      case 'Utensils': return <Utensils className="w-4 h-4" />;
      case 'FolderKanban': return <FolderKanban className="w-4 h-4" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4" />;
      default: return <Compass className="w-4 h-4" />;
    }
  };

  const coreAreas = areas.filter(a => !a.isCustom && a.id !== 'projects');
  const customAreas = areas.filter(a => a.isCustom);

  return (
    <aside className="w-64 border-r border-warm-border dark:border-warm-border-dark h-screen flex flex-col bg-warm-bg dark:bg-warm-bg-dark select-none shrink-0 transition-quiet relative overflow-hidden">
      {/* Interactive Floating Glass Mosaic Canvas Engine */}
      <MosaicAmbientBG />

      {/* Foreground Content Layer */}
      <div className="relative z-10 flex flex-col h-full py-6 px-4 overflow-y-auto pointer-events-none">
        {/* Brand Mark */}
        <div 
          data-tauri-drag-region
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 px-3 mb-8 cursor-pointer group pointer-events-auto"
        >
          <div className="w-8 h-8 rounded-xl bg-sage-500 flex items-center justify-center text-white group-hover:scale-105 transition-all duration-300 shadow-sm">
            <div className="grid grid-cols-2 gap-1 w-4 h-4">
              <div className="bg-white/90 rounded-[2px] group-hover:scale-90 transition-transform duration-200"></div>
              <div className="bg-white/60 rounded-[2px] group-hover:scale-90 transition-transform duration-200 delay-75"></div>
              <div className="bg-white/40 rounded-[2px] group-hover:scale-90 transition-transform duration-200 delay-100"></div>
              <div className="bg-white/90 rounded-[2px] group-hover:scale-90 transition-transform duration-200 delay-150"></div>
            </div>
          </div>
          <div>
            <h1 className="font-serif tracking-wide text-xl font-bold text-primary-text dark:text-primary-text-dark">
              Mosaic
            </h1>
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="space-y-0.5 pointer-events-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 relative group backdrop-blur-sm ${
                  isActive 
                    ? 'bg-sage-500/15 dark:bg-sage-500/25 text-sage-700 dark:text-sage-300 font-semibold border border-sage-500/20 dark:border-sage-500/30' 
                    : 'text-primary-text/80 dark:text-zinc-400 hover:bg-warm-subtle/80 dark:hover:bg-warm-subtle-dark/80 hover:text-primary-text dark:hover:text-white border border-transparent'
                }`}
              >
                {/* Active Pill Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-sage-500 dark:bg-sage-400" />
                )}

                <div className="flex items-center gap-2.5">
                  <span className={`transition-all duration-150 ${isActive ? 'text-sage-600 dark:text-sage-300 scale-110' : 'text-primary-secondary dark:text-zinc-400 group-hover:text-primary-text dark:group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-sage-500 text-white font-mono">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-warm-border dark:border-warm-border-dark/60 pointer-events-auto" />

        {/* Areas Section */}
        <div className="space-y-1 flex-1 pointer-events-auto">
          <div className="px-3 text-[11px] font-mono uppercase tracking-wider text-primary-secondary dark:text-zinc-400 mb-2">
            Areas
          </div>

          {/* Built-in Areas */}
          {coreAreas.map((area) => {
            const isAreaActive = currentView === (area.id as ViewType);
            return (
              <button
                key={area.id}
                onClick={() => setCurrentView(area.id as ViewType)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 relative group backdrop-blur-sm ${
                  isAreaActive 
                    ? 'bg-sage-500/15 dark:bg-sage-500/25 text-sage-700 dark:text-sage-300 font-semibold border border-sage-500/20 dark:border-sage-500/30' 
                    : 'text-primary-text/80 dark:text-zinc-400 hover:bg-warm-subtle/80 dark:hover:bg-warm-subtle-dark/80 hover:text-primary-text dark:hover:text-white border border-transparent'
                }`}
              >
                {isAreaActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-sage-500 dark:bg-sage-400" />
                )}
                <span className={`transition-all duration-150 ${isAreaActive ? 'text-sage-600 dark:text-sage-300 scale-110' : 'text-primary-secondary dark:text-zinc-400'}`}>
                  {getAreaIcon(area.icon)}
                </span>
                <span>{area.name}</span>
              </button>
            );
          })}

          {/* Custom User Areas */}
          {customAreas.map((area) => {
            const isAreaActive = currentView === 'custom-area' && selectedCustomAreaId === area.id;
            return (
              <div
                key={area.id}
                className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 relative backdrop-blur-sm ${
                  isAreaActive 
                    ? 'bg-sage-500/15 dark:bg-sage-500/25 text-sage-700 dark:text-sage-300 font-semibold border border-sage-500/20 dark:border-sage-500/30' 
                    : 'text-primary-text/80 dark:text-zinc-400 hover:bg-warm-subtle/80 dark:hover:bg-warm-subtle-dark/80 hover:text-primary-text dark:hover:text-white border border-transparent'
                }`}
              >
                {isAreaActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-sage-500 dark:bg-sage-400" />
                )}
                <button
                  onClick={() => setCurrentView('custom-area', area.id)}
                  className="flex items-center gap-2.5 flex-1 text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sage-500" />
                  <span>{area.name}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete custom area "${area.name}"?`)) {
                      deleteCustomArea(area.id);
                      if (isAreaActive) setCurrentView('home');
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-quiet p-1"
                  title="Delete area"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Clean Interactive Pixel Clock Display */}
        <div className="pointer-events-auto">
          <MosaicPixelGrid />
        </div>

        {/* Footer / Settings */}
        <div className="pt-4 border-t border-warm-border dark:border-warm-border-dark/60 mt-auto pointer-events-auto">
          <button
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 relative group backdrop-blur-sm ${
              currentView === 'settings' 
                ? 'bg-sage-500/15 dark:bg-sage-500/25 text-sage-700 dark:text-sage-300 font-semibold border border-sage-500/20 dark:border-sage-500/30' 
                : 'text-primary-text/80 dark:text-zinc-400 hover:bg-warm-subtle/80 dark:hover:bg-warm-subtle-dark/80 hover:text-primary-text dark:hover:text-white border border-transparent'
            }`}
          >
            {currentView === 'settings' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-sage-500 dark:bg-sage-400" />
            )}
            <Settings className={`w-4 h-4 transition-transform duration-200 ${currentView === 'settings' ? 'text-sage-600 dark:text-sage-300 rotate-90' : 'text-primary-secondary dark:text-zinc-400 group-hover:rotate-45'}`} />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
