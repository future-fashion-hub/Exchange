import type { TPlace } from '@api/types';
import { describe, expect, it } from 'vitest';
import { prepareSkillsToRender } from './prepareSkillsToRender';

const subcategories: TPlace[] = [
  { id: 1, name: 'UI' },
  { id: 2, name: 'UX' },
  { id: 3, name: 'Front-end Development' }
];

describe('prepareSkillsToRender', () => {
  it('returns empty payload when no matched skills', () => {
    expect(prepareSkillsToRender([], subcategories)).toEqual({
      skillsCanRender: [],
      isRest: false,
      rest: 0
    });
  });

  it('renders two short skills without remainder', () => {
    expect(prepareSkillsToRender([1, 2], subcategories)).toEqual({
      skillsCanRender: ['UI', 'UX'],
      isRest: false,
      rest: 0
    });
  });

  it('renders first skill and keeps remainder counter for long names', () => {
    expect(prepareSkillsToRender([3, 2, 1], subcategories)).toEqual({
      skillsCanRender: ['Front-end Development'],
      isRest: true,
      rest: 2
    });
  });
});
