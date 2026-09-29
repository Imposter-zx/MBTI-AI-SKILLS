// Language picker dropdown — goes in the Navbar
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '../../i18n';
import type { LangCode } from '../../i18n/types';

export function LanguagePicker() {
  const { lang, langMeta, languages, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all border border-white/5 hover:border-white/10"
        aria-label={t('lang.choose')}
        aria-expanded={open}
      >
        <span className="text-base leading-none">{langMeta.flag}</span>
        <span className="hidden sm:inline text-xs font-mono uppercase">{lang}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/10 bg-[#0d1421] shadow-2xl overflow-hidden z-50">
          <div className="p-1.5">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code as LangCode); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                  l.code === lang
                    ? 'bg-cyan-500/15 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span className="text-base leading-none">{l.flag}</span>
                <span className="flex-1">{l.label}</span>
                {l.code === lang && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
