import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const NewAreaModal: React.FC = () => {
  const { isNewAreaOpen, setNewAreaOpen, addCustomArea, setCurrentView } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Compass');
  const [color, setColor] = useState('#68735C');

  if (!isNewAreaOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomArea({
      name: name.trim(),
      description: description.trim(),
      icon,
      color
    });

    setName('');
    setDescription('');
    setNewAreaOpen(false);
  };

  const presetColors = ['#68735C', '#7E8B6E', '#909D80', '#5B6870', '#83705C', '#835C6E', '#5C7A83'];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-warm-bg dark:bg-warm-bg-dark border border-warm-border dark:border-warm-border-dark rounded-2xl w-full max-w-md shadow-elevated p-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-warm-border dark:border-warm-border-dark">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sage-500" />
            <span className="font-serif text-lg text-primary-text dark:text-primary-text-dark">Create Custom Area</span>
          </div>
          <button 
            onClick={() => setNewAreaOpen(false)}
            className="p-1 text-primary-secondary hover:text-primary-text transition-quiet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-primary-secondary mb-1">Area Name</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Finance, Reading, Nutrition, Startup..."
              className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2.5 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none focus:border-sage-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-primary-secondary mb-1">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What belongs in this area of your life?"
              className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2.5 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-primary-secondary mb-2">Accent Color</label>
            <div className="flex items-center gap-2">
              {presetColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full transition-quiet ${
                    color === c ? 'ring-2 ring-offset-2 ring-sage-500 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setNewAreaOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-primary-secondary hover:bg-warm-subtle transition-quiet"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-medium bg-sage-500 hover:bg-sage-600 text-white shadow-subtle transition-quiet"
            >
              Create Area
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
