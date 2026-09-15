import React, { useState } from 'react';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';
import { Globe, Info, Mail, ShieldCheck, FileText, ExternalLink, Menu, X, Maximize, Minimize } from 'lucide-react';
import mxiaLogo from '../assets/mxia-logo.png';

const kidsLogo = `${import.meta.env.BASE_URL}assets/kids-pim-thai-logo.png`;

interface PortalNavbarProps {
  guiLang: GuiLanguage;
  onToggleGuiLang: () => void;
  onOpenModal: (modalName: 'about' | 'contact' | 'privacy' | 'terms') => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const PortalNavbar: React.FC<PortalNavbarProps> = ({
  guiLang,
  onToggleGuiLang,
  onOpenModal,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[guiLang];

  return (
    <nav className="w-full bg-slate-950 border-b border-slate-800 text-slate-200 z-30 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-14 md:h-16">
        {/* Left: Brand Logos & Title */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mxia Portal Link */}
          <a
            href="https://www.mxiaapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group transition"
            title={t.backToMxia}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 p-0.5 shadow-md group-hover:border-indigo-400 transition flex items-center justify-center">
              <img
                src={mxiaLogo}
                alt="Mxia Logo"
                className="w-full h-full object-cover rounded-lg transform group-hover:scale-110 transition duration-300"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-black tracking-wider uppercase text-slate-400 group-hover:text-indigo-400 transition flex items-center gap-1">
                <span>MXIA HUB</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </span>
            </div>
          </a>

          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

          {/* Kids Pim Thai Logo & Title */}
          <div className="flex items-center gap-2.5">
            <img
              src={kidsLogo}
              alt="Kids Pim Thai"
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl object-cover shadow-lg shadow-amber-500/10 border border-amber-500/30"
            />
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-400 leading-tight">
                {t.appName}
              </span>
              <span className="text-[10px] text-slate-400 hidden md:block">
                {t.appSubtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
          <button
            onClick={() => onOpenModal('about')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.navAbout}</span>
          </button>

          <button
            onClick={() => onOpenModal('contact')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-pink-400" />
            <span>{t.navContact}</span>
          </button>

          <button
            onClick={() => onOpenModal('privacy')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.navPrivacy}</span>
          </button>

          <button
            onClick={() => onOpenModal('terms')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.navTerms}</span>
          </button>
        </div>

        {/* Right: Fullscreen, GUI Language Switcher & Mobile Menu Trigger */}
        <div className="flex items-center gap-2">
          {/* Fullscreen Quick Toggle */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className={`p-2 rounded-xl border text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1 ${
                isFullscreen
                  ? 'bg-indigo-600/40 border-indigo-500/80 text-amber-300 shadow-indigo-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
              title={isFullscreen ? t.fullscreenOff : t.fullscreenOn}
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px]">{isFullscreen ? t.fullscreenOff : t.fullscreenOn}</span>
            </button>
          )}

          {/* Bilingual Switcher */}
          <button
            onClick={onToggleGuiLang}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 hover:border-amber-400/50 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            title="Switch Language / สลับภาษาเมนู"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{guiLang === 'th' ? '🇬🇧 English' : '🇹🇭 ภาษาไทย'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/98 border-b border-slate-800 px-4 py-3 space-y-2 text-xs font-semibold animate-fadeIn">
          {onToggleFullscreen && (
            <button
              onClick={() => {
                onToggleFullscreen();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
            >
              <div className="flex items-center gap-2">
                {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4 text-indigo-400" />}
                <span>{isFullscreen ? t.fullscreenOff : t.fullscreenOn}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isFullscreen ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {isFullscreen ? 'ON' : 'OFF'}
              </span>
            </button>
          )}

          <button
            onClick={() => {
              onOpenModal('about');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200"
          >
            <Info className="w-4 h-4 text-indigo-400" />
            <span>{t.navAbout}</span>
          </button>

          <button
            onClick={() => {
              onOpenModal('contact');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200"
          >
            <Mail className="w-4 h-4 text-pink-400" />
            <span>{t.navContact}</span>
          </button>

          <button
            onClick={() => {
              onOpenModal('privacy');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.navPrivacy}</span>
          </button>

          <button
            onClick={() => {
              onOpenModal('terms');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>{t.navTerms}</span>
          </button>

          <a
            href="https://www.mxiaapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold"
          >
            <span>{t.backToMxia}</span>
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
          </a>
        </div>
      )}
    </nav>
  );
};
