export type Language = 'th' | 'en';

export interface FallingWord {
  id: string;
  text: string;
  typedIndex: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  balloonType: number; // 0..4 for different cartoon balloon / UFO styles
  isTarget: boolean;
  hitAnim?: number; // timestamp or frame for hit feedback
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  life: number;
  maxLife: number;
}

export interface LaserBeam {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  alpha: number;
  color: string;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  vy: number;
}

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  language: Language;
  category: 'letters' | 'vowels' | 'words' | 'sentences' | 'custom';
  words: string[];
  targetCount: number; // How many words to clear stage
  speedBase: number;
  icon?: string;
}

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  wordsCompleted: number;
  lettersTyped: number;
  mistakes: number;
  startTime: number;
  endTime: number | null;
}

export type FingerPosition = 
  | 'left-pinky' 
  | 'left-ring' 
  | 'left-middle' 
  | 'left-index' 
  | 'thumb' 
  | 'right-index' 
  | 'right-middle' 
  | 'right-ring' 
  | 'right-pinky';

export interface KeyInfo {
  code: string;
  labelEn: string;
  shiftEn: string;
  labelTh: string;
  shiftTh: string;
  finger: FingerPosition;
  width?: string; // flex width
  isSpecial?: boolean;
}
