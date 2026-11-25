import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileCode2,
  FileText,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  buildCustomSkillZip,
  downloadBlob,
  downloadTextFile,
  generateCustomSkillMarkdown,
  sanitizeSlug,
  type CustomSkillInput,
} from '../engine/skillExporter';
import { GlowCard } from '../components/shared/GlowCard';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';

export function CustomSkillPage() {
  const [name, setName] = useState('Code Review Partner');
  const [description, setDescription] = useState(
    'Reviews code changes for correctness, edge cases, and maintainability.'
  );
  const [purpose, setPurpose] = useState(
    'Help developers spot subtle bugs, security risks, and architectural trade-offs before merging.'
  );
  const [behaviors, setBehaviors] = useState<string[]>([
    'Prioritize correctness and edge cases over minor style nitpicks',
    'Explain why an issue matters and suggest a concrete fix',
    'Separate verified observations from assumptions',
  ]);
  const [workflow, setWorkflow] = useState<string[]>([
    'Summarize the intent and scope of the change',
    'Check logic, error handling, and boundary conditions',
    'List prioritized findings with actionable recommendations',
  ]);
  const [examples, setExamples] = useState<string[]>([
    'Prompt: "Review this TypeScript function for null-safety and race conditions."\nResponse: Lists critical bugs first, followed by concrete refactored code.',
  ]);
  const [tags, setTags] = useState<string[]>(['code-review', 'engineering', 'quality']);
  const [tagInput, setTagInput] = useState('');

  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const customSkillInput: CustomSkillInput = useMemo(
    () => ({
      name,
      slug: sanitizeSlug(name),
      description,
      purpose,
      behaviors,
      workflow,
      examples,
      tags,
    }),
    [name, description, purpose, behaviors, workflow, examples, tags]
  );

  const markdownPreview = useMemo(
    () => generateCustomSkillMarkdown(customSkillInput),
    [customSkillInput]
  );

  const slug = sanitizeSlug(name);

  function updateListItem(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function removeListItem(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) {
    setter((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : ['']));
  }

  function addListItem(setter: React.Dispatch<React.SetStateAction<string[]>>) {
    setter((prev) => [...prev, '']);
  }

  function addTagsFromInput(raw: string) {
    const candidates = raw
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#+/, ''))
      .filter(Boolean);
    if (candidates.length === 0) return;
    setTags((prev) => Array.from(new Set([...prev, ...candidates])));
    setTagInput('');
  }

  function removeTag(tagToRemove: string) {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdownPreview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  }

  async function handleDownloadZip() {
    setDownloadingZip(true);
    try {
      const blob = await buildCustomSkillZip(customSkillInput);
      downloadBlob(`${slug}-skill.zip`, blob);
    } finally {
      setDownloadingZip(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
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
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Custom Skill Authoring
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
            <span className="gradient-text">Create Custom Portable Skill</span>
          </h1>
          <p className="text-slate-400 text-base max-w-2xl">
            Design your own reusable <code className="text-cyan-300 font-mono">SKILL.md</code>{' '}
            module with live Markdown preview and instant ZIP export.
          </p>
        </div>

        {/* Security Note */}
        <GlowCard color="green" className="p-4 mb-8" hover={false}>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-semibold text-green-300">Instruction Files Only:</span>{' '}
              Exports generate plain UTF-8 Markdown (<code className="text-slate-200">SKILL.md</code>{' '}
              and <code className="text-slate-200">README.md</code>) locally in your browser. No
              executable scripts are included, and no backend or account is required.
            </div>
          </div>
        </GlowCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Form */}
          <div className="space-y-6">
            <GlowCard className="p-6 space-y-5" hover={false}>
              <div>
                <label
                  htmlFor="custom-skill-name"
                  className="block text-sm font-medium text-slate-200 mb-1.5"
                >
                  Skill Name
                </label>
                <input
                  id="custom-skill-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Architecture Reviewer"
                  className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/40"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Slug: <code className="font-mono text-cyan-400">{slug}</code>
                </p>
              </div>

              <div>
                <label
                  htmlFor="custom-skill-description"
                  className="block text-sm font-medium text-slate-200 mb-1.5"
                >
                  Short Description
                </label>
                <input
                  id="custom-skill-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="One-line summary for YAML frontmatter..."
                  className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/40"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-skill-purpose"
                  className="block text-sm font-medium text-slate-200 mb-1.5"
                >
                  Purpose
                </label>
                <textarea
                  id="custom-skill-purpose"
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe when and why an AI assistant should apply this skill..."
                  className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/40"
                />
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="custom-skill-tags"
                  className="block text-sm font-medium text-slate-200 mb-1.5"
                >
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    id="custom-skill-tags"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addTagsFromInput(tagInput);
                      }
                    }}
                    placeholder="Type tag(s), comma-separated, press Enter..."
                    className="flex-1 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/40"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => addTagsFromInput(tagInput)}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        aria-label={`Remove tag ${tag}`}
                        className="hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </GlowCard>

            {/* Behavioral Instructions */}
            <GlowCard className="p-6 space-y-3" hover={false}>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-100">
                  Behavioral Instructions
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addListItem(setBehaviors)}
                >
                  <Plus className="w-4 h-4" />
                  Add Line
                </Button>
              </div>
              <div className="space-y-2">
                {behaviors.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateListItem(setBehaviors, idx, e.target.value)}
                      placeholder={`Behavior guideline #${idx + 1}`}
                      aria-label={`Behavior guideline ${idx + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/40"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeListItem(setBehaviors, idx)}
                      aria-label={`Remove behavior ${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </GlowCard>

            {/* Workflow Steps */}
            <GlowCard className="p-6 space-y-3" hover={false}>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-100">Workflow Steps</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addListItem(setWorkflow)}
                >
                  <Plus className="w-4 h-4" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-2">
                {workflow.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 w-5 text-right">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => updateListItem(setWorkflow, idx, e.target.value)}
                      placeholder={`Workflow step #${idx + 1}`}
                      aria-label={`Workflow step ${idx + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/40"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeListItem(setWorkflow, idx)}
                      aria-label={`Remove step ${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </GlowCard>

            {/* Examples */}
            <GlowCard className="p-6 space-y-3" hover={false}>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-100">Examples</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addListItem(setExamples)}
                >
                  <Plus className="w-4 h-4" />
                  Add Example
                </Button>
              </div>
              <div className="space-y-3">
                {examples.map((example, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <textarea
                      rows={3}
                      value={example}
                      onChange={(e) => updateListItem(setExamples, idx, e.target.value)}
                      placeholder={`Example scenario #${idx + 1}`}
                      aria-label={`Example ${idx + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/40"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeListItem(setExamples, idx)}
                      aria-label={`Remove example ${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </GlowCard>
          </div>

          {/* Right: Live SKILL.md Preview */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <GlowCard color="cyan" className="p-6" hover={false}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-slate-100">
                    Live <code className="font-mono text-cyan-300">SKILL.md</code> Preview
                  </h2>
                </div>
                <Badge color="cyan" size="sm">
                  {slug}/SKILL.md
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="secondary" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy SKILL.md
                    </>
                  )}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => downloadTextFile(`${slug}-SKILL.md`, markdownPreview)}
                >
                  <FileText className="w-4 h-4" />
                  Download SKILL.md
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDownloadZip}
                  disabled={downloadingZip}
                >
                  <Download className="w-4 h-4" />
                  {downloadingZip ? 'Building ZIP...' : 'Download ZIP'}
                </Button>
              </div>

              <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 bg-[#080c14] border border-white/8 rounded-lg p-4 max-h-[640px] overflow-y-auto">
                {markdownPreview}
              </pre>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  );
}
