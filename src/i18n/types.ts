// i18n core — zero-dependency translation system
// Supported languages
export type LangCode = 'en' | 'fr' | 'ar' | 'es' | 'de' | 'zh' | 'pt' | 'ja';

export interface LanguageMeta {
  code: LangCode;
  label: string;      // native name
  flag: string;       // emoji flag
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English',    flag: '🇬🇧', dir: 'ltr' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', label: 'العربية',    flag: '🇲🇦', dir: 'rtl' },
  { code: 'es', label: 'Español',    flag: '🇪🇸', dir: 'ltr' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪', dir: 'ltr' },
  { code: 'zh', label: '中文',        flag: '🇨🇳', dir: 'ltr' },
  { code: 'pt', label: 'Português',  flag: '🇧🇷', dir: 'ltr' },
  { code: 'ja', label: '日本語',      flag: '🇯🇵', dir: 'ltr' },
];

export const DEFAULT_LANG: LangCode = 'en';

// ─── Translation keys (flat dot-notation) ────────────────────────────────────
export interface Translations {
  // Navbar
  'nav.types': string;
  'nav.compare': string;
  'nav.builder': string;
  'nav.lab': string;
  'nav.github': string;

  // HomePage
  'home.badge': string;
  'home.tagline': string;
  'home.subtitle': string;
  'home.cta.explore': string;
  'home.cta.build': string;
  'home.cta.compare': string;
  'home.cta.surprise': string;
  'home.features.title': string;
  'home.features.subtitle': string;
  'home.profiles.title': string;
  'home.profiles.subtitle': string;
  'home.profiles.viewAll': string;
  'home.disclaimer.title': string;
  'home.disclaimer.body': string;
  'home.flow.profile': string;
  'home.flow.style': string;
  'home.flow.skills': string;
  'home.flow.intensity': string;
  'home.flow.prompt': string;
  'home.flow.behavior': string;

  // Features
  'feature.profiles.title': string;
  'feature.profiles.desc': string;
  'feature.skills.title': string;
  'feature.skills.desc': string;
  'feature.compare.title': string;
  'feature.compare.desc': string;
  'feature.builder.title': string;
  'feature.builder.desc': string;

  // TypesPage
  'types.heading': string;
  'types.subheading': string;
  'types.search': string;
  'types.all': string;
  'types.viewProfile': string;
  'types.noResults': string;

  // ProfilePage
  'profile.back': string;
  'profile.tryBuilder': string;
  'profile.compare': string;
  'profile.cognitiveStyle': string;
  'profile.communication': string;
  'profile.problemSolving': string;
  'profile.decision': string;
  'profile.strengths': string;
  'profile.blindSpots': string;
  'profile.recommendedSkills': string;
  'profile.addToBuilder': string;
  'profile.examplePrompt': string;
  'profile.exampleInteraction': string;
  'profile.compatibleSkills': string;
  'profile.user': string;
  'profile.approach': string;

  // Builder
  'builder.heading': string;
  'builder.subtitle': string;
  'builder.step.base': string;
  'builder.step.skills': string;
  'builder.step.intensity': string;
  'builder.step.communication': string;
  'builder.step.profile': string;
  'builder.random': string;
  'builder.reset': string;
  'builder.share': string;
  'builder.export': string;
  'builder.import': string;
  'builder.promptTitle': string;
  'builder.promptSubtitle': string;
  'builder.edit': string;
  'builder.viewMode': string;
  'builder.testLab': string;
  'builder.searchSkills': string;
  'builder.activeSkills': string;
  'builder.noSkills': string;
  'builder.addSkill': string;
  'builder.removeSkill': string;
  'builder.profileSummary': string;
  'builder.importConfig': string;
  'builder.importBtn': string;
  'builder.urlError': string;
  'builder.shareLink': string;
  'builder.shareCopied': string;

  // Compare
  'compare.heading': string;
  'compare.subtitle': string;
  'compare.addProfile': string;
  'compare.question': string;
  'compare.run': string;
  'compare.loading': string;
  'compare.noWinner': string;
  'compare.presets': string;
  'compare.clear': string;
  'compare.divergence': string;
  'compare.sideBySide': string;

  // Lab
  'lab.heading': string;
  'lab.subtitle': string;
  'lab.notice': string;
  'lab.question': string;
  'lab.ask': string;
  'lab.profile': string;
  'lab.approach': string;
  'lab.response': string;
  'lab.style': string;
  'lab.examples': string;

  // Shared
  'shared.copy': string;
  'shared.copied': string;
  'shared.download': string;
  'shared.reset': string;
  'shared.close': string;
  'shared.save': string;
  'shared.loading': string;
  'shared.error': string;
  'shared.success': string;
  'shared.tokens': string;
  'shared.chars': string;
  'shared.copyLink': string;
  'shared.linkCopied': string;

  // 404
  '404.title': string;
  '404.body': string;
  '404.home': string;
  '404.explore': string;
  '404.builder': string;

  // Footer
  'footer.explore': string;
  'footer.tools': string;
  'footer.disclaimer': string;
  'footer.copyright': string;

  // Language picker
  'lang.choose': string;
}
