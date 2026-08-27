import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Clock, Plus, Play, Pause, Square, Award, AlertCircle, CheckSquare } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Course, Assignment, Exam } from '../../types';
import { getTodayStr, formatDateDisplay } from '../../utils/dateUtils';

export const AcademicsArea: React.FC = () => {
  const { 
    courses, 
    assignments, 
    exams, 
    addCourse, 
    addAssignment, 
    addExam, 
    recordStudySession,
    tasks,
    toggleTaskStatus 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'courses' | 'assignments' | 'exams' | 'timer'>('courses');

  // Study Timer state
  const [timerCourseId, setTimerCourseId] = useState<string>(courses[0]?.id || '');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Add Course Modal State
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [cName, setCName] = useState('');
  const [cCode, setCCode] = useState('');
  const [cInstructor, setCInstructor] = useState('');
  const [cCredits, setCCredits] = useState(4);

  // Add Assignment Modal State
  const [isAddAssignOpen, setIsAddAssignOpen] = useState(false);
  const [aCourseId, setACourseId] = useState('');
  const [aTitle, setATitle] = useState('');
  const [aDeadline, setADeadline] = useState(getTodayStr());

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else if (!isTimerRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleFinishTimer = () => {
    if (timerSeconds < 10) return; // ignore super short sessions
    const durationMins = Math.round(timerSeconds / 60) || 1;
    recordStudySession(timerCourseId, durationMins, 'Active study timer session');
    setIsTimerRunning(false);
    setTimerSeconds(0);
    alert(`Logged ${durationMins} minutes of study activity into your Daily Log & Heatmap!`);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cCode.trim()) return;

    addCourse({
      name: cName.trim(),
      code: cCode.trim(),
      instructor: cInstructor.trim() || undefined,
      semester: 'Autumn 2026',
      credits: cCredits,
      attendedClasses: 0,
      totalClasses: 0
    });

    setCName('');
    setCCode('');
    setIsAddCourseOpen(false);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aTitle.trim()) return;

    addAssignment({
      courseId: aCourseId || courses[0]?.id || '',
      title: aTitle.trim(),
      deadline: aDeadline,
      priority: 'high',
      status: 'todo'
    });

    setATitle('');
    setIsAddAssignOpen(false);
  };

  const formatTimerDisplay = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border dark:border-warm-border-dark pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sage-500 text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium text-primary-text dark:text-primary-text-dark">Academics</h1>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-warm-subtle dark:bg-warm-subtle-dark rounded-xl border border-warm-border/50 dark:border-warm-border-dark/50">
          {(['courses', 'assignments', 'exams', 'timer'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1 text-xs font-medium rounded-lg uppercase tracking-wider transition-quiet ${
                activeTab === t
                  ? 'bg-warm-card dark:bg-warm-card-dark text-sage-600 dark:text-sage-300 font-bold shadow-subtle'
                  : 'text-primary-secondary dark:text-zinc-400 hover:text-primary-text dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Active Study Timer Tab */}
      {activeTab === 'timer' && (
        <div className="mosaic-card p-8 text-center space-y-6 max-w-lg mx-auto border-sage-500/40">
          <h3 className="font-serif text-xl font-medium text-primary-text dark:text-primary-text-dark">Active Study Timer</h3>
          
          <div>
            <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 mb-2">Select Course</label>
            <select
              value={timerCourseId}
              onChange={(e) => setTimerCourseId(e.target.value)}
              className="bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark font-medium focus:outline-none"
            >
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
            </select>
          </div>

          <div className="font-mono text-5xl font-bold text-sage-600 dark:text-sage-300 tracking-widest my-4">
            {formatTimerDisplay(timerSeconds)}
          </div>

          <div className="flex items-center justify-center gap-3">
            {!isTimerRunning ? (
              <button
                onClick={() => setIsTimerRunning(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium shadow-subtle transition-quiet"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Session</span>
              </button>
            ) : (
              <button
                onClick={() => setIsTimerRunning(false)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium shadow-subtle transition-quiet"
              >
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </button>
            )}

            {timerSeconds > 0 && (
              <button
                onClick={handleFinishTimer}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-text dark:bg-white text-white dark:text-black font-medium text-xs shadow-subtle transition-quiet"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Finish & Record</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddCourseOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sage-500 text-white text-xs font-medium shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map((c) => {
              const attendanceRate = c.totalClasses > 0 
                ? Math.round((c.attendedClasses / c.totalClasses) * 100) 
                : 100;

              return (
                <div key={c.id} className="mosaic-card space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-sage-600 dark:text-sage-300 font-bold">{c.code}</span>
                      <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark">{c.name}</h3>
                      {c.instructor && <p className="text-xs text-primary-secondary dark:text-stone-300">{c.instructor}</p>}
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-warm-subtle dark:bg-[#222222] border border-warm-border dark:border-[#333333] text-primary-secondary dark:text-stone-300">
                      {c.credits} Credits
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-warm-border dark:border-warm-border-dark pt-2">
                    <span className="text-primary-secondary dark:text-stone-300">Target Grade: <strong className="text-primary-text dark:text-white">{c.targetGrade || 'A'}</strong></span>
                    <span className="text-primary-secondary dark:text-stone-300">Attendance: <strong className="text-sage-600 dark:text-sage-300">{attendanceRate}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddAssignOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sage-500 text-white text-xs font-medium shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Assignment</span>
            </button>
          </div>

          <div className="divide-y divide-warm-border dark:divide-warm-border-dark border border-warm-border dark:border-warm-border-dark rounded-xl bg-warm-card dark:bg-warm-card-dark overflow-hidden">
            {assignments.map((a) => {
              const course = courses.find(c => c.id === a.courseId);
              return (
                <div key={a.id} className="mosaic-row px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-medium text-primary-text dark:text-primary-text-dark">{a.title}</div>
                    <div className="text-[10px] font-mono text-sage-600 dark:text-sage-300">{course?.code || 'Academic'}</div>
                  </div>
                  <div className="text-xs font-mono text-primary-secondary dark:text-stone-300">
                    Due {formatDateDisplay(a.deadline)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Exams Tab */}
      {activeTab === 'exams' && (
        <div className="space-y-3">
          {exams.map((ex) => {
            const course = courses.find(c => c.id === ex.courseId);
            return (
              <div key={ex.id} className="mosaic-card p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-rose-600 dark:text-rose-300 dark:bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-bold inline-block mb-1">
                    {course?.code} EXAM
                  </span>
                  <h4 className="font-serif text-base font-medium text-primary-text dark:text-primary-text-dark">{ex.title}</h4>
                  {ex.location && <p className="text-xs text-primary-secondary dark:text-stone-300">{ex.location}</p>}
                </div>
                <div className="text-right font-mono text-xs text-primary-secondary dark:text-stone-300">
                  <div>{ex.date}</div>
                  {ex.time && <div>{ex.time}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Course Modal */}
      {isAddCourseOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl w-full max-w-md p-6 shadow-elevated">
            <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark mb-4">Add Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-3">
              <input
                type="text"
                placeholder="Course Code (e.g. EE-301)..."
                value={cCode}
                onChange={(e) => setCCode(e.target.value)}
                className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
              />
              <input
                type="text"
                placeholder="Course Name..."
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
              />
              <input
                type="text"
                placeholder="Instructor (Optional)..."
                value={cInstructor}
                onChange={(e) => setCInstructor(e.target.value)}
                className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
              />
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCourseOpen(false)}
                  className="w-1/2 py-2 rounded-xl border border-warm-border dark:border-warm-border-dark text-xs text-primary-secondary dark:text-stone-300 hover:text-primary-text dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {isAddAssignOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-warm-card dark:bg-warm-card-dark border border-warm-border dark:border-warm-border-dark rounded-2xl w-full max-w-md p-6 shadow-elevated">
            <h3 className="font-serif text-lg font-medium text-primary-text dark:text-primary-text-dark mb-4">Add Assignment</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <input
                type="text"
                placeholder="Assignment Title..."
                value={aTitle}
                onChange={(e) => setATitle(e.target.value)}
                className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
              />
              <div>
                <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Course</label>
                <select
                  value={aCourseId}
                  onChange={(e) => setACourseId(e.target.value)}
                  className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-primary-secondary dark:text-stone-300 mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={aDeadline}
                  onChange={(e) => setADeadline(e.target.value)}
                  className="w-full bg-warm-subtle dark:bg-warm-subtle-dark border border-warm-border dark:border-warm-border-dark rounded-xl px-4 py-2 text-xs text-primary-text dark:text-primary-text-dark focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAssignOpen(false)}
                  className="w-1/2 py-2 rounded-xl border border-warm-border dark:border-warm-border-dark text-xs text-primary-secondary dark:text-stone-300 hover:text-primary-text dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
