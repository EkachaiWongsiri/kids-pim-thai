import React from 'react';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';
import { Sparkles, BookOpen, Keyboard, ExternalLink, HelpCircle } from 'lucide-react';

interface AffiliateSidebarProps {
  position: 'left' | 'right';
  guiLang: GuiLanguage;
  onOpenContact: () => void;
}

export const AffiliateSidebar: React.FC<AffiliateSidebarProps> = ({
  position,
  guiLang,
  onOpenContact,
}) => {
  const t = TRANSLATIONS[guiLang];

  return (
    <aside className="hidden xl:flex flex-col gap-3 w-48 2xl:w-56 py-2 px-1 select-none shrink-0">
      {/* Sponsor / Affiliate Box 1 */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-700 transition">
        <div>
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 mb-2">
            <span>{t.sponsorNotice}</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </div>

          <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 p-2.5 flex flex-col items-center justify-center text-center mb-2 group cursor-pointer">
            {position === 'left' ? (
              <>
                <BookOpen className="w-8 h-8 text-indigo-400 mb-1.5 group-hover:scale-110 transition duration-300" />
                <span className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300 transition">
                  {t.sponsorSample1}
                </span>
              </>
            ) : (
              <>
                <Keyboard className="w-8 h-8 text-pink-400 mb-1.5 group-hover:scale-110 transition duration-300" />
                <span className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300 transition">
                  {t.sponsorSample2}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onOpenContact}
          className="text-[10px] text-slate-400 hover:text-indigo-300 transition text-center pt-1 border-t border-slate-800/80 flex items-center justify-center gap-1"
        >
          <span>ลงโฆษณา</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Sponsor / Affiliate Box 2 */}
      <div className="bg-slate-900/40 border border-dashed border-slate-800/60 rounded-2xl p-3 text-center flex flex-col items-center justify-center min-h-[140px]">
        <HelpCircle className="w-6 h-6 text-slate-600 mb-1" />
        <span className="text-[10px] text-slate-400 font-medium mb-1">
          {t.sponsorTitle}
        </span>
        <button
          onClick={onOpenContact}
          className="text-[10px] text-pink-400 hover:underline font-semibold"
        >
          support@mxiaapp.com
        </button>
      </div>
    </aside>
  );
};
