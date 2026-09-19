import { Language, Stage, CustomStage } from '../types/game';

export type VoiceMode = 'fast' | 'natural';
export type SpellingMode = 'snappy' | 'full';

export interface SavedSettings {
  sfxEnabled: boolean;
  voiceEnabled: boolean;
  bgmEnabled: boolean;
  keyboardVisible: boolean;
  speedMultiplier: number;
  lastPlayedStageId: number | string;
  targetWordsCount: number;
  maxConcurrentWords: number;
  voiceMode: VoiceMode;
  spellingMode: SpellingMode;
}

export interface StageScore {
  stageId: number | string;
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
  customStages?: CustomStage[];
  scores?: Record<string, StageScore>;
}

// MXIA Game Standard Namespace: mxia:game:{game-id}:v{schema-version}:{key}
const STORAGE_KEYS = {
  SETTINGS: 'mxia:game:kids-pim-thai:v1:settings',
  SCORES: 'mxia:game:kids-pim-thai:v1:scores',
  CUSTOM_WORDS: 'mxia:game:kids-pim-thai:v1:custom_words',
  TOTAL_WORDS: 'mxia:game:kids-pim-thai:v1:total_words',
  WORD_SETS: 'mxia:game:kids-pim-thai:v1:word_sets',
  CUSTOM_STAGES: 'mxia:game:kids-pim-thai:v1:custom_stages',
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
  spellingMode: 'full',
};

// Helper: Convert CustomStage to playable Stage
export function customStageToGameStage(cs: CustomStage): Stage {
  return {
    id: cs.id,
    title: cs.title,
    subtitle: cs.subtitle || (cs.language === 'th' ? `โจทย์คำศัพท์ ${cs.words.length} คำ` : `Custom set with ${cs.words.length} words`),
    description: cs.description || (cs.language === 'th' ? 'ฝึกพิมพ์คำศัพท์ที่คุณหรือผู้ปกครองสร้างไว้' : 'Practice your customized vocabulary list'),
    language: cs.language,
    category: 'custom',
    words: cs.words && cs.words.length > 0 ? cs.words : ['สวัสดี', 'คนเก่ง'],
    targetCount: cs.targetCount || Math.min(Math.max(cs.words.length * 2, 8), 20),
    speedBase: cs.speedBase || 0.75,
    icon: cs.icon || '📝',
  };
}

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
  static getScores(): Record<string, StageScore> {
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
      const key = String(score.stageId);
      const existing = scores[key];
      if (!existing || score.highScore > existing.highScore) {
        scores[key] = score;
        localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
      }
    } catch (e) {
      console.warn('StorageService.saveStageScore error:', e);
    }
  }

  // 3. Custom Words (Active Bank - Legacy support)
  static getCustomWords(): string[] {
    try {
      let data = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
      if (!data) {
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

  // 4. Custom Stages (Unlimited Multi-Stage Bank for Parents)
  static getCustomStages(): CustomStage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_STAGES);
      if (data) {
        return JSON.parse(data);
      }

      // Auto-Migration: Convert existing WordSets or CustomWords into CustomStages
      const migratedStages: CustomStage[] = [];
      const legacyWordSets = this.getSavedWordSets();

      if (legacyWordSets && legacyWordSets.length > 0) {
        for (const set of legacyWordSets) {
          migratedStages.push({
            id: set.id.startsWith('stage_') ? set.id : `stage_${set.id}`,
            title: set.name,
            subtitle: `ชุดคำศัพท์ ${set.words.length} คำ`,
            description: 'สร้างโดยผู้ปกครอง / คุณครู',
            language: set.language,
            words: set.words,
            icon: '📝',
            speedBase: 0.75,
            targetCount: Math.min(Math.max(set.words.length * 2, 8), 20),
            createdAt: set.createdAt || new Date().toISOString(),
            updatedAt: set.updatedAt || new Date().toISOString(),
          });
        }
      }

      // If no word sets existed, check active custom_words
      if (migratedStages.length === 0) {
        const activeWords = this.getCustomWords();
        if (activeWords && activeWords.length > 0) {
          const hasThai = activeWords.some((w) => /[\u0E00-\u0E7F]/.test(w));
          migratedStages.push({
            id: 'stage_custom_initial',
            title: hasThai ? 'คำศัพท์เตรียมฝึกชุดที่ 1' : 'Custom Word Practice Set 1',
            subtitle: `${activeWords.length} คำศัพท์`,
            description: 'ฝึกพิมพ์คำศัพท์ที่คุณกำหนดเอง',
            language: hasThai ? 'th' : 'en',
            words: activeWords,
            icon: '🌟',
            speedBase: 0.75,
            targetCount: Math.min(Math.max(activeWords.length * 2, 8), 20),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      if (migratedStages.length > 0) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_STAGES, JSON.stringify(migratedStages));
      }

      return migratedStages;
    } catch (e) {
      console.warn('StorageService.getCustomStages error:', e);
      return [];
    }
  }

  static saveCustomStage(
    stage: Omit<CustomStage, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string }
  ): CustomStage {
    try {
      const stages = this.getCustomStages();
      const now = new Date().toISOString();
      let savedStage: CustomStage;

      if (stage.id) {
        const index = stages.findIndex((s) => s.id === stage.id);
        if (index !== -1) {
          savedStage = {
            ...stages[index],
            title: stage.title.trim(),
            subtitle: stage.subtitle?.trim() || `โจทย์คำศัพท์ ${stage.words.length} คำ`,
            description: stage.description?.trim() || 'ฝึกพิมพ์คำศัพท์ที่คุณหรือผู้ปกครองสร้างไว้',
            language: stage.language,
            words: stage.words,
            icon: stage.icon || '📝',
            speedBase: stage.speedBase || 0.75,
            targetCount: stage.targetCount || Math.min(Math.max(stage.words.length * 2, 8), 20),
            updatedAt: now,
          };
          stages[index] = savedStage;
        } else {
          savedStage = {
            id: stage.id,
            title: stage.title.trim(),
            subtitle: stage.subtitle?.trim() || `โจทย์คำศัพท์ ${stage.words.length} คำ`,
            description: stage.description?.trim() || 'ฝึกพิมพ์คำศัพท์ที่คุณหรือผู้ปกครองสร้างไว้',
            language: stage.language,
            words: stage.words,
            icon: stage.icon || '📝',
            speedBase: stage.speedBase || 0.75,
            targetCount: stage.targetCount || Math.min(Math.max(stage.words.length * 2, 8), 20),
            createdAt: stage.createdAt || now,
            updatedAt: now,
          };
          stages.push(savedStage);
        }
      } else {
        const newId = 'stage_custom_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        savedStage = {
          id: newId,
          title: stage.title.trim(),
          subtitle: stage.subtitle?.trim() || `โจทย์คำศัพท์ ${stage.words.length} คำ`,
          description: stage.description?.trim() || 'ฝึกพิมพ์คำศัพท์ที่คุณหรือผู้ปกครองสร้างไว้',
          language: stage.language,
          words: stage.words,
          icon: stage.icon || '📝',
          speedBase: stage.speedBase || 0.75,
          targetCount: stage.targetCount || Math.min(Math.max(stage.words.length * 2, 8), 20),
          createdAt: now,
          updatedAt: now,
        };
        stages.push(savedStage);
      }

      localStorage.setItem(STORAGE_KEYS.CUSTOM_STAGES, JSON.stringify(stages));

      // Also sync active custom words
      this.saveCustomWords(savedStage.words);

      return savedStage;
    } catch (e) {
      console.warn('StorageService.saveCustomStage error:', e);
      throw e;
    }
  }

  static deleteCustomStage(stageId: string) {
    try {
      const stages = this.getCustomStages().filter((s) => s.id !== stageId);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_STAGES, JSON.stringify(stages));
    } catch (e) {
      console.warn('StorageService.deleteCustomStage error:', e);
    }
  }

  static duplicateCustomStage(stageId: string): CustomStage | null {
    try {
      const stages = this.getCustomStages();
      const source = stages.find((s) => s.id === stageId);
      if (!source) return null;

      const copy: Omit<CustomStage, 'id' | 'createdAt' | 'updatedAt'> = {
        title: `${source.title} (สำเนา)`,
        subtitle: source.subtitle,
        description: source.description,
        language: source.language,
        words: [...source.words],
        icon: source.icon,
        speedBase: source.speedBase,
        targetCount: source.targetCount,
      };

      return this.saveCustomStage(copy);
    } catch (e) {
      console.warn('StorageService.duplicateCustomStage error:', e);
      return null;
    }
  }

  // 5. Saved Word Sets (Legacy backward compatibility)
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

      // Also mirror as a CustomStage
      this.saveCustomStage({
        id: `stage_${updatedSet.id}`,
        title: updatedSet.name,
        language: updatedSet.language,
        words: updatedSet.words,
        icon: '📝',
      });

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
      this.deleteCustomStage(`stage_${setId}`);
      this.deleteCustomStage(setId);
    } catch (e) {
      console.warn('StorageService.deleteWordSet error:', e);
    }
  }

  // 6. Total Words Typed Counter
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

  // 7. Export Package (`kids-pim-thai.json`)
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
      pkg.customStages = this.getCustomStages();
    }
    if (options.includeWordSets) {
      pkg.wordSets = this.getSavedWordSets();
      if (!pkg.customStages) {
        pkg.customStages = this.getCustomStages();
      }
    }
    if (options.includeScores) {
      pkg.scores = this.getScores();
    }

    return pkg;
  }

  // 8. Import Package with Conflict Resolution ('overwrite' | 'merge' | 'skip')
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

      // Import Custom Stages (or legacy Word Sets)
      const stagesToImport: CustomStage[] = [];
      if (pkg.customStages && Array.isArray(pkg.customStages)) {
        stagesToImport.push(...pkg.customStages);
      } else if (pkg.wordSets && Array.isArray(pkg.wordSets)) {
        for (const ws of pkg.wordSets) {
          stagesToImport.push({
            id: ws.id,
            title: ws.name,
            subtitle: `ชุดคำศัพท์ ${ws.words.length} คำ`,
            description: 'นำเข้าจากไฟล์สำรอง',
            language: ws.language,
            words: ws.words,
            icon: '📝',
            speedBase: 0.75,
            targetCount: Math.min(Math.max(ws.words.length * 2, 8), 20),
            createdAt: ws.createdAt || new Date().toISOString(),
            updatedAt: ws.updatedAt || new Date().toISOString(),
          });
        }
      }

      if (stagesToImport.length > 0) {
        const currentStages = this.getCustomStages();
        if (mode === 'overwrite') {
          localStorage.setItem(STORAGE_KEYS.CUSTOM_STAGES, JSON.stringify(stagesToImport));
          importedCount += stagesToImport.length;
        } else if (mode === 'merge') {
          const existingIds = new Set(currentStages.map((s) => s.id));
          const updatedStages = [...currentStages];

          for (const newStage of stagesToImport) {
            if (existingIds.has(newStage.id)) {
              const reKeyed: CustomStage = {
                ...newStage,
                id: 'stage_custom_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                title: `${newStage.title} (นำเข้า)`,
              };
              updatedStages.push(reKeyed);
            } else {
              updatedStages.push(newStage);
              existingIds.add(newStage.id);
            }
            importedCount += 1;
          }
          localStorage.setItem(STORAGE_KEYS.CUSTOM_STAGES, JSON.stringify(updatedStages));
        } else if (mode === 'skip') {
          const existingIds = new Set(currentStages.map((s) => s.id));
          const updatedStages = [...currentStages];
          for (const newStage of stagesToImport) {
            if (!existingIds.has(newStage.id)) {
              updatedStages.push(newStage);
              existingIds.add(newStage.id);
              importedCount += 1;
            }
          }
          localStorage.setItem(STORAGE_KEYS.CUSTOM_STAGES, JSON.stringify(updatedStages));
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
            if (!mergedScores[idStr] || score.highScore > mergedScores[idStr].highScore) {
              mergedScores[idStr] = score;
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

