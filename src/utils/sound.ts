/**
 * Web Audio API Tactile Sound Synthesizer
 * Produces physical toy clicks, mechanical keyboard snaps, and joyful retro chimes.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Satisfying mechanical toy keypress / cherry switch click
   */
  public playMove(player: "X" | "O", volume = 0.6): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. High transient snap (key bottom-out)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();

      snapOsc.type = "sine";
      const snapFreq = player === "X" ? 820 : 640;
      snapOsc.frequency.setValueAtTime(snapFreq, now);
      snapOsc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

      snapGain.gain.setValueAtTime(volume * 0.7, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);

      snapOsc.start(now);
      snapOsc.stop(now + 0.06);

      // 2. Tactile body thud (chassis resonance)
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();

      thudOsc.type = "triangle";
      thudOsc.frequency.setValueAtTime(220, now);
      thudOsc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

      thudGain.gain.setValueAtTime(volume * 0.8, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);

      thudOsc.start(now);
      thudOsc.stop(now + 0.09);
    } catch {
      // Audio suppressed safely
    }
  }

  /**
   * Joyful ascending pentatonic chime (Victory)
   */
  public playWin(volume = 0.6): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // C5, E5, G5, B5, C6 (Bright playful victory fanfare)
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];

      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(volume * 0.5, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.32);
      });
    } catch {
      // Suppressed
    }
  }

  /**
   * Playful bouncy spring / boing (Stalemate)
   */
  public playTie(volume = 0.5): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(450, now + 0.1);
      osc.frequency.linearRampToValueAtTime(260, now + 0.25);

      gain.gain.setValueAtTime(volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Suppressed
    }
  }

  /**
   * Mechanical spring reset click
   */
  public playReset(volume = 0.4): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);

      gain.gain.setValueAtTime(volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Suppressed
    }
  }
}

export const soundEngine = new SoundEngine();
