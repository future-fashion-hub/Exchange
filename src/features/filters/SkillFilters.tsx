// src\features\filters\SkillFilters.tsx

import React, { useState } from 'react';
import styles from './SkillFilters.module.css';
import { Icon } from '../../shared/ui/icon/Icon';
import { TCategory, TSubcategory } from '../../api/types';
import { SKILL_TYPES, TSkillType } from '../../shared/types/filters';
import { setSubcategories } from '../../services/filters/filters-slice';
import { useDispatch } from '@store';

interface SkillFiltersProps {
  onSkillTypeChange: (type: TSkillType) => void;
  selectedSkillType: TSkillType;
  selectedSubcategories: number[];
  onSubcategoryToggle: (subcategoryId: number) => void;
  categories: TCategory[];
  subcategories: TSubcategory[];
}

export const SkillFilters: React.FC<SkillFiltersProps> = ({
  onSkillTypeChange,
  selectedSkillType,
  selectedSubcategories,
  onSubcategoryToggle,
  categories = [],
  subcategories = [],
}) => {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const skillTypeGroupId = React.useId()
  const dispatch = useDispatch();

  const handleCategoryExpand = (categoryId: number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getSubcategoriesForCategory = (categoryId: number) => {
    return subcategories.filter(sub => sub.categoryId === categoryId);
  };

  const handleSkillTypeChange = (value: string): TSkillType => {
    if (value === SKILL_TYPES.ALL 
      || value === SKILL_TYPES.WANT_TO_LEARN 
      || value === SKILL_TYPES.CAN_TEACH
    ) {
      return value as TSkillType;
    }
    return SKILL_TYPES.ALL;
  };

  if (!categories || !Array.isArray(categories)) {
    return <div className={styles.skillFilters}>Загрузка категорий...</div>;
  }

  const handleCategoryToggle = (categoryId: number) => {
  const subs = getSubcategoriesForCategory(categoryId).map((s) => s.id);

  const allSelected = subs.every((id) => selectedSubcategories.includes(id));

  if (allSelected) {
    // 🚀 если все выбраны → убираем их
    dispatch(setSubcategories(
      selectedSubcategories.filter((id) => !subs.includes(id))
    ));
  } else {
    // 🚀 если не все выбраны → добавляем недостающие
    const newSubs = subs.filter((id) => !selectedSubcategories.includes(id));
    dispatch(setSubcategories([...selectedSubcategories, ...newSubs]));
  }

};

  return (
    <div className={styles.skillFilters}>
      {/* Фильтр по типу навыка */}
      <div className={styles.group}>
        <h3 className={styles.title}>Тип навыка</h3>
        <div className={styles.items}>
          <label className={styles.item}>
            <input
              type="radio"
              name={`skill-type-${skillTypeGroupId}`}
              value={SKILL_TYPES.ALL}
              checked={selectedSkillType === SKILL_TYPES.ALL}
              onChange={(e) => onSkillTypeChange(handleSkillTypeChange(e.target.value))} 
              className={styles.input}
            />
            <span className={styles.radio}></span>
            <span className={styles.text}>Все</span>
          </label>
          <label className={styles.item}>
            <input
              type="radio"
              name={`skill-type-${skillTypeGroupId}`}
              value={SKILL_TYPES.WANT_TO_LEARN}
              checked={selectedSkillType === SKILL_TYPES.WANT_TO_LEARN}
              onChange={(e) => onSkillTypeChange(handleSkillTypeChange(e.target.value))} 
              className={styles.input}
            />
            <span className={styles.radio}></span>
            <span className={styles.text}>Хочу научиться</span>
          </label>
          <label className={styles.item}>
            <input
              type="radio"
              name={`skill-type-${skillTypeGroupId}`}
              value={SKILL_TYPES.CAN_TEACH}
              checked={selectedSkillType === SKILL_TYPES.CAN_TEACH}
              onChange={(e) => onSkillTypeChange(handleSkillTypeChange(e.target.value))} 
              className={styles.input}
            />
            <span className={styles.radio}></span>
            <span className={styles.text}>Могу научить</span>
          </label>
        </div>
      </div>

      {/* Фильтр по категориям навыков */}
      <div className={styles.group}>
        <h3 className={styles.title}>Навыки</h3>
        <div className={styles.items}>
          {categories.map((category) => {
            const categorySubs = getSubcategoriesForCategory(category.id);
            const isExpanded = expandedCategories.includes(category.id);
            const hasSubcategories = categorySubs.length > 0;

            return (
              <div key={category.id} className={styles.categoryItem}>
                <div className={styles.categoryHeader}>
                  <label className={styles.item}>
                    <input
                      type="checkbox"
                      checked={getSubcategoriesForCategory(category.id).every((s) =>
                        selectedSubcategories.includes(s.id)
                      )}
                      onChange={() => handleCategoryToggle(category.id)} 
                      // checked={selectedCategories.includes(category.id)}
                      className={styles.input}
                    />
                    <span className={styles.checkbox}></span>
                    <span className={styles.text}>{category.name}</span>
                  </label>
                  
                  {hasSubcategories && (
                    <button 
                      className={styles.expandButton}
                      onClick={() => handleCategoryExpand(category.id)}
                    >
                      <Icon 
                        name={isExpanded ? "chevronUp" : "chevronDown"} 
                        size="s" 
                      />
                    </button>
                  )}
                </div>

                {isExpanded && hasSubcategories && (
                  <div className={styles.subcategories}>
                    {categorySubs.map((subcategory) => (
                      <label key={subcategory.id} className={`${styles.item} ${styles.subcategoryItem}`}>
                        <input
                          type="checkbox"

                          checked={selectedSubcategories.includes(subcategory.id)}
                          onChange={() => onSubcategoryToggle(subcategory.id)}  

                          // checked={selectedCategories.includes(subcategory.id.toString())}
                          // onChange={() => onCategoryToggle(subcategory.id.toString())}
                          className={styles.input}
                        />
                        <span className={styles.checkbox}></span>
                        <span className={styles.text}>{subcategory.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};