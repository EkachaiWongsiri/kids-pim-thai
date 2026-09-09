import React, { useState, useEffect } from 'react';
import { CUSTOM_PRESETS } from '../data/stagesData';
import { Language, Stage } from '../types/game';
import { StorageService } from '../services/storageService';
import { X, Sparkles, Plus, Trash2, Play } from 'lucide-react';

interface CustomWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCustomStage: (stage: Stage) => void;
  currentLanguage: Language;
}

export const CustomWordModal: React.FC<CustomWordModalProps> = ({
  isOpen,
  onClose,
  onStartCustomStage,
  currentLanguage,
}) => {
  const [inputText, setInputText] = useState('');
  const [wordsList, setWordsList] = useState<string[]>([]);
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage);

  useEffect(() => {
    const saved = StorageService.getCustomWords();
    if (saved && saved.length > 0) {
      setWordsList(saved);
    } else {
      // Default initial custom words
      setWordsList(['แมว', 'หมา', 'ช้าง', 'รักพ่อแม่', 'คนเก่ง', 'ตั้งใจเรียน']);
    }
  }, []);

  if (!isOpen) return null;

  const handleAddWords = () => {
    if (!inputText.trim()) return;

    // Split by comma, newline, or space
    const newWords = inputText
      .split(/[\n, ]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    const updated = Array.from(new Set([...wordsList, ...newWords]));
    setWordsList(updated);
    StorageService.saveCustomWords(updated);
    setInputText('');
  };

  const handleRemoveWord = (wordToRemove: string) => {
    const updated = wordsList.filter((w) => w !== wordToRemove);
    setWordsList(updated);
    StorageService.saveCustomWords(updated);
  };

  const handleClearAll = () => {
    setWordsList([]);
    StorageService.saveCustomWords([]);
  };

  const handleLoadPreset = (presetWords: string[], lang: Language) => {
    setWordsList(presetWords);
    setSelectedLang(lang);
    StorageService.saveCustomWords(presetWords);
  };

  const handleStartGame = () => {
    if (wordsList.length === 0) return;

    const customStage: Stage = {
      id: 999,
      title: 'ด่านพิเศษ: คลังคำศัพท์ของคุณ',
      subtitle: `โจทย์พิเศษจำนวน ${wordsList.length} คำ`,
      description: 'ฝึกพิมพ์คำศัพท์ที่คุณหรือคุณครูกำหนดเอง',
      language: selectedLang,
      category: 'custom',
      words: wordsList,
      targetCount: Math.min(wordsList.length * 2, 20),
      speedBase: 0.8,
      icon: '✨'
    };

    onStartCustomStage(customStage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✏️</span>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                กำหนดโจทย์คำศัพท์เอง (Custom Words)
              </h2>
              <p className="text-xs text-slate-400">
                คุณครูหรือผู้ปกครองสามารถพิมพ์คำศัพท์ที่ต้องการให้เด็กๆ ฝึกพิมพ์เป็นพิเศษได้ที่นี่
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

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick Presets */}
          <div>
            <span className="text-xs font-semibold text-slate-300 mb-2 block">
              💡 เลือกหมวดหมู่คำศัพท์แนะนำแบบด่วน:
            </span>
            <div className="flex flex-wrap gap-2">
              {CUSTOM_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadPreset(preset.words, preset.lang)}
                  className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-xl transition flex items-center gap-1.5 hover:border-indigo-400"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                พิมพ์คำศัพท์ใหม่ (คั่นด้วยช่องว่าง, จุลภาค หรือขึ้นบรรทัดใหม่):
              </label>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">ภาษาของคำ:</span>
                <button
                  onClick={() => setSelectedLang(selectedLang === 'th' ? 'en' : 'th')}
                  className="px-2 py-0.5 bg-indigo-900/60 text-indigo-200 border border-indigo-500/40 rounded font-bold"
                >
                  {selectedLang === 'th' ? '🇹🇭 ไทย' : '🇬🇧 English'}
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="เช่น แมว สุนัข โรงเรียน ดินสอ ยางลบ หรือ dog cat sun moon..."
                rows={3}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddWords}
                className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition shadow-lg shadow-indigo-600/30"
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs">เพิ่มคำ</span>
              </button>
            </div>
          </div>

          {/* Current Word List Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">
                คำศัพท์ที่จะตกลงมาในเกม ({wordsList.length} คำ):
              </span>
              {wordsList.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ล้างทั้งหมด</span>
                </button>
              )}
            </div>

            {wordsList.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                ยังไม่มีคำศัพท์ กรุณาพิมพ์คำศัพท์ด้านบน หรือเลือกจากหมวดแนะนำ
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                {wordsList.map((word, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-full text-xs group"
                  >
                    <span>{word}</span>
                    <button
                      onClick={() => handleRemoveWord(word)}
                      className="text-slate-400 hover:text-rose-400 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition"
          >
            ยกเลิก
          </button>

          <button
            onClick={handleStartGame}
            disabled={wordsList.length === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl transition transform ${
              wordsList.length > 0
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>เริ่มเล่นด้วยคำศัพท์เหล่านี้</span>
          </button>
        </div>
      </div>
    </div>
  );
};
