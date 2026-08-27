import React, { useState } from 'react';
import { Inbox, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const InboxView: React.FC = () => {
  const { inbox, addInboxItem, deleteInboxItem, convertInboxToTask } = useStore();
  const [inputContent, setInputContent] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;
    addInboxItem(inputContent.trim());
    setInputContent('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-warm-border dark:border-warm-border-dark pb-4">
        <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Inbox</h1>
      </div>

      {/* Quick Dump Input Bar */}
      <form onSubmit={handleAdd} className="mosaic-card flex items-center gap-3 p-3">
        <input
          type="text"
          placeholder="Dump a quick thought without deciding what it is..."
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          className="flex-1 bg-transparent text-xs text-primary-text dark:text-primary-text-dark placeholder-primary-secondary focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
        >
          Dump to Inbox
        </button>
      </form>

      {/* Inbox Item Rows */}
      {inbox.length === 0 ? (
        <div className="py-12 text-center text-xs text-primary-secondary dark:text-stone-300 border border-dashed border-warm-border dark:border-warm-border-dark rounded-xl">
          Inbox is clear! Your mind is free of unprocessed items.
        </div>
      ) : (
        <div className="space-y-3">
          {inbox.map((item) => (
            <div key={item.id} className="mosaic-card flex items-center justify-between p-4 group">
              <div className="space-y-1 pr-4">
                <div className="text-xs font-medium text-primary-text dark:text-primary-text-dark">
                  {item.content}
                </div>
                <div className="text-[10px] font-mono text-primary-secondary dark:text-stone-300">
                  Captured {item.createdAt}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => convertInboxToTask(item.id, item.content)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sage-500/10 dark:bg-sage-500/25 border border-transparent dark:border-sage-500/40 text-sage-700 dark:text-sage-200 text-xs font-medium hover:bg-sage-500/20 transition-quiet"
                >
                  <span>Convert to Task</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => deleteInboxItem(item.id)}
                  className="p-1.5 text-primary-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-quiet"
                  title="Delete inbox item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
