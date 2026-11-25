import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Check,
  Compass,
  Copy,
  Download,
  ExternalLink,
  FileText,
  FlaskConical,
  Heart,
  Layers,
  Lightbulb,
  ListChecks,
  Map,
  MessageSquare,
  Package,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { skills, skillsById } from '../data/skills';
import {
  buildAllSkillsZip,
  buildSkillPackZip,
  buildSkillZip,
  downloadBlob,
  downloadTextFile,
  generateSkillMarkdown,
  generateSkillPackMarkdown,
  getMbtiSkillPacks,
} from '../engine/skillExporter';
import { GlowCard } from '../components/shared/GlowCard';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import type { MBTICategory, Skill, SkillId } from '../types';

type SkillCategoryFilter =
  | 'All'
  | 'Analytical'
  | 'Practical'
  | 'Creative'
  | 'Strategic'
  | 'Communication'
  | 'Research'
  | 'Problem-solving';

type SortOption = 'name-asc' | 'compatible-desc';
type ViewSection = 'all' | 'skills' | 'packs';

const SKILL_CATEGORIES: SkillCategoryFilter[] = [
  'All',
  'Analytical',
  'Practical',
  'Creative',
  'Strategic',
  'Communication',
  'Research',
  'Problem-solving',
];

const SKILL_CATEGORY_MAP: Record<SkillId, Exclude<SkillCategoryFilter, 'All'>[]> = {
  analytical: ['Analytical', 'Problem-solving'],
  tactical: ['Practical', 'Problem-solving'],
  strategic: ['Strategic'],
  brainstorming: ['Creative', 'Problem-solving'],
  troubleshooting: ['Practical', 'Problem-solving'],
  creative: ['Creative'],
  empathy: ['Communication'],
  structured: ['Practical', 'Analytical'],
  experimental: ['Research', 'Analytical'],
  debate: ['Communication', 'Analytical'],
  optimization: ['Strategic', 'Practical'],
  research: ['Research', 'Analytical'],
};

const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Target,
  Map,
  Lightbulb,
  Wrench,
  Sparkles,
  Heart,
  ListChecks,
  FlaskConical,
  MessageSquare,
  TrendingUp,
  BookOpen,
};

const PACK_CATEGORY_COLORS: Record<MBTICategory, 'cyan' | 'purple' | 'amber' | 'green'> = {
  Analysts: 'cyan',
  Diplomats: 'purple',
  Sentinels: 'amber',
  Explorers: 'green',
};

function toGlowColor(color: string): 'cyan' | 'purple' | 'green' | 'amber' | 'rose' {
  if (color === 'purple' || color === 'green' || color === 'amber' || color === 'rose') {
    return color;
  }
  return 'cyan';
}

export function SkillsLibraryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SkillCategoryFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [viewSection, setViewSection] = useState<ViewSection>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const packs = useMemo(() => getMbtiSkillPacks(), []);

  const filteredSkills = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = skills.filter((skill) => {
      const matchesCategory =
        activeCategory === 'All' ||
        (SKILL_CATEGORY_MAP[skill.id] ?? []).includes(activeCategory);

      if (!matchesCategory) return false;
      if (!query) return true;

      return (
        skill.name.toLowerCase().includes(query) ||
        skill.id.toLowerCase().includes(query) ||
        skill.shortDescription.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'compatible-desc') {
        const diff = b.compatibleProfiles.length - a.compatibleProfiles.length;
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });
  }, [search, activeCategory, sortBy]);

  const filteredPacks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return packs;
    return packs.filter(
      (pack) =>
        pack.type.toLowerCase().includes(query) ||
        pack.name.toLowerCase().includes(query) ||
        pack.tagline.toLowerCase().includes(query) ||
        pack.category.toLowerCase().includes(query) ||
        pack.skills.some((sid) => sid.toLowerCase().includes(query))
    );
  }, [packs, search]);

  async function handleCopy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(key);
      setTimeout(() => {
        setCopiedId((prev) => (prev === key ? null : prev));
      }, 2000);
    } catch {
      // Clipboard API unavailable
    }
  }

  async function handleDownloadAllZip() {
    setDownloadingAll(true);
    try {
      const blob = await buildAllSkillsZip();
      downloadBlob('mbti-ai-skills-library.zip', blob);
    } finally {
      setDownloadingAll(false);
    }
  }

  async function handleDownloadSkillZip(skill: Skill) {
    setDownloadingId(`zip-${skill.id}`);
    try {
      const blob = await buildSkillZip(skill);
      downloadBlob(`${skill.id}-skill.zip`, blob);
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDownloadPackZip(type: (typeof packs)[number]['type']) {
    const key = `pack-zip-${type}`;
    setDownloadingId(key);
    try {
      const blob = await buildSkillPackZip(type);
      downloadBlob(`${type.toLowerCase()}-skill-pack.zip`, blob);
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
              <Layers className="w-3.5 h-3.5" />
              Portable SKILL.md Modules
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
              <span className="gradient-text">Universal AI Skills Library</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
              Explore, download, combine and use portable AI Skills across compatible AI tools.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadAllZip}
              disabled={downloadingAll}
            >
              <Download className="w-4 h-4" />
              {downloadingAll ? 'Preparing ZIP...' : 'Download All Skills'}
            </Button>
            <Link to="/skills/custom">
              <Button variant="secondary" size="md">
                <Plus className="w-4 h-4" />
                Create Custom Skill
              </Button>
            </Link>
            <Link to="/docs/compatibility">
              <Button variant="ghost" size="md">
                <Compass className="w-4 h-4" />
                Compatibility Guide
              </Button>
            </Link>
          </div>
        </div>

        {/* Section Switcher + Search + Sort */}
        <div className="glass rounded-xl p-4 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills, tags, or MBTI packs..."
                aria-label="Search skills and packs"
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/8 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* View Toggle */}
              <div className="inline-flex rounded-lg bg-white/5 p-1 border border-white/8">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'skills', label: `Skills (${skills.length})` },
                    { id: 'packs', label: `16 MBTI Packs` },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setViewSection(tab.id)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      viewSection === tab.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort skills"
                className="px-3 py-2 rounded-lg bg-[#0d1421] border border-white/10 text-slate-300 text-sm focus:outline-none focus:border-cyan-500/40"
              >
                <option value="name-asc">Sort: Name A-Z</option>
                <option value="compatible-desc">Sort: Most Compatible Profiles</option>
              </select>
            </div>
          </div>

          {/* Category filter pills */}
          {viewSection !== 'packs' && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SKILL_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-white/6'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 12 Individual Skills */}
        {viewSection !== 'packs' && (
          <section className="mb-16" aria-labelledby="individual-skills-heading">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 id="individual-skills-heading" className="text-xl font-semibold text-slate-100">
                  Core Cognitive Skills ({filteredSkills.length})
                </h2>
                <p className="text-sm text-slate-500">
                  Standalone behavioral modules ready to copy as SKILL.md or download as ZIP packages.
                </p>
              </div>
            </div>

            {filteredSkills.length === 0 ? (
              <GlowCard className="p-10 text-center text-slate-500" hover={false}>
                No skills matched your current search or category filter.
              </GlowCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSkills.map((skill, idx) => {
                  const Icon = ICON_MAP[skill.icon] ?? Brain;
                  const glowColor = toGlowColor(skill.color);
                  const isCopied = copiedId === `skill-${skill.id}`;
                  const isZipLoading = downloadingId === `zip-${skill.id}`;

                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.3 }}
                    >
                      <GlowCard color={glowColor} className="p-5 h-full flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-slate-100">
                                {skill.name}
                              </h3>
                              <span className="text-xs text-slate-500 font-mono">
                                {skill.id}
                              </span>
                            </div>
                          </div>
                          <Badge color={glowColor} size="sm">
                            {skill.compatibleProfiles.length} profiles
                          </Badge>
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
                          {skill.shortDescription}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {skill.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/8"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-white/6 flex flex-wrap items-center gap-2">
                          <Link to={`/skills/${skill.id}`} className="flex-1 min-w-[110px]">
                            <Button variant="secondary" size="sm" fullWidth>
                              <ExternalLink className="w-3.5 h-3.5" />
                              Preview / Details
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCopy(`skill-${skill.id}`, generateSkillMarkdown(skill))
                            }
                            title="Copy SKILL.md"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-400" />
                                <span className="text-green-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy SKILL.md
                              </>
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              downloadTextFile(
                                `${skill.id}-SKILL.md`,
                                generateSkillMarkdown(skill)
                              )
                            }
                            title="Download SKILL.md"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            .md
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadSkillZip(skill)}
                            disabled={isZipLoading}
                            title="Download Skill ZIP"
                          >
                            <Download className="w-3.5 h-3.5" />
                            {isZipLoading ? '...' : 'ZIP'}
                          </Button>
                        </div>
                      </GlowCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* 16 MBTI Skill Packs */}
        {viewSection !== 'skills' && (
          <section id="mbti-packs" aria-labelledby="mbti-packs-heading">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-purple-400" />
                <h2 id="mbti-packs-heading" className="text-xl font-semibold text-slate-100">
                  16 MBTI Skill Packs ({filteredPacks.length})
                </h2>
                <Badge color="purple" size="sm">
                  Experimental Configurations
                </Badge>
              </div>
              <p className="text-sm text-slate-400 max-w-3xl">
                Curated multi-skill bundles inspired by MBTI cognitive preferences. These packs are
                experimental AI interaction configurations designed for workflow experimentation, not
                fixed psychological facts or personality diagnoses.
              </p>
            </div>

            {filteredPacks.length === 0 ? (
              <GlowCard className="p-10 text-center text-slate-500" hover={false}>
                No MBTI Skill Packs matched your search.
              </GlowCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPacks.map((pack) => {
                  const badgeColor = PACK_CATEGORY_COLORS[pack.category];
                  const isCopied = copiedId === `pack-${pack.type}`;
                  const isZipLoading = downloadingId === `pack-zip-${pack.type}`;

                  return (
                    <GlowCard key={pack.type} color={badgeColor} className="p-5 flex flex-col">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-bold text-slate-100">
                              {pack.type}
                            </span>
                            <Badge color={badgeColor} size="sm">
                              {pack.category}
                            </Badge>
                          </div>
                          <h3 className="text-sm font-semibold text-slate-200">
                            {pack.name}
                          </h3>
                          <p className="text-xs text-slate-500">{pack.tagline}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
                        {pack.description}
                      </p>

                      {/* Recommended skill pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {pack.skills.map((skillId) => {
                          const skill = skillsById[skillId];
                          return (
                            <Link
                              key={skillId}
                              to={`/skills/${skillId}`}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-colors"
                            >
                              {skill?.name ?? skillId}
                            </Link>
                          );
                        })}
                      </div>

                      {/* Pack Actions */}
                      <div className="pt-3 border-t border-white/6 flex flex-wrap items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            handleCopy(`pack-${pack.type}`, generateSkillPackMarkdown(pack.type))
                          }
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-400" />
                              <span className="text-green-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Pack
                            </>
                          )}
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleDownloadPackZip(pack.type)}
                          disabled={isZipLoading}
                        >
                          <Download className="w-3.5 h-3.5" />
                          {isZipLoading ? 'Building ZIP...' : 'Download Pack ZIP'}
                        </Button>
                      </div>
                    </GlowCard>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
