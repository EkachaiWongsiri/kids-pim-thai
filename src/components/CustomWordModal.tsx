import React, { useState, useEffect } from 'react';
import { CUSTOM_PRESETS } from '../data/stagesData';
import { Language, Stage } from '../types/game';
import { StorageService, WordSet } from '../services/storageService';
import { X, Sparkles, Plus, Trash2, Play, HelpCircle, ArrowRight, AlertTriangle, Bookmark, FolderPlus, Download } from 'lucide-react';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';
import { ExportImportModal } from './ExportImportModal';

interface CustomWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCustomStage: (stage: Stage) => void;
  currentLanguage: Language;
  guiLang: GuiLanguage;
}

export const CustomWordModal: React.FC<CustomWordModalProps> = ({
  isOpen,
  onClose,
  onStartCustomStage,
  currentLanguage,
  guiLang,
}) => {
  const [inputText, setInputText] = useState('');
  const [wordsList, setWordsList] = useState<string[]>([]);
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage);
  const [showHelp, setShowHelp] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Multi-Preset Word Sets state
  const [savedWordSets, setSavedWordSets] = useState<WordSet[]>([]);
  const [isSaveSetModalOpen, setIsSaveSetModalOpen] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  const t = TRANSLATIONS[guiLang];

  const reloadData = () => {
    const saved = StorageService.getCustomWords();
    if (saved && saved.length > 0) {
      setWordsList(saved);
    } else {
      setWordsList(['แมว', 'หมา', 'ช้าง', 'รักพ่อแม่', 'คนเก่ง', 'ตั้งใจเรียน']);
    }
    setSavedWordSets(StorageService.getSavedWordSets());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Sync selected language when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedLang(currentLanguage);
      setValidationError(null);
      reloadData();
    }
  }, [isOpen, currentLanguage]);

  if (!isOpen) return null;

  // Real-time language mismatch detection
  const hasThaiLetters = /[\u0E00-\u0E7F]/.test(inputText);
  const hasEnglishLetters = /[a-zA-Z]/.test(inputText);
  const isThaiModeWithEnglish = selectedLang === 'th' && hasEnglishLetters;
  const isEnglishModeWithThai = selectedLang === 'en' && hasThaiLetters;
  const hasLanguageMismatch = isThaiModeWithEnglish || isEnglishModeWithThai;

  const handleSwitchLanguage = () => {
    const newLang = selectedLang === 'th' ? 'en' : 'th';
    setSelectedLang(newLang);
    setValidationError(null);
  };

  const handleAddWords = () => {
    if (!inputText.trim()) return;

    // Check language validity
    if (selectedLang === 'th' && hasEnglishLetters) {
      setValidationError(t.langMismatchWarningTh);
      return;
    }
    if (selectedLang === 'en' && hasThaiLetters) {
      setValidationError(t.langMismatchWarningEn);
      return;
    }

    // Split by comma, newline, or space
    const newWords = inputText
      .split(/[\n, ]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    // Filter to ensure only compatible words are added
    const validWords = newWords.filter((w) => {
      if (selectedLang === 'th') return !/[a-zA-Z]/.test(w);
      return !/[\u0E00-\u0E7F]/.test(w);
    });

    if (validWords.length === 0) {
      setValidationError(
        selectedLang === 'th'
          ? 'กรุณากรอกคำศัพท์ภาษาไทยที่ถูกต้อง'
          : 'Please enter valid English vocabulary'
      );
      return;
    }

    const updated = Array.from(new Set([...wordsList, ...validWords]));
    setWordsList(updated);
    StorageService.saveCustomWords(updated);
    setInputText('');
    setValidationError(null);
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
    setSelectedLang(lang); // Automatically switch language to match preset!
    StorageService.saveCustomWords(presetWords);
    setValidationError(null);
  };

  const handleLoadSavedSet = (set: WordSet) => {
    setWordsList(set.words);
    setSelectedLang(set.language);
    StorageService.saveCustomWords(set.words);
    setValidationError(null);
  };

  const handleSaveCurrentAsNewSet = () => {
    if (!newSetName.trim() || wordsList.length === 0) return;

    StorageService.saveWordSet({
      name: newSetName.trim(),
      language: selectedLang,
      words: [...wordsList],
    });

    setSavedWordSets(StorageService.getSavedWordSets());
    setNewSetName('');
    setIsSaveSetModalOpen(false);
  };

  const handleDeleteSavedSet = (setId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.deleteWordSet(setId);
    setSavedWordSets(StorageService.getSavedWordSets());
  };

  const handleStartGame = () => {
    if (wordsList.length === 0) return;

    const customStage: Stage = {
      id: 999,
      title: guiLang === 'th' ? 'ด่านพิเศษ: คลังคำศัพท์ของคุณ' : 'Custom Stage: Your Words',
      subtitle: guiLang === 'th' ? `โจทย์พิเศษจำนวน ${wordsList.length} คำ` : `Special set with ${wordsList.length} words`,
      description: guiLang === 'th' ? 'ฝึกพิมพ์คำศัพท์ที่คุณหรือคุณครูกำหนดเอง' : 'Practice your customized vocabulary list',
      language: selectedLang,
      category: 'custom',
      words: wordsList,
      targetCount: Math.min(wordsList.length * 2, 20),
      speedBase: 0.8,
      icon: '✨',
    };

    onStartCustomStage(customStage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✏️</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {guiLang === 'th' ? 'กำหนดโจทย์คำศัพท์เอง' : 'Custom Word Bank'}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    showHelp
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                      : 'bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-400/40'
                  }`}
                  title={t.customWordHelp}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHelp ? (guiLang === 'th' ? 'ซ่อนคู่มือ' : 'Hide Guide') : (guiLang === 'th' ? 'วิธีใช้ ?' : 'Help ?')}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                {guiLang === 'th'
                  ? 'คุณครูหรือผู้ปกครองสามารถพิมพ์คำศัพท์ที่ต้องการให้น้องๆ ฝึกพิมพ์เป็นพิเศษได้ที่นี่'
                  : 'Parents and teachers can create custom vocabulary lists for targeted typing practice.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExportImportOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/40 rounded-xl text-xs font-bold transition cursor-pointer"
              title={t.exportImportTitle}
            >
              <Download className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">{guiLang === 'th' ? 'ส่งออก/นำเข้า JSON' : 'Export/Import JSON'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Collapsible Tutorial Card */}
          {showHelp && (
            <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-indigo-950/60 border-2 border-indigo-500/50 rounded-2xl p-4 shadow-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <span>💡</span>
                  <span>{t.customWordHelp}</span>
                </h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                  <div className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[11px] font-black">1</span>
                    <span>{t.customWordHelpStep1Title}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{t.customWordHelpStep1Desc}</p>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                  <div className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[11px] font-black">2</span>
                    <span>{t.customWordHelpStep2Title}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{t.customWordHelpStep2Desc}</p>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                  <div className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[11px] font-black">3</span>
                    <span>{t.customWordHelpStep3Title}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{t.customWordHelpStep3Desc}</p>
                </div>
              </div>
            </div>
          )}

          {/* Saved Word Sets (Multi-Preset Bank) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.savedWordSetsTitle} ({savedWordSets.length}):</span>
              </span>

              <button
                type="button"
                onClick={() => setIsSaveSetModalOpen(true)}
                disabled={wordsList.length === 0}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  wordsList.length > 0
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>{t.btnSaveCurrentAsSet}</span>
              </button>
            </div>

            {savedWordSets.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">
                {t.noSavedSetsYet}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                {savedWordSets.map((set) => (
                  <div
                    key={set.id}
                    onClick={() => handleLoadSavedSet(set)}
                    className="group px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 rounded-xl transition flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                      {set.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
                      {set.words.length} คำ ({set.language === 'th' ? '🇹🇭' : '🇬🇧'})
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSavedSet(set.id, e)}
                      className="text-slate-500 hover:text-rose-400 transition"
                      title={t.deleteSetConfirm}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Built-in Presets */}
          <div>
            <span className="text-xs font-semibold text-slate-300 mb-2 block">
              {guiLang === 'th' ? '💡 หรือเลือกหมวดหมู่คำศัพท์แนะนำแบบด่วน:' : '💡 Or choose from built-in presets:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {CUSTOM_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadPreset(preset.words, preset.lang)}
                  className={`text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer border ${
                    selectedLang === preset.lang
                      ? 'bg-slate-800 text-indigo-300 border-indigo-500/50 hover:bg-slate-700'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="font-medium">{preset.name}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-slate-950/80 text-slate-400">
                    {preset.lang === 'th' ? '🇹🇭' : '🇬🇧'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Box with Smart Language Indicator & Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                {guiLang === 'th'
                  ? 'พิมพ์คำศัพท์ใหม่ (คั่นด้วยช่องว่าง, จุลภาค หรือขึ้นบรรทัดใหม่):'
                  : 'Enter new words (separated by spaces, commas, or newlines):'}
              </label>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">{guiLang === 'th' ? 'ภาษาของโจทย์:' : 'Word Language:'}</span>
                <button
                  type="button"
                  onClick={handleSwitchLanguage}
                  className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    hasLanguageMismatch
                      ? 'bg-rose-600 text-white border-rose-400 ring-4 ring-rose-500/50 shadow-lg shadow-rose-500/50 animate-pulse'
                      : 'bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border-indigo-500/40'
                  }`}
                  title="คลิกเพื่อสลับภาษาคำศัพท์"
                >
                  <span>{selectedLang === 'th' ? '🇹🇭 ภาษาไทย' : '🇬🇧 English'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Language Mismatch Warning Banner */}
            {hasLanguageMismatch && (
              <div className="bg-rose-950/80 border-2 border-rose-500/80 text-rose-200 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs animate-shake shadow-lg shadow-rose-950/50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
                  <span className="font-medium">
                    {selectedLang === 'th' ? t.langMismatchWarningTh : t.langMismatchWarningEn}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSwitchLanguage}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition cursor-pointer shrink-0 shadow-md"
                >
                  {t.btnAutoSwitchLang}
                </button>
              </div>
            )}

            {/* Validation Error Banner */}
            {validationError && !hasLanguageMismatch && (
              <div className="bg-amber-950/80 border border-amber-500/60 text-amber-200 p-2.5 rounded-xl flex items-center gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder={
                  selectedLang === 'th'
                    ? 'เช่น แมว สุนัข โรงเรียน ดินสอ ยางลบ รักพ่อแม่ คนเก่ง...'
                    : 'e.g. cat dog apple star moon school pencil smile...'
                }
                rows={3}
                className={`flex-1 bg-slate-950 border rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none transition ${
                  hasLanguageMismatch
                    ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
              <button
                type="button"
                onClick={handleAddWords}
                disabled={hasLanguageMismatch || !inputText.trim()}
                className={`px-4 font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition shadow-lg cursor-pointer ${
                  hasLanguageMismatch || !inputText.trim()
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs">{guiLang === 'th' ? 'เพิ่มคำ' : 'Add Words'}</span>
              </button>
            </div>
          </div>

          {/* Current Word List Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>{guiLang === 'th' ? 'คำศัพท์ที่จะตกลงมาในเกม:' : 'Words in this custom stage:'}</span>
                <span className="font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {wordsList.length} {t.wordsCountUnit}
                </span>
                <span className="text-[10px] text-slate-400">
                  ({selectedLang === 'th' ? '🇹🇭 ภาษาไทย' : '🇬🇧 English'})
                </span>
              </span>
              {wordsList.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{guiLang === 'th' ? 'ล้างทั้งหมด' : 'Clear All'}</span>
                </button>
              )}
            </div>

            {wordsList.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                {guiLang === 'th'
                  ? 'ยังไม่มีคำศัพท์ กรุณาพิมพ์คำศัพท์ด้านบน หรือเลือกจากหมวดแนะนำ'
                  : 'No custom words added yet. Type words above or choose a preset.'}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                {wordsList.map((word, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-full text-xs group"
                  >
                    <span>{word}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWord(word)}
                      className="text-slate-400 hover:text-rose-400 transition cursor-pointer"
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
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            {guiLang === 'th' ? 'ยกเลิก' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleStartGame}
            disabled={wordsList.length === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl transition transform cursor-pointer ${
              wordsList.length > 0
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{guiLang === 'th' ? 'เริ่มเล่นด้วยคำศัพท์เหล่านี้' : 'Play with these words'}</span>
          </button>
        </div>
      </div>

      {/* Save Word Set Sub-modal */}
      {isSaveSetModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-400" />
              <span>{t.saveSetDialogTitle}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {guiLang === 'th'
                ? `บันทึกคำศัพท์ทั้ง ${wordsList.length} คำ เป็นชุดสำหรับกลับมาเล่นได้ตลอดเวลา`
                : `Save these ${wordsList.length} words as a reusable word set.`}
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t.setNameLabel}
              </label>
              <input
                type="text"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                placeholder={t.setNamePlaceholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSaveSetModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {guiLang === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveCurrentAsNewSet}
                disabled={!newSetName.trim()}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
              >
                {t.btnConfirmSaveSet}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export / Import Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        onImportSuccess={() => {
          reloadData();
          setIsExportImportOpen(false);
        }}
        guiLang={guiLang}
      />
    </div>
  );
};
