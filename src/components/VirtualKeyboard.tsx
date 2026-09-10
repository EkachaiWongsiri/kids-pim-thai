import React, { useState } from 'react';
import { KEYBOARD_ROWS, FINGER_COLORS, findKeyForChar } from '../data/keyboardLayouts';
import { Language, KeyInfo } from '../types/game';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';
import { Keyboard as KeyboardIcon, EyeOff, Hand } from 'lucide-react';

interface VirtualKeyboardProps {
  language: Language;
  targetChar: string | null;
  activePhysicalKey: string | null;
  onKeyClick?: (char: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  guiLang: GuiLanguage;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  language,
  targetChar,
  activePhysicalKey,
  onKeyClick,
  isVisible,
  onToggleVisibility,
  guiLang,
}) => {
  const [showFingerGuide, setShowFingerGuide] = useState(true);
  const [isVirtualShiftActive, setIsVirtualShiftActive] = useState(false);
  const t = TRANSLATIONS[guiLang];

  const isPhysicalShiftActive = activePhysicalKey === 'ShiftLeft' || activePhysicalKey === 'ShiftRight';
  const isShiftActive = isVirtualShiftActive || isPhysicalShiftActive;

  // Find which key is targeted
  const targetKeyData = targetChar ? findKeyForChar(targetChar, language) : null;
  const targetKeyCode = targetKeyData?.key.code || null;
  const requiresShift = targetKeyData?.requiresShift || false;

  const renderKeyContent = (key: KeyInfo) => {
    if (key.isSpecial) {
      if (key.code === 'ShiftLeft' || key.code === 'ShiftRight') {
        return (
          <span className={`text-xs md:text-sm font-black tracking-wider flex items-center gap-1 ${
            isShiftActive ? 'text-white' : ''
          }`}>
            <span>⬆</span>
            <span>{isShiftActive ? 'SHIFT' : (language === 'th' ? key.labelTh : key.labelEn)}</span>
          </span>
        );
      }
      return (
        <span className="text-xs md:text-sm font-semibold tracking-wider">
          {language === 'th' ? key.labelTh : key.labelEn}
        </span>
      );
    }

    const isTarget = targetKeyCode === key.code;
    const isThai = language === 'th';

    const mainChar = isThai ? key.labelTh : key.labelEn;
    const shiftChar = isThai ? key.shiftTh : key.shiftEn;

    if (isShiftActive) {
      // In shift mode: Show shiftChar prominently, mainChar small
      return (
        <div className="flex flex-col items-center justify-between h-full py-0.5 pointer-events-none">
          <span className={`text-sm md:text-lg font-black leading-none ${
            isTarget ? 'text-amber-300 scale-125' : 'text-white'
          }`}>
            {shiftChar}
          </span>
          <span className="text-[10px] md:text-xs leading-none text-slate-500 font-normal">
            {mainChar}
          </span>
        </div>
      );
    }

    // Normal non-shift mode
    return (
      <div className="flex flex-col items-center justify-between h-full py-0.5 pointer-events-none">
        {/* Shift character (top) */}
        <span className={`text-[10px] md:text-xs leading-none ${
          isTarget && requiresShift ? 'text-amber-300 font-bold scale-125' : 'text-slate-400'
        }`}>
          {shiftChar}
        </span>

        {/* Main character (bottom/center) */}
        <span className={`text-sm md:text-lg font-bold leading-none ${
          isTarget && !requiresShift ? 'text-white scale-125' : 'text-slate-200'
        }`}>
          {mainChar}
        </span>
      </div>
    );
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-20">
        <button
          onClick={onToggleVisibility}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/30 transition transform hover:scale-105 active:scale-95 font-semibold text-sm border border-indigo-400/30 cursor-pointer"
          title={t.showKeyboard}
        >
          <KeyboardIcon className="w-5 h-5 text-amber-300" />
          <span>{t.showKeyboard}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-1 sm:px-2 pb-1 transition-all duration-300 z-10 select-none">
      {/* Control bar above keyboard */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-900/80 backdrop-blur rounded-t-2xl border-t border-x border-slate-700/60 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-300 font-medium">
            <KeyboardIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.virtualKeyboardTitle} ({language === 'th' ? 'เกษมณี TH' : 'QWERTY EN'})</span>
          </div>
          {isShiftActive && (
            <span className="px-2 py-0.5 bg-rose-500/30 border border-rose-500/60 rounded-full text-rose-300 font-bold text-[10px] animate-pulse">
              ⬆ SHIFT ACTIVE
            </span>
          )}
          {targetChar && (
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-[11px]">
              <span>{t.nextKey}</span>
              <span className="font-bold text-xs bg-amber-500 text-slate-950 px-1.5 rounded">
                {targetChar === ' ' ? 'Space' : targetChar}
              </span>
              {requiresShift && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded font-bold">
                  {t.pressShiftToo}
                </span>
              )}
              {targetKeyData && (
                <span className="text-[10px] text-slate-300">
                  ({t.useFinger}{FINGER_COLORS[targetKeyData.key.finger].name})
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowFingerGuide(!showFingerGuide)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border transition text-[11px] ${
              showFingerGuide 
                ? 'bg-blue-600/40 border-blue-400/50 text-blue-200' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Hand className="w-3 h-3" />
            <span className="hidden md:inline">{t.fingerGuideToggle}</span>
          </button>
          
          <button
            onClick={onToggleVisibility}
            className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition text-[11px]"
            title={t.hideKeyboard}
          >
            <EyeOff className="w-3 h-3" />
            <span className="hidden md:inline">{t.hideKeyboard}</span>
          </button>
        </div>
      </div>

      {/* Keyboard Grid */}
      <div className="bg-slate-900/95 backdrop-blur-md p-1.5 md:p-2.5 rounded-b-2xl border border-slate-700/60 shadow-2xl flex flex-col gap-1 md:gap-1.5">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 md:gap-1.5 w-full">
            {row.map((key) => {
              const isTarget = targetKeyCode === key.code;
              const isShiftKey = key.code === 'ShiftLeft' || key.code === 'ShiftRight';
              const isTargetShift = requiresShift && isShiftKey;
              const isPhysicallyPressed = activePhysicalKey === key.code;
              const fingerStyle = FINGER_COLORS[key.finger];

              let keyClass = `
                relative flex items-center justify-center rounded-lg font-medium select-none
                transition-all duration-75 text-center cursor-pointer active:scale-95
                h-9 md:h-11 text-xs md:text-sm
                ${key.width || 'flex-1 min-w-[24px] md:min-w-[38px] max-w-[54px]'}
                ${key.code === 'Space' ? 'max-w-md w-full' : ''}
              `;

              // Dynamic styling based on state
              if (isPhysicallyPressed) {
                keyClass += ' bg-amber-400 text-slate-950 scale-95 shadow-inner ring-2 ring-amber-300';
              } else if (isShiftKey && isShiftActive) {
                keyClass += ' bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black shadow-lg shadow-rose-500/50 ring-2 ring-rose-300 scale-105';
              } else if (isTargetShift) {
                keyClass += ' bg-rose-600 text-white font-bold animate-pulse ring-2 ring-rose-400 shadow-lg shadow-rose-500/50 scale-105';
              } else if (isTarget) {
                keyClass += ' bg-gradient-to-t from-amber-500 to-yellow-400 text-slate-950 font-bold key-glow ring-2 ring-yellow-200 z-10';
              } else if (showFingerGuide && !key.isSpecial) {
                keyClass += ` ${fingerStyle.bg} border-b-2 ${fingerStyle.border} hover:brightness-125`;
              } else {
                keyClass += ' bg-slate-800/90 text-slate-300 border-b-2 border-slate-950/80 hover:bg-slate-700/80';
              }

              return (
                <button
                  key={key.code}
                  type="button"
                  onClick={() => {
                    if (isShiftKey) {
                      // Toggle virtual shift on touchscreen/click
                      setIsVirtualShiftActive((prev) => !prev);
                      return;
                    }

                    if (key.code === 'Backspace') {
                      return;
                    }

                    if (key.code === 'Space') {
                      onKeyClick?.(' ');
                      if (isVirtualShiftActive) setIsVirtualShiftActive(false);
                      return;
                    }

                    if (onKeyClick) {
                      const isThai = language === 'th';
                      let charToSend: string;

                      if (isShiftActive) {
                        charToSend = isThai
                          ? (key.shiftTh || key.labelTh)
                          : (key.shiftEn || key.labelEn.toUpperCase());
                      } else {
                        charToSend = isThai ? key.labelTh : key.labelEn;
                      }

                      onKeyClick(charToSend);

                      // If virtual shift was active, unlatch after tapping a key
                      if (isVirtualShiftActive) {
                        setIsVirtualShiftActive(false);
                      }
                    }
                  }}
                  className={keyClass}
                >
                  {renderKeyContent(key)}
                  {(key.code === 'KeyF' || key.code === 'KeyJ') && (
                    <span className="absolute bottom-0.5 w-2.5 h-0.5 bg-slate-400 rounded-full opacity-60"></span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Finger position color legend */}
        {showFingerGuide && (
          <div className="mt-0.5 pt-1 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 text-[10px] text-slate-400">
            <span className="font-semibold text-slate-300">{guiLang === 'th' ? 'ตำแหน่งนิ้ว:' : 'Fingers:'}</span>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> {guiLang === 'th' ? 'ก้อยซ้าย' : 'L.Pinky'}</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500"></span> {guiLang === 'th' ? 'นางซ้าย' : 'L.Ring'}</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> {guiLang === 'th' ? 'กลางซ้าย' : 'L.Middle'}</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> {guiLang === 'th' ? 'ชี้ซ้าย' : 'L.Index'}</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> {guiLang === 'th' ? 'นิ้วโป้ง' : 'Thumbs'}</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {guiLang === 'th' ? 'ชี้ขวา' : 'R.Index'}</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500"></span> {guiLang === 'th' ? 'กลางขวา' : 'R.Middle'}</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> {guiLang === 'th' ? 'นางขวา' : 'R.Ring'}</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> {guiLang === 'th' ? 'ก้อยขวา' : 'R.Pinky'}</div>
          </div>
        )}
      </div>
    </div>
  );
};
