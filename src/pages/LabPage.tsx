import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  Play,
  Sparkles,
  Layers,
  RotateCcw,
  BookOpen,
  Cpu,
  Bot,
  Copy,
  CheckCheck,
  Zap,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { mbtiProfiles } from '../data/mbtiProfiles';
import { skills, skillsById } from '../data/skills';
import { exampleProblems } from '../data/exampleProblems';
import { useAppStore } from '../store/useAppStore';
import { simulateResponse, buildApproachSteps } from '../engine/responseSimulator';
import { generateSystemPrompt } from '../engine/promptGenerator';
import { availableProviders } from '../engine/aiProvider';
import { Button } from '../components/shared/Button';
import { GlowCard } from '../components/shared/GlowCard';
import { Badge } from '../components/shared/Badge';
import { IntensitySlider } from '../components/shared/IntensitySlider';
import type { AIProviderType } from '../types';

type LucideIconName = keyof typeof LucideIcons;

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = LucideIcons[name as LucideIconName] as React.ComponentType<{ className?: string }>;
  return Icon ? <Icon className={className} /> : <Zap className={className} />;
}

export function LabPage() {
  const {
    labQuestion,
    labBaseType,
    labSkills,
    builderProfile,
    setLabQuestion,
    setLabBaseType,
    addLabSkill,
    removeLabSkill,
    setLabSkillIntensity,
    resetLab,
  } = useAppStore();

  const [selectedProvider, setSelectedProvider] = useState<AIProviderType>('mock');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{
    response: string;
    approach: string[];
    generatedPrompt: string;
    timestamp: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  // Load from Builder configuration if available and lab is empty
  const handleLoadFromBuilder = () => {
    if (builderProfile.baseType) {
      setLabBaseType(builderProfile.baseType);
      resetLab();
      setLabBaseType(builderProfile.baseType);
      (builderProfile.skills || []).forEach((s) => {
        addLabSkill(s.skillId);
        setLabSkillIntensity(s.skillId, s.intensity);
      });
    }
  };

  const handleRunSimulation = () => {
    if (!labBaseType || !labQuestion.trim()) return;

    setIsRunning(true);
    setResult(null);

    // Simulate thinking delay
    setTimeout(() => {
      const resp = simulateResponse({
        baseType: labBaseType,
        skills: labSkills,
        question: labQuestion,
      });

      const approach = buildApproachSteps(labBaseType);
      const prompt = generateSystemPrompt({
        baseType: labBaseType,
        skills: labSkills,
      });

      setResult({
        response: resp,
        approach,
        generatedPrompt: prompt,
        timestamp: new Date().toLocaleTimeString(),
      });
      setIsRunning(false);
    }, 600);
  };

  const handleCopyResponse = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentProfile = mbtiProfiles.find((p) => p.type === labBaseType);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-medium mb-3">
              <FlaskConical className="w-3.5 h-3.5" />
              Cognitive Simulation Environment
            </div>
            <h1 className="text-4xl font-bold text-slate-100 mb-2">
              AI Skill <span className="gradient-text">Laboratory</span>
            </h1>
            <p className="text-slate-500 max-w-2xl text-sm sm:text-base">
              Test how any base profile and custom skill setup processes problems in real-time.
              Runs purely client-side with future modular provider connectivity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {builderProfile.baseType && (
              <Button variant="secondary" size="sm" onClick={handleLoadFromBuilder}>
                <Layers className="w-4 h-4" />
                Import from Builder
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={resetLab}>
              <RotateCcw className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 1: Base MBTI Profile */}
            <GlowCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  1. Base Cognitive Profile
                </label>
                {labBaseType && (
                  <Badge color="cyan" size="sm">
                    {labBaseType}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-3">
                {mbtiProfiles.map((p) => {
                  const isSelected = labBaseType === p.type;
                  return (
                    <button
                      key={p.type}
                      onClick={() => setLabBaseType(p.type)}
                      className={`px-1.5 py-2 rounded-lg text-xs font-bold transition-all text-center ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                          : 'bg-white/4 text-slate-400 border border-white/6 hover:bg-white/8 hover:text-slate-200'
                      }`}
                      aria-pressed={isSelected}
                      aria-label={`Select profile ${p.type}`}
                    >
                      {p.type}
                    </button>
                  );
                })}
              </div>

              {currentProfile && (
                <div className="text-xs text-slate-400 p-2.5 rounded-lg bg-white/3 border border-white/5">
                  <div className="font-medium text-slate-200 mb-0.5">
                    {currentProfile.name} • {currentProfile.category}
                  </div>
                  <div className="text-slate-500 line-clamp-2">{currentProfile.tagline}</div>
                </div>
              )}
            </GlowCard>

            {/* Step 2: Modular Skills Setup */}
            <GlowCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  2. Active Skills ({labSkills.length})
                </label>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {skills.map((s) => {
                  const active = labSkills.some((item) => item.skillId === s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => (active ? removeLabSkill(s.id) : addLabSkill(s.id))}
                      className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all border ${
                        active
                          ? 'bg-purple-500/15 border-purple-500/30 text-purple-200'
                          : 'bg-white/3 border-white/5 text-slate-400 hover:bg-white/6'
                      }`}
                    >
                      <DynamicIcon name={s.icon} className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{s.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Intensity sliders for active skills */}
              {labSkills.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    Skill Intensities
                  </div>
                  {labSkills.map((item) => {
                    const sk = skillsById[item.skillId];
                    if (!sk) return null;
                    return (
                      <IntensitySlider
                        key={item.skillId}
                        value={item.intensity}
                        onChange={(val) => setLabSkillIntensity(item.skillId, val)}
                        label={sk.name}
                      />
                    );
                  })}
                </div>
              )}
            </GlowCard>

            {/* Provider Switcher */}
            <GlowCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-green-400" />
                  3. Execution Engine
                </label>
                <Badge color="green" size="sm">
                  Client-Side
                </Badge>
              </div>

              <div className="space-y-1.5">
                {availableProviders.map((prov) => {
                  const isMock = prov.type === 'mock';
                  const isCurrent = selectedProvider === prov.type;
                  return (
                    <button
                      key={prov.type}
                      onClick={() => isMock && setSelectedProvider(prov.type)}
                      disabled={!isMock}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all border ${
                        isCurrent
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                          : isMock
                          ? 'bg-white/3 border-white/5 text-slate-400 hover:bg-white/5'
                          : 'bg-white/1 border-white/2 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <span>{prov.name}</span>
                      {isMock ? (
                        <span className="text-[10px] text-cyan-400 font-mono">Ready</span>
                      ) : (
                        <span className="text-[10px] text-slate-600 uppercase font-mono">Upcoming</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </GlowCard>
          </div>

          {/* Execution & Output Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Input Problem */}
            <GlowCard className="p-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Problem or Prompt Input
                </label>
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {showExamples ? 'Hide Samples' : 'Browse Samples'}
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
                    <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg bg-white/3 border border-white/6 max-h-36 overflow-y-auto">
                      {exampleProblems.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setLabQuestion(p.description);
                            setShowExamples(false);
                          }}
                          className="text-xs px-2.5 py-1 rounded bg-white/5 text-slate-300 hover:bg-cyan-500/15 hover:text-cyan-200 border border-white/5 transition-all text-left"
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea
                value={labQuestion}
                onChange={(e) => setLabQuestion(e.target.value)}
                placeholder="Enter any challenge, query, or engineering problem for this cognitive profile..."
                rows={4}
                className="w-full rounded-lg bg-white/5 border border-white/8 text-slate-200 placeholder-slate-600 text-sm p-3.5 focus:outline-none focus:border-cyan-500/50 resize-none transition-all leading-relaxed"
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  {!labBaseType ? '⚠️ Please select a base profile first' : 'Ready to execute'}
                </div>
                <Button
                  onClick={handleRunSimulation}
                  disabled={!labBaseType || !labQuestion.trim() || isRunning}
                  size="md"
                >
                  {isRunning ? (
                    <>Processing Cognitive Flow...</>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Simulation
                    </>
                  )}
                </Button>
              </div>
            </GlowCard>

            {/* Simulated Response Output */}
            <AnimatePresence mode="wait">
              {isRunning && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-8 rounded-xl border border-cyan-500/20 bg-[#0d1421] text-center space-y-3"
                >
                  <div className="inline-block w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-cyan-300 font-mono">
                    Applying {labBaseType} cognitive patterns and {labSkills.length} active skills...
                  </p>
                </motion.div>
              )}

              {!isRunning && result && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Cognitive Reasoning Path */}
                  <GlowCard className="p-5 border-cyan-500/20">
                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                          Cognitive Trajectory ({labBaseType})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{result.timestamp}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {result.approach.map((step, idx, arr) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-1 rounded bg-white/5 text-slate-300 border border-white/8 font-mono">
                            {idx + 1}. {step}
                          </span>
                          {idx < arr.length - 1 && (
                            <span className="text-slate-600 text-xs">→</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Main Simulated AI Response */}
                    <div className="relative pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Simulated Output
                        </span>
                        <button
                          onClick={handleCopyResponse}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
                        >
                          {copied ? (
                            <>
                              <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                              <span className="text-green-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Response</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="rounded-lg bg-[#080c14] border border-white/5 p-4 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {result.response}
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              )}

              {!isRunning && !result && (
                <div className="rounded-xl border border-dashed border-white/10 p-12 text-center text-slate-600">
                  <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium text-slate-400 mb-1">
                    Laboratory Idle
                  </p>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Select a base profile, pick desired skills, write or pick a problem, and hit "Run Simulation".
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
