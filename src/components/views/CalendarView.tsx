import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format, addMonths, subMonths, startOfWeek, addDays, parseISO, isSameDay } from 'date-fns';
import { getDaysInMonth, getTodayStr } from '../../utils/dateUtils';
import { CalendarEvent } from '../../types';

export const CalendarView: React.FC = () => {
  const { events, tasks, exams, goals, activities, workoutLogs, addEvent, deleteEvent, toggleTaskStatus, updateGoal } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDay, setSelectedDay] = useState(getTodayStr());

  // Event modal state
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('09:00');
  const [newEventLocation, setNewEventLocation] = useState('');

  const todayStr = getTodayStr();

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      const prev = addDays(parseISO(selectedDay), -1);
      setCurrentDate(prev);
      setSelectedDay(format(prev, 'yyyy-MM-dd'));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      const next = addDays(parseISO(selectedDay), 1);
      setCurrentDate(next);
      setSelectedDay(format(next, 'yyyy-MM-dd'));
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(todayStr);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    addEvent({
      title: newEventTitle.trim(),
      startDate: selectedDay,
      startTime: newEventTime,
      location: newEventLocation.trim() || undefined,
      isAllDay: false,
      color: '#68735C'
    });

    setNewEventTitle('');
    setNewEventLocation('');
    setIsAddEventOpen(false);
  };

  // Items for selected day
  const dayEvents = events.filter(e => e.startDate === selectedDay);
  const dayExams = exams.filter(ex => ex.date === selectedDay);
  const dayTasks = tasks.filter(t => t.dueDate === selectedDay || (!t.dueDate && selectedDay === todayStr));
  const dayGoals = goals.filter(g => g.targetDate === selectedDay || (!g.targetDate && selectedDay === todayStr));

  // Time slots for Day View (00:00 to 23:00 full 24-hour day)
  const hoursList = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-6 py-6 animate-in fade-in duration-200">
      {/* Calendar Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">
            {viewMode === 'day' 
              ? format(parseISO(selectedDay), 'EEEE, MMMM d, yyyy')
              : format(currentDate, 'MMMM yyyy')}
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-warm-subtle dark:bg-warm-subtle-dark rounded-xl border border-warm-border/50 dark:border-warm-border-dark/50">
            {(['month', 'week', 'day'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1 text-xs font-medium rounded-lg uppercase tracking-wider transition-quiet ${
                  viewMode === m
                    ? 'bg-warm-card dark:bg-warm-card-dark text-sage-600 dark:text-sage-300 font-bold shadow-subtle'
                    : 'text-primary-secondary dark:text-stone-300 hover:text-primary-text dark:hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg border border-warm-border dark:border-warm-border-dark text-primary-secondary dark:text-stone-300 hover:text-primary-text dark:hover:text-white hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark transition-quiet"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-mono border border-warm-border dark:border-warm-border-dark rounded-lg text-primary-secondary dark:text-stone-300 hover:text-primary-text dark:hover:text-white transition-quiet"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-warm-border dark:border-warm-border-dark text-primary-secondary dark:text-stone-300 hover:text-primary-text dark:hover:text-white hover:bg-warm-subtle dark:hover:bg-warm-subtle-dark transition-quiet"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main View Panel */}
        <div className="lg:col-span-2">
          {/* 1. MONTH VIEW */}
          {viewMode === 'month' && (
            <div className="mosaic-card p-4">
              <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-primary-secondary dark:text-stone-300 uppercase mb-2">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {daysInMonth.map((day) => {
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const isSelected = selectedDay === dayStr;
                  const isTodayDay = todayStr === dayStr;
                  
                  const cellEvents = events.filter(e => e.startDate === dayStr);
                  const cellExams = exams.filter(ex => ex.date === dayStr);
                  const cellTasks = tasks.filter(t => t.dueDate === dayStr || (!t.dueDate && dayStr === todayStr));
                  const cellGoals = goals.filter(g => g.targetDate === dayStr || (!g.targetDate && dayStr === todayStr));

                  const allCellItems = [
                    ...cellExams.map(ex => ({ id: ex.id, title: ex.title, icon: '📚', done: false, bg: 'bg-sage-500/20 text-sage-700 dark:text-sage-300 font-bold' })),
                    ...cellGoals.map(g => ({ id: g.id, title: g.title, icon: '🎯', done: g.status === 'completed', bg: g.status === 'completed' ? 'bg-emerald-500/10 text-emerald-700/50 dark:text-emerald-300/50 line-through' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium' })),
                    ...cellEvents.map(e => ({ id: e.id, title: e.title, icon: '📅', done: false, bg: 'bg-warm-subtle dark:bg-warm-subtle-dark text-primary-text dark:text-primary-text-dark border border-warm-border/40' })),
                    ...cellTasks.map(t => ({ id: t.id, title: t.title, icon: t.status === 'completed' ? '✅' : '✓', done: t.status === 'completed', bg: t.status === 'completed' ? 'bg-amber-500/10 text-amber-900/50 dark:text-amber-200/50 line-through' : 'bg-amber-500/15 dark:bg-amber-500/25 text-amber-900 dark:text-amber-200 font-medium border border-amber-500/30' }))
                  ];

                  return (
                    <button
                      key={dayStr}
                      onClick={() => setSelectedDay(dayStr)}
                      className={`min-h-[105px] p-2 rounded-xl border text-left flex flex-col justify-between transition-quiet ${
                        isSelected
                          ? 'border-sage-500 bg-sage-500/10 dark:bg-sage-500/20 shadow-subtle'
                          : isTodayDay
                          ? 'border-sage-400/50 bg-warm-subtle dark:bg-warm-subtle-dark'
                          : 'border-warm-border dark:border-warm-border-dark hover:border-sage-300'
                      }`}
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-mono font-medium ${
                            isTodayDay ? 'text-sage-600 dark:text-sage-300 font-bold' : 'text-primary-text dark:text-primary-text-dark'
                          }`}>
                            {format(day, 'd')}
                          </span>
                          {allCellItems.length > 0 && (
                            <span className="text-[9px] font-mono text-primary-secondary dark:text-stone-300 px-1 rounded bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border/40">
                              {allCellItems.length}
                            </span>
                          )}
                        </div>

                        {/* Visible Item Pills inside Month Grid Cell */}
                        <div className="space-y-1 overflow-hidden text-[10px]">
                          {allCellItems.slice(0, 3).map((item) => (
                            <div key={item.id} className={`px-1.5 py-0.5 rounded truncate ${item.bg}`}>
                              {item.icon} {item.title}
                            </div>
                          ))}
                          {allCellItems.length > 3 && (
                            <div className="text-[9px] font-mono text-primary-secondary dark:text-stone-300 text-right pr-0.5">
                              +{allCellItems.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. WEEK VIEW */}
          {viewMode === 'week' && (
            <div className="mosaic-card p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-warm-border dark:border-warm-border-dark pb-2">
                <span className="text-xs font-mono uppercase text-primary-secondary dark:text-stone-300">
                  Week of {format(weekDays[0], 'MMM d')} – {format(weekDays[6], 'MMM d, yyyy')}
                </span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const isSelected = selectedDay === dayStr;
                  const isTodayDay = todayStr === dayStr;
                  
                  const dayEvts = events.filter(e => e.startDate === dayStr);
                  const dayExs = exams.filter(ex => ex.date === dayStr);
                  const dayTsks = tasks.filter(t => t.dueDate === dayStr || (!t.dueDate && dayStr === todayStr));
                  const dayGls = goals.filter(g => g.targetDate === dayStr || (!g.targetDate && dayStr === todayStr));

                  return (
                    <div
                      key={dayStr}
                      onClick={() => setSelectedDay(dayStr)}
                      className={`min-h-[280px] p-2.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-quiet ${
                        isSelected
                          ? 'border-sage-500 bg-sage-500/10 dark:bg-sage-500/20 shadow-subtle'
                          : isTodayDay
                          ? 'border-sage-400/50 bg-warm-subtle dark:bg-warm-subtle-dark'
                          : 'border-warm-border dark:border-warm-border-dark hover:border-sage-400/60'
                      }`}
                    >
                      <div>
                        {/* Day Header */}
                        <div className="text-center pb-2 border-b border-warm-border/50 dark:border-warm-border-dark/50">
                          <div className="text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300">
                            {format(day, 'EEE')}
                          </div>
                          <div className={`text-sm font-mono font-bold ${
                            isTodayDay ? 'text-sage-600 dark:text-sage-300' : 'text-primary-text dark:text-primary-text-dark'
                          }`}>
                            {format(day, 'd')}
                          </div>
                        </div>

                        {/* Event / Task / Goal list pills */}
                        <div className="space-y-1.5 mt-2 overflow-y-auto max-h-48 text-[10px]">
                          {dayExs.map((ex) => (
                            <div key={ex.id} className="p-1 rounded bg-sage-500/20 text-sage-700 dark:text-sage-300 font-bold truncate">
                              📚 {ex.title}
                            </div>
                          ))}
                          {dayGls.map((g) => (
                            <div key={g.id} className={`p-1 rounded truncate ${g.status === 'completed' ? 'bg-emerald-500/10 text-emerald-700/50 dark:text-emerald-300/50 line-through' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium'}`}>
                              {g.status === 'completed' ? '✅' : '🎯'} {g.title}
                            </div>
                          ))}
                          {dayEvts.map((e) => (
                            <div key={e.id} className="p-1 rounded bg-warm-subtle dark:bg-warm-subtle-dark text-primary-text dark:text-primary-text-dark truncate">
                              📅 {e.title}
                            </div>
                          ))}
                          {dayTsks.map((t) => (
                            <div key={t.id} className={`p-1 rounded truncate ${t.status === 'completed' ? 'bg-amber-500/10 text-amber-900/50 dark:text-amber-200/50 line-through' : 'bg-warm-subtle/60 dark:bg-warm-subtle-dark/60 text-primary-secondary dark:text-stone-300'}`}>
                              {t.status === 'completed' ? '✅' : '✓'} {t.title}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-[9px] font-mono text-primary-secondary dark:text-stone-300 text-center pt-2">
                        {dayEvts.length + dayExs.length + dayTsks.length + dayGls.length} items
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. DAY VIEW */}
          {viewMode === 'day' && (
            <div className="mosaic-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-warm-border dark:border-warm-border-dark pb-3">
                <div>
                  <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark">
                    Schedule for {format(parseISO(selectedDay), 'EEEE, MMMM d')}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddEventOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Event</span>
                </button>
              </div>

              {/* Goals Target for Today */}
              {dayGoals.length > 0 && (
                <div className="bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-emerald-700 dark:text-emerald-300 font-medium">
                    Goals Target Today ({dayGoals.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dayGoals.map(g => (
                      <div key={g.id} className={`px-2.5 py-1 rounded-lg bg-warm-card dark:bg-warm-card-dark border text-xs flex items-center gap-2 ${g.status === 'completed' ? 'border-emerald-500/15 opacity-60' : 'border-emerald-500/30'}`}>
                        <button onClick={() => updateGoal(g.id, { status: g.status === 'completed' ? 'active' : 'completed', progress: g.status === 'completed' ? g.progress : 100 })} className="hover:scale-110 transition-transform" title="Toggle completion">
                          {g.status === 'completed' ? '✅' : '🎯'}
                        </button>
                        <span className={`font-medium ${g.status === 'completed' ? 'line-through text-primary-secondary dark:text-stone-400' : 'text-primary-text dark:text-primary-text-dark'}`}>{g.title}</span>
                        <span className="text-[10px] font-mono text-primary-secondary capitalize">({g.tier})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks Due Today (All-Day) */}
              {dayTasks.length > 0 && (
                <div className="bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 border border-warm-border dark:border-warm-border-dark rounded-xl p-3 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-primary-secondary dark:text-stone-300 font-medium">
                    Tasks Due Today ({dayTasks.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dayTasks.map(t => (
                      <div key={t.id} className={`px-2.5 py-1 rounded-lg bg-warm-card dark:bg-warm-card-dark border text-xs flex items-center gap-2 ${t.status === 'completed' ? 'border-warm-border/30 dark:border-warm-border-dark/30 opacity-60' : 'border-warm-border dark:border-warm-border-dark'}`}>
                        <button onClick={() => toggleTaskStatus(t.id)} className="hover:scale-110 transition-transform" title="Toggle completion">
                          {t.status === 'completed' ? '✅' : <span className="text-amber-500 font-bold">○</span>}
                        </button>
                        <span className={`${t.status === 'completed' ? 'line-through text-primary-secondary dark:text-stone-400' : 'text-primary-text dark:text-primary-text-dark'}`}>{t.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hour-by-hour timeline */}
              <div className="divide-y divide-warm-border/60 dark:divide-warm-border-dark/60 max-h-[480px] overflow-y-auto pr-1">
                {hoursList.map((hour) => {
                  const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                  const matchingEvents = dayEvents.filter(e => e.startTime && e.startTime.startsWith(hour.toString().padStart(2, '0')));
                  const matchingExams = dayExams.filter(ex => ex.time && ex.time.startsWith(hour.toString().padStart(2, '0')));

                  return (
                    <div key={hour} className="py-3 grid grid-cols-12 gap-3 items-start group">
                      <div className="col-span-2 text-[11px] font-mono text-primary-secondary dark:text-stone-300 font-medium">
                        {hourStr}
                      </div>

                      <div className="col-span-10 space-y-1.5">
                        {matchingExams.map((ex) => (
                          <div key={ex.id} className="p-2.5 rounded-xl bg-sage-500/15 border border-sage-500/30 text-xs flex items-center justify-between">
                            <div>
                              <span className="font-bold text-sage-700 dark:text-sage-300">📚 Exam: {ex.title}</span>
                              {ex.location && <div className="text-[10px] text-primary-secondary dark:text-stone-300">{ex.location}</div>}
                            </div>
                            <span className="text-[10px] font-mono text-sage-600 dark:text-sage-300">{ex.time}</span>
                          </div>
                        ))}

                        {matchingEvents.map((evt) => (
                          <div key={evt.id} className="p-2.5 rounded-xl bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark text-xs flex items-center justify-between group/evt">
                            <div>
                              <span className="font-medium text-primary-text dark:text-primary-text-dark">📅 {evt.title}</span>
                              {evt.location && <div className="text-[10px] text-primary-secondary dark:text-stone-300">{evt.location}</div>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-primary-secondary dark:text-stone-300">{evt.startTime}</span>
                              <button
                                onClick={() => deleteEvent(evt.id)}
                                className="text-[10px] text-primary-secondary hover:text-red-500 opacity-0 group-hover/evt:opacity-100 transition-quiet"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}

                        {matchingEvents.length === 0 && matchingExams.length === 0 && (
                          <div className="h-4 border-b border-dashed border-warm-border/30 dark:border-warm-border-dark/30 text-[10px] text-primary-secondary opacity-0 group-hover:opacity-40">
                            + Add item at {hourStr}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Selected Day Agenda Side-drawer */}
        <div className="mosaic-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-warm-border dark:border-warm-border-dark pb-3">
            <div>
              <div className="font-mono text-[11px] uppercase text-primary-secondary dark:text-stone-300">Agenda</div>
              <div className="font-serif text-lg text-primary-text dark:text-primary-text-dark font-medium">
                {format(parseISO(selectedDay), 'EEE, MMM d, yyyy')}
              </div>
            </div>
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="p-2 rounded-lg bg-sage-500 text-white hover:bg-sage-600 shadow-subtle transition-quiet"
              title="Add event for this day"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {/* Goals */}
            {dayGoals.map((g) => (
              <div key={g.id} className={`p-3 rounded-xl border space-y-1 ${g.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/15 opacity-70' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-300 font-bold">{g.status === 'completed' ? '✅' : '🎯'} Goal ({g.tier})</span>
                  <button onClick={() => updateGoal(g.id, { status: g.status === 'completed' ? 'active' : 'completed', progress: g.status === 'completed' ? g.progress : 100 })} className="text-[10px] font-mono text-emerald-600 hover:text-emerald-500 dark:text-emerald-300">
                    {g.status === 'completed' ? 'Undo' : 'Complete'}
                  </button>
                </div>
                <div className={`text-xs font-medium ${g.status === 'completed' ? 'line-through text-primary-secondary dark:text-stone-400' : 'text-primary-text dark:text-primary-text-dark'}`}>{g.title}</div>
              </div>
            ))}

            {/* Exams */}
            {dayExams.map((ex) => (
              <div key={ex.id} className="p-3 rounded-xl bg-sage-500/10 border border-sage-500/30 space-y-1">
                <span className="text-[10px] font-mono uppercase text-sage-600 dark:text-sage-300 font-bold">Exam</span>
                <div className="text-xs font-medium text-primary-text dark:text-primary-text-dark">{ex.title}</div>
                {ex.time && <div className="text-[11px] font-mono text-primary-secondary dark:text-stone-300">{ex.time}</div>}
              </div>
            ))}

            {/* Events */}
            {dayEvents.map((evt) => (
              <div key={evt.id} className="p-3 rounded-xl border border-warm-border dark:border-warm-border-dark space-y-1 group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary-text dark:text-primary-text-dark">{evt.title}</span>
                  <button 
                    onClick={() => deleteEvent(evt.id)}
                    className="text-[10px] text-primary-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-quiet"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-primary-secondary dark:text-stone-300">
                  {evt.startTime && <span>{evt.startTime}</span>}
                  {evt.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{evt.location}</span>}
                </div>
              </div>
            ))}

            {/* Tasks due on this day */}
            {dayTasks.map((t) => (
              <div key={t.id} className={`p-2.5 rounded-lg flex items-center justify-between text-xs ${t.status === 'completed' ? 'bg-warm-subtle/50 dark:bg-warm-subtle-dark/50 opacity-70' : 'bg-warm-subtle dark:bg-warm-subtle-dark'}`}>
                <button onClick={() => toggleTaskStatus(t.id)} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                  <span>{t.status === 'completed' ? '✅' : '○'}</span>
                  <span className={`font-medium ${t.status === 'completed' ? 'line-through text-primary-secondary dark:text-stone-400' : 'text-primary-text dark:text-primary-text-dark'}`}>{t.title}</span>
                </button>
                <span className="text-[10px] font-mono text-primary-secondary dark:text-stone-300">{t.status === 'completed' ? 'Done' : 'Task'}</span>
              </div>
            ))}

            {dayEvents.length === 0 && dayExams.length === 0 && dayTasks.length === 0 && dayGoals.length === 0 && (
              <div className="py-8 text-center text-xs text-primary-secondary dark:text-stone-300">
                No events or deadlines for this day.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-warm-bg dark:bg-warm-bg-dark border border-warm-border dark:border-warm-border-dark rounded-2xl w-full max-w-md p-6 shadow-elevated">
            <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark mb-4">
              Add Event for {selectedDay}
            </h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <input
                type="text"
                autoFocus
                placeholder="Event title..."
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2.5 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Time</label>
                  <input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-lg px-3 py-2 text-xs text-primary-text dark:text-primary-text-dark"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Location (optional)"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="w-full bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-lg px-3 py-2 text-xs text-primary-text dark:text-primary-text-dark"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-primary-secondary dark:text-stone-300 hover:bg-warm-subtle rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-sage-500 text-white rounded-xl shadow-subtle hover:bg-sage-600"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
