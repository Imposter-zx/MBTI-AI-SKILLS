import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { GithubIcon } from '../shared/GithubIcon';

const navLinks = [
  { to: '/types', label: 'Explore Types' },
  { to: '/compare', label: 'Compare' },
  { to: '/builder', label: 'AI Mind Builder' },
  { to: '/lab', label: 'Test Lab' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
        >
          <div className="relative">
            <Brain className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <div className="absolute inset-0 blur-md bg-cyan-400/30 group-hover:bg-cyan-400/50 transition-all rounded-full" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">
            <span className="gradient-text">MBTI</span>
            <span className="text-slate-300"> AI Skills</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === link.to || pathname.startsWith(link.to + '/')
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* GitHub button + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/mbti-ai-skills/mbti-ai-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all border border-white/5 hover:border-white/10"
            aria-label="View on GitHub"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden lg:inline">GitHub</span>
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    pathname === link.to || pathname.startsWith(link.to + '/')
                      ? 'bg-cyan-500/10 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://github.com/mbti-ai-skills/mbti-ai-skills"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
