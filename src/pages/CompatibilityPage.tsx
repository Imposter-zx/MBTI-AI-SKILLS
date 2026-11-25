import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Compass,
  Info,
  Search,
  Terminal,
  Wrench,
} from 'lucide-react';
import { compatibilityEntries } from '../data/compatibility';
import { GlowCard } from '../components/shared/GlowCard';
import { Badge } from '../components/shared/Badge';
import type { CompatibilitySupportLevel } from '../types';

type SupportFilter = 'all' | CompatibilitySupportLevel;

const SUPPORT_FILTERS: Array<{ id: SupportFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'native', label: 'Native' },
  { id: 'tool-specific', label: 'Tool-Specific' },
  { id: 'manual', label: 'Manual' },
  { id: 'unverified', label: 'Unverified' },
];

const SUPPORT_LEVEL_META: Record<
  CompatibilitySupportLevel,
  { label: string; color: 'green' | 'amber' | 'cyan' | 'rose' }
> = {
  native: { label: 'Native Support', color: 'green' },
  'tool-specific': { label: 'Tool-Specific', color: 'amber' },
  manual: { label: 'Manual Usage', color: 'cyan' },
  unverified: { label: 'Unverified', color: 'rose' },
};

export function CompatibilityPage() {
  const [search, setSearch] = useState('');
  const [supportFilter, setSupportFilter] = useState<SupportFilter>('all');

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    return compatibilityEntries.filter((entry) => {
      const matchesSupport =
        supportFilter === 'all' || entry.supportLevel === supportFilter;
      if (!matchesSupport) return false;
      if (!query) return true;

      return (
        entry.tool.toLowerCase().includes(query) ||
        entry.category.toLowerCase().includes(query) ||
        entry.summary.toLowerCase().includes(query) ||
        entry.details.toLowerCase().includes(query)
      );
    });
  }, [search, supportFilter]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Skills Library
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
            <Compass className="w-3.5 h-3.5" />
            Tool Integration &amp; Verification Status
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
            <span className="gradient-text">Compatibility &amp; Installation Guide</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl">
            How to use exported <code className="text-cyan-300 font-mono">SKILL.md</code> files
            and Cognitive Profiles across AI assistants and coding tools, with transparent
            verification status.
          </p>
        </div>

        {/* General Installation Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <GlowCard color="cyan" className="p-6" hover={false}>
            <div className="flex items-center gap-2.5 mb-3">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-slate-100">
                Method 1: Native Skill Support
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              Some AI coding tools and agent runtimes support discovering{' '}
              <code className="text-cyan-300 font-mono">SKILL.md</code> directories automatically
              from a configured workspace or global skills folder.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Extract the downloaded Skill ZIP into its named folder.</li>
              <li>
                Place the folder in your tool&apos;s documented skills directory (paths differ by
                tool and version).
              </li>
              <li>
                Where auto-discovery is marked{' '}
                <strong className="text-rose-300">Compatibility not verified</strong> below, check
                your tool&apos;s official docs before relying on automatic loading.
              </li>
            </ul>
          </GlowCard>

          <GlowCard color="purple" className="p-6" hover={false}>
            <div className="flex items-center gap-2.5 mb-3">
              <Wrench className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-slate-100">
                Method 2: Manual Usage
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              You can copy the Markdown instructions from any{' '}
              <code className="text-purple-300 font-mono">SKILL.md</code> or Cognitive Profile and
              paste them into a System Prompt, Custom Instructions, Gem, Custom GPT, or Claude
              Project.
            </p>
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 p-3 text-xs text-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Important distinction:</strong> Manual pasting is{' '}
                <strong>not equivalent to native Skill integration</strong>. Native integration
                handles automatic discovery and metadata parsing, whereas manual usage relies on
                you supplying the Markdown text in context.
              </span>
            </div>
          </GlowCard>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tools by name, category, or notes..."
              aria-label="Search compatibility entries"
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/40"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {SUPPORT_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSupportFilter(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  supportFilter === filter.id
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-white/6'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compatibility Entries */}
        {filteredEntries.length === 0 ? (
          <GlowCard className="p-10 text-center text-slate-500" hover={false}>
            No tools matched your search or support-level filter.
          </GlowCard>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => {
              const levelMeta = SUPPORT_LEVEL_META[entry.supportLevel];
              const isUnverified = !entry.verified || entry.supportLevel === 'unverified';

              return (
                <GlowCard
                  key={entry.id}
                  color={isUnverified ? 'amber' : levelMeta.color}
                  className="p-6"
                  hover={false}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-1">
                        <h3 className="text-lg font-semibold text-slate-100">{entry.tool}</h3>
                        <Badge color={levelMeta.color} size="sm">
                          {levelMeta.label}
                        </Badge>
                        {isUnverified ? (
                          <Badge color="rose" size="sm">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Compatibility not verified
                          </Badge>
                        ) : (
                          <Badge color="green" size="sm">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verified (Manual Markdown)
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{entry.category}</p>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-slate-200 mb-2">{entry.summary}</p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{entry.details}</p>

                  {entry.steps.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Usage Steps
                      </h4>
                      <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                        {entry.steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {entry.notes && (
                    <div className="mt-3 pt-3 border-t border-white/6 text-xs text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{entry.notes}</span>
                    </div>
                  )}
                </GlowCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
