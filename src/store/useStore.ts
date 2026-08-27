import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mosaicSQLiteStorage, clearSQLiteStorage } from '../db/sqliteStorage';
import { 
  ViewType, 
  Area, 
  Task, 
  CalendarEvent, 
  Habit, 
  Goal, 
  Project, 
  Activity, 
  DailyLog, 
  InboxItem, 
  Review, 
  Course, 
  Assignment, 
  Exam, 
  StudySession, 
  Exercise, 
  WorkoutPlan, 
  WorkoutLog, 
  Person, 
  InteractionLog, 
  UserSettings,
  MealLog,
  NutritionGoal,
  MuscleGroup,
  WeeklySplitDay,
  SyncStatusType,
  SyncSettings
} from '../types';
import { syncEngine } from '../services/syncEngine';
import { triggerMosaicCompletionEffect } from '../utils/mosaicEffects';
import { 
  initialAreas, 
  initialUserSettings, 
  initialTasks, 
  initialEvents, 
  initialHabits, 
  initialGoals, 
  initialProjects, 
  initialActivities, 
  initialDailyLogs, 
  initialCourses, 
  initialAssignments, 
  initialExams, 
  initialExercises, 
  initialWorkoutPlans, 
  initialWorkoutLogs, 
  initialPeople,
  initialMealLogs,
  initialNutritionGoal
} from './seedData';
import { getTodayStr } from '../utils/dateUtils';

interface State {
  // Navigation & Modals
  currentView: ViewType;
  selectedCustomAreaId?: string;
  isQuickCaptureOpen: boolean;
  isGlobalSearchOpen: boolean;
  isNewAreaOpen: boolean;
  
  // App Data
  userSettings: UserSettings;
  areas: Area[];
  tasks: Task[];
  events: CalendarEvent[];
  habits: Habit[];
  goals: Goal[];
  projects: Project[];
  activities: Activity[];
  dailyLogs: Record<string, DailyLog>; // Key: YYYY-MM-DD
  inbox: InboxItem[];
  reviews: Review[];

  // Academics
  courses: Course[];
  assignments: Assignment[];
  exams: Exam[];

  // Gym
  exercises: Exercise[];
  workoutPlans: WorkoutPlan[];
  workoutLogs: WorkoutLog[];
  weeklySplit: WeeklySplitDay[];
  updateWeeklySplitDay: (day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN', muscleGroup: MuscleGroup) => void;

  // Communication
  people: Person[];
  interactionLogs: InteractionLog[];

  // Diet & Nutrition
  mealLogs: MealLog[];
  nutritionGoal: NutritionGoal;

  // Navigation & UI Actions
  setCurrentView: (view: ViewType, customAreaId?: string) => void;
  setQuickCaptureOpen: (open: boolean) => void;
  setGlobalSearchOpen: (open: boolean) => void;
  setNewAreaOpen: (open: boolean) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;

  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;

  // Event Actions
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Habit Actions
  addHabit: (habit: Omit<Habit, 'id' | 'completionHistory'>) => void;
  toggleHabitDate: (id: string, dateStr: string) => void;
  deleteHabit: (id: string) => void;

  // Goal Actions
  addGoal: (goal: Omit<Goal, 'id' | 'progress' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  deleteProject: (id: string) => void;

  // Activity Actions
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  deleteActivity: (id: string) => void;

  // Daily Log Actions
  getOrCreateDailyLog: (dateStr: string) => DailyLog;
  updateDailyLog: (dateStr: string, updates: Partial<DailyLog>) => void;
  addWinToLog: (dateStr: string, winText: string) => void;
  removeWinFromLog: (dateStr: string, index: number) => void;
  addProblemToLog: (dateStr: string, problemText: string) => void;
  removeProblemFromLog: (dateStr: string, index: number) => void;

  // Inbox Actions
  addInboxItem: (content: string) => void;
  deleteInboxItem: (id: string) => void;
  convertInboxToTask: (inboxId: string, taskTitle: string, areaId?: string) => void;

  // Academics Actions
  addCourse: (course: Omit<Course, 'id'>) => void;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  addExam: (exam: Omit<Exam, 'id'>) => void;
  recordStudySession: (courseId: string, durationMinutes: number, notes?: string) => void;

  // Gym Actions
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  addWorkoutPlan: (plan: Omit<WorkoutPlan, 'id'>) => void;
  recordWorkoutLog: (log: Omit<WorkoutLog, 'id'>) => void;

  // Communication Actions
  addPerson: (person: Omit<Person, 'id'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  addInteractionLog: (personId: string, summary: string, channel: InteractionLog['channel']) => void;

  // Diet & Nutrition Actions
  addMealLog: (meal: Omit<MealLog, 'id' | 'createdAt'>) => void;
  deleteMealLog: (id: string) => void;
  updateNutritionGoal: (goal: Partial<NutritionGoal>) => void;

  // Area Actions
  addCustomArea: (area: Omit<Area, 'id' | 'isCustom'>) => void;
  deleteCustomArea: (id: string) => void;

  // Reviews
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;

  // Sync Actions
  syncStatus: SyncStatusType;
  syncError: string | null;
  triggerSyncNow: () => Promise<boolean>;

  // Backup & Reset
  resetToSeedData: () => void;
  importDataJSON: (jsonStr: string) => boolean;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      // Navigation State
      currentView: 'home',
      selectedCustomAreaId: undefined,
      isQuickCaptureOpen: false,
      isGlobalSearchOpen: false,
      isNewAreaOpen: false,

      // Core State
      userSettings: initialUserSettings,
      areas: initialAreas,
      tasks: initialTasks,
      events: initialEvents,
      habits: initialHabits,
      goals: initialGoals,
      projects: initialProjects,
      activities: initialActivities,
      dailyLogs: initialDailyLogs,
      inbox: [],
      reviews: [],
      courses: initialCourses,
      assignments: initialAssignments,
      exams: initialExams,
      exercises: initialExercises,
      workoutPlans: initialWorkoutPlans,
      workoutLogs: initialWorkoutLogs,
      weeklySplit: [
        { day: 'MON', muscleGroup: 'chest' },
        { day: 'TUE', muscleGroup: 'back' },
        { day: 'WED', muscleGroup: 'legs' },
        { day: 'THU', muscleGroup: 'shoulders' },
        { day: 'FRI', muscleGroup: 'arms' },
        { day: 'SAT', muscleGroup: 'rest' },
        { day: 'SUN', muscleGroup: 'rest' },
      ],
      updateWeeklySplitDay: (day, muscleGroup) => set((state) => ({
        weeklySplit: (state.weeklySplit || []).map((s) => s.day === day ? { ...s, muscleGroup } : s)
      })),
      people: initialPeople,
      interactionLogs: [],
      mealLogs: initialMealLogs,
      nutritionGoal: initialNutritionGoal,

      // Sync State & Actions
      syncStatus: 'idle',
      syncError: null,
      triggerSyncNow: async () => {
        const state = get();
        const settings = state.userSettings.syncSettings || { provider: 'disabled', autoSync: false };
        
        const success = await syncEngine.sync(settings, (status, err) => {
          set({ syncStatus: status, syncError: err || null });
        });

        if (success) {
          const nowStr = new Date().toISOString();
          set((s) => ({
            userSettings: {
              ...s.userSettings,
              syncSettings: {
                ...(s.userSettings.syncSettings || { provider: 'disabled', autoSync: false }),
                lastSyncedAt: nowStr
              }
            }
          }));
        }

        return success;
      },

      // Navigation & Modal Handlers
      setCurrentView: (view, customAreaId) => set({ currentView: view, selectedCustomAreaId: customAreaId }),
      setQuickCaptureOpen: (open) => set({ isQuickCaptureOpen: open }),
      setGlobalSearchOpen: (open) => set({ isGlobalSearchOpen: open }),
      setNewAreaOpen: (open) => set({ isNewAreaOpen: open }),
      updateUserSettings: (updates) => set((s) => ({ userSettings: { ...s.userSettings, ...updates } })),

      // Task Handlers
      addTask: (taskData) => set((state) => {
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}`,
          dueDate: taskData.dueDate || getTodayStr(),
          createdAt: getTodayStr()
        };
        return { tasks: [newTask, ...state.tasks] };
      }),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
      })),

      toggleTaskStatus: (id) => set((state) => {
        const task = state.tasks.find((t) => t.id === id);
        if (!task) return state;

        const isCompleted = task.status === 'completed';
        const newStatus = isCompleted ? 'todo' : 'completed';
        const nowStr = new Date().toISOString();

        const updatedTasks = state.tasks.map((t) =>
          t.id === id ? { ...t, status: newStatus as any, completedAt: !isCompleted ? nowStr : undefined } : t
        );

        // If completed, record an Activity entry & play subtle mosaic task completion effect
        let updatedActivities = state.activities;
        if (!isCompleted) {
          triggerMosaicCompletionEffect('task');
          const newAct: Activity = {
            id: `act-task-${id}-${Date.now()}`,
            type: 'task_completion',
            title: `Completed task: ${task.title}`,
            timestamp: nowStr,
            durationMinutes: 0,
            areaId: task.areaId,
            projectId: task.projectId,
            goalId: task.goalId,
            source: 'Task System'
          };
          updatedActivities = [newAct, ...state.activities];
        } else {
          // Unchecking task: remove completion activity
          updatedActivities = state.activities.filter((a) => 
            !(a.type === 'task_completion' && (a.id.includes(id) || a.title === `Completed task: ${task.title}`))
          );
        }

        return { tasks: updatedTasks, activities: updatedActivities };
      }),

      deleteTask: (id) => set((state) => {
        const task = state.tasks.find((t) => t.id === id);
        return {
          tasks: state.tasks.filter((t) => t.id !== id),
          activities: state.activities.filter((a) => 
            !(a.id.includes(id) || (task && a.title === `Completed task: ${task.title}`))
          )
        };
      }),

      // Event Handlers
      addEvent: (evtData) => set((state) => ({
        events: [{ ...evtData, id: `evt-${Date.now()}` }, ...state.events]
      })),

      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e))
      })),

      deleteEvent: (id) => set((state) => ({
        events: state.events.filter((e) => e.id !== id)
      })),

      // Habit Handlers
      addHabit: (habitData) => set((state) => ({
        habits: [
          {
            ...habitData,
            id: `habit-${Date.now()}`,
            completionHistory: {}
          },
          ...state.habits
        ]
      })),

      toggleHabitDate: (id, dateStr) => set((state) => {
        const habit = state.habits.find((h) => h.id === id);
        if (!habit) return state;

        const currentVal = Boolean(habit.completionHistory[dateStr]);
        const newVal = !currentVal;
        const newHistory = { ...habit.completionHistory, [dateStr]: newVal };

        const updatedHabits = state.habits.map((h) =>
          h.id === id ? { ...h, completionHistory: newHistory } : h
        );

        let updatedActivities = state.activities;
        if (newVal) {
          triggerMosaicCompletionEffect('habit');
          const actId = `act-habit-${id}-${dateStr}`;
          const newAct: Activity = {
            id: actId,
            type: 'habit_practice',
            title: `Practiced habit: ${habit.name}`,
            timestamp: `${dateStr}T12:00:00Z`,
            durationMinutes: 0,
            areaId: habit.areaId,
            goalId: habit.goalId,
            source: 'Habit System'
          };
          updatedActivities = [newAct, ...state.activities.filter((a) => a.id !== actId)];
        } else {
          // Untoggling habit date: remove activity
          updatedActivities = state.activities.filter((a) => 
            !(a.id === `act-habit-${id}-${dateStr}` || (a.type === 'habit_practice' && a.title === `Practiced habit: ${habit.name}` && a.timestamp.startsWith(dateStr)))
          );
        }

        return { habits: updatedHabits, activities: updatedActivities };
      }),

      deleteHabit: (id) => set((state) => {
        const habit = state.habits.find((h) => h.id === id);
        return {
          habits: state.habits.filter((h) => h.id !== id),
          activities: state.activities.filter((a) => 
            !(a.id.includes(id) || (habit && a.title === `Practiced habit: ${habit.name}`))
          )
        };
      }),

      // Goal Handlers
      addGoal: (goalData) => set((state) => ({
        goals: [
          {
            ...goalData,
            id: `goal-${Date.now()}`,
            progress: 0,
            createdAt: getTodayStr()
          },
          ...state.goals
        ]
      })),

      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g))
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      })),

      // Project Handlers
      addProject: (projData) => set((state) => ({
        projects: [
          {
            ...projData,
            id: `proj-${Date.now()}`,
            createdAt: getTodayStr()
          },
          ...state.projects
        ]
      })),

      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
      })),

      toggleMilestone: (projectId, milestoneId) => set((state) => ({
        projects: state.projects.map((p) => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            milestones: p.milestones.map((m) =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            )
          };
        })
      })),

      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id)
      })),

      // Activity Handlers
      addActivity: (actData) => set((state) => ({
        activities: [{ ...actData, id: `act-${Date.now()}` }, ...state.activities]
      })),

      deleteActivity: (id) => set((state) => ({
        activities: state.activities.filter((a) => a.id !== id)
      })),

      // Daily Log Handlers
      getOrCreateDailyLog: (dateStr) => {
        const existing = get().dailyLogs[dateStr];
        if (existing) return existing;
        return {
          date: dateStr,
          freeformNote: '',
          wins: [],
          problems: [],
          tomorrowIntention: '',
          manualTimeline: [],
          updatedAt: new Date().toISOString()
        };
      },

      updateDailyLog: (dateStr, updates) => set((state) => {
        const currentLog = state.dailyLogs[dateStr] || {
          date: dateStr,
          freeformNote: '',
          wins: [],
          problems: [],
          tomorrowIntention: '',
          manualTimeline: [],
          updatedAt: new Date().toISOString()
        };
        const updatedLog: DailyLog = {
          ...currentLog,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        return {
          dailyLogs: {
            ...state.dailyLogs,
            [dateStr]: updatedLog
          }
        };
      }),

      addWinToLog: (dateStr, winText) => set((state) => {
        const log = state.dailyLogs[dateStr] || {
          date: dateStr, freeformNote: '', wins: [], problems: [], tomorrowIntention: '', manualTimeline: [], updatedAt: new Date().toISOString()
        };
        return {
          dailyLogs: {
            ...state.dailyLogs,
            [dateStr]: { ...log, wins: [...log.wins, winText], updatedAt: new Date().toISOString() }
          }
        };
      }),

      removeWinFromLog: (dateStr, index) => set((state) => {
        const log = state.dailyLogs[dateStr];
        if (!log) return state;
        return {
          dailyLogs: {
            ...state.dailyLogs,
            [dateStr]: { ...log, wins: log.wins.filter((_, i) => i !== index), updatedAt: new Date().toISOString() }
          }
        };
      }),

      addProblemToLog: (dateStr, problemText) => set((state) => {
        const log = state.dailyLogs[dateStr] || {
          date: dateStr, freeformNote: '', wins: [], problems: [], tomorrowIntention: '', manualTimeline: [], updatedAt: new Date().toISOString()
        };
        return {
          dailyLogs: {
            ...state.dailyLogs,
            [dateStr]: { ...log, problems: [...log.problems, problemText], updatedAt: new Date().toISOString() }
          }
        };
      }),

      removeProblemFromLog: (dateStr, index) => set((state) => {
        const log = state.dailyLogs[dateStr];
        if (!log) return state;
        return {
          dailyLogs: {
            ...state.dailyLogs,
            [dateStr]: { ...log, problems: log.problems.filter((_, i) => i !== index), updatedAt: new Date().toISOString() }
          }
        };
      }),

      // Inbox Handlers
      addInboxItem: (content) => set((state) => ({
        inbox: [
          { id: `inbox-${Date.now()}`, content, createdAt: getTodayStr(), status: 'inbox' },
          ...state.inbox
        ]
      })),

      deleteInboxItem: (id) => set((state) => ({
        inbox: state.inbox.filter((item) => item.id !== id)
      })),

      convertInboxToTask: (inboxId, taskTitle, areaId) => set((state) => {
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: taskTitle,
          priority: 'medium',
          status: 'todo',
          areaId,
          subtasks: [],
          createdAt: getTodayStr()
        };
        return {
          tasks: [newTask, ...state.tasks],
          inbox: state.inbox.filter((item) => item.id !== inboxId)
        };
      }),

      // Academics Actions
      addCourse: (courseData) => set((state) => ({
        courses: [...state.courses, { ...courseData, id: `course-${Date.now()}` }]
      })),

      addAssignment: (assignData) => set((state) => ({
        assignments: [{ ...assignData, id: `assign-${Date.now()}` }, ...state.assignments]
      })),

      addExam: (examData) => set((state) => ({
        exams: [{ ...examData, id: `exam-${Date.now()}` }, ...state.exams]
      })),

      recordStudySession: (courseId, durationMinutes, notes) => set((state) => {
        const course = state.courses.find((c) => c.id === courseId);
        const courseName = course ? course.name : 'Academic Study';
        const nowStr = new Date().toISOString();

        const act: Activity = {
          id: `act-study-${Date.now()}`,
          type: 'study',
          title: `Studied ${courseName}`,
          timestamp: nowStr,
          durationMinutes,
          areaId: 'academics',
          source: 'Academic Study Timer'
        };

        return {
          activities: [act, ...state.activities]
        };
      }),

      // Gym Actions
      addExercise: (exData) => set((state) => ({
        exercises: [...state.exercises, { ...exData, id: `ex-${Date.now()}` }]
      })),

      addWorkoutPlan: (planData) => set((state) => ({
        workoutPlans: [...state.workoutPlans, { ...planData, id: `plan-${Date.now()}` }]
      })),

      recordWorkoutLog: (logData) => set((state) => {
        const nowStr = new Date().toISOString();
        const act: Activity = {
          id: `act-workout-${Date.now()}`,
          type: 'workout',
          title: logData.name || 'Workout Session',
          timestamp: nowStr,
          durationMinutes: logData.durationMinutes,
          areaId: 'gym',
          source: 'Gym Logger'
        };

        const newLog: WorkoutLog = {
          ...logData,
          id: `wlog-${Date.now()}`,
          activityId: act.id
        };

        return {
          workoutLogs: [newLog, ...state.workoutLogs],
          activities: [act, ...state.activities]
        };
      }),

      // Communication Actions
      addPerson: (personData) => set((state) => ({
        people: [{ ...personData, id: `person-${Date.now()}` }, ...state.people]
      })),

      updatePerson: (id, updates) => set((state) => ({
        people: state.people.map((p) => (p.id === id ? { ...p, ...updates } : p))
      })),

      addInteractionLog: (personId, summary, channel) => set((state) => {
        const todayStr = getTodayStr();
        const newLog: InteractionLog = {
          id: `inter-${Date.now()}`,
          personId,
          date: todayStr,
          summary,
          channel
        };
        const updatedPeople = state.people.map((p) =>
          p.id === personId ? { ...p, lastInteractionDate: todayStr } : p
        );
        return {
          interactionLogs: [newLog, ...state.interactionLogs],
          people: updatedPeople
        };
      }),

      // Diet & Nutrition Actions
      addMealLog: (mealData) => set((state) => {
        const nowStr = new Date().toISOString();
        const newMeal: MealLog = {
          ...mealData,
          id: `meal-${Date.now()}`,
          createdAt: nowStr
        };

        const act: Activity = {
          id: `act-meal-${Date.now()}`,
          type: 'custom',
          title: `Meal: ${mealData.title}`,
          timestamp: nowStr,
          durationMinutes: 0,
          areaId: 'nutrition',
          source: 'Diet & Nutrition'
        };

        return {
          mealLogs: [newMeal, ...state.mealLogs],
          activities: [act, ...state.activities]
        };
      }),

      deleteMealLog: (id) => set((state) => ({
        mealLogs: state.mealLogs.filter((m) => m.id !== id)
      })),

      updateNutritionGoal: (updates) => set((state) => ({
        nutritionGoal: { ...state.nutritionGoal, ...updates }
      })),

      // Custom Area Actions
      addCustomArea: (areaData) => set((state) => ({
        areas: [
          ...state.areas,
          { ...areaData, id: `area-custom-${Date.now()}`, isCustom: true }
        ]
      })),

      deleteCustomArea: (id) => set((state) => ({
        areas: state.areas.filter((a) => a.id !== id)
      })),

      // Reviews
      addReview: (reviewData) => set((state) => ({
        reviews: [
          { ...reviewData, id: `review-${Date.now()}`, createdAt: new Date().toISOString() },
          ...state.reviews
        ]
      })),

      // Reset & Backup
      resetToSeedData: () => {
        const seedState = {
          currentView: 'home' as const,
          selectedCustomAreaId: undefined,
          userSettings: { ...initialUserSettings, hasCompletedTutorial: false },
          areas: initialAreas,
          tasks: initialTasks,
          events: initialEvents,
          habits: initialHabits,
          goals: initialGoals,
          projects: initialProjects,
          activities: initialActivities,
          dailyLogs: initialDailyLogs,
          courses: initialCourses,
          assignments: initialAssignments,
          exams: initialExams,
          exercises: initialExercises,
          workoutPlans: initialWorkoutPlans,
          workoutLogs: initialWorkoutLogs,
          people: initialPeople,
          mealLogs: initialMealLogs,
          nutritionGoal: initialNutritionGoal,
          inbox: [],
          reviews: []
        };

        set(seedState);

        try {
          clearSQLiteStorage();
          mosaicSQLiteStorage.setItem('mosaic-lifeos-store', JSON.stringify({
            state: seedState,
            version: 5
          }));
        } catch (e) {
          console.error('[Store] Failed to write seed state to storage:', e);
        }
      },

      importDataJSON: (jsonStr: string) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed && typeof parsed === 'object') {
            const dataToMerge = parsed.state || parsed;
            set((state) => ({
              ...state,
              ...dataToMerge
            }));
            return true;
          }
          return false;
        } catch (e) {
          console.error('Import failed', e);
          return false;
        }
      }
    }),
    {
      name: 'mosaic-lifeos-store',
      storage: createJSONStorage(() => mosaicSQLiteStorage),
      version: 5,
      migrate: (persistedState: any, version: number) => {
        const state = persistedState || {};
        let areas = state.areas || initialAreas;
        const today = getTodayStr();
        
        // Remove deprecated area IDs from persisted store
        const deprecatedAreaIds = ['coding', 'personality', 'career', 'finance', 'reading', 'creative', 'wellness', 'productivity'];
        areas = areas.filter((a: any) => !deprecatedAreaIds.includes(a.id));

        // Ensure nutrition area exists in stored areas
        if (!areas.some((a: any) => a.id === 'nutrition')) {
          const nutritionArea = { 
            id: 'nutrition', 
            name: 'Diet & Nutrition', 
            icon: 'Utensils', 
            color: '#85785C', 
            isCustom: false, 
            description: 'Meal logging, macros, calorie targets, and daily hydration' 
          };
          const gymIdx = areas.findIndex((a: any) => a.id === 'gym');
          if (gymIdx >= 0) {
            areas.splice(gymIdx + 1, 0, nutritionArea);
          } else {
            areas.push(nutritionArea);
          }
        }

        // Ensure all stored tasks carry a valid dueDate
        let tasks = state.tasks || [];
        if (Array.isArray(tasks)) {
          tasks = tasks.map((t: any) => ({
            ...t,
            dueDate: t.dueDate || today
          }));
        }

        // Ensure all stored goals carry a valid targetDate
        let goals = state.goals || [];
        if (Array.isArray(goals)) {
          goals = goals.map((g: any) => ({
            ...g,
            targetDate: g.targetDate || today
          }));
        }

        return {
          ...state,
          areas,
          tasks,
          goals,
          mealLogs: state.mealLogs || initialMealLogs,
          nutritionGoal: state.nutritionGoal || initialNutritionGoal,
        };
      }
    }
  )
);

// Real-time Event-Driven Auto-Sync Store Subscription
useStore.subscribe((state) => {
  const syncSettings = state.userSettings?.syncSettings;
  if (syncSettings && syncSettings.provider !== 'disabled' && syncSettings.autoSync) {
    syncEngine.scheduleRealtimeAutoSync(syncSettings, (status, err) => {
      useStore.setState({ syncStatus: status, syncError: err || null });
    });
  }
});
