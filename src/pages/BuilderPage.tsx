import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus,
  X,
  Save,
  Share2,
  Download,
  Upload,
  Shuffle,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { mbtiProfiles } from '../data/mbtiProfiles';
import { skills, skillsById } from '../data/skills';
import { useAppStore } from '../store/useAppStore';
import { generateSystemPrompt } from '../engine/promptGenerator';
import {
  buildShareUrl,
  readProfileFromUrl,
  exportProfileJson,
  importProfileJson,
} from '../engine/profileSerializer';
import { Button } from '../components/shared/Button';
import { GlowCard } from '../components/shared/GlowCard';
import { Badge } from '../components/shared/Badge';
import { IntensitySlider } from '../components/shared/IntensitySlider';
import { PromptPreview } from '../components/shared/PromptPreview';
import type { MBTITypeCode } from '../types';

type LucideIconName = keyof typeof LucideIcons;

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = LucideIcons[name as LucideIconName] as React.ComponentType<{ className?: string }>;
  return Icon ? <Icon className={className} /> : null;
}

const steps = ['Base Profile', 'Add Skills', 'Adjust Intensity', 'Generate'];

export function BuilderPage() {
  const {
    builderProfile,
    savedProfiles,
    setBuilderBaseType,
    setBuilderName,
    addBuilderSkill,
    removeBuilderSkill,
    setSkillIntensity,
    setBuilderCommunication,
    setBuilderCustomInstructions,
    resetBuilder,
    saveCurrentProfile,
    deleteSavedProfile,
    loadSavedProfile,
    loadBuilderProfile,
  } = useAppStore();

  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [editablePrompt, setEditablePrompt] = useState('');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  // Load profile from URL on mount
  useEffect(() => {
    const fromUrl = readProfileFromUrl();
    if (fromUrl) {
      loadBuilderProfile(fromUrl);
      setStep(3);
    }
  }, []);

  const prompt = useMemo(() => generateSystemPrompt(builderProfile), [builderProfile]);

  useEffect(() => {
    setEditablePrompt(prompt);
  }, [prompt]);

  const handleShare = async () => {
    const url = buildShareUrl(builderProfile);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExportJson = () => {
    const json = exportProfileJson(builderProfile);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mbti-ai-profile.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    setImportError('');
    const imported = importProfileJson(importText);
    if (!imported) {
      setImportError('Invalid JSON. Make sure it follows the MBTI AI Skills format.');
      return;
    }
    loadBuilderProfile(imported);
    setImportText('');
    setStep(3);
  };

  const handleRandomProfile = () => {
    const randomProfile = mbtiProfiles[Math.floor(Math.random() * mbtiProfiles.length)];
    resetBuilder();
    setBuilderBaseType(randomProfile.type);
    const randomSkills = [...skills].sort(() => Math.random() - 0.5).slice(0, 3);
    randomSkills.forEach((s) => addBuilderSkill(s.id));
    setStep(3);
  };

  const activeProfile = mbtiProfiles.find((p) => p.type === builderProfile.baseType);
  const activeSkills = builderProfile.skills || [];

  const generatedName = useMemo(() => {
    if (builderProfile.name) return builderProfile.name;
    if (!builderProfile.baseType) return 'My AI Profile';
    const skillNames = activeSkills.slice(0, 3).map((s) => skillsById[s.skillId]?.name ?? '').filter(Boolean);
    if (skillNames.length === 0) return `${builderProfile.baseType} Configuration`;
    return skillNames.join(' + ') + ' AI';
  }, [builderProfile]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 mb-2">
              Build Your <span className="gradient-text">AI Mind</span>
            </h1>
            <p className="text-slate-500">
              Combine a base MBTI profile with modular cognitive Skills to generate a custom AI system prompt.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={handleRandomProfile}>
              <Shuffle className="w-4 h-4" />
              Surprise Me
            </Button>
            <Button variant="secondary" size="sm" onClick={() => { resetBuilder(); setStep(0); }}>
              <Trash2 className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  step === i
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : i < step
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 cursor-default'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i < step ? 'bg-cyan-500 text-white' : step === i ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/5 text-slate-600'
                }`}>
                  {i < step ? '✓' : i + 1}
                </span>
                {label}
              </button>
              {i < steps.length - 1 && <div className="w-6 h-px bg-white/10 flex-shrink-0" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main config panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 0: Base Profile */}
            <GlowCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-200">Step 1 — Base Profile</h2>
                {activeProfile && (
                  <span
                    className="text-sm font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: activeProfile.gradient }}
                  >
                    {activeProfile.type} — {activeProfile.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {mbtiProfiles.map((profile) => {
                  const selected = builderProfile.baseType === profile.type;
                  return (
                    <button
                      key={profile.type}
                      onClick={() => setBuilderBaseType(profile.type as MBTITypeCode)}
                      className={`px-2 py-2 rounded-lg text-xs font-bold transition-all text-center ${
                        selected
                          ? 'border text-white'
                          : 'bg-white/4 text-slate-500 border border-white/6 hover:bg-white/8 hover:text-slate-300'
                      }`}
                      style={selected ? { background: activeProfile?.gradient, borderColor: 'transparent' } : {}}
                      aria-pressed={selected}
                    >
                      {profile.type}
                    </button>
                  );
                })}
              </div>

              {activeProfile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 rounded-lg bg-white/3 border border-white/6"
                >
                  <p className="text-xs text-slate-500 leading-relaxed">{activeProfile.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {activeProfile.tags.slice(0, 5).map((t) => (
                      <Badge key={t} color="slate" size="sm">{t}</Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </GlowCard>

            {/* Step 2: Skills */}
            <GlowCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-200">Step 2 — Add Skills</h2>
                <span className="text-xs text-slate-500">{activeSkills.length} active</span>
              </div>

              {/* Active skills */}
              {activeSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeSkills.map((si) => {
                    const skill = skillsById[si.skillId];
                    return skill ? (
                      <div
                        key={si.skillId}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs"
                      >
                        <DynamicIcon name={skill.icon} className="w-3 h-3" />
                        {skill.name}
                        <button
                          onClick={() => removeBuilderSkill(si.skillId)}
                          className="text-cyan-500 hover:text-cyan-200 transition-colors"
                          aria-label={`Remove ${skill.name}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {/* Available skills grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {skills.map((skill) => {
                  const active = activeSkills.some((s) => s.skillId === skill.id);
                  return (
                    <button
                      key={skill.id}
                      onClick={() => active ? removeBuilderSkill(skill.id) : addBuilderSkill(skill.id)}
                      className={`flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                        active
                          ? 'bg-cyan-500/10 border border-cyan-500/20'
                          : 'bg-white/3 border border-white/6 hover:bg-white/6 hover:border-white/12'
                      }`}
                      aria-pressed={active}
                    >
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${active ? 'bg-cyan-500/20' : 'bg-white/5'}`}>
                        <DynamicIcon name={skill.icon} className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-semibold mb-0.5 ${active ? 'text-cyan-300' : 'text-slate-400'}`}>
                          {skill.name}
                        </div>
                        <div className="text-[10px] text-slate-600 leading-relaxed">
                          {skill.shortDescription}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${active ? 'bg-cyan-500 border-cyan-400' : 'border-white/15'}`}>
                        {active ? <X className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-slate-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </GlowCard>

            {/* Step 3: Intensities */}
            {activeSkills.length > 0 && (
              <GlowCard className="p-6">
                <h2 className="font-semibold text-slate-200 mb-4">Step 3 — Adjust Intensity</h2>
                <div className="space-y-5">
                  {activeSkills.map((si) => {
                    const skill = skillsById[si.skillId];
                    return skill ? (
                      <div key={si.skillId}>
                        <div className="flex items-center gap-2 mb-2">
                          <DynamicIcon name={skill.icon} className="w-4 h-4 text-slate-500" />
                          <IntensitySlider
                            value={si.intensity}
                            onChange={(v) => setSkillIntensity(si.skillId, v)}
                            label={skill.name}
                          />
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </GlowCard>
            )}

            {/* Custom name + instructions */}
            <GlowCard className="p-6">
              <h2 className="font-semibold text-slate-200 mb-4">Step 4 — Personalize (Optional)</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Profile Name</label>
                  <input
                    type="text"
                    value={builderProfile.name || ''}
                    onChange={(e) => setBuilderName(e.target.value)}
                    placeholder={generatedName}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Communication Preference</label>
                  <input
                    type="text"
                    value={builderProfile.communicationPreference || ''}
                    onChange={(e) => setBuilderCommunication(e.target.value)}
                    placeholder="e.g. concise, technical, with examples..."
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Custom Instructions</label>
                  <textarea
                    value={builderProfile.customInstructions || ''}
                    onChange={(e) => setBuilderCustomInstructions(e.target.value)}
                    placeholder="Add any additional instructions to append to your system prompt..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 resize-none transition-all"
                  />
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Profile summary */}
            {activeProfile && (
              <GlowCard className="p-5">
                <div
                  className="text-3xl font-black mb-1 bg-clip-text text-transparent"
                  style={{ backgroundImage: activeProfile.gradient }}
                >
                  {activeProfile.type}
                </div>
                <div className="text-slate-300 font-semibold mb-0.5">{generatedName}</div>
                <div className="text-xs text-slate-500 mb-3">{activeProfile.tagline}</div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {activeSkills.map((si) => {
                    const skill = skillsById[si.skillId];
                    return skill ? (
                      <span key={si.skillId} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-500">
                        {skill.name} {si.intensity}%
                      </span>
                    ) : null;
                  })}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={saveCurrentProfile}
                    variant="secondary"
                    size="sm"
                    fullWidth
                    disabled={!builderProfile.baseType}
                  >
                    <Save className="w-4 h-4" />
                    Save Profile
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="ghost"
                    size="sm"
                    fullWidth
                    disabled={!builderProfile.baseType}
                  >
                    {copied ? <CheckCheck className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                    {copied ? 'URL Copied!' : 'Share Profile URL'}
                  </Button>
                  <Button
                    onClick={handleExportJson}
                    variant="ghost"
                    size="sm"
                    fullWidth
                    disabled={!builderProfile.baseType}
                  >
                    <Download className="w-4 h-4" />
                    Export JSON
                  </Button>
                </div>
              </GlowCard>
            )}

            {/* Saved profiles */}
            {savedProfiles.length > 0 && (
              <GlowCard className="p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Saved Profiles</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {savedProfiles.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/3 border border-white/6"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-300 truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-600">{p.baseType}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => loadSavedProfile(p.id)}
                          className="text-xs text-cyan-500 hover:text-cyan-300 transition-colors px-2 py-1"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteSavedProfile(p.id)}
                          className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                          aria-label="Delete profile"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            )}

            {/* Import JSON */}
            <GlowCard className="p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Import JSON</h3>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={'{\n  "baseType": "INTP",\n  "skills": [...]\n}'}
                rows={5}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-300 placeholder-slate-700 text-xs font-mono focus:outline-none focus:border-cyan-500/40 resize-none transition-all mb-2"
              />
              {importError && (
                <p className="text-xs text-rose-400 mb-2">{importError}</p>
              )}
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={handleImportJson}
                disabled={!importText.trim()}
              >
                <Upload className="w-4 h-4" />
                Import Profile
              </Button>
            </GlowCard>
          </div>
        </div>

        {/* Generated prompt */}
        {builderProfile.baseType && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-200">Generated System Prompt</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingPrompt(!isEditingPrompt)}
              >
                {isEditingPrompt ? 'View Mode' : 'Edit Mode'}
              </Button>
            </div>
            <PromptPreview
              prompt={isEditingPrompt ? editablePrompt : prompt}
              onReset={() => setEditablePrompt(prompt)}
              editable={isEditingPrompt}
              onEdit={setEditablePrompt}
            />
          </div>
        )}

        {/* Link to test in lab */}
        {builderProfile.baseType && (
          <div className="mt-4 text-center">
            <Link to="/lab">
              <Button variant="secondary">
                Test This Configuration in the Lab →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
