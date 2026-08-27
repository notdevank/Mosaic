import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Target, Repeat, Calendar, BookOpen, FolderKanban, Inbox } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTodayStr } from '../../utils/dateUtils';

type CaptureType = 'task' | 'goal' | 'habit' | 'event' | 'log' | 'project' | 'inbox';

export const QuickCaptureModal: React.FC = () => {
  const { isQuickCaptureOpen, setQuickCaptureOpen, areas, addTask, addGoal, addHabit, addEvent, addProject, addInboxItem, updateDailyLog, getOrCreateDailyLog } = useStore();
  const [captureType, setCaptureType] = useState<CaptureType>('task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [areaId, setAreaId] = useState<string>('');
  const [dueDate, setDueDate] = useState(getTodayStr());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && !isQuickCaptureOpen) {
        // Handled in global listener or search modal
      }
      if (e.key === 'Escape' && isQuickCaptureOpen) {
        setQuickCaptureOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickCaptureOpen, setQuickCaptureOpen]);

  if (!isQuickCaptureOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    switch (captureType) {
      case 'task':
        addTask({
          title,
          description,
          dueDate,
          priority: 'medium',
          status: 'todo',
          areaId: areaId || undefined,
          subtasks: []
        });
        break;

      case 'goal':
        addGoal({
          title,
          description,
          areaId: areaId || undefined,
          tier: 'monthly',
          targetDate: dueDate,
          status: 'active'
        });
        break;

      case 'habit':
        addHabit({
          name: title,
          frequency: 'daily',
          targetCount: 7,
          areaId: areaId || undefined,
          startDate: getTodayStr(),
          notes: description
        });
        break;

      case 'event':
        addEvent({
          title,
          areaId: areaId || undefined,
          startDate: dueDate,
          isAllDay: true,
          notes: description
        });
        break;

      case 'project':
        addProject({
          name: title,
          description,
          areaId: areaId || undefined,
          deadline: dueDate,
          status: 'active',
          milestones: []
        });
        break;

      case 'inbox':
        addInboxItem(title);
        break;

      case 'log':
        const today = getTodayStr();
        const currentLog = getOrCreateDailyLog(today);
        updateDailyLog(today, {
          freeformNote: currentLog.freeformNote ? `${currentLog.freeformNote}\n- ${title}` : title
        });
        break;
    }

    setTitle('');
    setDescription('');
    setQuickCaptureOpen(false);
  };

  const captureTabs: { type: CaptureType; label: string; icon: React.ReactNode }[] = [
    { type: 'task', label: 'Task', icon: <CheckSquare className="w-4 h-4" /> },
    { type: 'goal', label: 'Goal', icon: <Target className="w-4 h-4" /> },
    { type: 'habit', label: 'Habit', icon: <Repeat className="w-4 h-4" /> },
    { type: 'event', label: 'Event', icon: <Calendar className="w-4 h-4" /> },
    { type: 'project', label: 'Project', icon: <FolderKanban className="w-4 h-4" /> },
    { type: 'inbox', label: 'Inbox', icon: <Inbox className="w-4 h-4" /> },
    { type: 'log', label: 'Log', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-warm-bg dark:bg-warm-bg-dark border border-warm-border dark:border-warm-border-dark rounded-2xl w-full max-w-lg shadow-elevated p-6 animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-warm-border dark:border-warm-border-dark">
          <span className="font-serif text-lg text-primary-text dark:text-primary-text-dark">Quick Capture</span>
          <button 
            onClick={() => setQuickCaptureOpen(false)}
            className="p-1 text-primary-secondary hover:text-primary-text transition-quiet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Capture Type Selector */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-4">
          {captureTabs.map((tab) => (
            <button
              key={tab.type}
              type="button"
              onClick={() => setCaptureType(tab.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-quiet ${
                captureType === tab.type
                  ? 'bg-sage-500 text-white shadow-subtle'
                  : 'text-primary-secondary hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                captureType === 'task' ? 'What do you need to do?' :
                captureType === 'goal' ? 'What do you want to achieve?' :
                captureType === 'habit' ? 'What habit do you want to practice?' :
                captureType === 'event' ? 'Event title...' :
                captureType === 'project' ? 'Project name...' :
                captureType === 'inbox' ? 'Dump a quick thought or item...' :
                'Write a quick note for today\'s log...'
              }
              className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-3 text-sm text-primary-text dark:text-primary-text-dark focus:outline-none focus:border-sage-500"
            />
          </div>

          {captureType !== 'inbox' && captureType !== 'log' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-primary-secondary mb-1">Area</label>
                <select
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-lg px-3 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
                >
                  <option value="">No Area (General)</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-primary-secondary mb-1">Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-lg px-3 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes or additional context (optional)..."
              rows={2}
              className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2.5 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setQuickCaptureOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-primary-secondary hover:bg-warm-subtle transition-quiet"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-medium bg-sage-500 hover:bg-sage-600 text-white shadow-subtle transition-quiet"
            >
              Save {captureType.toUpperCase()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
