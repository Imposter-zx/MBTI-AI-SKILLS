import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Check,
  Compass,
  Copy,
  Download,
  FileCode2,
  FileText,
  FlaskConical,
  Heart,
  Lightbulb,
  ListChecks,
  Map,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { skillsById } from '../data/skills';
import {
  buildSkillZip,
  downloadBlob,
  downloadTextFile,
  generateSkillExample,
  generateSkillMarkdown,
} from '../engine/skillExporter';
import { GlowCard } from '../components/shared/GlowCard';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';

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

function toGlowColor(color: string): 'cyan' | 'purple' | 'green' | 'amber' | 'rose' {
  if (color === 'purple' || color === 'green' || color === 'amber' || color === 'rose') {
    return color;
  }
  return 'cyan';
}

export function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const skill = id ? skillsById[id.toLowerCase()] : undefined;

  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const skillMarkdown = useMemo(
    () => (skill ? generateSkillMarkdown(skill) : ''),
    [skill]
  );

  const exampleText = useMemo(
    () => (skill ? generateSkillExample(skill) : ''),
    [skill]
  );

  const workflowSteps = useMemo(() => {
    if (!skill) return [];
    return [
      "Identify the user's objective, constraints, and context.",
      ...skill.behaviors.slice(0, 4).map((b) => `${b}.`),
      'Verify the output against the requested goal and state any remaining uncertainty.',
    ];
  }, [skill]);

  if (!skill) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <GlowCard color="rose" className="p-8 text-center" hover={false}>
            <h1 className="text-2xl font-bold text-slate-100 mb-3">Skill Not Found</h1>
            <p className="text-slate-400 text-sm mb-6">
              The skill <code className="text-rose-400 font-mono">{id || 'unknown'}</code> does not
              exist in the Universal AI Skills Library.
            </p>
            <Link to="/skills">
              <Button variant="primary" size="md">
                <ArrowLeft className="w-4 h-4" />
                Back to Skills Library
              </Button>
            </Link>
          </GlowCard>
        </div>
      </div>
    );
  }

  const Icon = ICON_MAP[skill.icon] ?? Brain;
  const glowColor = toGlowColor(skill.color);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(skillMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  }

  async function handleDownloadZip() {
    if (!skill) return;
    setDownloadingZip(true);
    try {
      const blob = await buildSkillZip(skill);
      downloadBlob(`${skill.id}-skill.zip`, blob);
    } finally {
      setDownloadingZip(false);
    }
  }

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

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <GlowCard color={glowColor} className="p-6 sm:p-8" hover={false}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                      {skill.name} Skill
                    </h1>
                    <Badge color={glowColor} size="sm">
                      {skill.id}
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-base mb-4">{skill.shortDescription}</p>
                  <div className="flex flex-wrap gap-2">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/8"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
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
                  onClick={() => downloadTextFile(`${skill.id}-SKILL.md`, skillMarkdown)}
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
            </div>
          </GlowCard>
        </motion.div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Purpose */}
            <GlowCard className="p-6" hover={false}>
              <h2 className="text-lg font-semibold text-slate-100 mb-3">Purpose</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{skill.description}</p>
            </GlowCard>

            {/* Behavioral Instructions */}
            <GlowCard className="p-6" hover={false}>
              <h2 className="text-lg font-semibold text-slate-100 mb-4">
                Behavioral Instructions
              </h2>
              <ul className="space-y-2.5">
                {skill.behaviors.map((behavior, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{behavior}</span>
                  </li>
                ))}
              </ul>
            </GlowCard>

            {/* Workflow */}
            <GlowCard className="p-6" hover={false}>
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Workflow</h2>
              <ol className="space-y-2.5 list-decimal list-inside text-sm text-slate-300">
                {workflowSteps.map((step, index) => (
                  <li key={index} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </GlowCard>

            {/* Example */}
            <GlowCard className="p-6" hover={false}>
              <h2 className="text-lg font-semibold text-slate-100 mb-3">Example Usage</h2>
              <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 bg-[#080c14] border border-white/8 rounded-lg p-4 overflow-x-auto">
                {exampleText}
              </pre>
            </GlowCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Compatible MBTI Profiles */}
            <GlowCard color="purple" className="p-6" hover={false}>
              <h2 className="text-base font-semibold text-slate-100 mb-2">
                Compatible MBTI Profiles
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Experimental cognitive profiles commonly paired with this skill:
              </p>
              <div className="flex flex-wrap gap-2">
                {skill.compatibleProfiles.map((typeCode) => (
                  <Link
                    key={typeCode}
                    to={`/types/${typeCode.toLowerCase()}`}
                    className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/25 text-xs font-semibold transition-colors"
                  >
                    {typeCode}
                  </Link>
                ))}
              </div>
            </GlowCard>

            {/* Installation Guide */}
            <GlowCard color="cyan" className="p-6" hover={false}>
              <h2 className="text-base font-semibold text-slate-100 mb-3">
                Installation Guide
              </h2>
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-cyan-300 mb-1">
                    Method 1: Native Skill Support
                  </h3>
                  <p className="text-slate-400">
                    If your AI tool natively supports <code className="text-slate-200">SKILL.md</code>{' '}
                    packages, extract the ZIP and place the skill folder into your tool&apos;s
                    configured skills directory. Check official tool docs for exact paths.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-300 mb-1">
                    Method 2: Manual Usage
                  </h3>
                  <p className="text-slate-400">
                    Copy the <code className="text-slate-200">SKILL.md</code> instructions and paste
                    them into a System Prompt, Custom Instructions, Gem, Custom GPT, or Claude
                    Project. Manual pasting is not equivalent to native auto-discovery.
                  </p>
                </div>
                <Link
                  to="/docs/compatibility"
                  className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium pt-1"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Open Full Compatibility Guide
                </Link>
              </div>
            </GlowCard>
          </div>
        </div>

        {/* Live SKILL.md Preview */}
        <GlowCard className="p-6" hover={false}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-slate-100">
                Live <code className="font-mono text-cyan-300">SKILL.md</code> Preview
              </h2>
            </div>
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? (
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
          </div>
          <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 bg-[#080c14] border border-white/8 rounded-lg p-4 max-h-[480px] overflow-y-auto">
            {skillMarkdown}
          </pre>
        </GlowCard>
      </div>
    </div>
  );
}
