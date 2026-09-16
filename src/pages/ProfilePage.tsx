import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Brain,
  MessageSquare,
  Zap,
  Target,
  Eye,
  ArrowRight,
  Plus,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { profilesByType } from '../data/mbtiProfiles';
import { skills, skillsById } from '../data/skills';
import { useAppStore } from '../store/useAppStore';
import { Badge } from '../components/shared/Badge';
import { Button } from '../components/shared/Button';
import { GlowCard } from '../components/shared/GlowCard';
import type { SkillId } from '../types';

const categoryColors: Record<string, 'cyan' | 'purple' | 'amber' | 'green'> = {
  Analysts: 'cyan',
  Diplomats: 'purple',
  Sentinels: 'amber',
  Explorers: 'green',
};

type LucideIconName = keyof typeof LucideIcons;

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = LucideIcons[name as LucideIconName] as React.ComponentType<{ className?: string }>;
  return Icon ? <Icon className={className} /> : <Brain className={className} />;
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-cyan-400" />
        <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function ProfilePage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { setBuilderBaseType, addBuilderSkill, resetBuilder } = useAppStore();

  const profile = profilesByType[type?.toUpperCase() ?? ''];

  if (!profile) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center text-slate-500">
        Profile not found. <Link to="/types" className="text-cyan-400 ml-2">Browse all types →</Link>
      </div>
    );
  }

  const catColor = categoryColors[profile.category] || 'cyan';

  const handleTryInBuilder = () => {
    resetBuilder();
    setBuilderBaseType(profile.type);
    navigate('/builder');
  };

  const handleAddSkill = (skillId: SkillId) => {
    setBuilderBaseType(profile.type);
    addBuilderSkill(skillId);
    navigate('/builder');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          to="/types"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Profiles
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
            <div>
              <div
                className="text-7xl font-black mb-2 bg-clip-text text-transparent"
                style={{ backgroundImage: profile.gradient }}
              >
                {profile.type}
              </div>
              <div className="text-2xl font-bold text-slate-200 mb-1">{profile.name}</div>
              <div className="text-slate-500 mb-3">{profile.tagline}</div>
              <div className="flex flex-wrap gap-2">
                <Badge color={catColor}>{profile.category}</Badge>
                {profile.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} color="slate">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed text-lg mb-6">
            {profile.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleTryInBuilder}>
              <Zap className="w-4 h-4" />
              Try in Builder
            </Button>
            <Link to={`/compare?types=${profile.type}`}>
              <Button variant="secondary">
                <Eye className="w-4 h-4" />
                Compare This Profile
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Cognitive Style */}
          <GlowCard className="p-5">
            <Section icon={Brain} title="Cognitive Style">
              <p className="text-slate-400 text-sm leading-relaxed">{profile.cognitiveStyle}</p>
            </Section>
          </GlowCard>

          {/* Communication */}
          <GlowCard className="p-5">
            <Section icon={MessageSquare} title="Communication Style">
              <p className="text-slate-400 text-sm leading-relaxed">{profile.communicationStyle}</p>
            </Section>
          </GlowCard>

          {/* Problem Solving */}
          <GlowCard className="p-5">
            <Section icon={Target} title="Problem-Solving Process">
              <div className="flex flex-wrap items-center gap-2">
                {profile.problemSolvingStyle.split('→').map((step, i, arr) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/6">
                      {step.trim()}
                    </span>
                    {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </Section>
          </GlowCard>

          {/* Decision Style */}
          <GlowCard className="p-5">
            <Section icon={Zap} title="Decision Pattern">
              <p className="text-slate-400 text-sm leading-relaxed">{profile.decisionStyle}</p>
            </Section>
          </GlowCard>
        </div>

        {/* Strengths + Blind Spots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <GlowCard className="p-5">
            <h3 className="text-sm font-semibold text-green-400 mb-3 uppercase tracking-wider">
              Strength-Oriented Tendencies
            </h3>
            <ul className="space-y-2">
              {profile.strengths.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-green-400 flex-shrink-0 mt-0.5">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </GlowCard>

          <GlowCard className="p-5">
            <h3 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider">
              Possible Blind Spots
            </h3>
            <ul className="space-y-2">
              {profile.blindSpots.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-amber-400 flex-shrink-0 mt-0.5">△</span>
                  {s}
                </li>
              ))}
            </ul>
          </GlowCard>
        </div>

        {/* Recommended Skills */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-200 mb-5">
            Recommended AI Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.recommendedSkills.map((sid, i) => {
              const skill = skillsById[sid];
              if (!skill) return null;
              return (
                <motion.div
                  key={sid}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <GlowCard color={skill.color as 'cyan' | 'purple' | 'amber' | 'green' | 'rose'} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        <DynamicIcon name={skill.icon} className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-200 text-sm mb-1">{skill.name} Skill</div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">
                          {skill.shortDescription}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddSkill(sid)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <Plus className="w-3 h-3" />
                          Add to Builder
                        </Button>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Example System Prompt */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-200 mb-4">Example System Prompt</h2>
          <div className="rounded-xl border border-white/8 bg-[#0d1421] p-4">
            <pre className="font-mono text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">
              {profile.examplePrompt}
            </pre>
          </div>
        </div>

        {/* Example interactions */}
        {profile.exampleInteractions.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-200 mb-4">Example Interaction</h2>
            {profile.exampleInteractions.map((ex, i) => (
              <GlowCard key={i} className="p-5">
                <div className="mb-4">
                  <span className="text-xs text-slate-500 font-mono">USER</span>
                  <p className="text-slate-300 mt-1 italic">"{ex.problem}"</p>
                </div>

                <div className="mb-4">
                  <span className="text-xs text-slate-500 font-mono">APPROACH</span>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {ex.approach.map((step, si, arr) => (
                      <div key={si} className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/6">
                          {step}
                        </span>
                        {si < arr.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-cyan-500 font-mono">{profile.type}-INSPIRED RESPONSE</span>
                  <p className="text-slate-400 text-sm leading-relaxed mt-2">{ex.response}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        )}

        {/* All skills from this category that are compatible */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-200 mb-4">All Compatible Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills
              .filter((s) => s.compatibleProfiles.includes(profile.type))
              .map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => handleAddSkill(skill.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 text-slate-400 border border-white/6 hover:bg-white/10 hover:text-slate-200 transition-all"
                >
                  <DynamicIcon name={skill.icon} className="w-3 h-3" />
                  {skill.name}
                  <Plus className="w-3 h-3 text-cyan-400" />
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
