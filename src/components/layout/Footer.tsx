import { Brain, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GithubIcon } from '../shared/GithubIcon';

export function Footer() {
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
              An experimental framework for exploring AI interaction styles inspired by cognitive
              preferences. Not a psychological tool.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Explore</h3>
            <div className="flex flex-col gap-2">
              {([['/', 'Home'], ['/types', 'All 16 Types'], ['/compare', 'Compare Profiles'], ['/builder', 'AI Mind Builder'], ['/lab', 'Test Lab']] as const).map(
                ([to, label]) => (
                  <Link key={to} to={to} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                    {label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Disclaimer</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              MBTI AI Skills is an experimental framework for exploring AI interaction styles. MBTI
              should not be treated as a scientifically validated measure of intelligence, personality
              capability, or professional aptitude. The profiles in this project are configurable design
              patterns, not psychological diagnoses.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">© 2025 MBTI AI Skills. Open Source under MIT License.</p>
          <a
            href="https://github.com/mbti-ai-skills/mbti-ai-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            View on GitHub
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
