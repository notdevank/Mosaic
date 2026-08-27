export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';
export type RecurrenceType = 'none' | 'daily' | 'weekdays' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
export type GoalTier = 'long_term' | 'yearly' | 'monthly' | 'weekly' | 'daily';
export type GoalStatus = 'active' | 'completed' | 'archived';
export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed' | 'archived';
export type HabitFrequency = 'daily' | 'weekly' | 'custom';
export type ActivityType = 
  | 'study' 
  | 'workout' 
  | 'task_completion' 
  | 'habit_practice' 
  | 'project_work' 
  | 'reading' 
  | 'meeting' 
  | 'log_entry' 
  | 'custom';

export interface RecurrenceRule {
  type: RecurrenceType;
  interval?: number; // e.g. every N days/weeks
  weekdays?: number[]; // 0=Sunday, 1=Monday, etc.
  untilDate?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Area {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom?: boolean;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  status: TaskStatus;
  areaId?: string;
  projectId?: string;
  goalId?: string;
  recurrence?: RecurrenceRule;
  subtasks: Subtask[];
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  areaId?: string;
  projectId?: string;
  goalId?: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  isAllDay: boolean;
  location?: string;
  recurrence?: RecurrenceRule;
  notes?: string;
  color?: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: HabitFrequency;
  targetCount: number; // e.g. 5 times per week or 1 time per day
  completionHistory: Record<string, boolean | number>; // Key: YYYY-MM-DD
  areaId?: string;
  goalId?: string;
  startDate: string; // YYYY-MM-DD
  notes?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  areaId?: string;
  parentGoalId?: string;
  tier: GoalTier;
  targetDate?: string; // YYYY-MM-DD
  progress: number; // 0 to 100
  status: GoalStatus;
  notes?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate?: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  areaId?: string;
  goalId?: string;
  deadline?: string;
  status: ProjectStatus;
  milestones: Milestone[];
  notes?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string; // ISO String
  durationMinutes: number;
  areaId?: string;
  projectId?: string;
  goalId?: string;
  source?: string;
  metadata?: Record<string, any>;
}

export interface ManualTimelineEntry {
  id: string;
  time: string; // HH:mm
  title: string;
  durationMinutes?: number;
  areaId?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  freeformNote: string;
  mood?: number; // 1-10
  energy?: number; // 1-10
  focus?: number; // 1-10
  wins: string[];
  problems: string[];
  tomorrowIntention: string;
  manualTimeline: ManualTimelineEntry[];
  updatedAt: string;
}

export interface InboxItem {
  id: string;
  content: string;
  createdAt: string;
  status: 'inbox' | 'processed' | 'archived';
}

export interface Review {
  id: string;
  periodType: 'weekly' | 'monthly';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  completedTasksCount: number;
  studyMinutes: number;
  workoutCount: number;
  habitPercentage: number;
  wentWell: string;
  didNotGoWell: string;
  shouldChange: string;
  prioritiesNextPeriod: string;
  createdAt: string;
}

// Specialized Area Types: Academics
export interface Course {
  id: string;
  name: string;
  code: string;
  instructor?: string;
  semester: string;
  credits: number;
  targetGrade?: string;
  grade?: string;
  attendedClasses: number;
  totalClasses: number;
  color?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  deadline: string; // YYYY-MM-DD HH:mm
  priority: Priority;
  status: TaskStatus;
  grade?: number;
  maxGrade?: number;
  notes?: string;
  taskId?: string;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  location?: string;
  weightage?: number; // e.g. 30%
  result?: string;
  goalId?: string;
  notes?: string;
}

export interface StudySession {
  id: string;
  courseId: string;
  startTime: string;
  durationMinutes: number;
  notes?: string;
  activityId?: string;
}

// Specialized Area Types: Gym
export interface Exercise {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';
  defaultSets?: number;
}

export interface WorkoutSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    targetSets: number;
    targetReps: number;
    targetWeightKg?: number;
  }[];
}

export interface WorkoutLog {
  id: string;
  planId?: string;
  name: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  exercises: ExerciseLog[];
  prsRecorded?: string[];
  notes?: string;
  activityId?: string;
}

export interface BodyMeasurement {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercentage?: number;
  notes?: string;
}

// Specialized Area Types: Communication
export interface Person {
  id: string;
  name: string;
  relationshipContext: string; // e.g. "Professor", "Colleague", "Family"
  avatarUrl?: string;
  lastInteractionDate?: string; // YYYY-MM-DD
  nextFollowUpDate?: string; // YYYY-MM-DD
  notes?: string;
  email?: string;
  phone?: string;
}

export interface InteractionLog {
  id: string;
  personId: string;
  date: string; // YYYY-MM-DD
  summary: string;
  channel: 'meeting' | 'call' | 'message' | 'email' | 'other';
}

// Specialized Area Types: Diet & Nutrition
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealLog {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  title: string;
  calories?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatsGrams?: number;
  waterLiters?: number;
  notes?: string;
  createdAt: string;
}

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'abs' | 'rest';

export interface WeeklySplitDay {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  muscleGroup: MuscleGroup;
}

export interface NutritionGoal {
  targetDailyCalories: number; // e.g. 2400
  targetDailyProteinGrams: number; // e.g. 150
  targetDailyWaterLiters: number; // e.g. 3.0
}

export type SyncProvider = 'disabled' | 'local_folder' | 'remote_api';
export type SyncStatusType = 'idle' | 'syncing' | 'synced' | 'error';

export interface SyncSettings {
  provider: SyncProvider;
  localPath?: string;
  remoteUrl?: string;
  secretToken?: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}

export interface UserSettings {
  userName: string;
  theme: 'light' | 'dark' | 'system';
  accentColor: string; // default '#68735C'
  greeting: string;
  pinEnabled?: boolean;
  pinCode?: string;
  hasCompletedTutorial?: boolean;
  syncSettings?: SyncSettings;
  homeSections: {
    schedule: boolean;
    tasks: boolean;
    habits: boolean;
    goals: boolean;
    dailyLog: boolean;
  };
}

export type ViewType = 
  | 'home'
  | 'calendar'
  | 'tasks'
  | 'goals'
  | 'habits'
  | 'daily-log'
  | 'heatmap'
  | 'projects'
  | 'reviews'
  | 'inbox'
  | 'academics'
  | 'gym'
  | 'communication'
  | 'nutrition'
  | 'custom-area'
  | 'settings';
