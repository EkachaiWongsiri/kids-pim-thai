import React, { useState } from 'react';
import { THAI_STAGES, ENGLISH_STAGES } from '../data/stagesData';
import { Language, Stage } from '../types/game';
import { GuiLanguage } from '../data/i18n';
import { StorageService } from '../services/storageService';
import { X, Trophy, Play } from 'lucide-react';

interface StageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStage: (stage: Stage) => void;
  currentStageId: number;
  guiLang: GuiLanguage;
}

export const StageSelector: React.FC<StageSelectorProps> = ({
  isOpen,
  onClose,
  onSelectStage,
  currentStageId,
  guiLang,
}) => {
  const [activeTab, setActiveTab] = useState<Language>('th');
  const scores = StorageService.getScores();

  if (!isOpen) return null;

  const stagesList = activeTab === 'th' ? THAI_STAGES : ENGLISH_STAGES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🗺️</span>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {guiLang === 'th' ? 'เลือกด่านผจญภัย' : 'Select Stage'}
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  {guiLang === 'th' ? 'เลือกเล่นได้ทุกด่านทันที!' : 'Free jump to any stage!'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {guiLang === 'th' ? 'เด็กๆ สามารถเลือกด่านที่ต้องการฝึกพิมพ์ได้ตามใจชอบ' : 'Choose any stage to practice typing freely.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex px-6 pt-3 gap-3 border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('th')}
            className={`pb-3 px-4 font-bold text-sm transition border-b-2 flex items-center gap-2 ${
              activeTab === 'th'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span>🇹🇭 ภาษาไทย (10 ด่าน)</span>
          </button>
          <button
            onClick={() => setActiveTab('en')}
            className={`pb-3 px-4 font-bold text-sm transition border-b-2 flex items-center gap-2 ${
              activeTab === 'en'
                ? 'text-indigo-400 border-indigo-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span>🇬🇧 English Track (7 Stages)</span>
          </button>
        </div>

        {/* Stages Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {stagesList.map((stage) => {
            const isCurrent = currentStageId === stage.id;
            const scoreData = scores[stage.id];

            return (
              <div
                key={stage.id}
                onClick={() => {
                  onSelectStage(stage);
                  onClose();
                }}
                className={`relative group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 bg-slate-900/80 rounded-xl border border-slate-700">
                        {stage.icon || '🚀'}
                      </span>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-amber-300 transition text-sm md:text-base">
                          {stage.title}
                        </h3>
                        <p className="text-xs text-indigo-300 font-medium">{stage.subtitle}</p>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] bg-indigo-500 text-white font-bold px-2 py-0.5 rounded-full">
                        {guiLang === 'th' ? 'เล่นอยู่' : 'Active'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-3">{stage.description}</p>

                  {/* Words preview pills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {stage.words.slice(0, 7).map((word, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-medium"
                      >
                        {word}
                      </span>
                    ))}
                    {stage.words.length > 7 && (
                      <span className="text-[11px] text-slate-500 px-1 py-0.5">
                        +{stage.words.length - 7} ...
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer of stage card */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs">
                  <div className="flex items-center gap-2">
                    {scoreData ? (
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{scoreData.highScore.toLocaleString()}</span>
                        <span className="text-slate-400 font-normal">({scoreData.wpm} WPM)</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">{guiLang === 'th' ? 'ยังไม่ได้เล่น' : 'Not played'}</span>
                    )}
                  </div>

                  <button className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-lg shadow transition transform group-hover:scale-105 cursor-pointer">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{guiLang === 'th' ? 'เล่นด่านนี้' : 'Play'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
