// src/features/filters/ActiveFiltersBar.tsx

import React from "react";
import styles from "./ActiveFiltersBar.module.css";
import { SKILL_TYPES, TSkillType } from "../../shared/types/filters";
import { GENDERS, TGender } from "@api/types";
import { RootState, useSelector } from "@store";

type Props = {
  selectedSkillType: TSkillType;
  selectedGender: TGender;
  selectedPlaces: string[];
  selectedSubcategories: number[];

  onSkillTypeChange: (value: TSkillType) => void;
  onChangeGender: (value: TGender) => void;
  onChangePlaces: (values: string[]) => void;
  onSubcategoryToggle: (subcategoryId: number) => void;
};

export const SKILL_TYPE_LABELS: Record<TSkillType, string> = {
  [SKILL_TYPES.ALL]: "Все навыки",
  [SKILL_TYPES.WANT_TO_LEARN]: "Хочу научиться",
  [SKILL_TYPES.CAN_TEACH]: "Могу научить",
};

export const GENDER_LABELS: Record<TGender, string> = {
  [GENDERS.MALE]: "Мужчины",
  [GENDERS.FEMALE]: "Женщины",
  [GENDERS.UNSPECIFIED]: "Пол не выбран",
};

export const ActiveFiltersBar: React.FC<Props> = (props) => {
  const {
    selectedSkillType,
    selectedGender,
    selectedPlaces,
    selectedSubcategories,

    onSkillTypeChange,
    onChangeGender,
    onChangePlaces,
    onSubcategoryToggle,
  } = props;
  
  const subcategories = useSelector(
    (s: RootState) => s.categories.subcategories
  );

  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (selectedSkillType !== SKILL_TYPES.ALL) {
    chips.push({
        key: "skillType",
        label:  SKILL_TYPE_LABELS[selectedSkillType],
        onRemove: () => onSkillTypeChange(SKILL_TYPES.ALL),
    });
  }

  if (selectedGender !== GENDERS.UNSPECIFIED) {
    chips.push({
      key: "gender",
      label: GENDER_LABELS[selectedGender],
      onRemove: () => onChangeGender(GENDERS.UNSPECIFIED),
    });
  }

  selectedPlaces.forEach((placeName) =>
    chips.push({
      key: `place-${placeName}`,
      label: placeName,
      onRemove: () =>
        onChangePlaces(selectedPlaces.filter((x) => x !== placeName)),
    })
  );

  selectedSubcategories.forEach((id) => {
    const subcat = subcategories.find((s) => s.id === id);
    chips.push({
      key: `subcat-${id}`,
      label: subcat?.name ?? `Подкатегория ${id}`,
      onRemove: () => onSubcategoryToggle(id),
    });
  });




  if (!chips.length) return null;

  return (
    <div className={styles.wrap} role="region" aria-label="Активные фильтры">
        <div className={styles.chips}>
        {chips.map((chip) => (
            <span key={chip.key} className={styles.chip}>
            <span className={styles.chipText}>{chip.label}</span>
            <button
                type="button"
                className={styles.close}
                aria-label={`Убрать фильтр: ${chip.label}`}
                onClick={chip.onRemove}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.7438 8.28919L8.25847 16.7745C7.96856 17.0644 7.48772 17.0644 7.19781 16.7745C6.9079 16.4846 6.9079 16.0037 7.19781 15.7138L15.6831 7.22853C15.973 6.93861 16.4538 6.93861 16.7438 7.22853C17.0337 7.51844 17.0337 7.99927 16.7438 8.28919Z" fill="#253017"/>
                <path d="M16.7438 16.7734C16.4538 17.0633 15.973 17.0633 15.6831 16.7734L7.19781 8.28814C6.9079 7.99823 6.9079 7.5174 7.19781 7.22748C7.48772 6.93757 7.96856 6.93757 8.25847 7.22748L16.7438 15.7128C17.0337 16.0027 17.0337 16.4835 16.7438 16.7734Z" fill="#253017"/>
                </svg>
            </button>
            </span>
        ))}
        </div>
    </div>
    );
};
