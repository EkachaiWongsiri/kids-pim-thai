import React from 'react';
import { Heart, Flame, Volume2, VolumeX, Mic, MicOff, Music, Gauge, Sparkles, Pause, Play, RefreshCw, Settings, Maximize, Minimize } from 'lucide-react';
import { Language, Stage } from '../types/game';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';

interface GameHeaderProps {
  lives: number;
  maxLives: number;
  score: number;
  combo: number;
  maxCombo: number;
  currentStage: Stage;
  speedMultiplier: number;
  onSpeedChange: (speed: number) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isSfxMuted: boolean;
  onToggleSfx: () => void;
  isVoiceMuted: boolean;
  onToggleVoice: () => void;
  isBgmMuted: boolean;
  onToggleBgm: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenStageSelect: () => void;
  onOpenCustomWords: () => void;
  onOpenSettings: () => void;
  onRestartStage: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  targetCount: number;
  wordsCompleted: number;
  guiLang: GuiLanguage;
}

const SPEED_OPTIONS = [0.1, 0.2, 0.5, 0.8, 1.0, 1.2, 1.5, 2.0];

export const GameHeader: React.FC<GameHeaderProps> = ({
  lives,
  maxLives,
  score,
  combo,
  maxCombo: _maxCombo,
  currentStage,
  speedMultiplier,
  onSpeedChange,
  language,
  onLanguageChange,
  isSfxMuted,
  onToggleSfx,
  isVoiceMuted,
  onToggleVoice,
  isBgmMuted,
  onToggleBgm,
  isPaused,
  onTogglePause,
  onOpenStageSelect,
  onOpenCustomWords,
  onOpenSettings,
  onRestartStage,
  isFullscreen,
  onToggleFullscreen,
  targetCount,
  wordsCompleted,
  guiLang,
}) => {
  const t = TRANSLATIONS[guiLang];

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 py-2 md:px-5 md:py-2.5 rounded-2xl shadow-xl z-10 mb-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Section: Stage Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              {currentStage.icon || '🚀'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm md:text-base text-white">
                  {currentStage.title}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {language === 'th' ? '🇹🇭 TH' : '🇬🇧 EN'}
                </span>
              </div>
              <button
                onClick={onOpenStageSelect}
                className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 transition group cursor-pointer"
              >
                <span className="text-slate-400 group-hover:text-white">({wordsCompleted}/{targetCount})</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 group-hover:border-amber-400/50">
                  {t.changeStage}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Section: Lives & Score & Combo */}
        <div className="flex items-center gap-3 md:gap-5 bg-slate-950/80 px-3 md:px-4 py-1 rounded-xl border border-slate-800">
          {/* Hearts / Lives */}
          <div className="flex items-center gap-1">
            {Array.from({ length: maxLives }).map((_, index) => (
              <Heart
                key={index}
                className={`w-5 h-5 transition-all duration-300 ${
                  index < lives
                    ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Score Counter */}
          <div className="flex flex-col items-center border-x border-slate-800 px-3">
            <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">{t.score}</span>
            <span className="text-sm md:text-lg font-black text-amber-400">
              {score.toLocaleString()}
            </span>
          </div>

          {/* Combo Indicator */}
          <div className="flex items-center gap-1.5 min-w-[65px]">
            <Flame className={`w-4 h-4 ${combo > 0 ? 'text-orange-500 animate-bounce' : 'text-slate-700'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-400 font-semibold">{t.combo}</span>
              <span className={`text-xs md:text-sm font-bold ${combo > 2 ? 'text-orange-400' : 'text-slate-300'}`}>
                x{combo}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Controls & Settings */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 text-xs">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-slate-300 text-[11px]">{t.speed}:</span>
            <select
              value={speedMultiplier}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="bg-slate-900 text-emerald-300 font-bold rounded px-1.5 py-0.5 border border-slate-700 text-xs cursor-pointer focus:outline-none focus:border-emerald-400"
            >
              {SPEED_OPTIONS.map((spd) => (
                <option key={spd} value={spd}>
                  x{spd.toFixed(1)} {spd <= 0.2 ? t.speedSlowest : spd <= 0.5 ? t.speedSlow : spd === 1.0 ? t.speedNormal : t.speedFast}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switch */}
          <button
            onClick={() => onLanguageChange(language === 'th' ? 'en' : 'th')}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-lg text-xs font-semibold transition cursor-pointer"
            title="สลับภาษาโจทย์ ไทย / English"
          >
            <span>{language === 'th' ? '🇹🇭 TH' : '🇬🇧 EN'}</span>
          </button>

          {/* Custom Words Modal Button */}
          <button
            onClick={onOpenCustomWords}
            className="flex items-center gap-1 px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-lg text-xs font-semibold transition cursor-pointer"
            title={t.customWords}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden md:inline">{t.customWords}</span>
          </button>

          {/* Game Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
            title={t.settingsTitle}
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isFullscreen
                ? 'bg-indigo-600/40 border-indigo-500 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isFullscreen ? t.fullscreenOff : t.fullscreenOn}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          {/* Background Music Toggle */}
          <button
            onClick={onToggleBgm}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              !isBgmMuted
                ? 'bg-pink-600/30 border-pink-500/40 text-pink-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title={!isBgmMuted ? 'ปิดเสียงดนตรีประกอบ (BGM)' : 'เปิดเสียงดนตรีประกอบ (BGM)'}
          >
            <Music className="w-3.5 h-3.5" />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSfx}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              !isSfxMuted
                ? 'bg-blue-600/30 border-blue-500/40 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title={!isSfxMuted ? 'ปิดเสียงเอฟเฟกต์ (SFX)' : 'เปิดเสียงเอฟเฟกต์ (SFX)'}
          >
            {!isSfxMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Voice Pronunciation Toggle */}
          <button
            onClick={onToggleVoice}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              !isVoiceMuted
                ? 'bg-amber-600/30 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title={!isVoiceMuted ? 'ปิดเสียงอ่านคำ (Voice)' : 'เปิดเสียงอ่านคำ (Voice)'}
          >
            {!isVoiceMuted ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
          </button>

          {/* Restart Stage Button */}
          <button
            onClick={onRestartStage}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
            title={t.restartStage}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Pause / Play Button */}
          <button
            onClick={onTogglePause}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isPaused
                ? 'bg-emerald-600/40 border-emerald-500 text-emerald-200 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title={isPaused ? t.resume : t.pause}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
