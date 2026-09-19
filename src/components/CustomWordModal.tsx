import React, { useState, useEffect } from 'react';
import { CUSTOM_PRESETS } from '../data/stagesData';
import { Language, Stage, CustomStage } from '../types/game';
import { StorageService, customStageToGameStage } from '../services/storageService';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Play,
  HelpCircle,
  ArrowRight,
  AlertTriangle,
  Bookmark,
  Download,
  Copy,
  Edit3,
  Check,
  FolderPlus,
  Layers,
} from 'lucide-react';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';
import { ExportImportModal } from './ExportImportModal';

const AVAILABLE_ICONS = ['📝', '📚', '🎯', '🌟', '🍎', '🚀', '🐱', '🏆', '💡', '⚡', '🌺', '🎨', '🧪', '⚽', '🎒', '👑'];

interface CustomWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCustomStage: (stage: Stage) => void;
  currentLanguage: Language;
  guiLang: GuiLanguage;
  initialEditStageId?: string | null;
}

export const CustomWordModal: React.FC<CustomWordModalProps> = ({
  isOpen,
  onClose,
  onStartCustomStage,
  currentLanguage,
  guiLang,
  initialEditStageId,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'list'>('editor');
  const [customStages, setCustomStages] = useState<CustomStage[]>([]);

  // Editor State
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [stageTitle, setStageTitle] = useState('');
  const [stageSubtitle, setStageSubtitle] = useState('');
  const [stageIcon, setStageIcon] = useState('📝');
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage);
  const [inputText, setInputText] = useState('');
  const [wordsList, setWordsList] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [showHelp, setShowHelp] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  const t = TRANSLATIONS[guiLang];

  const reloadData = () => {
    const stages = StorageService.getCustomStages();
    setCustomStages(stages);
  };

  useEffect(() => {
    reloadData();
  }, []);

  // When modal opens or initialEditStageId changes
  useEffect(() => {
    if (isOpen) {
      reloadData();
      setValidationError(null);
      setSaveSuccessMsg(null);

      if (initialEditStageId) {
        const stageToEdit = StorageService.getCustomStages().find((s) => s.id === initialEditStageId);
        if (stageToEdit) {
          handleLoadForEdit(stageToEdit);
          return;
        }
      }

      // Default: If no stages, go to editor. If stages exist and no editing ID, load first or start fresh
      if (customStages.length === 0 && wordsList.length === 0) {
        handleResetEditor();
      }
    }
  }, [isOpen, initialEditStageId]);

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

  const handleResetEditor = () => {
    setEditingStageId(null);
    setStageTitle('');
    setStageSubtitle('');
    setStageIcon('📝');
    setSelectedLang(currentLanguage);
    setInputText('');
    setWordsList(['แมว', 'หมา', 'ช้าง', 'รักพ่อแม่', 'คนเก่ง', 'ตั้งใจเรียน']);
    setValidationError(null);
    setSaveSuccessMsg(null);
    setActiveTab('editor');
  };

  const handleLoadForEdit = (stage: CustomStage) => {
    setEditingStageId(stage.id);
    setStageTitle(stage.title);
    setStageSubtitle(stage.subtitle || '');
    setStageIcon(stage.icon || '📝');
    setSelectedLang(stage.language);
    setWordsList([...stage.words]);
    setInputText('');
    setValidationError(null);
    setSaveSuccessMsg(null);
    setActiveTab('editor');
  };

  const handleAddWords = () => {
    if (!inputText.trim()) return;

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
    setInputText('');
    setValidationError(null);
  };

  const handleRemoveWord = (wordToRemove: string) => {
    const updated = wordsList.filter((w) => w !== wordToRemove);
    setWordsList(updated);
  };

  const handleClearAllWords = () => {
    setWordsList([]);
  };

  const handleLoadPreset = (presetWords: string[], lang: Language, presetName: string) => {
    setWordsList(presetWords);
    setSelectedLang(lang);
    if (!stageTitle) {
      setStageTitle(presetName);
    }
    setValidationError(null);
  };

  const handleSaveStage = (autoPlay: boolean = false) => {
    if (wordsList.length === 0) {
      setValidationError(
        guiLang === 'th' ? 'กรุณาเพิ่มคำศัพท์อย่างน้อย 1 คำ' : 'Please add at least 1 word'
      );
      return;
    }

    const titleToSave = stageTitle.trim() || (
      selectedLang === 'th'
        ? `คำศัพท์ชุดที่ ${customStages.length + 1}`
        : `Word Set ${customStages.length + 1}`
    );

    const saved = StorageService.saveCustomStage({
      id: editingStageId || undefined,
      title: titleToSave,
      subtitle: stageSubtitle.trim() || undefined,
      language: selectedLang,
      words: wordsList,
      icon: stageIcon,
    });

    reloadData();
    setEditingStageId(saved.id);
    setStageTitle(saved.title);
    setSaveSuccessMsg(guiLang === 'th' ? 'บันทึกด่านเรียบร้อยแล้ว!' : 'Stage saved successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);

    if (autoPlay) {
      const playable = customStageToGameStage(saved);
      onStartCustomStage(playable);
      onClose();
    }
  };

  const handleDeleteStage = (stageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.deleteCustomStageConfirm)) {
      StorageService.deleteCustomStage(stageId);
      reloadData();
      if (editingStageId === stageId) {
        handleResetEditor();
      }
    }
  };

  const handleDuplicateStage = (stageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated = StorageService.duplicateCustomStage(stageId);
    if (duplicated) {
      reloadData();
      handleLoadForEdit(duplicated);
    }
  };

  const handlePlayDirect = (customStage: CustomStage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const playable = customStageToGameStage(customStage);
    onStartCustomStage(playable);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✏️</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {guiLang === 'th' ? 'สร้างด่านเตรียมสอบ & คลังคำศัพท์' : 'Custom Stages & Exam Prep'}
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
                  ? 'ผู้ปกครองและคุณครูสามารถสร้างด่านฝึกพิมพ์คำศัพท์เฉพาะบทเรียนหรือเตรียมสอบให้ลูกๆ ได้ไม่จำกัด'
                  : 'Create unlimited practice stages for exam prep, homework, or customized vocabulary lists.'}
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

        {/* Navigation Tabs */}
        <div className="flex px-6 pt-2.5 gap-4 border-b border-slate-800 bg-slate-900/80">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`pb-2.5 px-3 font-bold text-xs md:text-sm transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'editor'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{editingStageId ? (guiLang === 'th' ? 'แก้ไขด่านนี้' : 'Edit Stage') : (guiLang === 'th' ? 'สร้างด่านใหม่' : 'Create New Stage')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`pb-2.5 px-3 font-bold text-xs md:text-sm transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'list'
                ? 'text-indigo-400 border-indigo-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.savedWordSetsTitle}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700 font-bold">
              {customStages.length}
            </span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Help Tutorial */}
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

          {/* TAB 1: STAGE EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-4">
              {/* Stage Metadata Form */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex-1 w-full">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {t.customStageTitle}
                    </label>
                    <input
                      type="text"
                      value={stageTitle}
                      onChange={(e) => setStageTitle(e.target.value)}
                      placeholder={t.customStageTitlePlaceholder}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>

                  <div className="w-full sm:w-64">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {guiLang === 'th' ? 'ภาษาของด่านนี้:' : 'Stage Language:'}
                    </label>
                    <button
                      type="button"
                      onClick={handleSwitchLanguage}
                      className={`w-full py-2.5 px-3 rounded-xl font-bold transition flex items-center justify-between cursor-pointer border text-xs ${
                        hasLanguageMismatch
                          ? 'bg-rose-600 text-white border-rose-400 ring-4 ring-rose-500/50 animate-pulse'
                          : 'bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border-indigo-500/40'
                      }`}
                    >
                      <span>{selectedLang === 'th' ? '🇹🇭 ภาษาไทย (Thai)' : '🇬🇧 English (US/UK)'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtitle & Icon Picker */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pt-1">
                  <div className="flex-1 w-full">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {t.customStageSubtitle}
                    </label>
                    <input
                      type="text"
                      value={stageSubtitle}
                      onChange={(e) => setStageSubtitle(e.target.value)}
                      placeholder={t.customStageSubtitlePlaceholder}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {t.customStageIconLabel}
                    </label>
                    <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
                      {AVAILABLE_ICONS.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setStageIcon(icon)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition cursor-pointer ${
                            stageIcon === icon
                              ? 'bg-amber-400/20 border border-amber-400 scale-110'
                              : 'hover:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Built-in Presets */}
              <div>
                <span className="text-xs font-semibold text-slate-300 mb-2 block">
                  {guiLang === 'th' ? '💡 หรือเลือกหมวดหมู่คำศัพท์แนะนำแบบด่วน:' : '💡 Or choose from quick built-in templates:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {CUSTOM_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLoadPreset(preset.words, preset.lang, preset.name)}
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

              {/* Validation / Success Messages */}
              {validationError && !hasLanguageMismatch && (
                <div className="bg-amber-950/80 border border-amber-500/60 text-amber-200 p-2.5 rounded-xl flex items-center gap-2 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {saveSuccessMsg && (
                <div className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 p-2.5 rounded-xl flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Word Input Textarea & Add Button */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  {guiLang === 'th'
                    ? 'พิมพ์หรือก๊อปปี้คำศัพท์มาวาง (คั่นด้วยช่องว่าง, จุลภาค หรือขึ้นบรรทัดใหม่):'
                    : 'Type or paste vocabulary words (separated by spaces, commas, or newlines):'}
                </label>

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

              {/* Words Pills Display */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>{guiLang === 'th' ? 'คำศัพท์ในด่านนี้:' : 'Words in this stage:'}</span>
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
                      onClick={handleClearAllWords}
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
          )}

          {/* TAB 2: SAVED STAGES LIST */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  {guiLang === 'th'
                    ? 'รายการด่านที่คุณบันทึกไว้ในอุปกรณ์นี้ สามารถคลิกเล่น แก้ไข หรือทำสำเนาได้ทันที'
                    : 'Saved custom stages on this device. Click to play, edit, or duplicate.'}
                </p>

                <button
                  type="button"
                  onClick={handleResetEditor}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.createNewCustomStage}</span>
                </button>
              </div>

              {customStages.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl space-y-3">
                  <span className="text-4xl">📚</span>
                  <h4 className="text-sm font-bold text-slate-300">
                    {t.noCustomStagesYet}
                  </h4>
                  <button
                    type="button"
                    onClick={handleResetEditor}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    {t.createNewCustomStage}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {customStages.map((cs) => (
                    <div
                      key={cs.id}
                      onClick={() => handleLoadForEdit(cs)}
                      className="p-4 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-400/50 rounded-2xl transition flex flex-col justify-between space-y-3 cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-700">
                              {cs.icon || '📝'}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition flex items-center gap-1.5">
                                <span>{cs.title}</span>
                                <span>{cs.language === 'th' ? '🇹🇭' : '🇬🇧'}</span>
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                {cs.subtitle || `${cs.words.length} คำศัพท์`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => handleDuplicateStage(cs.id, e)}
                              className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-900 rounded-lg transition"
                              title={t.duplicateCustomStage}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteStage(cs.id, e)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition"
                              title={t.deleteCustomStage}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Words pills */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {cs.words.slice(0, 6).map((w, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700/80"
                            >
                              {w}
                            </span>
                          ))}
                          {cs.words.length > 6 && (
                            <span className="text-[10px] text-slate-500 px-1 py-0.5">
                              +{cs.words.length - 6} ...
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <span className="text-[11px] text-amber-400/80 font-medium">
                          {cs.words.length} {t.wordsCountUnit}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoadForEdit(cs);
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
                          >
                            <Edit3 className="w-3 h-3 inline mr-1" />
                            <span>{guiLang === 'th' ? 'แก้ไข' : 'Edit'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handlePlayDirect(cs, e)}
                            className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold rounded-lg shadow transition"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>{guiLang === 'th' ? 'เล่นด่านนี้' : 'Play'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              {guiLang === 'th' ? 'ปิด' : 'Close'}
            </button>

            {activeTab === 'editor' && (
              <button
                type="button"
                onClick={handleResetEditor}
                className="px-3 py-2 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>{guiLang === 'th' ? 'สร้างด่านใหม่' : 'New Stage'}</span>
              </button>
            )}
          </div>

          {activeTab === 'editor' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveStage(false)}
                disabled={wordsList.length === 0}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition cursor-pointer ${
                  wordsList.length > 0
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40'
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{t.btnSaveOnly}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveStage(true)}
                disabled={wordsList.length === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl transition transform cursor-pointer ${
                  wordsList.length > 0
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 hover:scale-105 active:scale-95'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.btnSaveAndPlay}</span>
              </button>
            </div>
          )}
        </div>
      </div>

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
