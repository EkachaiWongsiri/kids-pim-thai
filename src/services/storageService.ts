export interface SavedSettings {
  sfxEnabled: boolean;
  voiceEnabled: boolean;
  bgmEnabled: boolean;
  keyboardVisible: boolean;
  speedMultiplier: number;
  lastPlayedStageId: number;
  targetWordsCount: number;
  maxConcurrentWords: number;
}

export interface StageScore {
  stageId: number;
  highScore: number;
  maxCombo: number;
  accuracy: number;
  wpm: number;
  stars: number;
  clearedAt: string;
}

const STORAGE_KEYS = {
  SETTINGS: 'kids_pim_thai_settings_v1',
  SCORES: 'kids_pim_thai_scores_v1',
  CUSTOM_WORDS: 'kids_pim_thai_custom_words_v1',
  TOTAL_WORDS: 'kids_pim_thai_total_words_v1',
};

const DEFAULT_SETTINGS: SavedSettings = {
  sfxEnabled: true,
  voiceEnabled: true,
  bgmEnabled: true,
  keyboardVisible: true,
  speedMultiplier: 0.8,
  lastPlayedStageId: 1,
  targetWordsCount: 10,
  maxConcurrentWords: 4,
};

export class StorageService {
  static getSettings(): SavedSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: Partial<SavedSettings>) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  static getScores(): Record<number, StageScore> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCORES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static saveStageScore(score: StageScore) {
    try {
      const scores = this.getScores();
      const existing = scores[score.stageId];
      if (!existing || score.highScore > existing.highScore) {
        scores[score.stageId] = score;
        localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  static getCustomWords(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveCustomWords(words: string[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(words));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  static incrementTotalWordsTyped() {
    try {
      const current = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_WORDS) || '0', 10);
      localStorage.setItem(STORAGE_KEYS.TOTAL_WORDS, (current + 1).toString());
    } catch {
      // Ignore
    }
  }

  static getTotalWordsTyped(): number {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_WORDS) || '0', 10);
    } catch {
      return 0;
    }
  }
}
