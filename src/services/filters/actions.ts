import { AppDispatch, RootState } from '@store';
import { setQuery, setSubcategories, setSkillType } from './filters-slice';
import { subcategoryIdsByQuery } from '../../shared/lib/helpers';
import { resetFilteredUsers } from '../filteredUsers/filtered-users-slice';
import { getFilteredUsersThunk } from '../filteredUsers/actions';
import { SKILL_TYPES } from '../../shared/types/filters';

export const applySearchQuery = (query: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const q = (query ?? '').trim();
    const { categories, subcategories } = state.categories;
    const { gender, places } = state.filters;
    const isShort = q.length < 3;

    dispatch(setQuery(q));

    const ids = isShort ? [] : subcategoryIdsByQuery(q, categories, subcategories);
    dispatch(setSubcategories(ids));

    // По умолчанию ищем «Могу научить», чтобы искать по skill/subCategoryId
    dispatch(setSkillType(SKILL_TYPES.ALL));

    dispatch(resetFilteredUsers());
    dispatch(getFilteredUsersThunk({
      page: 1,
      gender,
      places,
      skillType: getState().filters.skillType,
      subcategories: ids,
      q: isShort ? '' : q
    }));
  };