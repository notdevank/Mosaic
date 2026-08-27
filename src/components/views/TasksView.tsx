import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { TaskStatus, Priority } from '../../types';
import { formatDateDisplay, getTodayStr } from '../../utils/dateUtils';

export const TasksView: React.FC = () => {
  const { tasks, areas, addTask, toggleTaskStatus, deleteTask, updateTask } = useStore();
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterAreaId, setFilterAreaId] = useState<string>('all');
  
  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newAreaId, setNewAreaId] = useState('');
  const [newDueDate, setNewDueDate] = useState(getTodayStr());
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle.trim(),
      status: 'todo',
      priority: 'medium',
      subtasks: [],
      areaId: newAreaId || undefined,
      dueDate: newDueDate || getTodayStr()
    });

    setNewTitle('');
    setNewDueDate(getTodayStr());
  };

  const handleAddSubtask = (taskId: string) => {
    if (!newSubtaskTitle.trim()) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newSub = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };

    updateTask(taskId, {
      subtasks: [...task.subtasks, newSub]
    });
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updated = task.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
    updateTask(taskId, { subtasks: updated });
  };

  const filtered = tasks.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterAreaId !== 'all' && t.areaId !== filterAreaId) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Tasks</h1>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-warm-card dark:bg-[#1E1E1E] border border-warm-border dark:border-[#2A2A2A] rounded-xl px-3 py-1.5 text-xs text-primary-text dark:text-white font-medium focus:outline-none"
          >
            <option value="all" className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white">All Statuses</option>
            <option value="todo" className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white">Todo</option>
            <option value="in_progress" className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white">In Progress</option>
            <option value="completed" className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white">Completed</option>
            <option value="cancelled" className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white">Cancelled</option>
          </select>

          {/* Area filter */}
          <select
            value={filterAreaId}
            onChange={(e) => setFilterAreaId(e.target.value)}
            className="bg-warm-card dark:bg-[#1E1E1E] border border-warm-border dark:border-[#2A2A2A] rounded-xl px-3 py-1.5 text-xs text-primary-text dark:text-white font-medium focus:outline-none"
          >
            <option value="all" className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white">All Areas</option>
            {areas.map(a => (
              <option key={a.id} value={a.id} className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white">{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inline Quick Add Form */}
      <form onSubmit={handleAddTask} className="mosaic-card flex flex-col sm:flex-row items-center gap-3 p-3">
        <input
          type="text"
          placeholder="Add a task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 bg-transparent text-xs text-primary-text dark:text-primary-text-dark placeholder-primary-secondary focus:outline-none w-full"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={newAreaId}
            onChange={(e) => setNewAreaId(e.target.value)}
            className="bg-warm-subtle dark:bg-[#1E1E1E] border border-warm-border dark:border-[#2A2A2A] rounded-lg px-2.5 py-1 text-[11px] text-primary-secondary dark:text-white focus:outline-none"
          >
            <option value="" className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white">Area...</option>
            {areas.map(a => <option key={a.id} value={a.id} className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white">{a.name}</option>)}
          </select>

          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="bg-warm-subtle dark:bg-warm-subtle-dark border-none rounded-lg px-2 py-1 text-[11px] text-primary-secondary dark:text-stone-300 focus:outline-none font-mono"
          />

          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Compact Task Rows */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-primary-secondary dark:text-stone-300 border border-dashed border-warm-border dark:border-warm-border-dark rounded-xl">
          No tasks found matching your filter criteria.
        </div>
      ) : (
        <div className="divide-y divide-warm-border dark:divide-warm-border-dark border border-warm-border dark:border-warm-border-dark rounded-xl bg-warm-card dark:bg-warm-card-dark overflow-hidden">
          {filtered.map((task) => {
            const isDone = task.status === 'completed';
            const isExpanded = expandedTaskId === task.id;
            const area = areas.find(a => a.id === task.areaId);

            return (
              <div key={task.id} className="group transition-quiet">
                <div className="mosaic-row px-4 py-3">
                  {/* Left: Checkbox + Title */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-quiet shrink-0 ${
                        isDone 
                          ? 'bg-sage-500 border-sage-500 text-white' 
                          : 'border-warm-border dark:border-warm-border-dark hover:border-sage-500'
                      }`}
                    >
                      {isDone && <CheckSquare className="w-3 h-3" />}
                    </button>
                    <span className={`text-xs truncate ${isDone ? 'line-through text-primary-secondary dark:text-stone-400' : 'text-primary-text dark:text-primary-text-dark font-medium'}`}>
                      {task.title}
                    </span>
                  </div>

                  {/* Right: Area Tag, Date, Controls */}
                  <div className="flex items-center gap-3 shrink-0 text-xs text-primary-secondary dark:text-stone-300">
                    {area && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-warm-subtle dark:bg-warm-subtle-dark text-primary-secondary dark:text-stone-300 border border-warm-border/50 dark:border-warm-border-dark">
                        {area.name}
                      </span>
                    )}

                    <input
                      type="date"
                      value={task.dueDate || ''}
                      onChange={(e) => updateTask(task.id, { dueDate: e.target.value || undefined })}
                      className="bg-warm-subtle dark:bg-[#1E1E1E] border border-warm-border/50 dark:border-[#2A2A2A] rounded px-2 py-0.5 text-[11px] font-mono text-primary-secondary dark:text-stone-300 focus:outline-none"
                      title="Set or change due date"
                    />

                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="p-1 hover:text-primary-text dark:hover:text-white transition-quiet"
                      title="Subtasks"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 hover:text-primary-text dark:hover:text-white opacity-0 group-hover:opacity-100 transition-quiet"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtasks Accordion */}
                {isExpanded && (
                  <div className="px-10 py-3 bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border-t border-warm-border dark:border-warm-border-dark space-y-2">
                    {task.subtasks.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={sub.completed}
                          onChange={() => handleToggleSubtask(task.id, sub.id)}
                          className="rounded border-warm-border text-sage-500 focus:ring-sage-500"
                        />
                        <span className={sub.completed ? 'line-through text-primary-secondary dark:text-stone-400' : 'text-primary-text dark:text-primary-text-dark'}>
                          {sub.title}
                        </span>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add subtask..."
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(task.id); } }}
                        className="bg-transparent border-b border-warm-border dark:border-warm-border-dark text-xs text-primary-text dark:text-primary-text-dark placeholder-primary-secondary focus:outline-none py-1 flex-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
