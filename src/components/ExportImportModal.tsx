import React, { useState, useRef } from 'react';
import { Download, Upload, X, CheckSquare, Square, FileJson, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StorageService, ExportData } from '../services/storageService';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
  guiLang: GuiLanguage;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  guiLang,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [includeCustomWords, setIncludeCustomWords] = useState(true);
  const [includeWordSets, setIncludeWordSets] = useState(true);
  const [includeSettings, setIncludeSettings] = useState(true);
  const [includeScores, setIncludeScores] = useState(false);

  // Import state
  const [pendingPackage, setPendingPackage] = useState<ExportData | null>(null);
  const [importMode, setImportMode] = useState<'overwrite' | 'merge' | 'skip'>('merge');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const t = TRANSLATIONS[guiLang];

  const handleExport = () => {
    const pkg = StorageService.exportPackage({
      includeCustomWords,
      includeWordSets,
      includeSettings,
      includeScores,
    });

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pkg, null, 2));
    const downloadAnchor = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kids-pim-thai-${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setStatusMessage({
      type: 'success',
      text: guiLang === 'th' ? 'ส่งออกไฟล์ kids-pim-thai.json เรียบร้อยแล้ว!' : 'Exported kids-pim-thai.json successfully!',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.format !== 'kids-pim-thai') {
          setStatusMessage({
            type: 'error',
            text: guiLang === 'th' ? 'ไฟล์นี้ไม่ใช่รูปแบบข้อมูลของ Kids Pim Thai' : 'Invalid Kids Pim Thai file format',
          });
          return;
        }
        setPendingPackage(json);
        setStatusMessage(null);
      } catch (err) {
        console.error(err);
        setStatusMessage({
          type: 'error',
          text: t.importFailMsg,
        });
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmImport = () => {
    if (!pendingPackage) return;

    const result = StorageService.importPackage(pendingPackage, importMode);
    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: `${t.importSuccessMsg} (${result.importedCount} รายการ)`,
      });
      setPendingPackage(null);
      onImportSuccess();
    } else {
      setStatusMessage({
        type: 'error',
        text: result.message,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {t.exportImportTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.exportImportDesc}
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('export');
              setStatusMessage(null);
            }}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'export'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>{t.btnExportData}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('import');
              setStatusMessage(null);
            }}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'import'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{t.btnImportData}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-200'
                  : 'bg-rose-950/80 border border-rose-500/60 text-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-slate-200 block">
                  {t.exportOptionsTitle}
                </span>

                <div className="space-y-2.5">
                  <label
                    onClick={() => setIncludeCustomWords(!includeCustomWords)}
                    className="flex items-center gap-3 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
                  >
                    {includeCustomWords ? (
                      <CheckSquare className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                    <span>{t.optCustomWords}</span>
                  </label>

                  <label
                    onClick={() => setIncludeWordSets(!includeWordSets)}
                    className="flex items-center gap-3 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
                  >
                    {includeWordSets ? (
                      <CheckSquare className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                    <span>{guiLang === 'th' ? 'ชุดคำศัพท์หลายหมวดที่สร้างไว้' : 'Saved Multi-Preset Word Sets'}</span>
                  </label>

                  <label
                    onClick={() => setIncludeSettings(!includeSettings)}
                    className="flex items-center gap-3 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
                  >
                    {includeSettings ? (
                      <CheckSquare className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                    <span>{t.optGameSettings}</span>
                  </label>

                  <label
                    onClick={() => setIncludeScores(!includeScores)}
                    className="flex items-center gap-3 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
                  >
                    {includeScores ? (
                      <CheckSquare className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                    <span>{t.optScores}</span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleExport}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t.btnDownloadJson}</span>
              </button>
            </div>
          )}

          {/* TAB 2: IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              {!pendingPackage ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                    id="import-json-file"
                  />
                  <label
                    htmlFor="import-json-file"
                    className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/60 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition text-center group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-200 block">
                        {t.importPromptTitle}
                      </span>
                      <span className="text-xs text-slate-400">
                        {guiLang === 'th' ? 'คลิกเพื่อเลือกไฟล์ .json จากเครื่องของคุณ' : 'Click to select .json file from your computer'}
                      </span>
                    </div>
                  </label>
                </div>
              ) : (
                /* Conflict Resolution Prompt */
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center gap-2 text-amber-300">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-sm font-bold">{t.importConflictTitle}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {t.importConflictDesc}
                  </p>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setImportMode('merge')}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                        importMode === 'merge'
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 shadow-md font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {t.importModeMerge}
                    </button>

                    <button
                      type="button"
                      onClick={() => setImportMode('overwrite')}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                        importMode === 'overwrite'
                          ? 'bg-rose-600/30 border-rose-500 text-rose-200 shadow-md font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {t.importModeOverwrite}
                    </button>

                    <button
                      type="button"
                      onClick={() => setImportMode('skip')}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                        importMode === 'skip'
                          ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-md font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {t.importModeSkip}
                    </button>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPendingPackage(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      {guiLang === 'th' ? 'ยกเลิก' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmImport}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30 cursor-pointer"
                    >
                      {guiLang === 'th' ? 'ยืนยันการนำเข้าข้อมูล' : 'Confirm Import'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
