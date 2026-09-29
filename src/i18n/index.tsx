// i18n context + hook
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { LangCode, Translations, LanguageMeta } from './types';
import { LANGUAGES, DEFAULT_LANG } from './types';
import { en } from './locales/en';
import { fr } from './locales/fr';
import { ar } from './locales/ar';
import { es } from './locales/es';
import { de } from './locales/de';
import { zh } from './locales/zh';
import { pt } from './locales/pt';
import { ja } from './locales/ja';

const LOCALES: Record<LangCode, Translations> = { en, fr, ar, es, de, zh, pt, ja };

const LS_KEY = 'mbti-ai-lang';

/** Detect the best matching language from browser preferences */
function detectBrowserLang(): LangCode {
  const supported = Object.keys(LOCALES) as LangCode[];
  for (const nav of navigator.languages ?? [navigator.language]) {
    const code = nav.slice(0, 2).toLowerCase() as LangCode;
    if (supported.includes(code)) return code;
  }
  return DEFAULT_LANG;
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface I18nContextValue {
  lang: LangCode;
  langMeta: LanguageMeta;
  languages: LanguageMeta[];
  t: (key: keyof Translations) => string;
  setLang: (code: LangCode) => void;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    const saved = localStorage.getItem(LS_KEY) as LangCode | null;
    if (saved && saved in LOCALES) return saved;
    return detectBrowserLang();
  });

  const langMeta = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  const dir = langMeta.dir;

  useEffect(() => {
    localStorage.setItem(LS_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = (code: LangCode) => {
    if (code in LOCALES) setLangState(code);
  };

  const t = (key: keyof Translations): string => {
    return LOCALES[lang][key] ?? LOCALES[DEFAULT_LANG][key] ?? key;
  };

  return (
    <I18nContext.Provider value={{ lang, langMeta, languages: LANGUAGES, t, setLang, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>');
  return ctx;
}
