// Web Audio API: procedural cozy BGM + sfx. No external assets needed.
export class AudioManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmTimer: number | null = null;
  private musicOn = true;
  private sfxOn = true;

  /** Must be called from a user gesture. */
  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    // gentle limiter to avoid clipping
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 6;
    this.master.connect(comp);
    comp.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this.musicOn ? 0.35 : 0;
    this.musicGain.connect(this.master);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this.sfxOn ? 0.6 : 0;
    this.sfxGain.connect(this.master);

    if (this.musicOn) this.startBgm();
  }

  setMusic(on: boolean): void {
    this.musicOn = on;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(on ? 0.35 : 0, this.ctx.currentTime, 0.2);
    }
    if (on && !this.bgmTimer) this.startBgm();
  }

  setSfx(on: boolean): void {
    this.sfxOn = on;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(on ? 0.6 : 0, this.ctx.currentTime, 0.05);
    }
  }

  // ---------- BGM: gentle looping marimba/piano arpeggio ----------
  private startBgm(): void {
    if (!this.ctx || this.bgmTimer !== null) return;
    // C major pentatonic, cozy waltz-ish
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33];
    const melody = [0, 2, 4, 2, 5, 4, 2, 1, 0, 2, 3, 2, 4, 5, 4, 2];
    let step = 0;
    const stepMs = 420;
    const tick = () => {
      if (!this.ctx || !this.musicGain) return;
      const idx = melody[step % melody.length];
      const freq = scale[idx];
      this.pluck(freq, 0, 0.5, this.musicGain, 'sine');
      // soft bass every 4 steps
      if (step % 4 === 0) {
        this.pluck(freq / 4, 0, 0.9, this.musicGain, 'triangle');
      }
      step++;
    };
    tick();
    this.bgmTimer = window.setInterval(tick, stepMs);
  }

  private pluck(freq: number, _d: number, dur: number, dest: AudioNode, type: OscillatorType): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // ---------- SFX ----------
  private blip(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.5): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  click(): void { this.blip(660, 0.08, 'triangle', 0.35); }
  pick(): void { this.blip(520, 0.1, 'sine', 0.4); }
  basket(): void {
    this.blip(880, 0.12, 'triangle', 0.4);
    setTimeout(() => this.blip(1174, 0.14, 'triangle', 0.35), 60);
  }
  trayFull(): void { this.blip(220, 0.18, 'sawtooth', 0.25); }
  undo(): void { this.blip(440, 0.1, 'sine', 0.35); }
  hint(): void { this.blip(1046, 0.2, 'sine', 0.3); }
  basketDone(): void {
    [660, 880, 1320].forEach((f, i) => setTimeout(() => this.blip(f, 0.15, 'triangle', 0.4), i * 70));
  }
  win(): void {
    [523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => this.blip(f, 0.25, 'triangle', 0.45), i * 110));
  }
}
