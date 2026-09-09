import React from 'react';
import { RefreshCw, MapPin, Gauge, HeartCrack } from 'lucide-react';
import { GameStats, Stage } from '../types/game';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';

interface GameOverModalProps {
  isOpen: boolean;
  stats: GameStats;
  currentStage: Stage;
  onRetry: () => void;
  onOpenStageSelect: () => void;
  onSlowDownAndRetry: () => void;
  guiLang: GuiLanguage;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  stats,
  currentStage,
  onRetry,
  onOpenStageSelect,
  onSlowDownAndRetry,
  guiLang,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[guiLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl shadow-rose-500/20 relative overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Icon & Title */}
        <div className="inline-flex p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl mb-3">
          <HeartCrack className="w-12 h-12 text-rose-500 animate-pulse" />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
          {t.gameOverTitle}
        </h2>
        <p className="text-xs text-indigo-300 font-semibold mb-1">
          {currentStage.title}
        </p>
        <p className="text-sm text-slate-300 mb-6">
          {t.gameOverEncourage}
        </p>

        {/* Score Summary Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{t.totalScore}</span>
            <span className="text-lg font-black text-amber-400">{stats.score.toLocaleString()}</span>
          </div>
          <div className="flex flex-col border-x border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{guiLang === 'th' ? 'พิมพ์สำเร็จ' : 'Cleared'}</span>
            <span className="text-lg font-black text-emerald-400">{stats.wordsCompleted}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{t.maxCombo}</span>
            <span className="text-lg font-black text-orange-400">x{stats.maxCombo}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/30 transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            <span>{t.btnRetry}</span>
          </button>

          <button
            onClick={onSlowDownAndRetry}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold rounded-xl transition text-sm cursor-pointer"
          >
            <Gauge className="w-4 h-4" />
            <span>{t.btnSlowDown}</span>
          </button>

          <button
            onClick={onOpenStageSelect}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold rounded-xl transition text-sm cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>{t.btnChooseStage}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
