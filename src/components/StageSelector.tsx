import React, { useState, useEffect } from 'react';
import { THAI_STAGES, ENGLISH_STAGES } from '../data/stagesData';
import { Language, Stage, CustomStage } from '../types/game';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';
import { StorageService, customStageToGameStage } from '../services/storageService';
import { X, Trophy, Play, Plus, BookOpen } from 'lucide-react';

interface StageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStage: (stage: Stage) => void;
  currentStageId: number | string;
  guiLang: GuiLanguage;
  onOpenCreateCustomStage?: () => void;
}

export const StageSelector: React.FC<StageSelectorProps> = ({
  isOpen,
  onClose,
  onSelectStage,
  currentStageId,
  guiLang,
  onOpenCreateCustomStage,
}) => {
  const [activeTab, setActiveTab] = useState<Language | 'custom'>('th');
  const [customStages, setCustomStages] = useState<CustomStage[]>([]);
  const scores = StorageService.getScores();
  const t = TRANSLATIONS[guiLang];

  useEffect(() => {
    if (isOpen) {
      setCustomStages(StorageService.getCustomStages());
      // If current stage is a custom stage, auto-switch tab to 'custom'
      if (typeof currentStageId === 'string' || currentStageId >= 900) {
        setActiveTab('custom');
      }
    }
  }, [isOpen, currentStageId]);

  if (!isOpen) return null;

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
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  {guiLang === 'th' ? 'เลือกเล่นได้ทุกด่านทันที!' : 'Free jump to any stage!'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {guiLang === 'th'
                  ? 'เด็กๆ และผู้ปกครองสามารถเลือกด่านฝึกพิมพ์หรือด่านเตรียมสอบได้ตามใจชอบ'
                  : 'Choose any built-in stage or custom practice stage freely.'}
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

        {/* Tabs: Thai, English, and Custom Stages */}
        <div className="flex px-6 pt-3 gap-3 border-b border-slate-800 bg-slate-900/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('th')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm transition border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'th'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span>🇹🇭 ภาษาไทย (10 ด่าน)</span>
          </button>

          <button
            onClick={() => setActiveTab('en')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm transition border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'en'
                ? 'text-indigo-400 border-indigo-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span>🇬🇧 English Track (7 Stages)</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm transition border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'custom'
                ? 'text-emerald-400 border-emerald-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span>⭐ {t.customStagesTab}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-emerald-300 border border-slate-700 font-bold">
              {customStages.length}
            </span>
          </button>
        </div>

        {/* Tab 1 & 2: Built-in Stages (Thai & English) */}
        {activeTab !== 'custom' && (
          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {(activeTab === 'th' ? THAI_STAGES : ENGLISH_STAGES).map((stage) => {
              const isCurrent = String(currentStageId) === String(stage.id);
              const scoreData = scores[String(stage.id)];

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
        )}

        {/* Tab 3: Custom Stages (Unlimited Multi-Stage Bank for Parents) */}
        {activeTab === 'custom' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-white">
                    {guiLang === 'th' ? 'ด่านสำหรับเตรียมสอบ & ท่องจำคำศัพท์' : 'Exam Preparation & Custom Vocab Stages'}
                  </h4>
                  <p className="text-[11px] text-emerald-300/80">
                    {guiLang === 'th'
                      ? 'ผู้ปกครองสามารถสร้างด่านใหม่เพื่อให้น้องๆ ฝึกพิมพ์คำศัพท์ตามบทเรียนได้ไม่จำกัด'
                      : 'Parents can create unlimited targeted word lists for spelling tests and lessons.'}
                  </p>
                </div>
              </div>

              {onOpenCreateCustomStage && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCreateCustomStage();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition transform hover:scale-105 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.createNewCustomStage}</span>
                </button>
              )}
            </div>

            {customStages.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl space-y-3 bg-slate-950/40">
                <span className="text-4xl">📚</span>
                <h4 className="text-sm font-bold text-slate-200">
                  {t.noCustomStagesYet}
                </h4>
                {onOpenCreateCustomStage && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCreateCustomStage();
                    }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
                  >
                    {t.createNewCustomStage}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {customStages.map((cs) => {
                  const playable = customStageToGameStage(cs);
                  const isCurrent = String(currentStageId) === String(cs.id);
                  const scoreData = scores[String(cs.id)];

                  return (
                    <div
                      key={cs.id}
                      onClick={() => {
                        onSelectStage(playable);
                        onClose();
                      }}
                      className={`relative group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl p-2 bg-slate-900/80 rounded-xl border border-slate-700">
                              {cs.icon || '📝'}
                            </span>
                            <div>
                              <h3 className="font-bold text-white group-hover:text-emerald-300 transition text-sm md:text-base flex items-center gap-1.5">
                                <span>{cs.title}</span>
                                <span>{cs.language === 'th' ? '🇹🇭' : '🇬🇧'}</span>
                              </h3>
                              <p className="text-xs text-emerald-300 font-medium">
                                {cs.subtitle || `${cs.words.length} คำศัพท์`}
                              </p>
                            </div>
                          </div>

                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                              {guiLang === 'th' ? 'เล่นอยู่' : 'Active'}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 mb-3">{cs.description}</p>

                        {/* Words preview pills */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {cs.words.slice(0, 7).map((word, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-medium"
                            >
                              {word}
                            </span>
                          ))}
                          {cs.words.length > 7 && (
                            <span className="text-[11px] text-slate-500 px-1 py-0.5">
                              +{cs.words.length - 7} ...
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer of card */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs">
                        <div className="flex items-center gap-2">
                          {scoreData ? (
                            <div className="flex items-center gap-1 text-amber-400 font-bold">
                              <Trophy className="w-3.5 h-3.5" />
                              <span>{scoreData.highScore.toLocaleString()}</span>
                              <span className="text-slate-400 font-normal">({scoreData.wpm} WPM)</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px]">
                              {guiLang === 'th' ? 'ยังไม่ได้เล่น' : 'Not played'}
                            </span>
                          )}
                        </div>

                        <button className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-lg shadow transition transform group-hover:scale-105 cursor-pointer">
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{guiLang === 'th' ? 'เล่นด่านนี้' : 'Play'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
