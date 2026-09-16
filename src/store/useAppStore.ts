import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, UserProfile, MBTITypeCode, SkillIntensity, SkillId } from '../types';
import { nanoid } from '../utils/nanoid';

interface AppStore extends AppState {
  // Builder actions
  setBuilderBaseType: (type: MBTITypeCode) => void;
  setBuilderName: (name: string) => void;
  addBuilderSkill: (skillId: SkillId) => void;
  removeBuilderSkill: (skillId: SkillId) => void;
  setSkillIntensity: (skillId: SkillId, intensity: number) => void;
  reorderSkills: (skills: SkillIntensity[]) => void;
  setBuilderCommunication: (pref: string) => void;
  setBuilderCustomInstructions: (instructions: string) => void;
  resetBuilder: () => void;
  loadBuilderProfile: (profile: Partial<UserProfile>) => void;

  // Saved profiles
  saveCurrentProfile: () => void;
  deleteSavedProfile: (id: string) => void;
  loadSavedProfile: (id: string) => void;

  // Compare page
  addComparison: (type: MBTITypeCode) => void;
  removeComparison: (type: MBTITypeCode) => void;
  clearComparisons: () => void;
  setCompareQuestion: (q: string) => void;

  // Lab page
  setLabQuestion: (q: string) => void;
  setLabBaseType: (type: MBTITypeCode | null) => void;
  addLabSkill: (skillId: SkillId) => void;
  removeLabSkill: (skillId: SkillId) => void;
  setLabSkillIntensity: (skillId: SkillId, intensity: number) => void;
  resetLab: () => void;
}

const defaultState: AppState = {
  savedProfiles: [],
  builderProfile: {},
  selectedComparisons: [],
  compareQuestion: '',
  labQuestion: '',
  labBaseType: null,
  labSkills: [],
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      // ── Builder ────────────────────────────────────────────────────────────
      setBuilderBaseType: (type) =>
        set((s) => ({ builderProfile: { ...s.builderProfile, baseType: type } })),

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

      setSkillIntensity: (skillId, intensity) =>
        set((s) => ({
          builderProfile: {
            ...s.builderProfile,
            skills: (s.builderProfile.skills || []).map((sk) =>
              sk.skillId === skillId ? { ...sk, intensity } : sk
            ),
          },
        })),

      reorderSkills: (skills) =>
        set((s) => ({ builderProfile: { ...s.builderProfile, skills } })),

      setBuilderCommunication: (communicationPreference) =>
        set((s) => ({ builderProfile: { ...s.builderProfile, communicationPreference } })),

      setBuilderCustomInstructions: (customInstructions) =>
        set((s) => ({ builderProfile: { ...s.builderProfile, customInstructions } })),

      resetBuilder: () => set({ builderProfile: {} }),

      loadBuilderProfile: (profile) => set({ builderProfile: profile }),

      // ── Saved profiles ─────────────────────────────────────────────────────
      saveCurrentProfile: () => {
        const { builderProfile, savedProfiles } = get();
        if (!builderProfile.baseType) return;
        const newProfile: UserProfile = {
          id: nanoid(),
          name: builderProfile.name || `${builderProfile.baseType} Configuration`,
          baseType: builderProfile.baseType,
          skills: builderProfile.skills || [],
          communicationPreference: builderProfile.communicationPreference,
          customInstructions: builderProfile.customInstructions,
          createdAt: new Date().toISOString(),
        };
        set({ savedProfiles: [...savedProfiles, newProfile] });
      },

      deleteSavedProfile: (id) =>
        set((s) => ({ savedProfiles: s.savedProfiles.filter((p) => p.id !== id) })),

      loadSavedProfile: (id) => {
        const profile = get().savedProfiles.find((p) => p.id === id);
        if (profile) set({ builderProfile: profile });
      },

      // ── Compare ────────────────────────────────────────────────────────────
      addComparison: (type) =>
        set((s) => {
          if (s.selectedComparisons.includes(type) || s.selectedComparisons.length >= 4) return s;
          return { selectedComparisons: [...s.selectedComparisons, type] };
        }),

      removeComparison: (type) =>
        set((s) => ({
          selectedComparisons: s.selectedComparisons.filter((t) => t !== type),
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
            sk.skillId === skillId ? { ...sk, intensity } : sk
          ),
        })),

      resetLab: () => set({ labQuestion: '', labBaseType: null, labSkills: [] }),
    }),
    {
      name: 'mbti-ai-skills-storage',
      partialize: (state) => ({
        savedProfiles: state.savedProfiles,
        builderProfile: state.builderProfile,
        selectedComparisons: state.selectedComparisons,
        compareQuestion: state.compareQuestion,
      }),
    }
  )
);
