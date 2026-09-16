import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  CognitiveProfile,
  MBTITypeCode,
  SkillConfiguration,
  SkillId,
  CommunicationStyle,
} from '../types';
import { nanoid } from '../utils/nanoid';
import { clampIntensity, generateCognitiveProfileName } from '../engine/promptGenerator';
import { mbtiProfiles } from '../data/mbtiProfiles';
import { skills } from '../data/skills';

const communicationStyles: CommunicationStyle[] = [
  'Balanced',
  'Concise',
  'Detailed',
  'Technical',
  'Simple',
  'Socratic',
  'Direct',
  'Exploratory',
];

interface AppStore extends AppState {
  // Builder actions
  setBuilderBaseType: (type: MBTITypeCode) => void;
  setBuilderName: (name: string) => void;
  addBuilderSkill: (skillId: SkillId) => void;
  removeBuilderSkill: (skillId: SkillId) => void;
  setSkillIntensity: (skillId: SkillId, intensity: number) => void;
  reorderSkills: (skills: SkillConfiguration[]) => void;
  setBuilderCommunication: (style: string) => void;
  setBuilderCommunicationStyle: (style: CommunicationStyle) => void;
  setBuilderCustomInstructions: (instructions: string) => void;
  resetBuilder: () => void;
  loadBuilderProfile: (profile: Partial<CognitiveProfile>) => void;
  generateRandomProfile: (richCognitive?: boolean) => void;

  // Saved profiles
  saveCurrentProfile: () => void;
  deleteSavedProfile: (id: string) => void;
  loadSavedProfile: (id: string) => void;

  // Compare page
  addComparison: (id: string) => void;
  removeComparison: (id: string) => void;
  clearComparisons: () => void;
  setCompareQuestion: (q: string) => void;

  // Lab page
  setLabQuestion: (q: string) => void;
  setLabBaseType: (type: MBTITypeCode | null) => void;
  addLabSkill: (skillId: SkillId) => void;
  removeLabSkill: (skillId: SkillId) => void;
  setLabSkillIntensity: (skillId: SkillId, intensity: number) => void;
  setLabCommunicationStyle: (style: string) => void;
  resetLab: () => void;
}

const defaultState: AppState = {
  version: 1,
  savedProfiles: [],
  builderProfile: {
    baseType: 'INTP',
    skills: [
      { skillId: 'analytical', intensity: 90 },
      { skillId: 'research', intensity: 80 },
    ],
    communicationStyle: 'Technical',
  },
  selectedComparisons: ['ISTP', 'INTP', 'ENTP', 'INTJ'],
  compareQuestion: 'My application keeps crashing randomly. How should I debug it?',
  labQuestion: 'How should we approach architecting a scalable, high-concurrency backend?',
  labBaseType: 'INTP',
  labSkills: [
    { skillId: 'analytical', intensity: 90 },
    { skillId: 'research', intensity: 80 },
  ],
  labCommunicationStyle: 'Technical',
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      // ── Builder ────────────────────────────────────────────────────────────
      setBuilderBaseType: (type) =>
        set((s) => {
          const profile = mbtiProfiles.find((p) => p.type === type);
          const defaultSkills = profile?.recommendedSkills.slice(0, 2).map((sid) => ({
            skillId: sid,
            intensity: 80,
          })) ?? [];

          return {
            builderProfile: {
              ...s.builderProfile,
              baseType: type,
              skills: s.builderProfile.skills && s.builderProfile.skills.length > 0
                ? s.builderProfile.skills
                : defaultSkills,
            },
          };
        }),

      setBuilderName: (name) =>
        set((s) => ({ builderProfile: { ...s.builderProfile, name } })),

      addBuilderSkill: (skillId) =>
        set((s) => {
          const existing = s.builderProfile.skills || [];
          if (existing.find((sk) => sk.skillId === skillId)) return s;
          return {
            builderProfile: {
              ...s.builderProfile,
              skills: [...existing, { skillId, intensity: 80 }],
            },
          };
        }),

      removeBuilderSkill: (skillId) =>
        set((s) => ({
          builderProfile: {
            ...s.builderProfile,
            skills: (s.builderProfile.skills || []).filter((sk) => sk.skillId !== skillId),
          },
        })),

      setSkillIntensity: (skillId, rawIntensity) =>
        set((s) => ({
          builderProfile: {
            ...s.builderProfile,
            skills: (s.builderProfile.skills || []).map((sk) =>
              sk.skillId === skillId
                ? { ...sk, intensity: clampIntensity(rawIntensity) }
                : sk
            ),
          },
        })),

      reorderSkills: (skills) =>
        set((s) => ({
          builderProfile: {
            ...s.builderProfile,
            skills: skills.map((sk) => ({ ...sk, intensity: clampIntensity(sk.intensity) })),
          },
        })),

      setBuilderCommunication: (style) =>
        set((s) => ({
          builderProfile: {
            ...s.builderProfile,
            communicationStyle: style,
            communicationPreference: style,
          },
        })),

      setBuilderCommunicationStyle: (style) =>
        set((s) => ({
          builderProfile: {
            ...s.builderProfile,
            communicationStyle: style,
            communicationPreference: style,
          },
        })),

      setBuilderCustomInstructions: (customInstructions) =>
        set((s) => ({ builderProfile: { ...s.builderProfile, customInstructions } })),

      resetBuilder: () =>
        set({
          builderProfile: {
            baseType: 'INTP',
            skills: [],
            communicationStyle: 'Balanced',
          },
        }),

      loadBuilderProfile: (profile) =>
        set({
          builderProfile: {
            ...profile,
            skills: (profile.skills || []).map((sk) => ({
              ...sk,
              intensity: clampIntensity(sk.intensity),
            })),
          },
        }),

      generateRandomProfile: (richCognitive = true) => {
        const randomProfile = mbtiProfiles[Math.floor(Math.random() * mbtiProfiles.length)];
        const randomComm = communicationStyles[Math.floor(Math.random() * communicationStyles.length)];

        if (!richCognitive) {
          set({
            builderProfile: {
              baseType: randomProfile.type,
              skills: [],
              communicationStyle: randomComm,
            },
          });
          return;
        }

        // Generate rich cognitive profile: 2–4 skills with realistic weighted intensities
        const shuffledSkills = [...skills].sort(() => Math.random() - 0.5);
        const count = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 skills
        const selected = shuffledSkills.slice(0, count).map((sk, idx) => {
          // Dominant skills get higher intensities
          const baseIntensities = [95, 80, 65, 45];
          const variance = Math.floor(Math.random() * 10) - 5;
          return {
            skillId: sk.id,
            intensity: clampIntensity(baseIntensities[idx] + variance),
          };
        });

        const generatedName = generateCognitiveProfileName(randomProfile.type, selected);

        set({
          builderProfile: {
            baseType: randomProfile.type,
            name: generatedName,
            skills: selected,
            communicationStyle: randomComm,
          },
        });
      },

      // ── Saved profiles ─────────────────────────────────────────────────────
      saveCurrentProfile: () => {
        const { builderProfile, savedProfiles } = get();
        if (!builderProfile.baseType) return;

        const autoName = generateCognitiveProfileName(
          builderProfile.baseType,
          builderProfile.skills || []
        );

        const newProfile: CognitiveProfile = {
          id: nanoid(),
          version: 1,
          name: builderProfile.name || autoName,
          baseType: builderProfile.baseType,
          skills: (builderProfile.skills || []).map((sk) => ({
            ...sk,
            intensity: clampIntensity(sk.intensity),
          })),
          communicationStyle: builderProfile.communicationStyle || 'Balanced',
          customInstructions: builderProfile.customInstructions,
          createdAt: new Date().toISOString(),
        };

        set({ savedProfiles: [newProfile, ...savedProfiles] });
      },

      deleteSavedProfile: (id) =>
        set((s) => ({ savedProfiles: s.savedProfiles.filter((p) => p.id !== id) })),

      loadSavedProfile: (id) => {
        const profile = get().savedProfiles.find((p) => p.id === id);
        if (profile) set({ builderProfile: profile });
      },

      // ── Compare ────────────────────────────────────────────────────────────
      addComparison: (id) =>
        set((s) => {
          if (s.selectedComparisons.includes(id) || s.selectedComparisons.length >= 4) return s;
          return { selectedComparisons: [...s.selectedComparisons, id] };
        }),

      removeComparison: (id) =>
        set((s) => ({
          selectedComparisons: s.selectedComparisons.filter((t) => t !== id),
        })),

      clearComparisons: () => set({ selectedComparisons: [], compareQuestion: '' }),

      setCompareQuestion: (compareQuestion) => set({ compareQuestion }),

      // ── Lab ────────────────────────────────────────────────────────────────
      setLabQuestion: (labQuestion) => set({ labQuestion }),

      setLabBaseType: (labBaseType) => set({ labBaseType }),

      addLabSkill: (skillId) =>
        set((s) => {
          if (s.labSkills.find((sk) => sk.skillId === skillId)) return s;
          return { labSkills: [...s.labSkills, { skillId, intensity: 80 }] };
        }),

      removeLabSkill: (skillId) =>
        set((s) => ({ labSkills: s.labSkills.filter((sk) => sk.skillId !== skillId) })),

      setLabSkillIntensity: (skillId, intensity) =>
        set((s) => ({
          labSkills: s.labSkills.map((sk) =>
            sk.skillId === skillId ? { ...sk, intensity: clampIntensity(intensity) } : sk
          ),
        })),

      setLabCommunicationStyle: (labCommunicationStyle) => set({ labCommunicationStyle }),

      resetLab: () =>
        set({
          labQuestion: '',
          labBaseType: null,
          labSkills: [],
          labCommunicationStyle: 'Balanced',
        }),
    }),
    {
      name: 'mbti-ai-skills-storage-v1.1',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0 || !persistedState || typeof persistedState !== 'object') {
          return defaultState;
        }
        return persistedState as AppState;
      },
      partialize: (state) => ({
        version: state.version,
        savedProfiles: state.savedProfiles,
        builderProfile: state.builderProfile,
        selectedComparisons: state.selectedComparisons,
        compareQuestion: state.compareQuestion,
      }),
    }
  )
);
