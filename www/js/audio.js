const AudioSystem = {
  ctx: null,
  enabled: true,

  init() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (this.ctx) return;
      this.ctx = new AudioContext();
    } catch (e) {
      console.warn('Audio init failed', e);
    }
  },

  playTone(freq, type, duration, vol, startTime) {
    if (!this.ctx || !this.enabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    type = type || 'sine';
    duration = duration || 0.1;
    vol = vol || 0.2;
    startTime = startTime || 0;

    const t = this.ctx.currentTime + startTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + duration);
  },

  play(name) {
    if (!this.ctx || !this.enabled) return;
    switch (name) {
      case 'click':
        this.playTone(800, 'sine', 0.05, 0.08);
        break;
      case 'error':
        this.playTone(150, 'sawtooth', 0.2, 0.15);
        break;
      case 'cast_fire':
        this.playTone(300, 'sawtooth', 0.3, 0.15);
        this.playTone(150, 'square', 0.4, 0.1, 0.05);
        break;
      case 'cast_water':
        this.playTone(600, 'sine', 0.2, 0.15);
        this.playTone(800, 'sine', 0.3, 0.1, 0.05);
        break;
      case 'cast_ice':
        this.playTone(1200, 'triangle', 0.2, 0.15);
        this.playTone(1600, 'triangle', 0.3, 0.1, 0.05);
        break;
      case 'hit':
        this.playTone(100, 'square', 0.15, 0.2);
        this.playTone(60, 'sawtooth', 0.2, 0.15);
        break;
      case 'heal':
        this.playTone(400, 'sine', 0.3, 0.15);
        this.playTone(600, 'sine', 0.4, 0.15, 0.1);
        this.playTone(800, 'sine', 0.5, 0.15, 0.2);
        break;
      case 'victory':
        this.playTone(523.25, 'square', 0.2, 0.15);
        this.playTone(659.25, 'square', 0.2, 0.15, 0.15);
        this.playTone(783.99, 'square', 0.4, 0.15, 0.3);
        break;
      case 'defeat':
        this.playTone(392.00, 'sawtooth', 0.3, 0.15);
        this.playTone(311.13, 'sawtooth', 0.3, 0.15, 0.2);
        this.playTone(261.63, 'sawtooth', 0.6, 0.15, 0.4);
        break;
      case 'unlock':
        this.playTone(600, 'sine', 0.1, 0.15);
        this.playTone(900, 'sine', 0.2, 0.15, 0.1);
        break;
      case 'level_up':
        this.playTone(440, 'square', 0.15, 0.15);
        this.playTone(554.37, 'square', 0.15, 0.15, 0.15);
        this.playTone(659.25, 'square', 0.15, 0.15, 0.3);
        this.playTone(880, 'square', 0.4, 0.15, 0.45);
        break;
    }
  }
};