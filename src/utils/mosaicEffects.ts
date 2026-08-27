import { soundManager } from './soundUtils';

export function triggerMosaicCompletionEffect(
  type: 'task' | 'habit' | 'goal',
  _event?: any
) {
  // Play subtle audio chime only — clean native desktop feel with zero screen clutter
  if (type === 'goal') {
    soundManager.playGoalCompletionChime();
  } else {
    soundManager.playCompletionChime();
  }
}
