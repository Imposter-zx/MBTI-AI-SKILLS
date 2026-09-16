import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, X, Loader2, Shuffle, BookOpen, Layers, Sparkles } from 'lucide-react';
import { mbtiProfiles } from '../data/mbtiProfiles';
import { exampleProblems } from '../data/exampleProblems';
import { useAppStore } from '../store/useAppStore';
import { generateCognitiveComparisonPanels } from '../engine/responseSimulator';
import { Button } from '../components/shared/Button';
import { GlowCard } from '../components/shared/GlowCard';
import { Badge } from '../components/shared/Badge';
import type { MBTITypeCode, ComparisonTarget, ComparisonPanel } from '../types';

const categoryColors: Record<string, 'cyan' | 'purple' | 'amber' | 'green'> = {
  Analysts: 'cyan',
  Diplomats: 'purple',
  Sentinels: 'amber',
  Explorers: 'green',
};

// Preset cognitive profile showdowns
const presetShowdowns: Array<{ name: string; targets: ComparisonTarget[] }> = [
  {
    name: 'Deep Debugging Showdown',
    targets: [
      {
        id: 'p-istp',
        label: 'ISTP Tactical Debugger',
        isCustom: true,
        baseType: 'ISTP',
        skills: [
          { skillId: 'tactical', intensity: 95 },
          { skillId: 'troubleshooting', intensity: 90 },
        ],
        communicationStyle: 'Direct',
      },
      {
        id: 'p-intp',
        label: 'INTP Logic Investigator',
        isCustom: true,
        baseType: 'INTP',
        skills: [
          { skillId: 'analytical', intensity: 95 },
          { skillId: 'research', intensity: 85 },
        ],
        communicationStyle: 'Technical',
      },
      {
        id: 'p-entp',
        label: 'ENTP Contrarian Explorer',
        isCustom: true,
        baseType: 'ENTP',
        skills: [
          { skillId: 'brainstorming', intensity: 90 },
          { skillId: 'debate', intensity: 85 },
        ],
        communicationStyle: 'Exploratory',
      },
      {
        id: 'p-intj',
        label: 'INTJ Systems Architect',
        isCustom: true,
        baseType: 'INTJ',
        skills: [
          { skillId: 'strategic', intensity: 95 },
          { skillId: 'optimization', intensity: 85 },
        ],
        communicationStyle: 'Concise',
      },
    ],
  },
  {
    name: 'Strategic Innovation Showdown',
    targets: [
      {
        id: 'p-entj',
        label: 'ENTJ Executive Commander',
        isCustom: true,
        baseType: 'ENTJ',
        skills: [
          { skillId: 'strategic', intensity: 95 },
          { skillId: 'optimization', intensity: 90 },
        ],
        communicationStyle: 'Direct',
      },
      {
        id: 'p-enfp',
        label: 'ENFP Creative Synthesizer',
        isCustom: true,
        baseType: 'ENFP',
        skills: [
          { skillId: 'creative', intensity: 95 },
          { skillId: 'brainstorming', intensity: 90 },
        ],
        communicationStyle: 'Exploratory',
      },
      {
        id: 'p-infj',
        label: 'INFJ Purpose Aligner',
        isCustom: true,
        baseType: 'INFJ',
        skills: [
          { skillId: 'empathy', intensity: 90 },
          { skillId: 'strategic', intensity: 85 },
        ],
        communicationStyle: 'Balanced',
      },
      {
        id: 'p-estp',
        label: 'ESTP Rapid Prototyper',
        isCustom: true,
        baseType: 'ESTP',
        skills: [
          { skillId: 'tactical', intensity: 95 },
          { skillId: 'experimental', intensity: 85 },
        ],
        communicationStyle: 'Concise',
      },
    ],
  },
];

export function ComparePage() {
  const {
    selectedComparisons,
    compareQuestion,
    savedProfiles,
    addComparison,
    removeComparison,
    clearComparisons,
    setCompareQuestion,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [panels, setPanels] = useState<ComparisonPanel[]>([]);
  const [activeTab, setActiveTab] = useState<'responses' | 'matrix'>('responses');
  const [showExamples, setShowExamples] = useState(false);
  const [customTargets, setCustomTargets] = useState<ComparisonTarget[]>([]);

  // Parse URL params for pre-selected types
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const types = params.get('types');
    if (types) {
      types.split(',').forEach((t) => {
        const upper = t.toUpperCase();
        if (mbtiProfiles.find((p) => p.type === upper)) {
          addComparison(upper);
        }
      });
    }
  }, []);

  // Build target list from selectedComparisons
  const resolvedTargets: ComparisonTarget[] = selectedComparisons.map((id) => {
    // Check if custom target exists
    const custom = customTargets.find((c) => c.id === id);
    if (custom) return custom;

    // Check if saved profile
    const saved = savedProfiles.find((s) => s.id === id);
    if (saved) {
      return {
        id: saved.id,
        label: saved.name,
        isCustom: true,
        baseType: saved.baseType,
        skills: saved.skills,
        communicationStyle: saved.communicationStyle,
        customInstructions: saved.customInstructions,
      };
    }

    // Default: MBTI base type
    const mbti = mbtiProfiles.find((p) => p.type === id);
    return {
      id,
      label: `${id} (${mbti?.name ?? 'Base'})`,
      isCustom: false,
      baseType: (mbti?.type || 'INTP') as MBTITypeCode,
      skills: [],
    };
  });

  const handleCompare = () => {
    if (!compareQuestion.trim() || resolvedTargets.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      const result = generateCognitiveComparisonPanels(resolvedTargets, compareQuestion);
      setPanels(result);
      setLoading(false);
    }, 500);
  };

  const handleRandomSelection = () => {
    clearComparisons();
    const shuffled = [...mbtiProfiles].sort(() => Math.random() - 0.5).slice(0, 4);
    shuffled.forEach((p) => addComparison(p.type));
  };

  const loadPresetShowdown = (showdown: typeof presetShowdowns[0]) => {
    clearComparisons();
    setCustomTargets(showdown.targets);
    showdown.targets.forEach((t) => addComparison(t.id));
  };

  const colSpan =
    resolvedTargets.length === 1
      ? 'grid-cols-1'
      : resolvedTargets.length === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : resolvedTargets.length === 3
      ? 'grid-cols-1 md:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-medium mb-3">
            <GitCompare className="w-3.5 h-3.5" />
            Side-by-Side Cognitive Divergence Lab
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-2">
            <span className="gradient-text">Compare</span> AI Cognitive Profiles
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-3xl">
            Examine how different cognitive architectures approach the identical problem. Compare base MBTI profiles or your custom-composed Cognitive Profiles side-by-side.
          </p>
        </div>

        {/* Configuration panel */}
        <GlowCard className="p-6 mb-8">
          {/* Preset showdown shortcuts */}
          <div className="mb-5 pb-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300">Quick Showdowns:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presetShowdowns.map((ps) => (
                <button
                  key={ps.name}
                  onClick={() => loadPresetShowdown(ps)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
                >
                  ⚡ {ps.name}
                </button>
              ))}
            </div>
          </div>

          {/* Profile selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-300">
                Selected Configurations{' '}
                <span className="text-slate-500 font-normal">({resolvedTargets.length}/4)</span>
              </h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleRandomSelection}>
                  <Shuffle className="w-3.5 h-3.5" />
                  Random 4
                </Button>
                {resolvedTargets.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearComparisons}>
                    <X className="w-3.5 h-3.5" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Selected chips */}
            {resolvedTargets.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {resolvedTargets.map((target) => (
                  <div
                    key={target.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-medium"
                  >
                    <span>{target.label}</span>
                    <button
                      onClick={() => removeComparison(target.id)}
                      className="ml-1 text-cyan-500 hover:text-cyan-200"
                      aria-label={`Remove ${target.label}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Saved Custom Profiles Selector (if any exist) */}
            {savedProfiles.length > 0 && (
              <div className="mb-4">
                <span className="text-xs text-slate-500 font-medium block mb-1.5">
                  Your Saved Cognitive Profiles:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {savedProfiles.map((p) => {
                    const isSelected = selectedComparisons.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => (isSelected ? removeComparison(p.id) : addComparison(p.id))}
                        disabled={!isSelected && resolvedTargets.length >= 4}
                        className={`px-2.5 py-1 rounded text-xs transition-all border ${
                          isSelected
                            ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                            : 'bg-white/3 border-white/6 text-slate-400 hover:bg-white/6'
                        }`}
                      >
                        <Layers className="w-3 h-3 inline mr-1" />
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Base MBTI Grid */}
            <span className="text-xs text-slate-500 font-medium block mb-1.5">
              16 MBTI Base Profiles:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-1.5">
              {mbtiProfiles.map((profile) => {
                const isSelected = selectedComparisons.includes(profile.type);
                const disabled = !isSelected && resolvedTargets.length >= 4;
                return (
                  <button
                    key={profile.type}
                    onClick={() => (isSelected ? removeComparison(profile.type) : addComparison(profile.type))}
                    disabled={disabled}
                    className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                        : disabled
                        ? 'bg-white/2 text-slate-700 border border-transparent cursor-not-allowed'
                        : 'bg-white/4 text-slate-400 border border-white/6 hover:bg-white/8 hover:text-slate-200'
                    }`}
                    aria-pressed={isSelected}
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
              <label className="text-sm font-semibold text-slate-300">Problem or Challenge Statement</label>
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {showExamples ? 'Hide Samples' : 'Browse Benchmark Challenges'}
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
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-white/3 border border-white/6 max-h-36 overflow-y-auto">
                    {exampleProblems.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCompareQuestion(p.description);
                          setShowExamples(false);
                        }}
                        className="text-xs px-2.5 py-1 rounded bg-white/5 text-slate-400 border border-white/6 hover:text-slate-200 hover:bg-white/10 text-left"
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
              className="w-full rounded-lg bg-white/5 border border-white/8 text-slate-200 placeholder-slate-600 text-sm p-3 focus:outline-none focus:border-cyan-500/40 resize-none transition-all"
            />
          </div>

          <Button
            onClick={handleCompare}
            disabled={!compareQuestion.trim() || resolvedTargets.length === 0 || loading}
            size="lg"
            fullWidth
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Multi-Profile Comparison...
              </>
            ) : (
              <>
                <GitCompare className="w-5 h-5" />
                Compare Selected Profiles ({resolvedTargets.length})
              </>
            )}
          </Button>
        </GlowCard>

        {/* Comparison Results */}
        {panels.length > 0 && (
          <div>
            {/* Tab switch */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('responses')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'responses'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Cognitive Responses
                </button>
                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'matrix'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Divergence Matrix
                </button>
              </div>

              <span className="text-xs text-slate-500 hidden sm:inline">
                Rule-based behavioral simulation • Neutral comparative analysis
              </span>
            </div>

            {/* Tab 1: Responses */}
            {activeTab === 'responses' && (
              <div className={`grid ${colSpan} gap-4`}>
                {panels.map((panel, i) => {
                  const mbti = mbtiProfiles.find((p) => p.type === panel.profileType);
                  const catColor = categoryColors[mbti?.category || ''] || 'cyan';
                  return (
                    <motion.div
                      key={panel.targetId}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.35 }}
                    >
                      <GlowCard color={catColor} className="p-5 h-full flex flex-col justify-between">
                        <div>
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div
                                className="text-2xl font-black bg-clip-text text-transparent mb-0.5"
                                style={{ backgroundImage: mbti?.gradient }}
                              >
                                {panel.profileType}
                              </div>
                              <div className="text-xs font-semibold text-slate-200">{panel.label}</div>
                            </div>
                            <Badge color={catColor} size="sm">
                              {mbti?.category}
                            </Badge>
                          </div>

                          {/* Dominant Skills */}
                          {panel.dominantSkills.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-1">
                              {panel.dominantSkills.map((sk) => (
                                <span
                                  key={sk}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-cyan-400 border border-white/5"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Approach Steps */}
                          <div className="mb-4">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">
                              Reasoning Trajectory
                            </div>
                            <div className="space-y-1">
                              {panel.approach.map((step, si) => (
                                <div key={si} className="flex items-start gap-1.5 text-xs text-slate-300">
                                  <span className="text-cyan-400 font-mono text-[10px] mt-0.5">{si + 1}.</span>
                                  <span className="leading-snug">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Simulated Output */}
                          <div>
                            <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold mb-1.5">
                              Illustrative Output
                            </div>
                            <div className="text-xs text-slate-300 leading-relaxed rounded bg-[#080c14] border border-white/5 p-3 whitespace-pre-wrap font-sans">
                              {panel.simulatedResponse}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-600 text-center">
                          Illustrative cognitive stance • Not a ranking
                        </div>
                      </GlowCard>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Matrix */}
            {activeTab === 'matrix' && (
              <div className="overflow-x-auto rounded-xl border border-white/8 bg-[#0d1421] p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="text-left py-3 px-3 text-slate-500 font-medium text-xs w-36">Dimension</th>
                      {panels.map((p) => (
                        <th key={p.targetId} className="text-left py-3 px-3">
                          <div className="text-lg font-black text-cyan-300">{p.profileType}</div>
                          <div className="text-xs text-slate-400 font-normal">{p.label}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-3 text-xs text-slate-500 font-medium">Cognitive Posture</td>
                      {panels.map((p) => {
                        const mbti = mbtiProfiles.find((m) => m.type === p.profileType);
                        return (
                          <td key={p.targetId} className="py-3 px-3 text-xs text-slate-300 align-top">
                            {mbti?.cognitiveStyle}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-3 text-xs text-slate-500 font-medium">Problem Formulation</td>
                      {panels.map((p) => (
                        <td key={p.targetId} className="py-3 px-3 text-xs text-slate-300 align-top">
                          <div className="space-y-1">
                            {p.approach.slice(0, 3).map((st, i) => (
                              <div key={i}>• {st}</div>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-3 text-xs text-slate-500 font-medium">Decision Pattern</td>
                      {panels.map((p) => {
                        const mbti = mbtiProfiles.find((m) => m.type === p.profileType);
                        return (
                          <td key={p.targetId} className="py-3 px-3 text-xs text-slate-300 align-top">
                            {mbti?.decisionStyle}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-xs text-slate-500 font-medium">Active Modifiers</td>
                      {panels.map((p) => (
                        <td key={p.targetId} className="py-3 px-3 text-xs text-slate-400 align-top">
                          {p.dominantSkills.length > 0 ? p.dominantSkills.join(', ') : 'Base defaults'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-xs text-slate-600 text-center mt-6">
              Notice how the reasoning trajectory changes: no profile is declared "superior" — each optimizes for different constraints (speed, logical rigor, systemic resilience, or creative breadth).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
