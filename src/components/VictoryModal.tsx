import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, RefreshCw, MapPin, Trophy } from 'lucide-react';
import { GameStats, Stage } from '../types/game';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';

interface VictoryModalProps {
  isOpen: boolean;
  stats: GameStats;
  currentStage: Stage;
  hasNextStage: boolean;
  onNextStage: () => void;
  onReplay: () => void;
  onOpenStageSelect: () => void;
  guiLang: GuiLanguage;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  stats,
  currentStage,
  hasNextStage,
  onNextStage,
  onReplay,
  onOpenStageSelect,
  guiLang,
}) => {
  const t = TRANSLATIONS[guiLang];

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#a855f7']
        });
      } catch {
        // Ignore confetti error
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalTyped = stats.lettersTyped + stats.mistakes;
  const accuracy = totalTyped > 0 ? Math.round((stats.lettersTyped / totalTyped) * 100) : 100;
  
  const durationMinutes = stats.endTime && stats.startTime ? Math.max((stats.endTime - stats.startTime) / 60000, 0.1) : 0.5;
  const wpm = Math.round((stats.lettersTyped / 5) / durationMinutes);

  const stars = accuracy >= 90 ? 3 : accuracy >= 75 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl shadow-amber-500/20 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Stars */}
        <div className="flex justify-center items-center gap-2 mb-2">
          <Star className={`w-8 h-8 ${stars >= 1 ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-slate-700'}`} />
          <Star className={`w-12 h-12 -mt-3 ${stars >= 2 ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-slate-700'}`} />
          <Star className={`w-8 h-8 ${stars >= 3 ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-slate-700'}`} />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-1 flex items-center justify-center gap-2">
          <span>{t.victoryTitle}</span>
        </h2>
        <p className="text-sm text-indigo-300 font-medium mb-5">
          {t.victoryDesc} ({currentStage.title})
        </p>

        {/* Stats Grid */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{t.totalScore}</span>
            <span className="text-lg md:text-xl font-black text-amber-400">{stats.score.toLocaleString()}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{t.wpm}</span>
            <span className="text-lg md:text-xl font-black text-indigo-400">{wpm} WPM</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{t.accuracy}</span>
            <span className="text-lg md:text-xl font-black text-emerald-400">{accuracy}%</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{t.maxCombo}</span>
            <span className="text-lg md:text-xl font-black text-orange-400">x{stats.maxCombo}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {hasNextStage ? (
            <button
              onClick={onNextStage}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 hover:from-emerald-400 hover:to-indigo-400 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/30 transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{t.btnNextStage}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onOpenStageSelect}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl shadow-lg transition transform hover:scale-[1.02] cursor-pointer"
            >
              <Trophy className="w-5 h-5" />
              <span>{guiLang === 'th' ? 'ผ่านครบทุกด่านแล้ว! เลือกด่านใหม่' : 'All stages cleared! Choose another'}</span>
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={onReplay}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold rounded-xl transition text-xs cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.btnReplay}</span>
            </button>

            <button
              onClick={onOpenStageSelect}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold rounded-xl transition text-xs cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>{t.btnChooseStage}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
