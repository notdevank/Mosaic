import { 
  format, 
  parseISO, 
  isSameDay, 
  isToday, 
  isBefore, 
  isAfter, 
  addDays, 
  subDays, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  eachDayOfInterval,
  subYears,
  differenceInDays
} from 'date-fns';

export const getTodayStr = (): string => format(new Date(), 'yyyy-MM-dd');

export const formatDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    return format(date, 'MMM d, yyyy');
  } catch (e) {
    return dateStr;
  }
};

export const formatShortDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'MMM d');
  } catch {
    return dateStr;
  }
};

export const formatDayHeader = (dateStr: string): string => {
  try {
    const d = parseISO(dateStr);
    return format(d, 'd MMMM yyyy').toUpperCase();
  } catch {
    return dateStr;
  }
};

export const getDaysInWeek = (date: Date = new Date()): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const getDaysInMonth = (date: Date = new Date()): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const getPastYearDays = (): Date[] => {
  const today = new Date();
  const yearAgo = subDays(today, 364);
  return eachDayOfInterval({ start: yearAgo, end: today });
};

export const calculateStreak = (completionHistory: Record<string, boolean | number>): { current: number; best: number } => {
  const dates = Object.keys(completionHistory)
    .filter(d => Boolean(completionHistory[d]))
    .sort((a, b) => (a > b ? -1 : 1));

  if (dates.length === 0) return { current: 0, best: 0 };

  let current = 0;
  let best = 0;
  let tempStreak = 0;

  const today = getTodayStr();
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // Check if active today or yesterday
  if (completionHistory[today] || completionHistory[yesterday]) {
    let checkDate = completionHistory[today] ? parseISO(today) : parseISO(yesterday);
    while (true) {
      const dateKey = format(checkDate, 'yyyy-MM-dd');
      if (completionHistory[dateKey]) {
        current++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
  }

  // Calculate best streak
  const sortedAsc = [...dates].reverse();
  if (sortedAsc.length > 0) {
    tempStreak = 1;
    best = 1;
    for (let i = 1; i < sortedAsc.length; i++) {
      const prev = parseISO(sortedAsc[i - 1]);
      const curr = parseISO(sortedAsc[i]);
      const diff = differenceInDays(curr, prev);
      if (diff === 1) {
        tempStreak++;
        if (tempStreak > best) best = tempStreak;
      } else if (diff > 1) {
        tempStreak = 1;
      }
    }
  }

  return { current, best };
};
