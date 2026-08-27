// Web Audio API Synthesizer for subtle, quiet completion chimes
class SoundManager {
  private audioCtx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play a quiet, elegant soft glass chime for tasks & habits
  playCompletionChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Soft warm sine tone (G5 -> C6)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(783.99, now);
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      // Ignore audio policy restrictions
    }
  }

  // Play a slightly richer, warmer triumph chime for goal completions
  playGoalCompletionChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Dual harmonic chord (C5 + E5 + G5 -> C6)
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        const startDelay = idx * 0.06;
        
        osc.frequency.setValueAtTime(freq, now + startDelay);
        gain.gain.setValueAtTime(0.09, now + startDelay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startDelay + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + startDelay);
        osc.stop(now + startDelay + 0.45);
      });
    } catch (e) {
      // Ignore audio policy restrictions
    }
  }
}

export const soundManager = new SoundManager();
