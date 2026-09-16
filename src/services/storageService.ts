import { Language } from '../types/game';

export type VoiceMode = 'fast' | 'natural';

export interface SavedSettings {
  sfxEnabled: boolean;
  voiceEnabled: boolean;
  bgmEnabled: boolean;
  keyboardVisible: boolean;
  speedMultiplier: number;
  lastPlayedStageId: number;
  targetWordsCount: number;
  maxConcurrentWords: number;
  voiceMode: VoiceMode;
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

export interface WordSet {
  id: string;
  name: string;
  language: Language;
  words: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExportData {
  format: 'kids-pim-thai';
  version: '1.0.0';
  exportedAt: string;
  settings?: SavedSettings;
  customWords?: string[];
  wordSets?: WordSet[];
  scores?: Record<number, StageScore>;
}

// MXIA Game Standard Namespace: mxia:game:{game-id}:v{schema-version}:{key}
const STORAGE_KEYS = {
  SETTINGS: 'mxia:game:kids-pim-thai:v1:settings',
  SCORES: 'mxia:game:kids-pim-thai:v1:scores',
  CUSTOM_WORDS: 'mxia:game:kids-pim-thai:v1:custom_words',
  TOTAL_WORDS: 'mxia:game:kids-pim-thai:v1:total_words',
  WORD_SETS: 'mxia:game:kids-pim-thai:v1:word_sets',
};

// Legacy keys for automatic migration
const LEGACY_KEYS = {
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
  voiceMode: 'fast',
};

export class StorageService {
  // 1. Settings
  static getSettings(): SavedSettings {
    try {
      let data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        // Check and migrate from legacy key
        const legacyData = localStorage.getItem(LEGACY_KEYS.SETTINGS);
        if (legacyData) {
          data = legacyData;
          localStorage.setItem(STORAGE_KEYS.SETTINGS, legacyData);
        }
      }
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.warn('StorageService.getSettings error:', e);
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: Partial<SavedSettings>) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('StorageService.saveSettings error:', e);
    }
  }

  // 2. Scores
  static getScores(): Record<number, StageScore> {
    try {
      let data = localStorage.getItem(STORAGE_KEYS.SCORES);
      if (!data) {
        // Migrate from legacy key
        const legacyData = localStorage.getItem(LEGACY_KEYS.SCORES);
        if (legacyData) {
          data = legacyData;
          localStorage.setItem(STORAGE_KEYS.SCORES, legacyData);
        }
      }
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn('StorageService.getScores error:', e);
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
      console.warn('StorageService.saveStageScore error:', e);
    }
  }

  // 3. Custom Words (Active Bank)
  static getCustomWords(): string[] {
    try {
      let data = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
      if (!data) {
        // Migrate from legacy key
        const legacyData = localStorage.getItem(LEGACY_KEYS.CUSTOM_WORDS);
        if (legacyData) {
          data = legacyData;
          localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, legacyData);
        }
      }
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('StorageService.getCustomWords error:', e);
      return [];
    }
  }

  static saveCustomWords(words: string[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(words));
    } catch (e) {
      console.warn('StorageService.saveCustomWords error:', e);
    }
  }

  // 4. Saved Word Sets (Multi-Preset Bank)
  static getSavedWordSets(): WordSet[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORD_SETS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('StorageService.getSavedWordSets error:', e);
      return [];
    }
  }

  static saveWordSet(set: Omit<WordSet, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): WordSet {
    try {
      const sets = this.getSavedWordSets();
      const now = new Date().toISOString();
      let updatedSet: WordSet;

      if (set.id) {
        const index = sets.findIndex((s) => s.id === set.id);
        if (index !== -1) {
          updatedSet = {
            ...sets[index],
            name: set.name,
            language: set.language,
            words: set.words,
            updatedAt: now,
          };
          sets[index] = updatedSet;
        } else {
          updatedSet = {
            id: set.id,
            name: set.name,
            language: set.language,
            words: set.words,
            createdAt: now,
            updatedAt: now,
          };
          sets.push(updatedSet);
        }
      } else {
        updatedSet = {
          id: 'set_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          name: set.name,
          language: set.language,
          words: set.words,
          createdAt: now,
          updatedAt: now,
        };
        sets.push(updatedSet);
      }

      localStorage.setItem(STORAGE_KEYS.WORD_SETS, JSON.stringify(sets));
      return updatedSet;
    } catch (e) {
      console.warn('StorageService.saveWordSet error:', e);
      throw e;
    }
  }

  static deleteWordSet(setId: string) {
    try {
      const sets = this.getSavedWordSets().filter((s) => s.id !== setId);
      localStorage.setItem(STORAGE_KEYS.WORD_SETS, JSON.stringify(sets));
    } catch (e) {
      console.warn('StorageService.deleteWordSet error:', e);
    }
  }

  // 5. Total Words Typed Counter
  static incrementTotalWordsTyped() {
    try {
      let current = localStorage.getItem(STORAGE_KEYS.TOTAL_WORDS);
      if (!current) {
        current = localStorage.getItem(LEGACY_KEYS.TOTAL_WORDS);
      }
      const count = parseInt(current || '0', 10) + 1;
      localStorage.setItem(STORAGE_KEYS.TOTAL_WORDS, count.toString());
    } catch (e) {
      console.warn('StorageService.incrementTotalWordsTyped error:', e);
    }
  }

  static getTotalWordsTyped(): number {
    try {
      let data = localStorage.getItem(STORAGE_KEYS.TOTAL_WORDS);
      if (!data) {
        data = localStorage.getItem(LEGACY_KEYS.TOTAL_WORDS);
        if (data) {
          localStorage.setItem(STORAGE_KEYS.TOTAL_WORDS, data);
        }
      }
      return parseInt(data || '0', 10);
    } catch (e) {
      console.warn('StorageService.getTotalWordsTyped error:', e);
      return 0;
    }
  }

  // 6. Export Package (`kids-pim-thai.json`)
  static exportPackage(options: {
    includeSettings: boolean;
    includeCustomWords: boolean;
    includeWordSets: boolean;
    includeScores: boolean;
  }): ExportData {
    const pkg: ExportData = {
      format: 'kids-pim-thai',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
    };

    if (options.includeSettings) {
      pkg.settings = this.getSettings();
    }
    if (options.includeCustomWords) {
      pkg.customWords = this.getCustomWords();
    }
    if (options.includeWordSets) {
      pkg.wordSets = this.getSavedWordSets();
    }
    if (options.includeScores) {
      pkg.scores = this.getScores();
    }

    return pkg;
  }

  // 7. Import Package with Conflict Resolution ('overwrite' | 'merge' | 'skip')
  static importPackage(
    pkg: ExportData,
    mode: 'overwrite' | 'merge' | 'skip'
  ): { success: boolean; message: string; importedCount: number } {
    try {
      if (pkg.format !== 'kids-pim-thai') {
        return { success: false, message: 'รูปแบบไฟล์ไม่ถูกต้อง (Invalid format)', importedCount: 0 };
      }

      let importedCount = 0;

      // Import Settings
      if (pkg.settings) {
        if (mode === 'overwrite' || (mode === 'merge' && !localStorage.getItem(STORAGE_KEYS.SETTINGS))) {
          this.saveSettings(pkg.settings);
        }
      }

      // Import Custom Words
      if (pkg.customWords && Array.isArray(pkg.customWords)) {
        if (mode === 'overwrite') {
          this.saveCustomWords(pkg.customWords);
          importedCount += pkg.customWords.length;
        } else if (mode === 'merge') {
          const currentWords = this.getCustomWords();
          const merged = Array.from(new Set([...currentWords, ...pkg.customWords]));
          this.saveCustomWords(merged);
          importedCount += (merged.length - currentWords.length);
        } else if (mode === 'skip') {
          const currentWords = this.getCustomWords();
          if (currentWords.length === 0) {
            this.saveCustomWords(pkg.customWords);
            importedCount += pkg.customWords.length;
          }
        }
      }

      // Import Word Sets
      if (pkg.wordSets && Array.isArray(pkg.wordSets)) {
        const currentSets = this.getSavedWordSets();
        if (mode === 'overwrite') {
          localStorage.setItem(STORAGE_KEYS.WORD_SETS, JSON.stringify(pkg.wordSets));
          importedCount += pkg.wordSets.length;
        } else if (mode === 'merge') {
          // Merge and re-key if duplicate ID
          const existingIds = new Set(currentSets.map((s) => s.id));
          const updatedSets = [...currentSets];

          for (const newSet of pkg.wordSets) {
            if (existingIds.has(newSet.id)) {
              // Re-index / give fresh unique ID
              const reKeyed: WordSet = {
                ...newSet,
                id: 'set_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                name: `${newSet.name} (นำเข้า)`,
              };
              updatedSets.push(reKeyed);
            } else {
              updatedSets.push(newSet);
              existingIds.add(newSet.id);
            }
            importedCount += 1;
          }
          localStorage.setItem(STORAGE_KEYS.WORD_SETS, JSON.stringify(updatedSets));
        } else if (mode === 'skip') {
          const existingIds = new Set(currentSets.map((s) => s.id));
          const updatedSets = [...currentSets];
          for (const newSet of pkg.wordSets) {
            if (!existingIds.has(newSet.id)) {
              updatedSets.push(newSet);
              existingIds.add(newSet.id);
              importedCount += 1;
            }
          }
          localStorage.setItem(STORAGE_KEYS.WORD_SETS, JSON.stringify(updatedSets));
        }
      }

      // Import Scores
      if (pkg.scores) {
        if (mode === 'overwrite') {
          localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(pkg.scores));
        } else if (mode === 'merge') {
          const currentScores = this.getScores();
          const mergedScores = { ...currentScores };
          for (const [idStr, score] of Object.entries(pkg.scores)) {
            const id = Number(idStr);
            if (!mergedScores[id] || score.highScore > mergedScores[id].highScore) {
              mergedScores[id] = score;
            }
          }
          localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(mergedScores));
        }
      }

      return {
        success: true,
        message: 'นำเข้าข้อมูลเรียบร้อยแล้ว',
        importedCount,
      };
    } catch (e) {
      console.warn('StorageService.importPackage error:', e);
      return { success: false, message: 'เกิดข้อผิดพลาดในการนำเข้าไฟล์', importedCount: 0 };
    }
  }
}
