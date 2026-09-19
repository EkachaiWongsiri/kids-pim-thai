import { Language } from '../types/game';
import { VoiceMode } from './storageService';

// Platform Guard: Check if running on Desktop vs Mobile/Tablet
export function isDesktopPlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

// Thai Phonetic descriptions for friendly kid voice (Single-letter mode / Stages 1-4)
const THAI_LETTER_PHONETICS: Record<string, string> = {
  // Consonants (พยัญชนะ 44 ตัว)
  'ก': 'ก ไก่', 'ข': 'ข ไข่', 'ฃ': 'ฃ ขวด', 'ค': 'ค ควาย', 'ฅ': 'ฅ คน', 'ฆ': 'ฆ ระฆัง',
  'ง': 'ง งู', 'จ': 'จ จาน', 'ฉ': 'ฉ ฉิ่ง', 'ช': 'ช ช้าง', 'ซ': 'ซ โซ่', 'ฌ': 'ชอกะเชอ',
  'ญ': 'ญ หญิง', 'ฎ': 'ดอชะดา', 'ฏ': 'ฏ ปฏัก', 'ฐ': 'ฐ ฐาน', 'ฑ': 'ทอ มนโท', 'ฒ': 'ฒ ผู้เฒ่า',
  'ณ': 'นอเนร', 'ด': 'ดอเด็ก', 'ต': 'ต เต่า', 'ถ': 'ถ ถุง', 'ท': 'ท ทหาร', 'ธ': 'ทอทง',
  'น': 'น หนู', 'บ': 'บ ใบไม้', 'ป': 'ปอปลา', 'ผ': 'ผ๋อพึ่ง', 'ฝ': 'ฝอฝา', 'พ': 'พ พาน',
  'ฟ': 'ฟ ฟัน', 'ภ': 'ภ สำเภา', 'ม': 'ม ม้า', 'ย': 'ยอยัก', 'ร': 'รอเรือ', 'ล': 'ลอลิง',
  'ว': 'วอแหวน', 'ศ': 'ศ ศาลา', 'ษ': 'สอลือสี', 'ส': 'ส เสือ', 'ห': 'หอหีบ', 'ฬ': 'ฬ จุฬา',
  'อ': 'อออ่าง', 'ฮ': 'ฮ นกฮูก',
  
  // Vowels & Combining Marks (สระและเครื่องหมาย)
  'ะ': 'สะหร่ะ อะ', 'ั': 'ไม้หันอากาศ', 'า': 'สะหร่ะ อา', 'ำ': 'สะหร่ะ อำ',
  'ิ': 'สะหร่ะ อิ', 'ี': 'สะหร่ะ อี', 'ึ': 'สะหร่ะ อึ', 'ื': 'สะหร่ะ อือ',
  'ุ': 'สะหร่ะ อุ', 'ู': 'สะหร่ะ อู', 'ฺ': 'พินทุ',
  'เ': 'สะหร่ะ เอ', 'แ': 'สะหร่ะ แอ', 'โ': 'สะหร่ะ โอ',
  'ใ': 'สะหร่ะ ใอไม้ม้วน', 'ไ': 'สะหร่ะ ไอไม้มลาย', 'ๅ': 'ลากข้าง',
  
  // Tone Marks & Special Symbols (วรรณยุกต์และเครื่องหมายพิเศษ)
  '่': 'ไม้เอก', '้': 'ไม้โท', '๊': 'ไม้ตรี', '๋': 'ไม้จัตวา',
  '์': 'การัน', '็': 'ไม้ไต่คู้', 'ๆ': 'ไม้ยมก',
  'ฯ': 'ไปยาลน้อย', 'ฯลฯ': 'ไปยาลใหญ่', '฿': 'บาท',
  'ํ': 'นิคหิต', '๎': 'ยามักการ',
  'ฤ': 'ลึ', 'ฤๅ': 'ตัว รือ', 'ฦ': 'ตัว ลึ', 'ฦๅ': 'ตัว ลือ'
};

// Thai Fast Spelling Phonetics for in-word typing (กอ - อา - งอ -> กาง)
const THAI_SPELLING_PHONETICS: Record<string, string> = {
  // Consonant Spelling Sounds (พยัญชนะแจกลูกสะกด)
  'ก': 'กอ', 'ข': 'ขอ', 'ฃ': 'ขอ', 'ค': 'คอ', 'ฅ': 'คอ', 'ฆ': 'คอ',
  'ง': 'งอ', 'จ': 'จอ', 'ฉ': 'ฉอ', 'ช': 'ชอ', 'ซ': 'ซอ', 'ฌ': 'ชอ',
  'ญ': 'ยอ', 'ฎ': 'ดอ', 'ฏ': 'ตอ', 'ฐ': 'ถอ', 'ฑ': 'ทอ', 'ฒ': 'ทอ',
  'ณ': 'นอ', 'ด': 'ดอ', 'ต': 'ตอ', 'ถ': 'ถอ', 'ท': 'ทอ', 'ธ': 'ทอ',
  'น': 'นอ', 'บ': 'บอ', 'ป': 'ปอ', 'ผ': 'ผอ', 'ฝ': 'ฝอ', 'พ': 'พอ',
  'ฟ': 'ฟอ', 'ภ': 'พอ', 'ม': 'มอ', 'ย': 'ยอ', 'ร': 'รอ', 'ล': 'ลอ',
  'ว': 'วอ', 'ศ': 'สอ', 'ษ': 'สอ', 'ส': 'สอ', 'ห': 'หอ', 'ฬ': 'ลอ',
  'อ': 'ออ', 'ฮ': 'ฮอ',

  // Vowel Spelling Sounds (สระแจกลูกสะกด)
  'ะ': 'อะ', 'ั': 'หันอากาศ', 'า': 'อา', 'ำ': 'อำ',
  'ิ': 'อิ', 'ี': 'อี', 'ึ': 'อึ', 'ื': 'อือ',
  'ุ': 'อุ', 'ู': 'อู', 'ฺ': 'พินทุ',
  'เ': 'เอ', 'แ': 'แอ', 'โ': 'โอ',
  'ใ': 'ไอ', 'ไ': 'ไอ', 'ๅ': 'ลากข้าง',

  // Tone Marks & Symbols
  '่': 'ไม้เอก', '้': 'ไม้โท', '๊': 'ไม้ตรี', '๋': 'ไม้จัตวา',
  '์': 'การัน', '็': 'ไม้ไต่คู้', 'ๆ': 'ไม้ยมก',
  'ฯ': 'ไปยาลน้อย', 'ฯลฯ': 'ไปยาลใหญ่', '฿': 'บาท',
  'ฤ': 'ลึ', 'ฤๅ': 'รือ', 'ฦ': 'ลึ', 'ฦๅ': 'ลือ'
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

  // Web Speech Synthesis state
  private voices: SpeechSynthesisVoice[] = [];
  public bestThaiVoice: SpeechSynthesisVoice | null = null;
  public bestEnglishVoice: SpeechSynthesisVoice | null = null;
  public isVoicesLoaded: boolean = false;
  public voiceMode: VoiceMode = 'fast'; // 'fast' (Local 0ms) or 'natural' (AI Online Neural)
  private activeUtterances: Set<SpeechSynthesisUtterance> = new Set();

  // BGM Sequencer state
  private isBgmPlaying: boolean = false;
  private bgmStep: number = 0;
  private nextNoteTime: number = 0;
  private bgmTimerId: number | null = null;
  private tempoBpm: number = 136; // Cheerful kids arcade tempo

  constructor() {
    this.initVoices();
  }

  public setVoiceMode(mode: VoiceMode) {
    this.voiceMode = mode;
    this.updateBestVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const populateVoices = () => {
      try {
        const list = window.speechSynthesis.getVoices();
        if (list && list.length > 0) {
          this.voices = list;
          this.isVoicesLoaded = true;
          this.updateBestVoices();
        }
      } catch {
        // Ignore
      }
    };

    populateVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }
  }

  public updateBestVoices() {
    if (!isDesktopPlatform()) {
      // Platform Guard: On Mobile (Android / iOS), keep native default behavior 100%
      this.bestThaiVoice = null;
      this.bestEnglishVoice = null;
      return;
    }

    if (!this.voices || this.voices.length === 0) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.voices = window.speechSynthesis.getVoices();
      }
    }

    // --- Select Best Thai Voice on Desktop ---
    const thaiVoices = this.voices.filter(v => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      return lang === 'th-th' || lang.startsWith('th') || name.includes('thai') || name.includes('ภาษาไทย');
    });

    if (thaiVoices.length > 0) {
      if (this.voiceMode === 'natural') {
        // Mode: Natural AI (Quality Priority for Thai Learners / Foreigners)
        const naturalRankings = [
          (v: SpeechSynthesisVoice) => /premwadee/i.test(v.name) && /natural|online/i.test(v.name),
          (v: SpeechSynthesisVoice) => /niwat/i.test(v.name) && /natural|online/i.test(v.name),
          (v: SpeechSynthesisVoice) => /natural|neural|online.*natural/i.test(v.name),
          (v: SpeechSynthesisVoice) => /premwadee/i.test(v.name),
          (v: SpeechSynthesisVoice) => /niwat/i.test(v.name),
          (v: SpeechSynthesisVoice) => /google.*(thai|ภาษาไทย)/i.test(v.name) || (/google/i.test(v.name) && (v.lang || '').toLowerCase().startsWith('th')),
          (v: SpeechSynthesisVoice) => /siri|kanya|narisa/i.test(v.name),
          (v: SpeechSynthesisVoice) => /pattara|achara/i.test(v.name),
          (v: SpeechSynthesisVoice) => (v.lang || '').toLowerCase() === 'th-th',
          (v: SpeechSynthesisVoice) => (v.lang || '').toLowerCase().startsWith('th'),
        ];

        for (const ranker of naturalRankings) {
          const match = thaiVoices.find(ranker);
          if (match) {
            this.bestThaiVoice = match;
            break;
          }
        }
      } else {
        // Mode: Fast Zero-Lag (Local Device Synthesizer for Fast Arcade Typing)
        const fastRankings = [
          (v: SpeechSynthesisVoice) => v.localService && /google.*(thai|ภาษาไทย)/i.test(v.name),
          (v: SpeechSynthesisVoice) => v.localService && /siri|kanya|narisa/i.test(v.name),
          (v: SpeechSynthesisVoice) => v.localService && /pattara|achara/i.test(v.name),
          (v: SpeechSynthesisVoice) => v.localService && (v.lang || '').toLowerCase().startsWith('th'),
          (v: SpeechSynthesisVoice) => !/online/i.test(v.name) && /google.*(thai|ภาษาไทย)/i.test(v.name),
          (v: SpeechSynthesisVoice) => !/online/i.test(v.name) && /siri|kanya|narisa/i.test(v.name),
          (v: SpeechSynthesisVoice) => !/online/i.test(v.name) && /pattara|achara/i.test(v.name),
          (v: SpeechSynthesisVoice) => !/online/i.test(v.name) && (v.lang || '').toLowerCase().startsWith('th'),
          (v: SpeechSynthesisVoice) => /premwadee/i.test(v.name),
          (v: SpeechSynthesisVoice) => /niwat/i.test(v.name),
          (v: SpeechSynthesisVoice) => /natural|neural/i.test(v.name),
          (v: SpeechSynthesisVoice) => (v.lang || '').toLowerCase() === 'th-th',
          (v: SpeechSynthesisVoice) => (v.lang || '').toLowerCase().startsWith('th'),
        ];

        for (const ranker of fastRankings) {
          const match = thaiVoices.find(ranker);
          if (match) {
            this.bestThaiVoice = match;
            break;
          }
        }
      }

      if (!this.bestThaiVoice && thaiVoices.length > 0) {
        this.bestThaiVoice = thaiVoices[0];
      }
    }

    // --- Select Best English Voice on Desktop ---
    const englishVoices = this.voices.filter(v => {
      const lang = (v.lang || '').toLowerCase();
      return lang.startsWith('en');
    });

    if (englishVoices.length > 0) {
      if (this.voiceMode === 'natural') {
        const naturalEnRankings = [
          (v: SpeechSynthesisVoice) => /natural|neural/i.test(v.name) && /us|united states/i.test(v.lang + v.name),
          (v: SpeechSynthesisVoice) => /jenny|aria|guy/i.test(v.name) && /natural|online/i.test(v.name),
          (v: SpeechSynthesisVoice) => /natural|neural/i.test(v.name),
          (v: SpeechSynthesisVoice) => /google.*us.*english/i.test(v.name),
          (v: SpeechSynthesisVoice) => /samantha|siri|alex/i.test(v.name),
          (v: SpeechSynthesisVoice) => (v.lang || '').toLowerCase() === 'en-us',
          (v: SpeechSynthesisVoice) => (v.lang || '').toLowerCase().startsWith('en'),
        ];
        for (const ranker of naturalEnRankings) {
          const match = englishVoices.find(ranker);
          if (match) {
            this.bestEnglishVoice = match;
            break;
          }
        }
      } else {
        const fastEnRankings = [
          (v: SpeechSynthesisVoice) => v.localService && /google.*us.*english/i.test(v.name),
          (v: SpeechSynthesisVoice) => v.localService && /samantha|siri|alex/i.test(v.name),
          (v: SpeechSynthesisVoice) => v.localService && (v.lang || '').toLowerCase().startsWith('en'),
          (v: SpeechSynthesisVoice) => !/online/i.test(v.name) && (v.lang || '').toLowerCase().startsWith('en'),
          (v: SpeechSynthesisVoice) => /jenny|aria|guy/i.test(v.name),
          (v: SpeechSynthesisVoice) => /natural|neural/i.test(v.name),
          (v: SpeechSynthesisVoice) => (v.lang || '').toLowerCase() === 'en-us',
          (v: SpeechSynthesisVoice) => (v.lang || '').toLowerCase().startsWith('en'),
        ];
        for (const ranker of fastEnRankings) {
          const match = englishVoices.find(ranker);
          if (match) {
            this.bestEnglishVoice = match;
            break;
          }
        }
      }

      if (!this.bestEnglishVoice && englishVoices.length > 0) {
        this.bestEnglishVoice = englishVoices[0];
      }
    }
  }

  public getActiveVoiceName(lang: Language): string {
    if (!isDesktopPlatform()) {
      return 'Native System Default';
    }
    const voice = lang === 'th' ? this.bestThaiVoice : this.bestEnglishVoice;
    return voice ? `${voice.name} (${voice.lang})` : 'Default Voice';
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

  // Dispatch utterance immediately with 0ms latency
  private dispatchUtterance(utterance: SpeechSynthesisUtterance, cancelPrevious: boolean = true) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      if (cancelPrevious) {
        window.speechSynthesis.cancel();
        this.activeUtterances.clear();
      }
      this.activeUtterances.add(utterance);
      utterance.onend = () => {
        this.activeUtterances.delete(utterance);
      };
      utterance.onerror = () => {
        this.activeUtterances.delete(utterance);
      };
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore
    }
  }

  // Speak snappy spelling sound while typing characters inside a word (e.g. "กอ", "อา", "งอ")
  speakSpellingChar(char: string, lang: Language) {
    if (this.isVoiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      let textToSpeak = (char || '').trim();
      if (!textToSpeak) return;

      if (lang === 'th') {
        if (THAI_SPELLING_PHONETICS[textToSpeak]) {
          textToSpeak = THAI_SPELLING_PHONETICS[textToSpeak];
        } else if (THAI_LETTER_PHONETICS[textToSpeak]) {
          textToSpeak = THAI_LETTER_PHONETICS[textToSpeak];
        }
      } else {
        textToSpeak = textToSpeak.toUpperCase();
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang === 'th' ? 'th-TH' : 'en-US';

      if (isDesktopPlatform()) {
        if (!this.bestThaiVoice && !this.bestEnglishVoice) {
          this.updateBestVoices();
        }
        const voice = lang === 'th' ? this.bestThaiVoice : this.bestEnglishVoice;
        if (voice) {
          utterance.voice = voice;
        }
        utterance.rate = 1.25; // Fast and snappy for typing rhythm
        utterance.pitch = 1.08;
      } else {
        // Mobile (Android / iOS): Native default behavior 100%
        utterance.rate = 1.2;
        utterance.pitch = 1.15;
      }

      this.dispatchUtterance(utterance, true);
    } catch {
      // Ignore
    }
  }

  // Speak full phonetic letter sound for single-letter stages (e.g. "ก ไก่", "สะหร่ะ อา", "ดอเด็ก")
  speakChar(char: string, lang: Language) {
    if (this.isVoiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      let textToSpeak = (char || '').trim();
      if (!textToSpeak) return;

      if (lang === 'th') {
        if (THAI_LETTER_PHONETICS[textToSpeak]) {
          textToSpeak = THAI_LETTER_PHONETICS[textToSpeak];
        }
      } else {
        textToSpeak = textToSpeak.toUpperCase();
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang === 'th' ? 'th-TH' : 'en-US';

      if (isDesktopPlatform()) {
        if (!this.bestThaiVoice && !this.bestEnglishVoice) {
          this.updateBestVoices();
        }
        const voice = lang === 'th' ? this.bestThaiVoice : this.bestEnglishVoice;
        if (voice) {
          utterance.voice = voice;
        }
        utterance.rate = 1.05;
        utterance.pitch = 1.08;
      } else {
        // Mobile (Android / iOS): Native default behavior 100%
        utterance.rate = 1.1;
        utterance.pitch = 1.15;
      }

      this.dispatchUtterance(utterance, true);
    } catch {
      // Ignore
    }
  }

  // Speak the final character's spelling sound followed immediately by the full word
  speakWordCompletion(finalChar: string, word: string, lang: Language) {
    if (this.isVoiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      // 1. Prepare final char spelling text
      let charText = (finalChar || '').trim();
      if (lang === 'th') {
        if (THAI_SPELLING_PHONETICS[charText]) {
          charText = THAI_SPELLING_PHONETICS[charText];
        } else if (THAI_LETTER_PHONETICS[charText]) {
          charText = THAI_LETTER_PHONETICS[charText];
        }
      } else {
        charText = charText.toUpperCase();
      }

      // 2. Prepare full word text
      let wordText = (word || '').trim();
      if (lang === 'th') {
        if (wordText.length === 1 && THAI_LETTER_PHONETICS[wordText]) {
          wordText = THAI_LETTER_PHONETICS[wordText];
        }
        wordText = wordText.normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, '');
      }

      if (!charText && !wordText) return;
      if (!charText) {
        this.speakWord(wordText, lang);
        return;
      }

      if (isDesktopPlatform()) {
        if (!this.bestThaiVoice && !this.bestEnglishVoice) {
          this.updateBestVoices();
        }
      }

      const voice = isDesktopPlatform()
        ? (lang === 'th' ? this.bestThaiVoice : this.bestEnglishVoice)
        : null;

      // Utterance 1: Final character spelling sound (e.g. "อา", "งอ", "D")
      const charUtterance = new SpeechSynthesisUtterance(charText);
      charUtterance.lang = lang === 'th' ? 'th-TH' : 'en-US';
      if (voice) charUtterance.voice = voice;
      charUtterance.rate = isDesktopPlatform() ? 1.25 : 1.2;
      charUtterance.pitch = isDesktopPlatform() ? 1.08 : 1.15;

      // Utterance 2: Full word pronunciation (e.g. "ดา", "กาง", "bird")
      const wordUtterance = new SpeechSynthesisUtterance(wordText);
      wordUtterance.lang = lang === 'th' ? 'th-TH' : 'en-US';
      if (voice) wordUtterance.voice = voice;
      wordUtterance.rate = 1.05;
      wordUtterance.pitch = isDesktopPlatform() ? 1.05 : 1.1;

      // Track active utterances to prevent GC drop
      this.activeUtterances.add(charUtterance);
      this.activeUtterances.add(wordUtterance);

      charUtterance.onend = () => {
        this.activeUtterances.delete(charUtterance);
      };
      charUtterance.onerror = () => {
        this.activeUtterances.delete(charUtterance);
      };
      wordUtterance.onend = () => {
        this.activeUtterances.delete(wordUtterance);
      };
      wordUtterance.onerror = () => {
        this.activeUtterances.delete(wordUtterance);
      };

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(charUtterance);
      window.speechSynthesis.speak(wordUtterance);
    } catch {
      // Ignore
    }
  }

  // Speak full word/phrase upon completion (immediate instant trigger)
  speakWord(word: string, lang: Language) {
    if (this.isVoiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      let textToSpeak = (word || '').trim();
      if (!textToSpeak) return;

      if (lang === 'th') {
        // If single character in Thai, use full phonetic description (e.g. ก ไก่, สะหร่ะ อา)
        if (textToSpeak.length === 1 && THAI_LETTER_PHONETICS[textToSpeak]) {
          textToSpeak = THAI_LETTER_PHONETICS[textToSpeak];
        }
        // Normalize unicode NFC and remove invisible zero-width characters
        textToSpeak = textToSpeak.normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, '');
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang === 'th' ? 'th-TH' : 'en-US';

      if (isDesktopPlatform()) {
        if (!this.bestThaiVoice && !this.bestEnglishVoice) {
          this.updateBestVoices();
        }
        const voice = lang === 'th' ? this.bestThaiVoice : this.bestEnglishVoice;
        if (voice) {
          utterance.voice = voice;
        }
        utterance.rate = 1.05; // Crisp and immediate
        utterance.pitch = 1.05;
      } else {
        // Mobile (Android / iOS): Native default behavior 100%
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
      }

      this.dispatchUtterance(utterance, true);
    } catch {
      // Ignore
    }
  }
}

export const audioService = new AudioService();
