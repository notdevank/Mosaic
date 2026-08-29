import React from 'react';
import { 
  Compass, 
  Plus, 
  GraduationCap, 
  Dumbbell, 
  Utensils, 
  MessageSquare, 
  FolderKanban, 
  Trash2,
  CheckSquare,
  BookOpen
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ViewType } from '../../types';

export const AreasView: React.FC = () => {
  const { 
    areas, 
    setCurrentView, 
    setNewAreaOpen, 
    deleteCustomArea,
    tasks,
    projects,
    journalEntries
  } = useStore();

  const getAreaIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-sage-600 dark:text-sage-400" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5 text-sage-600 dark:text-sage-400" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-sage-600 dark:text-sage-400" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-sage-600 dark:text-sage-400" />;
      default: return <Compass className="w-5 h-5 text-sage-600 dark:text-sage-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-warm-border dark:border-warm-border-dark pb-4 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-primary-text dark:text-white tracking-tight">
          Areas
        </h1>

        <button
          onClick={() => setNewAreaOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium transition-quiet"
        >
          <Plus className="w-4 h-4" />
          <span>New Area</span>
        </button>
      </div>

      {/* Grid of Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {areas.map((area) => {
          const areaTasks = tasks.filter((t) => t.areaId === area.id);
          const areaProjects = projects.filter((p) => p.areaId === area.id);
          const areaJournals = (journalEntries || []).filter((j) => j.areaId === area.id);

          return (
            <div
              key={area.id}
              onClick={() => setCurrentView(area.isCustom ? 'custom-area' : (area.id as ViewType), area.isCustom ? area.id : undefined)}
              className="group cursor-pointer bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-5 space-y-3 hover:border-sage-500/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-sage-500/10 flex items-center justify-center">
                  {getAreaIcon(area.icon)}
                </div>

                {area.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete custom area "${area.name}"?`)) {
                        deleteCustomArea(area.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-primary-secondary hover:text-red-500 transition-quiet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <h3 className="font-serif text-lg font-semibold text-primary-text dark:text-white">
                  {area.name}
                </h3>
                {area.description && (
                  <p className="text-xs text-primary-secondary line-clamp-2 mt-0.5">
                    {area.description}
                  </p>
                )}
              </div>

              <div className="pt-2.5 border-t border-warm-border/60 dark:border-warm-border-dark/60 flex items-center justify-between text-[11px] font-mono text-primary-secondary">
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3 text-sage-500" /> {areaTasks.length} tasks
                </span>
                <span className="flex items-center gap-1">
                  <FolderKanban className="w-3 h-3 text-sage-500" /> {areaProjects.length} projects
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-sage-500" /> {areaJournals.length} entries
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
