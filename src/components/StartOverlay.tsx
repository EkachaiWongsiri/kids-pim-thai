import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Hand, Target, Volume2, CheckCircle2, Loader2 } from 'lucide-react';
import { Stage } from '../types/game';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';
import { audioService } from '../services/audioService';
import { SpellingMode } from '../services/storageService';

interface StartOverlayProps {
  stage: Stage;
  guiLang: GuiLanguage;
  onStart: () => void;
  speedMultiplier: number;
  spellingMode?: SpellingMode;
}

export const StartOverlay: React.FC<StartOverlayProps> = ({
  stage,
  guiLang,
  onStart,
  speedMultiplier,
  spellingMode = 'snappy',
}) => {
  const t = TRANSLATIONS[guiLang];
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsAudioReady(false);

    audioService.preloadStagePhonetics(stage).then(() => {
      if (isMounted) {
        setIsAudioReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [stage]);

  const handleTestPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPreviewPlaying) return;
    setIsPreviewPlaying(true);
    audioService.previewSampleVoice(stage, spellingMode);
    setTimeout(() => {
      setIsPreviewPlaying(false);
    }, 1200);
  };

  const handleStartGame = () => {
    audioService.prewarmSpeechEngine(stage.language);
    onStart();
  };

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="bg-slate-900/95 border-2 border-indigo-500/50 rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl shadow-indigo-500/20 relative overflow-hidden flex flex-col items-center">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Stage Badge & Speed */}
        <div className="flex items-center gap-2 mb-3 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold">
            <span className="text-base">{stage.icon || '🚀'}</span>
            <span>{stage.title}</span>
          </div>
          <div className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-bold">
            ⚡ x{speedMultiplier.toFixed(1)}
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
          {t.readyTitle}
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mb-4 max-w-sm">
          {stage.description}
        </p>

        {/* Words Preview Pills */}
        <div className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 mb-4 text-left">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-semibold">
            <span className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.stageTargetPrefix}</span>
            </span>
            <span className="text-amber-400 font-bold">
              {stage.targetCount} {t.stageWordsToClear}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
            {stage.words.slice(0, 10).map((w, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 font-bold"
              >
                {w}
              </span>
            ))}
            {stage.words.length > 10 && (
              <span className="text-xs text-slate-500 px-1 py-1">
                +{stage.words.length - 10} ...
              </span>
            )}
          </div>
        </div>

        {/* Pre-cached Phonetics Status & Test Voice Action Bar */}
        <div className="w-full bg-slate-950/50 border border-slate-800/80 rounded-2xl px-3.5 py-2.5 mb-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-left min-w-0">
            {isAudioReady ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
            )}
            <div className="truncate">
              <div className="text-[11px] font-bold text-slate-200 truncate">
                {isAudioReady ? t.audioStatusReady : t.audioStatusLoading}
              </div>
              <div className="text-[10px] text-slate-400">
                {audioService.getActiveVoiceName(stage.language)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestPreview}
            disabled={isPreviewPlaying}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer shrink-0 ${
              isPreviewPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-400/30 hover:border-indigo-400/50'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPreviewPlaying ? t.audioPreviewPlaying : t.btnTestVoice}</span>
          </button>
        </div>

        {/* Big Glow Play Button */}
        <button
          onClick={handleStartGame}
          className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-slate-950 font-black text-lg md:text-xl rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 w-full max-w-xs mb-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
          <span>{t.btnStart}</span>
          <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
        </button>

        {/* Hand Placement Tip */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800/80">
          <Hand className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{t.tipsText}</span>
        </div>
      </div>
    </div>
  );
};
