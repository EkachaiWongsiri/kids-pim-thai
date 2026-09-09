import { FingerPosition, KeyInfo } from '../types/game';

export const FINGER_COLORS: Record<FingerPosition, { bg: string; text: string; border: string; name: string; side: string }> = {
  'left-pinky': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500', name: 'ก้อยซ้าย', side: 'มือซ้าย' },
  'left-ring': { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500', name: 'นางซ้าย', side: 'มือซ้าย' },
  'left-middle': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500', name: 'กลางซ้าย', side: 'มือซ้าย' },
  'left-index': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500', name: 'ชี้ซ้าย', side: 'มือซ้าย' },
  'thumb': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500', name: 'นิ้วโป้ง', side: 'สองมือ' },
  'right-index': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500', name: 'ชี้ขวา', side: 'มือขวา' },
  'right-middle': { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500', name: 'กลางขวา', side: 'มือขวา' },
  'right-ring': { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500', name: 'นางขวา', side: 'มือขวา' },
  'right-pinky': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500', name: 'ก้อยขวา', side: 'มือขวา' },
};

export const KEYBOARD_ROWS: KeyInfo[][] = [
  // Row 1: Number Row
  [
    { code: 'Backquote', labelEn: '`', shiftEn: '~', labelTh: '_', shiftTh: '%', finger: 'left-pinky' },
    { code: 'Digit1', labelEn: '1', shiftEn: '!', labelTh: 'ๅ', shiftTh: '+', finger: 'left-pinky' },
    { code: 'Digit2', labelEn: '2', shiftEn: '@', labelTh: '/', shiftTh: '๑', finger: 'left-ring' },
    { code: 'Digit3', labelEn: '3', shiftEn: '#', labelTh: '-', shiftTh: '๒', finger: 'left-middle' },
    { code: 'Digit4', labelEn: '4', shiftEn: '$', labelTh: 'ภ', shiftTh: '๓', finger: 'left-index' },
    { code: 'Digit5', labelEn: '5', shiftEn: '%', labelTh: 'ถ', shiftTh: '๔', finger: 'left-index' },
    { code: 'Digit6', labelEn: '6', shiftEn: '^', labelTh: 'ุ', shiftTh: 'ู', finger: 'right-index' },
    { code: 'Digit7', labelEn: '7', shiftEn: '&', labelTh: 'ึ', shiftTh: '฿', finger: 'right-index' },
    { code: 'Digit8', labelEn: '8', shiftEn: '*', labelTh: 'ค', shiftTh: '๕', finger: 'right-middle' },
    { code: 'Digit9', labelEn: '9', shiftEn: '(', labelTh: 'ต', shiftTh: '๖', finger: 'right-ring' },
    { code: 'Digit0', labelEn: '0', shiftEn: ')', labelTh: 'จ', shiftTh: '๗', finger: 'right-pinky' },
    { code: 'Minus', labelEn: '-', shiftEn: '_', labelTh: 'ข', shiftTh: '๘', finger: 'right-pinky' },
    { code: 'Equal', labelEn: '=', shiftEn: '+', labelTh: 'ช', shiftTh: '๙', finger: 'right-pinky' },
    { code: 'Backspace', labelEn: 'Backspace', shiftEn: 'Backspace', labelTh: 'ลบ', shiftTh: 'ลบ', finger: 'right-pinky', width: 'w-16 md:w-20', isSpecial: true }
  ],
  // Row 2: Top Row
  [
    { code: 'Tab', labelEn: 'Tab', shiftEn: 'Tab', labelTh: 'Tab', shiftTh: 'Tab', finger: 'left-pinky', width: 'w-12 md:w-16', isSpecial: true },
    { code: 'KeyQ', labelEn: 'q', shiftEn: 'Q', labelTh: 'ๆ', shiftTh: '๐', finger: 'left-pinky' },
    { code: 'KeyW', labelEn: 'w', shiftEn: 'W', labelTh: 'ไ', shiftTh: '"', finger: 'left-ring' },
    { code: 'KeyE', labelEn: 'e', shiftEn: 'E', labelTh: 'ำ', shiftTh: 'ฎ', finger: 'left-middle' },
    { code: 'KeyR', labelEn: 'r', shiftEn: 'R', labelTh: 'พ', shiftTh: 'ฑ', finger: 'left-index' },
    { code: 'KeyT', labelEn: 't', shiftEn: 'T', labelTh: 'ะ', shiftTh: 'ธ', finger: 'left-index' },
    { code: 'KeyY', labelEn: 'y', shiftEn: 'Y', labelTh: 'ั', shiftTh: 'ํ', finger: 'right-index' },
    { code: 'KeyU', labelEn: 'u', shiftEn: 'U', labelTh: 'ี', shiftTh: '๊', finger: 'right-index' },
    { code: 'KeyI', labelEn: 'i', shiftEn: 'I', labelTh: 'ร', shiftTh: 'ณ', finger: 'right-middle' },
    { code: 'KeyO', labelEn: 'o', shiftEn: 'O', labelTh: 'น', shiftTh: 'ฯ', finger: 'right-ring' },
    { code: 'KeyP', labelEn: 'p', shiftEn: 'P', labelTh: 'ย', shiftTh: 'ญ', finger: 'right-pinky' },
    { code: 'BracketLeft', labelEn: '[', shiftEn: '{', labelTh: 'บ', shiftTh: 'ฐ', finger: 'right-pinky' },
    { code: 'BracketRight', labelEn: ']', shiftEn: '}', labelTh: 'ล', shiftTh: ',', finger: 'right-pinky' },
    { code: 'Backslash', labelEn: '\\', shiftEn: '|', labelTh: 'ฃ', shiftTh: 'ฅ', finger: 'right-pinky' }
  ],
  // Row 3: Home Row
  [
    { code: 'CapsLock', labelEn: 'Caps', shiftEn: 'Caps', labelTh: 'Caps', shiftTh: 'Caps', finger: 'left-pinky', width: 'w-14 md:w-18', isSpecial: true },
    { code: 'KeyA', labelEn: 'a', shiftEn: 'A', labelTh: 'ฟ', shiftTh: 'ฤ', finger: 'left-pinky' },
    { code: 'KeyS', labelEn: 's', shiftEn: 'S', labelTh: 'ห', shiftTh: 'ฆ', finger: 'left-ring' },
    { code: 'KeyD', labelEn: 'd', shiftEn: 'D', labelTh: 'ก', shiftTh: 'ฏ', finger: 'left-middle' },
    { code: 'KeyF', labelEn: 'f', shiftEn: 'F', labelTh: 'ด', shiftTh: 'โ', finger: 'left-index' },
    { code: 'KeyG', labelEn: 'g', shiftEn: 'G', labelTh: 'เ', shiftTh: 'ฌ', finger: 'left-index' },
    { code: 'KeyH', labelEn: 'h', shiftEn: 'H', labelTh: '้', shiftTh: '็', finger: 'right-index' },
    { code: 'KeyJ', labelEn: 'j', shiftEn: 'J', labelTh: '่', shiftTh: '๋', finger: 'right-index' },
    { code: 'KeyK', labelEn: 'k', shiftEn: 'K', labelTh: 'า', shiftTh: 'ษ', finger: 'right-middle' },
    { code: 'KeyL', labelEn: 'l', shiftEn: 'L', labelTh: 'ส', shiftTh: 'ศ', finger: 'right-ring' },
    { code: 'Semicolon', labelEn: ';', shiftEn: ':', labelTh: 'ว', shiftTh: 'ซ', finger: 'right-pinky' },
    { code: 'Quote', labelEn: '\'', shiftEn: '"', labelTh: 'ง', shiftTh: '.', finger: 'right-pinky' },
    { code: 'Enter', labelEn: 'Enter', shiftEn: 'Enter', labelTh: 'Enter', shiftTh: 'Enter', finger: 'right-pinky', width: 'w-16 md:w-20', isSpecial: true }
  ],
  // Row 4: Bottom Row
  [
    { code: 'ShiftLeft', labelEn: 'Shift', shiftEn: 'Shift', labelTh: 'Shift', shiftTh: 'Shift', finger: 'left-pinky', width: 'w-16 md:w-22', isSpecial: true },
    { code: 'KeyZ', labelEn: 'z', shiftEn: 'Z', labelTh: 'ผ', shiftTh: '(', finger: 'left-pinky' },
    { code: 'KeyX', labelEn: 'x', shiftEn: 'X', labelTh: 'ป', shiftTh: ')', finger: 'left-ring' },
    { code: 'KeyC', labelEn: 'c', shiftEn: 'C', labelTh: 'แ', shiftTh: 'ฉ', finger: 'left-middle' },
    { code: 'KeyV', labelEn: 'v', shiftEn: 'V', labelTh: 'อ', shiftTh: 'ฮ', finger: 'left-index' },
    { code: 'KeyB', labelEn: 'b', shiftEn: 'B', labelTh: 'ิ', shiftTh: 'ฺ', finger: 'left-index' },
    { code: 'KeyN', labelEn: 'n', shiftEn: 'N', labelTh: 'ื', shiftTh: '์', finger: 'right-index' },
    { code: 'KeyM', labelEn: 'm', shiftEn: 'M', labelTh: 'ท', shiftTh: '?', finger: 'right-index' },
    { code: 'Comma', labelEn: ',', shiftEn: '<', labelTh: 'ม', shiftTh: 'ฒ', finger: 'right-middle' },
    { code: 'Period', labelEn: '.', shiftEn: '>', labelTh: 'ใ', shiftTh: 'ฬ', finger: 'right-ring' },
    { code: 'Slash', labelEn: '/', shiftEn: '?', labelTh: 'ฝ', shiftTh: 'ฦ', finger: 'right-pinky' },
    { code: 'ShiftRight', labelEn: 'Shift', shiftEn: 'Shift', labelTh: 'Shift', shiftTh: 'Shift', finger: 'right-pinky', width: 'w-16 md:w-22', isSpecial: true }
  ],
  // Row 5: Space
  [
    { code: 'Space', labelEn: 'Space', shiftEn: 'Space', labelTh: 'เว้นวรรค', shiftTh: 'เว้นวรรค', finger: 'thumb', width: 'w-64 md:w-96', isSpecial: true }
  ]
];

// Helper to find key details for any given character
export function findKeyForChar(char: string, lang: 'th' | 'en'): { key: KeyInfo; requiresShift: boolean } | null {
  if (char === ' ') {
    return { key: KEYBOARD_ROWS[4][0], requiresShift: false };
  }

  for (const row of KEYBOARD_ROWS) {
    for (const key of row) {
      if (lang === 'th') {
        if (key.labelTh === char) return { key, requiresShift: false };
        if (key.shiftTh === char) return { key, requiresShift: true };
      } else {
        if (key.labelEn.toLowerCase() === char.toLowerCase()) {
          const isUpper = char === char.toUpperCase() && char !== char.toLowerCase();
          return { key, requiresShift: isUpper };
        }
        if (key.labelEn === char) return { key, requiresShift: false };
        if (key.shiftEn === char) return { key, requiresShift: true };
      }
    }
  }
  return null;
}
