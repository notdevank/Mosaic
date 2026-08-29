import { addDays, format } from 'date-fns';
import { Priority } from '../types';

export interface ParsedTaskInput {
  title: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
}

export function parseNaturalLanguageTask(input: string): ParsedTaskInput {
  let text = input.trim();
  let dueDate: string | undefined = undefined;
  let dueTime: string | undefined = undefined;
  let priority: Priority = 'medium';

  // Check priority keywords
  if (/\b(urgent|p1|high priority|important)\b/i.test(text)) {
    priority = 'high';
    text = text.replace(/\b(urgent|p1|high priority|important)\b/gi, '').trim();
  } else if (/\b(low priority|p3|someday|minor)\b/i.test(text)) {
    priority = 'low';
    text = text.replace(/\b(low priority|p3|someday|minor)\b/gi, '').trim();
  }

  const today = new Date();

  // Check date keywords
  if (/\btomorrow\b/i.test(text)) {
    dueDate = format(addDays(today, 1), 'yyyy-MM-dd');
    text = text.replace(/\btomorrow\b/gi, '').trim();
  } else if (/\btoday\b/i.test(text)) {
    dueDate = format(today, 'yyyy-MM-dd');
    text = text.replace(/\btoday\b/gi, '').trim();
  } else if (/\bnext week\b/i.test(text)) {
    dueDate = format(addDays(today, 7), 'yyyy-MM-dd');
    text = text.replace(/\bnext week\b/gi, '').trim();
  } else {
    // Check day of week (e.g. on Monday / Friday)
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < days.length; i++) {
      const regex = new RegExp(`\\b(on |this |next )?${days[i]}\\b`, 'i');
      if (regex.test(text)) {
        let diff = (i - today.getDay() + 7) % 7;
        if (diff === 0) diff = 7;
        dueDate = format(addDays(today, diff), 'yyyy-MM-dd');
        text = text.replace(regex, '').trim();
        break;
      }
    }
  }

  // Check time formats (e.g. "at 6 PM", "at 18:00", "6pm", "9:30am")
  const timeRegex = /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i;
  const match = text.match(timeRegex);
  if (match) {
    let hour = parseInt(match[1], 10);
    const minute = match[2] ? parseInt(match[2], 10) : 0;
    const ampm = match[3] ? match[3].toLowerCase() : null;

    if (ampm === 'pm' && hour < 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;

    if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
      dueTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      text = text.replace(match[0], '').trim();
    }
  }

  // Clean trailing prepositions or extra whitespace
  text = text.replace(/\s+(at|by|on)\s*$/i, '').trim();

  return {
    title: text || input,
    dueDate,
    dueTime,
    priority,
  };
}
