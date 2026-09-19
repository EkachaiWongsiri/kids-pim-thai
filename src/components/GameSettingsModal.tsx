import React from 'react';
import { Settings, X, Target, Layers, Gauge, Maximize, Minimize, Volume2, VolumeX, Music, Mic, MicOff, RotateCcw, Zap, Sparkles, GraduationCap } from 'lucide-react';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';
import { VoiceMode, SpellingMode } from '../services/storageService';

interface GameSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetWordsCount: number;
  onChangeTargetWordsCount: (count: number) => void;
  maxConcurrentWords: number;
  onChangeMaxConcurrentWords: (count: number) => void;
  speedMultiplier: number;
  onChangeSpeed: (speed: number) => void;
  isSfxMuted: boolean;
  onToggleSfx: () => void;
  isVoiceMuted: boolean;
  onToggleVoice: () => void;
  isBgmMuted: boolean;
  onToggleBgm: () => void;
  voiceMode: VoiceMode;
  onChangeVoiceMode: (mode: VoiceMode) => void;
  spellingMode: SpellingMode;
  onChangeSpellingMode: (mode: SpellingMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  guiLang: GuiLanguage;
}

const TARGET_WORDS_OPTIONS = [10, 15, 20, 25, 30];
const CONCURRENT_WORDS_OPTIONS = [
  { value: 1, labelTh: '1 คำ (⚡ โฟกัสทีละคำ)', labelEn: '1 Word (⚡ Single Focus)' },
  { value: 2, labelTh: '2 คำ', labelEn: '2 Words' },
  { value: 3, labelTh: '3 คำ', labelEn: '3 Words' },
  { value: 4, labelTh: '4 คำ (⭐ ปกติ)', labelEn: '4 Words (⭐ Normal)' },
  { value: 5, labelTh: '5 คำ (🔥 ท้าทาย)', labelEn: '5 Words (🔥 Challenge)' },
];
const SPEED_OPTIONS = [0.1, 0.2, 0.5, 0.8, 1.0, 1.2, 1.5, 2.0];

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  isOpen,
  onClose,
  targetWordsCount,
  onChangeTargetWordsCount,
  maxConcurrentWords,
  onChangeMaxConcurrentWords,
  speedMultiplier,
  onChangeSpeed,
  isSfxMuted,
  onToggleSfx,
  isVoiceMuted,
  onToggleVoice,
  isBgmMuted,
  onToggleBgm,
  voiceMode,
  onChangeVoiceMode,
  spellingMode,
  onChangeSpellingMode,
  isFullscreen,
  onToggleFullscreen,
  guiLang,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[guiLang];

  const handleResetDefaults = () => {
    onChangeTargetWordsCount(10);
    onChangeMaxConcurrentWords(4);
    onChangeSpeed(0.8);
    onChangeVoiceMode('fast');
    onChangeSpellingMode('snappy');
    if (isSfxMuted) onToggleSfx();
    if (isVoiceMuted) onToggleVoice();
    if (isBgmMuted) onToggleBgm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {t.settingsTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.settingsDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. Words per Stage Target */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-slate-200">{t.wordsPerStage}</span>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                {targetWordsCount} {t.wordsCountUnit}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {guiLang === 'th'
                ? 'เลือกจำนวนคำศัพท์ที่ต้องพิมพ์ให้สำเร็จเพื่อผ่านด่าน (10, 15, 20, 25, 30 คำ)'
                : 'Choose how many words to type to clear each stage (10, 15, 20, 25, 30 words)'}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {TARGET_WORDS_OPTIONS.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChangeTargetWordsCount(num)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition border cursor-pointer text-center ${
                    targetWordsCount === num
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {num} {t.wordsCountUnit}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Concurrent Falling Words Density */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-slate-200">{t.concurrentWords}</span>
              </div>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/30">
                {maxConcurrentWords} {t.concurrentUnit}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {guiLang === 'th'
                ? 'ปรับจำนวนคำที่ลอยลงมาพร้อมกันบนจอ แนะนำ "1 คำ" สำหรับน้องๆ ที่เพิ่งเริ่มฝึก เพื่อไม่ให้สับสน'
                : 'Adjust simultaneous falling words. "1 Word" is great for beginners to focus calmly.'}
            </p>
            <div className="flex flex-wrap gap-2">
              {CONCURRENT_WORDS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeMaxConcurrentWords(opt.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition border cursor-pointer flex-1 min-w-[120px] text-center ${
                    maxConcurrentWords === opt.value
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30 font-bold scale-102'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {guiLang === 'th' ? opt.labelTh : opt.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Game Speed Selection */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-slate-200">{t.speed}</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/30">
                x{speedMultiplier.toFixed(1)}
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {SPEED_OPTIONS.map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => onChangeSpeed(spd)}
                  className={`py-1.5 px-1 rounded-xl text-xs font-bold transition border cursor-pointer text-center ${
                    speedMultiplier === spd
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  x{spd.toFixed(1)}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Voice Mode Selector (Fast vs Natural AI) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-slate-200">{t.voiceModeTitle}</span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                voiceMode === 'fast'
                  ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                  : 'bg-purple-400/10 text-purple-400 border-purple-400/30'
              }`}>
                {voiceMode === 'fast' ? '⚡ 0ms Fast Mode' : '✨ Natural AI Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.voiceModeDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Fast 0ms Mode */}
              <button
                type="button"
                onClick={() => onChangeVoiceMode('fast')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                  voiceMode === 'fast'
                    ? 'bg-amber-500/15 border-amber-500/60 text-amber-200 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    {t.voiceModeFast}
                  </span>
                  {voiceMode === 'fast' && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/20 px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-tight text-slate-400">
                  {t.voiceModeFastDesc}
                </p>
              </button>

              {/* Natural AI Mode */}
              <button
                type="button"
                onClick={() => onChangeVoiceMode('natural')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                  voiceMode === 'natural'
                    ? 'bg-purple-500/15 border-purple-500/60 text-purple-200 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    {t.voiceModeNatural}
                  </span>
                  {voiceMode === 'natural' && (
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-400/20 px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-tight text-slate-400">
                  {t.voiceModeNaturalDesc}
                </p>
              </button>
            </div>
          </div>

          {/* 5. Spelling Audio Style Selector (Snappy Finale vs Full Spelling Recap) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-slate-200">{t.spellingModeTitle}</span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                spellingMode === 'snappy'
                  ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                  : 'bg-indigo-400/10 text-indigo-400 border-indigo-400/30'
              }`}>
                {spellingMode === 'snappy' ? '⚡ Snappy Finale' : '🎓 Full Spelling'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.spellingModeDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Snappy Finale */}
              <button
                type="button"
                onClick={() => onChangeSpellingMode('snappy')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                  spellingMode === 'snappy'
                    ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    {t.spellingModeSnappy}
                  </span>
                  {spellingMode === 'snappy' && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/20 px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-tight text-slate-400">
                  {t.spellingModeSnappyDesc}
                </p>
              </button>

              {/* Full Spelling Recap */}
              <button
                type="button"
                onClick={() => onChangeSpellingMode('full')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                  spellingMode === 'full'
                    ? 'bg-indigo-500/15 border-indigo-500/60 text-indigo-200 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    {t.spellingModeFull}
                  </span>
                  {spellingMode === 'full' && (
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/20 px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-tight text-slate-400">
                  {t.spellingModeFullDesc}
                </p>
              </button>
            </div>
          </div>

          {/* 6. Display & Sound Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={onToggleFullscreen}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                isFullscreen
                  ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-200 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4 text-indigo-400" />}
                <div className="text-left">
                  <div className="text-xs font-bold">{t.fullscreen}</div>
                  <div className="text-[10px] text-slate-400">
                    {isFullscreen ? t.fullscreenOff : t.fullscreenOn}
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isFullscreen ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {isFullscreen ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Background Music Toggle */}
            <button
              type="button"
              onClick={onToggleBgm}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                !isBgmMuted
                  ? 'bg-pink-600/30 border-pink-500/50 text-pink-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Music className={`w-4 h-4 ${!isBgmMuted ? 'text-pink-400' : 'text-slate-500'}`} />
                <div className="text-left">
                  <div className="text-xs font-bold">{guiLang === 'th' ? 'เสียงดนตรีประกอบ (BGM)' : 'Music (BGM)'}</div>
                  <div className="text-[10px] text-slate-400">{!isBgmMuted ? (guiLang === 'th' ? 'เปิดใช้งาน' : 'Enabled') : (guiLang === 'th' ? 'ปิดเสียง' : 'Muted')}</div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${!isBgmMuted ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                {!isBgmMuted ? 'ON' : 'MUTE'}
              </span>
            </button>

            {/* Sound FX Toggle */}
            <button
              type="button"
              onClick={onToggleSfx}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                !isSfxMuted
                  ? 'bg-blue-600/30 border-blue-500/50 text-blue-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {!isSfxMuted ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                <div className="text-left">
                  <div className="text-xs font-bold">{guiLang === 'th' ? 'เสียงเอฟเฟกต์ (SFX)' : 'Sound Effects'}</div>
                  <div className="text-[10px] text-slate-400">{!isSfxMuted ? (guiLang === 'th' ? 'เปิดใช้งาน' : 'Enabled') : (guiLang === 'th' ? 'ปิดเสียง' : 'Muted')}</div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${!isSfxMuted ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                {!isSfxMuted ? 'ON' : 'MUTE'}
              </span>
            </button>

            {/* Voice Pronunciation Toggle */}
            <button
              type="button"
              onClick={onToggleVoice}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                !isVoiceMuted
                  ? 'bg-amber-600/30 border-amber-500/50 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {!isVoiceMuted ? <Mic className="w-4 h-4 text-amber-400" /> : <MicOff className="w-4 h-4 text-slate-500" />}
                <div className="text-left">
                  <div className="text-xs font-bold">{guiLang === 'th' ? 'เสียงอ่านคำ (Voice)' : 'Voice Pronounce'}</div>
                  <div className="text-[10px] text-slate-400">{!isVoiceMuted ? (guiLang === 'th' ? 'เปิดใช้งาน' : 'Enabled') : (guiLang === 'th' ? 'ปิดเสียง' : 'Muted')}</div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${!isVoiceMuted ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                {!isVoiceMuted ? 'ON' : 'MUTE'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetDefault}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
