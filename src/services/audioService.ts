import { Language } from '../types/game';

// Thai Phonetic descriptions for friendly kid voice
const THAI_LETTER_PHONETICS: Record<string, string> = {
  'ก': 'ก ไก่', 'ข': 'ข ไข่', 'ฃ': 'ฃ ขวด', 'ค': 'ค ควาย', 'ฅ': 'ฅ คน', 'ฆ': 'ฆ ระฆัง',
  'ง': 'ง งู', 'จ': 'จ จาน', 'ฉ': 'ฉ ฉิ่ง', 'ช': 'ช ช้าง', 'ซ': 'ซ โซ่', 'ฌ': 'ฌ กะเฌอ',
  'ญ': 'ญ หญิง', 'ฎ': 'ฎ ชฎา', 'ฏ': 'ฏ ปฏัก', 'ฐ': 'ฐ ฐาน', 'ฑ': 'ฑ มณโฑ', 'ฒ': 'ฒ ผู้เฒ่า',
  'ณ': 'ณ เณร', 'ด': 'ด เด็ก', 'ต': 'ต เต่า', 'ถ': 'ถ ถุง', 'ท': 'ท ทหาร', 'ธ': 'ธ ธง',
  'น': 'น หนู', 'บ': 'บ ใบไม้', 'ป': 'ป ปลา', 'ผ': 'ผ ผึ้ง', 'ฝ': 'ฝ ฝา', 'พ': 'พ พาน',
  'ฟ': 'ฟ ฟัน', 'ภ': 'ภ สำเภา', 'ม': 'ม ม้า', 'ย': 'ย ยักษ์', 'ร': 'ร เรือ', 'ล': 'ล ลิง',
  'ว': 'ว แหวน', 'ศ': 'ศ ศาลา', 'ษ': 'ษ ฤๅษี', 'ส': 'ส เสือ', 'ห': 'ห หีบ', 'ฬ': 'ฬ จุฬา',
  'อ': 'อ อ่าง', 'ฮ': 'ฮ นกฮูก',
  'ะ': 'สระ อะ', 'า': 'สระ อา', 'ิ': 'สระ อิ', 'ี': 'สระ อี', 'ึ': 'สระ อึ', 'ื': 'สระ อือ',
  'ุ': 'สระ อุ', 'ู': 'สระ อู', 'เ': 'สระ เอ', 'แ': 'สระ แอ', 'โ': 'สระ โอ', 'ใ': 'สระ ใอม้วน',
  'ไ': 'สระ ไอไม้มลาย', 'ำ': 'สระ อำ',
  '่': 'ไม้เอก', '้': 'ไม้โท', '๊': 'ไม้ตรี', '๋': 'ไม้จัตวา', '์': 'ไม้ทัณฑฆาต การันต์',
  '็': 'ไม้ไต่คู้', 'ๆ': 'ไม้ยมก', 'ฯ': 'ไปยาลน้อย', '฿': 'บาท'
};

// Cheerful Arcade Music Notes (Frequencies in Hz)
const NOTES = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50
};

// 16-step melody loop
const BGM_MELODY = [
  NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6,
  NOTES.G5, NOTES.E5, NOTES.G5, NOTES.E5,
  NOTES.A4, NOTES.C5, NOTES.E5, NOTES.A5,
  NOTES.F5, NOTES.A5, NOTES.G5, NOTES.E5,
  NOTES.F5, NOTES.A5, NOTES.C6, NOTES.A5,
  NOTES.G5, NOTES.B5, NOTES.D5, NOTES.G5,
  NOTES.E5, NOTES.G5, NOTES.C6, NOTES.E5,
  NOTES.D5, NOTES.F5, NOTES.G5, NOTES.B5,
];

// Bassline loop
const BGM_BASS = [
  NOTES.C3, NOTES.C3, NOTES.G3, NOTES.C3,
  NOTES.A3, NOTES.A3, NOTES.E3, NOTES.A3,
  NOTES.F3, NOTES.F3, NOTES.C3, NOTES.F3,
  NOTES.G3, NOTES.G3, NOTES.D3, NOTES.G3,
  NOTES.C3, NOTES.C3, NOTES.G3, NOTES.C3,
  NOTES.A3, NOTES.A3, NOTES.E3, NOTES.A3,
  NOTES.F3, NOTES.F3, NOTES.C3, NOTES.F3,
  NOTES.G3, NOTES.G3, NOTES.B3, NOTES.G3,
];

class AudioService {
  private ctx: AudioContext | null = null;
  public isSfxMuted: boolean = false;
  public isVoiceMuted: boolean = false;
  public isBgmMuted: boolean = false;
  public sfxVolume: number = 0.8;
  public bgmVolume: number = 0.18; // Soft pleasant background volume

  // BGM Sequencer state
  private isBgmPlaying: boolean = false;
  private bgmStep: number = 0;
  private nextNoteTime: number = 0;
  private bgmTimerId: number | null = null;
  private tempoBpm: number = 136; // Cheerful kids arcade tempo

  constructor() {
    // Initialized lazily
  }

  private getAudioContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // ===================== BGM Sequencer =====================
  startBgm() {
    if (this.isBgmPlaying || this.isBgmMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.isBgmPlaying = true;
    this.bgmStep = 0;
    this.nextNoteTime = ctx.currentTime + 0.1;

    this.scheduleBgmLoop();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimerId !== null) {
      window.clearTimeout(this.bgmTimerId);
      this.bgmTimerId = null;
    }
  }

  toggleBgm(): boolean {
    this.isBgmMuted = !this.isBgmMuted;
    if (this.isBgmMuted) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return !this.isBgmMuted;
  }

  setBgmSpeed(speedMultiplier: number) {
    // Speed up or slow down BGM smoothly with game speed
    const base = 136;
    const clampedSpeed = Math.min(Math.max(speedMultiplier, 0.4), 1.8);
    this.tempoBpm = base * (0.85 + clampedSpeed * 0.18);
  }

  private scheduleBgmLoop = () => {
    if (!this.isBgmPlaying || this.isBgmMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const secondsPerBeat = 60.0 / this.tempoBpm;
    const stepDuration = secondsPerBeat / 2; // 8th note steps

    // Schedule notes up to 0.2s into the future
    while (this.nextNoteTime < ctx.currentTime + 0.2) {
      this.playBgmStep(this.nextNoteTime, this.bgmStep);
      this.nextNoteTime += stepDuration;
      this.bgmStep = (this.bgmStep + 1) % BGM_MELODY.length;
    }

    this.bgmTimerId = window.setTimeout(this.scheduleBgmLoop, 60);
  };

  private playBgmStep(time: number, step: number) {
    const ctx = this.ctx;
    if (!ctx || this.isBgmMuted) return;

    try {
      // 1. Play Melody Note (Cute bouncy bell / triangle synth)
      const melodyFreq = BGM_MELODY[step % BGM_MELODY.length];
      if (melodyFreq) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(melodyFreq, time);

        const noteVol = this.bgmVolume * 0.4;
        gain.gain.setValueAtTime(noteVol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.18);
      }

      // 2. Play Bass Note (Groovy Sine/Square)
      if (step % 2 === 0) {
        const bassFreq = BGM_BASS[(step / 2) % BGM_BASS.length];
        if (bassFreq) {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();

          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(bassFreq, time);

          const bassVol = this.bgmVolume * 0.55;
          bassGain.gain.setValueAtTime(bassVol, time);
          bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

          bassOsc.connect(bassGain);
          bassGain.connect(ctx.destination);

          bassOsc.start(time);
          bassOsc.stop(time + 0.3);
        }
      }

      // 3. Play Cute Percussion Beat (Hi-hat click on off-beats)
      if (step % 2 === 1) {
        const hatOsc = ctx.createOscillator();
        const hatGain = ctx.createGain();

        hatOsc.type = 'sawtooth';
        hatOsc.frequency.setValueAtTime(8000, time);

        const hatVol = this.bgmVolume * 0.12;
        hatGain.gain.setValueAtTime(hatVol, time);
        hatGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

        hatOsc.connect(hatGain);
        hatGain.connect(ctx.destination);

        hatOsc.start(time);
        hatOsc.stop(time + 0.05);
      }
    } catch {
      // Ignore audio scheduling errors
    }
  }

  // ===================== SFX Effects =====================

  // Play Laser Beam firing sound
  playLaserSound() {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const now = ctx.currentTime;

      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

      gain.gain.setValueAtTime(this.sfxVolume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Ignore
    }
  }

  // Play satisfying arcade explosion sound
  playExplosionSound() {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.sfxVolume * 0.45, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // Ignore
    }
  }

  // Play bright chime for correctly typed letter
  playHitLetterSound() {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

      gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore
    }
  }

  // Play cute combo chime with rising pitch
  playComboChime(combo: number) {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
      const freq = notes[Math.min(combo % notes.length, notes.length - 1)];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignore
    }
  }

  // Play heart lost sound
  playHeartLostSound() {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

      gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  // Play victory celebration fanfare
  playVictoryFanfare() {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chords.forEach((freq, index) => {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const now = ctx.currentTime;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(this.sfxVolume * 0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.4);
        } catch {
          // Ignore
        }
      }, index * 100);
    });
  }

  // Play Game Over sound
  playGameOverSound() {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [440, 392, 349.23, 261.63]; // A4, G4, F4, C4
    notes.forEach((freq, index) => {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const now = ctx.currentTime;

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.3);
        } catch {
          // Ignore
        }
      }, index * 120);
    });
  }

  // Speak letter/phonetic using Web Speech API
  speakChar(char: string, lang: Language) {
    if (this.isVoiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();

      let textToSpeak = char;
      if (lang === 'th' && THAI_LETTER_PHONETICS[char]) {
        textToSpeak = THAI_LETTER_PHONETICS[char];
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang === 'th' ? 'th-TH' : 'en-US';
      utterance.rate = 1.1;
      utterance.pitch = 1.15;

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore
    }
  }

  // Speak full word/phrase upon completion
  speakWord(word: string, lang: Language) {
    if (this.isVoiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = lang === 'th' ? 'th-TH' : 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.1;

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore
    }
  }
}

export const audioService = new AudioService();
