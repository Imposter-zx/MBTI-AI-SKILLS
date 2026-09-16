import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, X, ArrowRight, Loader2, Shuffle, BookOpen } from 'lucide-react';
import { mbtiProfiles } from '../data/mbtiProfiles';
import { exampleProblems } from '../data/exampleProblems';
import { useAppStore } from '../store/useAppStore';
import { generateComparisonPanels } from '../engine/responseSimulator';
import { Button } from '../components/shared/Button';
import { GlowCard } from '../components/shared/GlowCard';
import { Badge } from '../components/shared/Badge';
import { skillsById } from '../data/skills';
import type { MBTITypeCode } from '../types';

const categoryColors: Record<string, 'cyan' | 'purple' | 'amber' | 'green'> = {
  Analysts: 'cyan',
  Diplomats: 'purple',
  Sentinels: 'amber',
  Explorers: 'green',
};

export function ComparePage() {
  const {
    selectedComparisons,
    compareQuestion,
    addComparison,
    removeComparison,
    clearComparisons,
    setCompareQuestion,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [panels, setPanels] = useState<ReturnType<typeof generateComparisonPanels>>([]);
  const [activeTab, setActiveTab] = useState<'responses' | 'matrix'>('responses');
  const [showExamples, setShowExamples] = useState(false);

  // Parse URL params for pre-selected types
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const types = params.get('types');
    if (types) {
      types.split(',').forEach((t) => {
        const upper = t.toUpperCase() as MBTITypeCode;
        if (mbtiProfiles.find((p) => p.type === upper)) {
          addComparison(upper);
        }
      });
    }
  }, []);

  const handleCompare = () => {
    if (!compareQuestion.trim() || selectedComparisons.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      const result = generateComparisonPanels(selectedComparisons, compareQuestion);
      setPanels(result);
      setLoading(false);
    }, 600);
  };

  const handleRandomSelection = () => {
    clearComparisons();
    const shuffled = [...mbtiProfiles].sort(() => Math.random() - 0.5).slice(0, 4);
    shuffled.forEach((p) => addComparison(p.type));
  };

  const colSpan = selectedComparisons.length === 1 ? 'grid-cols-1' :
    selectedComparisons.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
    selectedComparisons.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">
            <span className="gradient-text">Compare</span> AI Profiles
          </h1>
          <p className="text-slate-500">
            See how different cognitive configurations approach the same problem. Select up to 4 profiles,
            enter a problem, and compare approaches side-by-side.
          </p>
        </div>

        {/* Configuration panel */}
        <GlowCard className="p-6 mb-8">
          {/* Profile selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-300">
                Select Profiles to Compare{' '}
                <span className="text-slate-600 font-normal">({selectedComparisons.length}/4)</span>
              </h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleRandomSelection}>
                  <Shuffle className="w-3.5 h-3.5" />
                  Random
                </Button>
                {selectedComparisons.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearComparisons}>
                    <X className="w-3.5 h-3.5" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Selected chips */}
            {selectedComparisons.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedComparisons.map((type) => {
                  const profile = mbtiProfiles.find((p) => p.type === type);
                  return (
                    <div
                      key={type}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm"
                    >
                      <span className="font-bold">{type}</span>
                      <span className="text-cyan-500 text-xs">{profile?.name}</span>
                      <button
                        onClick={() => removeComparison(type)}
                        className="ml-1 text-cyan-500 hover:text-cyan-300 transition-colors"
                        aria-label={`Remove ${type}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Profile grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-1.5">
              {mbtiProfiles.map((profile) => {
                const selected = selectedComparisons.includes(profile.type);
                const disabled = !selected && selectedComparisons.length >= 4;
                return (
                  <button
                    key={profile.type}
                    onClick={() => selected ? removeComparison(profile.type) : addComparison(profile.type)}
                    disabled={disabled}
                    className={`px-2 py-2 rounded-lg text-xs font-bold transition-all text-center ${
                      selected
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : disabled
                        ? 'bg-white/2 text-slate-700 border border-transparent cursor-not-allowed'
                        : 'bg-white/4 text-slate-500 border border-white/6 hover:bg-white/8 hover:text-slate-300'
                    }`}
                    aria-pressed={selected}
                    aria-label={`${selected ? 'Remove' : 'Add'} ${profile.type}`}
                  >
                    {profile.type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problem input */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-300">Your Problem or Question</label>
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {showExamples ? 'Hide' : 'Show'} examples
              </button>
            </div>

            <AnimatePresence>
              {showExamples && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3 overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-white/3 border border-white/6">
                    {exampleProblems.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCompareQuestion(p.description);
                          setShowExamples(false);
                        }}
                        className="text-xs px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/6 hover:text-slate-200 hover:bg-white/10 transition-all"
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <textarea
              value={compareQuestion}
              onChange={(e) => setCompareQuestion(e.target.value)}
              placeholder="e.g. My application keeps crashing randomly. How should I debug it?"
              rows={3}
              className="w-full rounded-lg bg-white/5 border border-white/8 text-slate-300 placeholder-slate-600 text-sm p-3 focus:outline-none focus:border-cyan-500/40 resize-none transition-all"
              aria-label="Problem to compare"
            />
          </div>

          <Button
            onClick={handleCompare}
            disabled={!compareQuestion.trim() || selectedComparisons.length === 0 || loading}
            size="lg"
            fullWidth
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating Comparison...</>
            ) : (
              <><GitCompare className="w-5 h-5" /> Compare Profiles</>
            )}
          </Button>
        </GlowCard>

        {/* Results */}
        <AnimatePresence>
          {panels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Tab switch */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('responses')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'responses' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                >
                  Responses
                </button>
                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'matrix' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                >
                  Comparison Matrix
                </button>
              </div>

              {activeTab === 'responses' && (
                <div className={`grid ${colSpan} gap-4`}>
                  {panels.map((panel, i) => {
                    const profile = mbtiProfiles.find((p) => p.type === panel.type);
                    const catColor = categoryColors[profile?.category || ''] || 'cyan';
                    return (
                      <motion.div
                        key={panel.type}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                      >
                        <GlowCard color={catColor} className="p-5 h-full flex flex-col">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div
                                className="text-2xl font-black bg-clip-text text-transparent mb-0.5"
                                style={{ backgroundImage: profile?.gradient }}
                              >
                                {panel.type}
                              </div>
                              <div className="text-sm text-slate-400">{panel.name}</div>
                            </div>
                            <Badge color={catColor} size="sm">{profile?.category}</Badge>
                          </div>

                          {/* Approach steps */}
                          <div className="mb-4">
                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                              Approach
                            </div>
                            <div className="flex flex-col gap-1.5">
                              {panel.approach.map((step, si) => (
                                <div key={si} className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/8 text-[10px] text-slate-500 flex items-center justify-center flex-shrink-0">
                                    {si + 1}
                                  </div>
                                  <span className="text-xs text-slate-400">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Simulated response */}
                          <div className="flex-1">
                            <div className="text-xs text-cyan-500 font-semibold uppercase tracking-wider mb-2">
                              {panel.type}-Inspired Response
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">{panel.response}</p>
                          </div>

                          {/* View full profile link */}
                          <div className="mt-4 pt-4 border-t border-white/5">
                            <a
                              href={`${import.meta.env.BASE_URL}types/${panel.type.toLowerCase()}`.replace('//', '/')}
                              className="flex items-center gap-1 text-xs text-slate-600 hover:text-cyan-400 transition-colors"
                            >
                              View full profile <ArrowRight className="w-3 h-3" />
                            </a>
                          </div>
                        </GlowCard>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'matrix' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="text-left py-3 px-4 text-slate-500 font-medium w-32">Dimension</th>
                        {panels.map((p) => {
                          const profile = mbtiProfiles.find((pr) => pr.type === p.type);
                          return (
                            <th key={p.type} className="text-left py-3 px-4 text-slate-300 font-semibold">
                              <div
                                className="text-lg font-black bg-clip-text text-transparent mb-0.5"
                                style={{ backgroundImage: profile?.gradient }}
                              >
                                {p.type}
                              </div>
                              <div className="text-xs text-slate-500 font-normal">{p.name}</div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Cognitive Style', key: 'cognitiveStyle' as const },
                        { label: 'Communication', key: 'communicationStyle' as const },
                        { label: 'Problem-Solving', key: 'problemSolvingStyle' as const },
                        { label: 'Decision Pattern', key: 'decisionStyle' as const },
                      ].map((row) => (
                        <tr key={row.key} className="border-b border-white/4">
                          <td className="py-4 px-4 text-xs text-slate-500 font-medium align-top">{row.label}</td>
                          {panels.map((p) => {
                            const profile = mbtiProfiles.find((pr) => pr.type === p.type);
                            return (
                              <td key={p.type} className="py-4 px-4 text-xs text-slate-400 align-top leading-relaxed">
                                {profile?.[row.key]}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      <tr>
                        <td className="py-4 px-4 text-xs text-slate-500 font-medium align-top">Main Skills</td>
                        {panels.map((p) => {
                          const profile = mbtiProfiles.find((pr) => pr.type === p.type);
                          return (
                            <td key={p.type} className="py-4 px-4 align-top">
                              <div className="flex flex-wrap gap-1">
                                {profile?.recommendedSkills.map((sid) => {
                                  const skill = skillsById[sid];
                                  return skill ? (
                                    <span key={sid} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-500">
                                      {skill.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <p className="text-xs text-slate-600 text-center mt-6">
                These responses are AI simulations based on profile configurations — not claims about individual people with these MBTI types.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
