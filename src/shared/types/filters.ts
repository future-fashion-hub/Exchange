// src\shared\types\filters.ts

export const SKILL_TYPES = {
  ALL: 'all',
  WANT_TO_LEARN: 'want-to-learn',
  CAN_TEACH: 'can-teach',
} as const;

export type TSkillType = (typeof SKILL_TYPES)[keyof typeof SKILL_TYPES];