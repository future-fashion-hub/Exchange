import type { TCategory, TSubcategory } from '@api/types';
import { describe, expect, it } from 'vitest';
import { subcategoryIdsByQuery, toAbsoluteServerUrl } from './helpers';

describe('helpers', () => {
  it('converts relative path to absolute server url', () => {
    expect(toAbsoluteServerUrl('/uploads/avatar.png')).toBe('http://localhost:5000/uploads/avatar.png');
    expect(toAbsoluteServerUrl('uploads/avatar.png')).toBe('http://localhost:5000/uploads/avatar.png');
    expect(toAbsoluteServerUrl('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png');
  });

  it('finds subcategories by direct subcategory match', () => {
    const categories: TCategory[] = [
      { id: 1, name: 'Design', color: '#fff', icon: 'briefcase' },
      { id: 2, name: 'Programming', color: '#000', icon: 'book' }
    ];
    const subcategories: TSubcategory[] = [
      { id: 10, categoryId: 1, name: 'UI', color: '#aaa' },
      { id: 11, categoryId: 1, name: 'UX', color: '#bbb' },
      { id: 12, categoryId: 2, name: 'Node', color: '#ccc' }
    ];

    expect(subcategoryIdsByQuery('node', categories, subcategories)).toEqual([12]);
  });

  it('finds all subcategories when category name matches', () => {
    const categories: TCategory[] = [
      { id: 1, name: 'Design', color: '#fff', icon: 'briefcase' },
      { id: 2, name: 'Programming', color: '#000', icon: 'book' }
    ];
    const subcategories: TSubcategory[] = [
      { id: 10, categoryId: 1, name: 'UI', color: '#aaa' },
      { id: 11, categoryId: 1, name: 'UX', color: '#bbb' },
      { id: 12, categoryId: 2, name: 'Node', color: '#ccc' }
    ];

    expect(subcategoryIdsByQuery('design', categories, subcategories).sort((a, b) => a - b)).toEqual([10, 11]);
  });
});
