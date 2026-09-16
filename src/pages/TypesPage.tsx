import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { mbtiProfiles } from '../data/mbtiProfiles';
import { skillsById } from '../data/skills';
import { GlowCard } from '../components/shared/GlowCard';
import { Badge } from '../components/shared/Badge';
import type { MBTICategory } from '../types';

const categoryColors: Record<MBTICategory, 'cyan' | 'purple' | 'amber' | 'green'> = {
  Analysts: 'cyan',
  Diplomats: 'purple',
  Sentinels: 'amber',
  Explorers: 'green',
};

const categoryDescriptions: Record<MBTICategory, string> = {
  Analysts: 'Logic-driven profiles that prioritize rational analysis, systems thinking, and intellectual rigor.',
  Diplomats: 'Values-oriented profiles that emphasize empathy, meaning, and human-centered problem solving.',
  Sentinels: 'Structure-oriented profiles that excel at reliability, process, and systematic execution.',
  Explorers: 'Action-oriented profiles that thrive on experimentation, adaptation, and hands-on problem solving.',
};

export function TypesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MBTICategory | 'All'>('All');

  const categories: Array<MBTICategory | 'All'> = ['All', 'Analysts', 'Diplomats', 'Sentinels', 'Explorers'];

  const filtered = mbtiProfiles.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      search === '' ||
      p.type.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const grouped = categories
    .filter((c) => c !== 'All')
    .map((cat) => ({
      category: cat as MBTICategory,
      profiles: filtered.filter((p) => p.category === cat),
    }))
    .filter((g) => (activeCategory === 'All' ? g.profiles.length > 0 : g.category === activeCategory));

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-100 mb-3">
            Explore <span className="gradient-text">16 AI Profiles</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Each profile is an experimental AI interaction style inspired by MBTI cognitive
            preferences. Not personality science — configurable design patterns.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search profiles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/8 transition-all"
              aria-label="Search profiles"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Profile groups */}
        {grouped.map(({ category, profiles }) => (
          <div key={category} className="mb-12">
            <div className="flex items-start gap-3 mb-6">
              <Badge color={categoryColors[category]} size="md">{category}</Badge>
              <p className="text-sm text-slate-500 max-w-lg pt-0.5">
                {categoryDescriptions[category]}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {profiles.map((profile, i) => (
                <motion.div
                  key={profile.type}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/types/${profile.type.toLowerCase()}`} className="block h-full group">
                    <GlowCard color={categoryColors[category]} className="p-5 h-full flex flex-col">
                      {/* Type code */}
                      <div
                        className="text-3xl font-black mb-1 bg-clip-text text-transparent"
                        style={{ backgroundImage: profile.gradient }}
                      >
                        {profile.type}
                      </div>

                      {/* Name + tagline */}
                      <div className="mb-3">
                        <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {profile.name}
                        </div>
                        <div className="text-xs text-slate-500">{profile.tagline}</div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
                        {profile.description.slice(0, 100)}...
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {profile.recommendedSkills.slice(0, 3).map((sid) => {
                          const skill = skillsById[sid];
                          return skill ? (
                            <span
                              key={sid}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/6"
                            >
                              {skill.name}
                            </span>
                          ) : null;
                        })}
                      </div>

                      {/* View button */}
                      <div className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
                        View Profile
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </GlowCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-600">
            No profiles match your search.
          </div>
        )}
      </div>
    </div>
  );
}
