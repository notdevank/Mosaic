import React, { useState } from 'react';
import { FolderKanban, Plus, CheckSquare, Trash2, Calendar, Target } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ProjectStatus } from '../../types';
import { getTodayStr, formatDateDisplay } from '../../utils/dateUtils';

export const ProjectsView: React.FC = () => {
  const { projects, areas, addProject, updateProject, toggleMilestone, deleteProject } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [areaId, setAreaId] = useState('');
  const [deadline, setDeadline] = useState(getTodayStr());

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      name: name.trim(),
      description: description.trim(),
      areaId: areaId || undefined,
      deadline,
      status: 'active',
      milestones: []
    });

    setName('');
    setDescription('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Projects</h1>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Add Project Form */}
      {isAdding && (
        <form onSubmit={handleCreateProject} className="mosaic-card p-5 space-y-3">
          <h3 className="font-serif text-lg text-primary-text">Create Project</h3>
          <input
            type="text"
            placeholder="Project name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border rounded-xl px-4 py-2.5 text-xs text-primary-text focus:outline-none"
          />
          <input
            type="text"
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border rounded-xl px-4 py-2 text-xs text-primary-text focus:outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-primary-secondary mb-1">Area</label>
              <select
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                className="w-full bg-warm-subtle border border-warm-border rounded-lg px-3 py-2 text-xs"
              >
                <option value="">No Area</option>
                {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-primary-secondary mb-1">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-warm-subtle border border-warm-border rounded-lg px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-1.5 text-xs text-primary-secondary hover:bg-warm-subtle rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 text-xs bg-sage-500 text-white rounded-lg font-medium shadow-subtle"
            >
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((proj) => {
          const area = areas.find(a => a.id === proj.areaId);

          return (
            <div key={proj.id} className="mosaic-card space-y-4 group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sage-500/10 text-sage-600 font-bold">
                      {proj.status}
                    </span>
                    {area && (
                      <span className="text-[10px] font-mono text-primary-secondary">
                        {area.name}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark">
                    {proj.name}
                  </h3>
                  {proj.description && (
                    <p className="text-xs text-primary-secondary line-clamp-2">
                      {proj.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteProject(proj.id)}
                  className="text-xs text-primary-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-quiet"
                >
                  Delete
                </button>
              </div>

              {/* Milestones */}
              <div className="space-y-2 pt-2 border-t border-warm-border dark:border-warm-border-dark">
                <div className="text-[10px] font-mono uppercase text-primary-secondary">
                  Milestones ({proj.milestones.filter(m => m.completed).length}/{proj.milestones.length})
                </div>
                <div className="space-y-1">
                  {proj.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(proj.id, m.id)}
                      className="flex items-center gap-2 text-xs cursor-pointer text-primary-text"
                    >
                      <input
                        type="checkbox"
                        checked={m.completed}
                        onChange={() => {}}
                        className="rounded text-sage-500"
                      />
                      <span className={m.completed ? 'line-through text-primary-secondary' : ''}>
                        {m.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
