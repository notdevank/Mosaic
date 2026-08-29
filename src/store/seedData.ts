import { 
  Area, 
  Task, 
  CalendarEvent, 
  Habit, 
  Goal, 
  Project, 
  Activity, 
  DailyLog, 
  Course, 
  Assignment, 
  Exam, 
  Exercise, 
  WorkoutPlan, 
  WorkoutLog, 
  Person, 
  UserSettings,
  MealLog,
  NutritionGoal
} from '../types';

export const initialAreas: Area[] = [
  { id: 'academics', name: 'Academics', icon: 'GraduationCap', color: '#68735C', isCustom: false, description: 'Courses, exams, and study tracking' },
  { id: 'gym', name: 'Gym', icon: 'Dumbbell', color: '#7E8B6E', isCustom: false, description: 'Workouts, exercises, and physical fitness' },
  { id: 'nutrition', name: 'Diet & Nutrition', icon: 'Utensils', color: '#85785C', isCustom: false, description: 'Meal logging, macros, calorie targets, and daily hydration' },
  { id: 'communication', name: 'Communication', icon: 'MessageSquare', color: '#808977', isCustom: false, description: 'People, relationships, and follow-ups' }
];

export const initialUserSettings: UserSettings = {
  userName: '',
  theme: 'light',
  accentColor: '#68735C',
  greeting: 'Good day',
  pinEnabled: false,
  pinCode: '',
  homeSections: {
    schedule: true,
    tasks: true,
    habits: true,
    goals: true,
    dailyLog: true
  }
};

export const initialTasks: Task[] = [];
export const initialEvents: CalendarEvent[] = [];
export const initialHabits: Habit[] = [];
export const initialGoals: Goal[] = [];
export const initialProjects: Project[] = [];
export const initialActivities: Activity[] = [];
export const initialDailyLogs: Record<string, DailyLog> = {};
export const initialCourses: Course[] = [];
export const initialAssignments: Assignment[] = [];
export const initialExams: Exam[] = [];

export const initialExercises: Exercise[] = [
  { id: 'ex-1', name: 'Barbell Bench Press', category: 'chest', defaultSets: 3 },
  { id: 'ex-2', name: 'Overhead Shoulder Press', category: 'shoulders', defaultSets: 3 },
  { id: 'ex-3', name: 'Incline Dumbbell Press', category: 'chest', defaultSets: 3 },
  { id: 'ex-4', name: 'Barbell Squat', category: 'legs', defaultSets: 4 },
  { id: 'ex-5', name: 'Lat Pulldown', category: 'back', defaultSets: 3 }
];

export const initialWorkoutPlans: WorkoutPlan[] = [
  {
    id: 'wp-ppl-push',
    name: 'PPL Push',
    description: 'Chest, Shoulders, and Triceps.',
    exercises: [
      { exerciseId: 'ex-1', exerciseName: 'Barbell Bench Press', targetSets: 4, targetReps: 8, targetWeightKg: 80 },
      { exerciseId: 'ex-3', exerciseName: 'Incline Dumbbell Press', targetSets: 3, targetReps: 10, targetWeightKg: 28 },
      { exerciseId: 'ex-2', exerciseName: 'Overhead Barbell Press', targetSets: 3, targetReps: 8, targetWeightKg: 50 },
      { exerciseId: 'ex-lat-raise', exerciseName: 'Lateral Dumbbell Raises', targetSets: 4, targetReps: 12, targetWeightKg: 12 },
      { exerciseId: 'ex-tricep-pushdown', exerciseName: 'Tricep Rope Pushdowns', targetSets: 4, targetReps: 12, targetWeightKg: 30 }
    ]
  },
  {
    id: 'wp-gvt-10x10',
    name: 'German Volume Training',
    description: '10 sets x 10 reps.',
    exercises: [
      { exerciseId: 'ex-bench-gvt', exerciseName: 'Barbell Bench Press (10x10)', targetSets: 10, targetReps: 10, targetWeightKg: 65 },
      { exerciseId: 'ex-row-gvt', exerciseName: 'Bent-Over Barbell Row (10x10)', targetSets: 10, targetReps: 10, targetWeightKg: 55 },
      { exerciseId: 'ex-fly-gvt', exerciseName: 'Incline Dumbbell Flyes', targetSets: 3, targetReps: 12, targetWeightKg: 16 }
    ]
  },
  {
    id: 'wp-arnold-golden',
    name: 'Chest & Back Split',
    description: 'Chest and back supersets.',
    exercises: [
      { exerciseId: 'ex-arnold-bench', exerciseName: 'Flat Barbell Bench Press', targetSets: 5, targetReps: 10, targetWeightKg: 90 },
      { exerciseId: 'ex-arnold-pullup', exerciseName: 'Wide-Grip Chins / Pull-Ups', targetSets: 5, targetReps: 10, targetWeightKg: 0 },
      { exerciseId: 'ex-arnold-incline', exerciseName: 'Incline DB Chest Press', targetSets: 4, targetReps: 10, targetWeightKg: 32 },
      { exerciseId: 'ex-arnold-tbar', exerciseName: 'T-Bar Barbell Row', targetSets: 4, targetReps: 10, targetWeightKg: 70 },
      { exerciseId: 'ex-arnold-curl', exerciseName: 'Barbell Bicep Curls', targetSets: 4, targetReps: 10, targetWeightKg: 35 }
    ]
  },
  {
    id: 'wp-phat-power',
    name: 'PHAT Power Upper Body (Layne Norton)',
    description: 'Power Hypertrophy Adaptive Training combining heavy compound powerlifting with high volume body work.',
    exercises: [
      { exerciseId: 'ex-phat-row', exerciseName: 'Bent Over Barbell Row', targetSets: 3, targetReps: 5, targetWeightKg: 85 },
      { exerciseId: 'ex-phat-pullup', exerciseName: 'Weighted Pull-Ups', targetSets: 2, targetReps: 8, targetWeightKg: 15 },
      { exerciseId: 'ex-phat-bench', exerciseName: 'Flat Dumbbell Bench Press', targetSets: 3, targetReps: 5, targetWeightKg: 40 },
      { exerciseId: 'ex-phat-dips', exerciseName: 'Weighted Dips', targetSets: 2, targetReps: 10, targetWeightKg: 20 }
    ]
  },
  {
    id: 'wp-531-power',
    name: '5/3/1 Powerlifting & Strength (Wendler)',
    description: 'Jim Wendler’s core strength progression program built around Squats, Bench, Deadlift & OHP.',
    exercises: [
      { exerciseId: 'ex-531-squat', exerciseName: 'Barbell Back Squat', targetSets: 3, targetReps: 5, targetWeightKg: 120 },
      { exerciseId: 'ex-531-bench', exerciseName: 'Barbell Bench Press', targetSets: 3, targetReps: 5, targetWeightKg: 95 },
      { exerciseId: 'ex-531-deadlift', exerciseName: 'Barbell Deadlift', targetSets: 3, targetReps: 5, targetWeightKg: 140 },
      { exerciseId: 'ex-531-ohp', exerciseName: 'Standing Military Press', targetSets: 3, targetReps: 5, targetWeightKg: 60 }
    ]
  }
];
export const initialWorkoutLogs: WorkoutLog[] = [];
export const initialPeople: Person[] = [];

export const initialNutritionGoal: NutritionGoal = {
  targetDailyCalories: 2400,
  targetDailyProteinGrams: 140,
  targetDailyWaterLiters: 3.0
};

export const initialMealLogs: MealLog[] = [];
