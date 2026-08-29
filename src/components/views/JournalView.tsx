import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Tag, 
  Smile, 
  Trash2, 
  Heading1,
  Heading2,
  Heading3,
  Bold, 
  Italic, 
  List, 
  Quote, 
  Calendar,
  Maximize2,
  Minimize2,
  CheckSquare,
  Clock,
  Eye,
  Edit3,
  Columns
} from 'lucide-react';
import { useStore } from '../../store/useStore';

type EditorViewMode = 'write' | 'read';

export const JournalView: React.FC = () => {
  const { 
    journalEntries, 
    addJournalEntry, 
    updateJournalEntry, 
    deleteJournalEntry 
  } = useStore();

  const [activeEntryId, setActiveEntryId] = useState<string | null>(
    journalEntries && journalEntries.length > 0 ? journalEntries[0].id : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorViewMode>('write');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeEntry = (journalEntries || []).find((j) => j.id === activeEntryId);

  const filteredEntries = (journalEntries || []).filter((j) => {
    const matchesSearch = 
      !searchQuery || 
      (j.title && j.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      j.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !selectedTag || (j.tags && j.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(
    new Set((journalEntries || []).flatMap((j) => j.tags || []))
  );

  // Word Count & Reading Time
  const wordCount = activeEntry?.content ? activeEntry.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const handleCreateNewEntry = () => {
    addJournalEntry({
      title: '',
      content: '',
      mood: 7,
      tags: []
    });
    setTimeout(() => {
      if (journalEntries && journalEntries.length > 0) {
        setActiveEntryId(journalEntries[0].id);
      }
    }, 50);
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || !activeEntry) return;
    const currentTags = activeEntry.tags || [];
    if (!currentTags.includes(tagInput.trim())) {
      updateJournalEntry(activeEntry.id, { tags: [...currentTags, tagInput.trim()] });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!activeEntry) return;
    updateJournalEntry(activeEntry.id, {
      tags: (activeEntry.tags || []).filter((t) => t !== tagToRemove)
    });
  };

  // Smart Formatting Insertion at Selection Cursor
  const applyFormatting = (prefix: string, suffix: string = '') => {
    if (!activeEntry || !textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = activeEntry.content.substring(start, end);

    let replacement = '';
    if (selectedText) {
      replacement = `${prefix}${selectedText}${suffix}`;
    } else {
      replacement = `${prefix}${suffix}`;
    }

    const newContent = 
      activeEntry.content.substring(0, start) + 
      replacement + 
      activeEntry.content.substring(end);

    updateJournalEntry(activeEntry.id, { content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  // Simple, robust Markdown parser into HTML for real-time rich text preview
  const renderMarkdownHTML = (markdown: string) => {
    if (!markdown) return '<p class="text-primary-secondary italic">Start writing to see live preview...</p>';

    const lines = markdown.split('\n');
    let html = '';
    let inList = false;

    lines.forEach((line) => {
      let formattedLine = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Inline Bold and Italic
      formattedLine = formattedLine.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      formattedLine = formattedLine.replace(/`(.*?)`/g, '<code class="bg-warm-subtle dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-sage-600 font-bold">$1</code>');

      // Headings
      if (formattedLine.startsWith('# ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h1 class="font-serif text-2xl font-bold mt-4 mb-2 text-primary-text dark:text-white">${formattedLine.slice(2)}</h1>`;
      } else if (formattedLine.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2 class="font-serif text-xl font-bold mt-3 mb-2 text-primary-text dark:text-white">${formattedLine.slice(3)}</h2>`;
      } else if (formattedLine.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3 class="font-serif text-lg font-bold mt-2 mb-1 text-primary-text dark:text-white">${formattedLine.slice(4)}</h3>`;
      } 
      // Blockquotes
      else if (formattedLine.startsWith('&gt; ') || formattedLine.startsWith('> ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<blockquote class="border-l-2 border-sage-500 pl-4 py-1 my-2 text-primary-secondary italic bg-sage-500/5 rounded-r-lg">${formattedLine.replace(/^(&gt;|>)\s?/, '')}</blockquote>`;
      }
      // Checkbox list
      else if (formattedLine.startsWith('- [ ] ') || formattedLine.startsWith('- [x] ')) {
        if (inList) { html += '</ul>'; inList = false; }
        const isChecked = formattedLine.startsWith('- [x] ');
        const text = formattedLine.slice(6);
        html += `<div className="flex items-center gap-2 my-1.5 text-sm">
          <span class="w-4 h-4 rounded border flex items-center justify-center text-xs ${isChecked ? 'bg-sage-500 text-white border-sage-500 font-bold' : 'border-warm-border'}">${isChecked ? '✓' : ''}</span>
          <span class="${isChecked ? 'line-through opacity-60' : ''}">${text}</span>
        </div>`;
      }
      // Bullet List
      else if (formattedLine.startsWith('- ') || formattedLine.startsWith('* ')) {
        if (!inList) { html += '<ul class="list-disc list-inside space-y-1 my-2 text-sm">'; inList = true; }
        html += `<li>${formattedLine.slice(2)}</li>`;
      }
      // Paragraph
      else {
        if (inList) { html += '</ul>'; inList = false; }
        if (formattedLine.trim() === '') {
          html += '<div className="h-3"></div>';
        } else {
          html += `<p class="text-sm leading-relaxed my-1.5 text-primary-text dark:text-zinc-200">${formattedLine}</p>`;
        }
      }
    });

    if (inList) html += '</ul>';
    return html;
  };

  return (
    <div className={`max-w-6xl mx-auto py-6 space-y-6 animate-in fade-in duration-200 ${isFocusMode ? 'max-w-4xl' : ''}`}>
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl font-semibold text-primary-text dark:text-white tracking-tight">
            Journal
          </h1>
          <span className="text-xs font-mono text-primary-secondary pt-1">
            ({(journalEntries || []).length})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-warm-border dark:border-warm-border-dark text-xs font-mono text-primary-secondary hover:text-primary-text dark:hover:text-white transition-quiet"
            title="Focus Writing Mode"
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFocusMode ? 'Sidebar' : 'Focus'}</span>
          </button>

          <button
            onClick={handleCreateNewEntry}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium transition-quiet shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Layout */}
      <div className={`grid grid-cols-1 gap-6 min-h-[600px] ${isFocusMode ? 'grid-cols-1' : 'md:grid-cols-12'}`}>
        
        {/* Left Timeline Pane */}
        {!isFocusMode && (
          <div className="md:col-span-4 space-y-3 bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-4 flex flex-col">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border border-warm-border dark:border-warm-border-dark text-xs focus:outline-none text-primary-text dark:text-white placeholder-primary-secondary"
              />
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1 pb-2 border-b border-warm-border dark:border-warm-border-dark/60">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-quiet ${
                    selectedTag === null ? 'bg-sage-500 text-white font-semibold' : 'bg-warm-subtle dark:bg-warm-subtle-dark text-primary-secondary'
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-quiet ${
                      selectedTag === tag ? 'bg-sage-500 text-white font-semibold' : 'bg-warm-subtle dark:bg-warm-subtle-dark text-primary-secondary'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredEntries.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-primary-secondary">
                  No entries found.
                </div>
              ) : (
                filteredEntries.map((entry) => {
                  const isActive = entry.id === activeEntryId;
                  return (
                    <button
                      key={entry.id}
                      onClick={() => setActiveEntryId(entry.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 relative space-y-1.5 ${
                        isActive
                          ? 'bg-sage-500/10 border-sage-500/30 text-sage-700 dark:text-sage-300 font-semibold shadow-xs'
                          : 'border-warm-border dark:border-warm-border-dark hover:border-sage-500/30 text-primary-text dark:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-primary-secondary">
                        <span>{format(new Date(entry.createdAt), 'MMM d, yyyy')}</span>
                        {entry.mood && <span className="opacity-75">Mood {entry.mood}/10</span>}
                      </div>
                      <div className="text-xs font-serif font-medium truncate">
                        {entry.title || 'Untitled Entry'}
                      </div>
                      <p className="text-[11px] text-primary-secondary line-clamp-2 leading-relaxed font-sans">
                        {entry.content || 'Write something...'}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Right Editor Pane */}
        <div className={`${isFocusMode ? 'col-span-1' : 'md:col-span-8'} bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-xs`}>
          {activeEntry ? (
            <>
              {/* Header & Actions */}
              <div className="space-y-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
                <div className="flex items-center justify-between text-xs font-mono text-primary-secondary">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sage-500" />
                      {format(new Date(activeEntry.createdAt), 'EEEE, MMMM d, yyyy — h:mm a')}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary-secondary" />
                      {readTimeMin} min read ({wordCount} words)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (confirm('Delete this journal entry?')) {
                          deleteJournalEntry(activeEntry.id);
                          setActiveEntryId(null);
                        }
                      }}
                      className="p-1.5 text-primary-secondary hover:text-red-500 transition-quiet"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  value={activeEntry.title || ''}
                  onChange={(e) => updateJournalEntry(activeEntry.id, { title: e.target.value })}
                  placeholder="Untitled Entry..."
                  className="w-full bg-transparent font-serif text-3xl font-semibold text-primary-text dark:text-white placeholder-primary-secondary focus:outline-none"
                />

                {/* Real-time Formatting Toolbar & View Mode Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-warm-border/60 dark:border-warm-border-dark/60 text-xs font-mono text-primary-secondary">
                  
                  {/* Formatting Buttons */}
                  <div className="flex items-center gap-1">
                    <button onClick={() => applyFormatting('# ')} className="p-1.5 rounded hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark" title="Heading 1">
                      <Heading1 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => applyFormatting('## ')} className="p-1.5 rounded hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark" title="Heading 2">
                      <Heading2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => applyFormatting('### ')} className="p-1.5 rounded hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark" title="Heading 3">
                      <Heading3 className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-[1px] h-3 bg-warm-border dark:bg-warm-border-dark mx-1" />
                    <button onClick={() => applyFormatting('**', '**')} className="p-1.5 rounded hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark" title="Bold">
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => applyFormatting('*', '*')} className="p-1.5 rounded hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark" title="Italic">
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => applyFormatting('- ')} className="p-1.5 rounded hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark" title="Bullet List">
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => applyFormatting('- [ ] ')} className="p-1.5 rounded hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark" title="Task Checkbox">
                      <CheckSquare className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => applyFormatting('> ')} className="p-1.5 rounded hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark" title="Quote Block">
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Mode Switcher: Write vs Read */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-warm-subtle/60 dark:bg-warm-subtle-dark/60 border border-warm-border/60 dark:border-warm-border-dark/60">
                    <button
                      onClick={() => setEditorMode('write')}
                      className={`px-3 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 transition-quiet ${
                        editorMode === 'write' ? 'bg-sage-500 text-white font-bold shadow-xs' : 'text-primary-secondary hover:text-primary-text'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Write Mode
                    </button>
                    <button
                      onClick={() => setEditorMode('read')}
                      className={`px-3 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 transition-quiet ${
                        editorMode === 'read' ? 'bg-sage-500 text-white font-bold shadow-xs' : 'text-primary-secondary hover:text-primary-text'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Read Mode
                    </button>
                  </div>

                </div>
              </div>

              {/* Main Content Area: Write vs Read */}
              <div className="flex-1 min-h-[400px]">
                {editorMode === 'write' ? (
                  <textarea
                    ref={textareaRef}
                    value={activeEntry.content}
                    onChange={(e) => updateJournalEntry(activeEntry.id, { content: e.target.value })}
                    placeholder="Write your reflection freely here..."
                    className="w-full h-full min-h-[380px] bg-transparent font-sans text-base leading-relaxed text-primary-text dark:text-zinc-200 placeholder-primary-secondary focus:outline-none resize-none"
                  />
                ) : (
                  <div
                    className="w-full h-full min-h-[380px] prose dark:prose-invert max-w-none text-primary-text dark:text-zinc-200 overflow-y-auto leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownHTML(activeEntry.content) }}
                  />
                )}
              </div>

              {/* Footer Metadata Bar */}
              <div className="pt-4 border-t border-warm-border dark:border-warm-border-dark flex items-center justify-between text-xs font-mono">
                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-sage-500" />
                  {(activeEntry.tags || []).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-warm-subtle dark:bg-warm-subtle-dark text-[10px] flex items-center gap-1 text-primary-text dark:text-white">
                      #{t}
                      <button onClick={() => handleRemoveTag(t)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="+ add tag"
                    className="bg-transparent border-none text-[10px] text-primary-secondary focus:outline-none w-20"
                  />
                </div>

                {/* Mood Select */}
                <div className="flex items-center gap-2">
                  <Smile className="w-3.5 h-3.5 text-sage-500" />
                  <span className="text-primary-secondary">Mood:</span>
                  <select
                    value={activeEntry.mood || 7}
                    onChange={(e) => updateJournalEntry(activeEntry.id, { mood: parseInt(e.target.value, 10) })}
                    className="bg-transparent border border-warm-border dark:border-warm-border-dark rounded px-2 py-0.5 text-xs font-mono text-primary-text dark:text-white"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(m => (
                      <option key={m} value={m} className="bg-warm-card dark:bg-warm-card-dark">{m}/10</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-primary-secondary space-y-3">
              <BookOpen className="w-12 h-12 stroke-[1.5] text-sage-500/50" />
              <div className="font-serif text-lg text-primary-text dark:text-white">No entry selected</div>
              <p className="text-xs text-primary-secondary max-w-xs">Write notes, daily reflections, and long-term memories in your personal space.</p>
              <button
                onClick={handleCreateNewEntry}
                className="px-4 py-2 rounded-xl bg-sage-500 text-white text-xs font-medium shadow-xs"
              >
                Create Entry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
