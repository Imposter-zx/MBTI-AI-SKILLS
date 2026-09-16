import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  GitCompare,
  Wrench,
  FlaskConical,
  Shuffle,
  ArrowRight,
  Sparkles,
  Layers,
  Zap,
} from 'lucide-react';
import { mbtiProfiles } from '../data/mbtiProfiles';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/shared/Button';
import { GlowCard } from '../components/shared/GlowCard';
import { Badge } from '../components/shared/Badge';
import { skillsById } from '../data/skills';

const categories = ['Analysts', 'Diplomats', 'Sentinels', 'Explorers'];

const categoryColors: Record<string, 'cyan' | 'purple' | 'amber' | 'green'> = {
  Analysts: 'cyan',
  Diplomats: 'purple',
  Sentinels: 'amber',
  Explorers: 'green',
};

const features = [
  {
    icon: Brain,
    title: '16 AI Profiles',
    description: 'Explore all 16 MBTI-inspired cognitive interaction styles, each with unique Skills and behaviors.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    link: '/types',
  },
  {
    icon: Layers,
    title: '12 Modular Skills',
    description: 'Compose reusable cognitive Skills — Analytical, Tactical, Creative, Strategic and more.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    link: '/builder',
  },
  {
    icon: GitCompare,
    title: 'Compare Profiles',
    description: 'See how different AI configurations approach the same problem side-by-side.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    link: '/compare',
  },
  {
    icon: Wrench,
    title: 'Build Your AI Mind',
    description: 'Combine a base profile with custom Skills and intensities to generate a system prompt.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    link: '/builder',
  },
];

const flow = [
  { label: 'MBTI Profile', icon: Brain },
  { label: 'Cognitive Style', icon: Sparkles },
  { label: 'AI Skills', icon: Layers },
  { label: 'Skill Intensity', icon: Zap },
  { label: 'System Prompt', icon: Wrench },
  { label: 'AI Behavior', icon: FlaskConical },
];

function SurpriseButton() {
  const { setBuilderBaseType, resetBuilder } = useAppStore();

  const handleSurprise = () => {
    const randomProfile = mbtiProfiles[Math.floor(Math.random() * mbtiProfiles.length)];
    resetBuilder();
    setBuilderBaseType(randomProfile.type);
    // Navigate to builder
    window.location.href = `${import.meta.env.BASE_URL}builder`.replace('//', '/');
  };

  return (
    <Button variant="secondary" size="lg" onClick={handleSurprise}>
      <Shuffle className="w-5 h-5" />
      Surprise Me
    </Button>
  );
}

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 grid-bg overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-medium mb-6">
              <Sparkles className="w-3 h-3" />
              Experimental AI Framework — v0.1
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="gradient-text">MBTI AI Skills</span>
            </h1>

            <p className="text-2xl sm:text-3xl text-slate-300 font-light mb-4">
              Build the way your AI thinks.
            </p>

            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Explore 16 AI interaction profiles, experiment with modular cognitive Skills, and build
              your own AI thinking configuration — all without writing a single line of code.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/types">
                <Button size="lg">
                  <Brain className="w-5 h-5" />
                  Explore 16 Types
                </Button>
              </Link>
              <Link to="/builder">
                <Button variant="secondary" size="lg">
                  <Wrench className="w-5 h-5" />
                  Build Your AI
                </Button>
              </Link>
              <Link to="/compare">
                <Button variant="ghost" size="lg">
                  <GitCompare className="w-5 h-5" />
                  Compare Profiles
                </Button>
              </Link>
              <SurpriseButton />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture flow */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-0">
            {flow.map((item, i) => (
              <div key={item.label} className="flex items-center gap-2 sm:gap-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-white/3 border border-white/6"
                >
                  <item.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs text-slate-400 text-center whitespace-nowrap">
                    {item.label}
                  </span>
                </motion.div>
                {i < flow.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-3">
              One framework. Four capabilities.
            </h2>
            <p className="text-slate-500">
              Everything you need to explore, compare, and build AI cognitive profiles.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Link to={feature.link}>
                  <GlowCard className="p-6 h-full group">
                    <div className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold text-slate-200 mb-2 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                  </GlowCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Profile preview grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-1">All 16 Profiles</h2>
              <p className="text-slate-500 text-sm">Choose your cognitive starting point.</p>
            </div>
            <Link to="/types">
              <Button variant="secondary" size="sm">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          {categories.map((cat) => (
            <div key={cat} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge color={categoryColors[cat]}>{cat}</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {mbtiProfiles
                  .filter((p) => p.category === cat)
                  .map((profile, i) => (
                    <motion.div
                      key={profile.type}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <Link to={`/types/${profile.type.toLowerCase()}`}>
                        <GlowCard
                          color={categoryColors[cat]}
                          className="p-4 group"
                        >
                          <div
                            className="text-2xl font-black mb-1 bg-clip-text text-transparent"
                            style={{ backgroundImage: profile.gradient }}
                          >
                            {profile.type}
                          </div>
                          <div className="text-xs text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                            {profile.name}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {profile.recommendedSkills.slice(0, 2).map((sid) => {
                              const skill = skillsById[sid];
                              return skill ? (
                                <span
                                  key={sid}
                                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-500"
                                >
                                  {skill.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </GlowCard>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <GlowCard className="p-6 border-amber-500/20 bg-amber-500/3">
            <div className="flex gap-3">
              <div className="text-amber-400 flex-shrink-0 mt-0.5">⚠</div>
              <div>
                <h3 className="text-sm font-semibold text-amber-400 mb-1">Research Disclaimer</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  MBTI AI Skills is an experimental framework for exploring AI interaction styles.
                  MBTI should not be treated as a scientifically validated measure of intelligence,
                  personality capability, or professional aptitude. The profiles in this project are
                  configurable design patterns, not psychological diagnoses.
                </p>
              </div>
            </div>
          </GlowCard>
        </div>
      </section>
    </div>
  );
}
