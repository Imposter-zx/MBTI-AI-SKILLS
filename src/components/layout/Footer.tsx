import { Brain, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GithubIcon } from '../shared/GithubIcon';
import { useI18n } from '../../i18n';

export function Footer() {
  const { t } = useI18n();

  const links = [
    ['/', 'Home'],
    ['/types', t('nav.types')],
    ['/compare', t('nav.compare')],
    ['/builder', t('nav.builder')],
    ['/lab', t('nav.lab')],
  ] as const;

  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-6 h-6 text-cyan-400" />
              <span className="font-bold gradient-text">MBTI AI Skills</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              {t('footer.disclaimer')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
              {t('footer.explore')}
            </h3>
            <div className="flex flex-col gap-2">
              {links.map(([to, label]) => (
                <Link key={to} to={to} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
              {t('home.disclaimer.title')}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              {t('home.disclaimer.body')}
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">{t('footer.copyright')}</p>
          <a
            href="https://github.com/Imposter-zx/MBTI-AI-SKILLS"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            {t('nav.github')}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
