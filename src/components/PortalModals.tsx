import React, { useState } from 'react';
import { GuiLanguage, TRANSLATIONS } from '../data/i18n';
import { X, Mail, ShieldCheck, FileText, Info, Send, CheckCircle2, Heart } from 'lucide-react';

interface PortalModalsProps {
  activeModal: 'about' | 'contact' | 'privacy' | 'terms' | null;
  onClose: () => void;
  guiLang: GuiLanguage;
}

export const PortalModals: React.FC<PortalModalsProps> = ({
  activeModal,
  onClose,
  guiLang,
}) => {
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!activeModal) return null;

  const t = TRANSLATIONS[guiLang];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Kids Pim Thai Feedback] from ${feedbackName || 'Parent/Teacher'}`);
    const body = encodeURIComponent(`Name: ${feedbackName}\n\nFeedback:\n${feedbackMsg}`);
    window.location.href = `mailto:support@mxiaapp.com?subject=${subject}&body=${body}`;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            {activeModal === 'contact' && <Mail className="w-6 h-6 text-pink-400" />}
            {activeModal === 'about' && <Info className="w-6 h-6 text-indigo-400" />}
            {activeModal === 'privacy' && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
            {activeModal === 'terms' && <FileText className="w-6 h-6 text-amber-400" />}

            <h2 className="text-lg md:text-xl font-bold text-white">
              {activeModal === 'contact' && t.contactTitle}
              {activeModal === 'about' && t.aboutTitle}
              {activeModal === 'privacy' && t.privacyTitle}
              {activeModal === 'terms' && t.termsTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm leading-relaxed">
          {/* ================= Contact Modal ================= */}
          {activeModal === 'contact' && (
            <div className="space-y-4">
              <p className="text-slate-300">{t.contactSubtitle}</p>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold shrink-0">
                    <Mail className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">{t.contactEmailLabel}</span>
                    <a
                      href="mailto:support@mxiaapp.com"
                      className="text-base font-bold text-pink-400 hover:underline tracking-wider"
                    >
                      support@mxiaapp.com
                    </a>
                  </div>
                </div>

                <a
                  href="mailto:support@mxiaapp.com"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-pink-600/30 whitespace-nowrap"
                >
                  {t.btnSendEmail}
                </a>
              </div>

              {/* In-app Message Form */}
              <form onSubmit={handleSendFeedback} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {t.contactFormName}
                  </label>
                  <input
                    type="text"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder="เช่น คุณแม่น้องภีม / คุณครูใจดี"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {t.contactFormMsg}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={feedbackMsg}
                    onChange={(e) => setFeedbackMsg(e.target.value)}
                    placeholder="พิมพ์ข้อเสนอแนะ คำติชม หรือคำศัพท์ที่อยากให้เพิ่ม..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>

                {sentSuccess ? (
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>กำลังเปิดโปรแกรมอีเมลเพื่อส่งข้อความ ขอบคุณสำหรับข้อเสนอแนะ!</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold rounded-xl transition text-sm shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.btnSendFeedback}</span>
                  </button>
                )}
              </form>
            </div>
          )}

          {/* ================= About Modal ================= */}
          {activeModal === 'about' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-center gap-3">
                <span className="text-3xl">🚀</span>
                <div>
                  <h3 className="font-bold text-white text-base">Kids Pim Thai by Mxia</h3>
                  <p className="text-xs text-indigo-300">https://www.mxiaapp.com/th/app/kids-pim-thai</p>
                </div>
              </div>

              <p className="text-slate-300">{t.aboutP1}</p>
              <p className="text-slate-300">{t.aboutP2}</p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>สร้างสรรค์ด้วยใจเพื่อเยาวชนไทย</span>
                </div>
                <span>Version 1.0.0</span>
              </div>
            </div>
          )}

          {/* ================= Privacy Policy Modal ================= */}
          {activeModal === 'privacy' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.privacyTag}</span>
              </div>

              <p className="text-slate-300">{t.privacyP1}</p>

              <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-emerald-400 text-sm">{t.privacyPoint1Title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{t.privacyPoint1Desc}</p>
                </div>

                <div>
                  <h4 className="font-bold text-emerald-400 text-sm">{t.privacyPoint2Title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{t.privacyPoint2Desc}</p>
                </div>

                <div>
                  <h4 className="font-bold text-emerald-400 text-sm">{t.privacyPoint3Title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{t.privacyPoint3Desc}</p>
                </div>
              </div>
            </div>
          )}

          {/* ================= Terms Modal ================= */}
          {activeModal === 'terms' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold">
                <FileText className="w-4 h-4" />
                <span>{t.termsTag}</span>
              </div>

              <p className="text-slate-300">{t.termsP1}</p>
              <p className="text-slate-300">{t.termsP2}</p>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-300 block mb-1">ลิขสิทธิ์และการเผยแพร่:</span>
                คุณสามารถแชร์ลิงก์ <span className="text-indigo-300 font-mono">https://www.mxiaapp.com/th/app/kids-pim-thai</span> ให้กับนักเรียนหรือผู้สนใจได้ทันทีโดยไม่ต้องขออนุญาตล่วงหน้า
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
