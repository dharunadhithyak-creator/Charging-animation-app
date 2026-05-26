/**
 * Synthesizes sound effects using Web Audio API for charge connection events.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playConnect(speed: 'standard' | 'fast' | 'super_fast' | 'hyper', volume: number) {
    try {
      this.init();
      if (!this.ctx || volume <= 0) return;

      const now = this.ctx.currentTime;
      
      // Determine synth frequency profiles based on speed
      let freqs = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 (friendly chime)
      if (speed === 'fast' || speed === 'super_fast') {
        freqs = [329.63, 440.00, 554.37, 659.25, 880.00]; // Major/bright tech chime
      } else if (speed === 'hyper') {
        freqs = [440.00, 554.37, 659.25, 880.00, 1109.73, 1318.51]; // Cyber-futuristic fast sweep
      }

      // Create main gain
      const mainGain = this.ctx.createGain();
      mainGain.gain.setValueAtTime(0, now);
      mainGain.gain.linearRampToValueAtTime(0.15 * volume, now + 0.05);
      mainGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      mainGain.connect(this.ctx.destination);

      // We'll create small oscillators for each note
      freqs.forEach((freq, index) => {
        if (!this.ctx) return;
        const noteOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Stagger note starts
        const startOffset = index * 0.07;
        const noteStart = now + startOffset;

        // Choose wave shape: Standard sine/triangle for pleasant sound
        noteOsc.type = speed === 'hyper' ? 'triangle' : 'sine';
        noteOsc.frequency.setValueAtTime(freq, noteStart);

        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.setValueAtTime(0, noteStart);
        noteGain.gain.linearRampToValueAtTime(0.12 * volume, noteStart + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.4);

        noteOsc.connect(noteGain);
        noteGain.connect(mainGain);

        noteOsc.start(noteStart);
        noteOsc.stop(noteStart + 0.5);
      });

      // Add a quick high-tech "sub bass" pulse on hyper/super_fast
      if (speed === 'super_fast' || speed === 'hyper') {
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(60, now);
        subOsc.frequency.exponentialRampToValueAtTime(120, now + 0.2);

        subGain.gain.setValueAtTime(0, now);
        subGain.gain.linearRampToValueAtTime(0.2 * volume, now + 0.02);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);

        subOsc.start(now);
        subOsc.stop(now + 0.4);
      }
    } catch (e) {
      console.warn('Audio context was blocked or not supported:', e);
    }
  }

  playDisconnect(volume: number) {
    try {
      this.init();
      if (!this.ctx || volume <= 0) return;

      const now = this.ctx.currentTime;
      
      // Let's make a modern descending "unplug" whoosh
      const osc = this.ctx.createOscillator();
      const noise = this.ctx.createOscillator(); // Or a custom filter wave
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(392.00, now); // G4
      osc.frequency.linearRampToValueAtTime(130.81, now + 0.35); // C3 descending

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1 * volume, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);

      // Add a short high-passed white noise-like burst for the mechanical USB-C unplug "click"
      const bufferSize = this.ctx.sampleRate * 0.04; // 40ms click
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1500, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08 * volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      noiseNode.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseNode.start(now);
      noiseNode.stop(now + 0.05);

    } catch (e) {
      console.warn('Audio context error on disconnect:', e);
    }
  }
}

export const audioSynth = new AudioSynthesizer();
