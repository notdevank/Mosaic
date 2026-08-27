import React, { useState } from 'react';
import { MessageSquare, User, Plus, Clock, Calendar, CheckSquare } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTodayStr, formatDateDisplay } from '../../utils/dateUtils';

export const CommunicationArea: React.FC = () => {
  const { people, addPerson, addInteractionLog, interactionLogs } = useStore();
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState(getTodayStr());

  const handleCreatePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addPerson({
      name: name.trim(),
      relationshipContext: context.trim(),
      nextFollowUpDate: nextFollowUp
    });

    setName('');
    setContext('');
    setIsAddPersonOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sage-500 text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Communication</h1>
          </div>
        </div>

        <button
          onClick={() => setIsAddPersonOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
        >
          <Plus className="w-4 h-4" />
          <span>Add Person</span>
        </button>
      </div>

      {/* Add Person Modal */}
      {isAddPersonOpen && (
        <form onSubmit={handleCreatePerson} className="mosaic-card p-5 space-y-3">
          <h3 className="font-serif text-lg text-primary-text">Add Person to Directory</h3>
          <input
            type="text"
            placeholder="Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-warm-subtle border border-warm-border rounded-xl px-4 py-2 text-xs focus:outline-none"
          />
          <input
            type="text"
            placeholder="Context (e.g. Faculty Advisor, Colleague, Friend)..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full bg-warm-subtle border border-warm-border rounded-xl px-4 py-2 text-xs focus:outline-none"
          />
          <div>
            <label className="block text-[10px] font-mono uppercase text-primary-secondary mb-1">Scheduled Follow-up Date</label>
            <input
              type="date"
              value={nextFollowUp}
              onChange={(e) => setNextFollowUp(e.target.value)}
              className="w-full bg-warm-subtle border border-warm-border rounded-xl px-4 py-2 text-xs focus:outline-none font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsAddPersonOpen(false)} className="px-4 py-1.5 text-xs text-primary-secondary">Cancel</button>
            <button type="submit" className="px-5 py-1.5 bg-sage-500 text-white rounded-xl text-xs font-medium">Save Person</button>
          </div>
        </form>
      )}

      {/* People Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {people.map((person) => (
          <div key={person.id} className="mosaic-card space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sage-500/10 text-sage-600 flex items-center justify-center font-serif text-sm font-medium">
                  {person.name[0]}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-primary-text">{person.name}</h3>
                  <p className="text-xs text-primary-secondary">{person.relationshipContext}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs border-t border-warm-border pt-2">
              {person.lastInteractionDate && (
                <div className="flex justify-between text-primary-secondary">
                  <span>Last Interaction:</span>
                  <span className="font-mono text-primary-text">{formatDateDisplay(person.lastInteractionDate)}</span>
                </div>
              )}

              {person.nextFollowUpDate && (
                <div className="flex justify-between text-primary-secondary">
                  <span>Next Follow-up:</span>
                  <span className="font-mono text-sage-600 font-bold">{formatDateDisplay(person.nextFollowUpDate)}</span>
                </div>
              )}

              {person.notes && (
                <p className="text-xs text-primary-secondary pt-1 italic">
                  "{person.notes}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
