// src\features\filters\FilterSection.tsx

import React, { useState } from "react";
import styles from "./FilterSection.module.css";
import { Icon } from "../../shared/ui/icon/Icon";
import { RootState, useSelector } from "@store";
import { GENDERS, TGender } from "@api/types";

interface FilterSectionProps {
  onGenderChange: (value: TGender) => void;
  onPlacesChange: (selectedPlaces: string[]) => void;

  selectedGender: TGender;
  selectedPlaces: string[];
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  onGenderChange,
  onPlacesChange,
  selectedGender,
  selectedPlaces,
}) => {
  const places = useSelector((state: RootState) => state.places.places);
  const [showAllPlaces, setShowAllPlaces] = useState(false);

  const mainPlaces = places.slice(0, 5);
  const otherPlaces = places.slice(5);

  // добавляем/убираем из списка мест
  const handlePlaceToggle = (placeName: string) => {
    const newPlaces = selectedPlaces.includes(placeName)
      ? selectedPlaces.filter((n) => n !== placeName)
      : [...selectedPlaces, placeName];
    onPlacesChange(newPlaces);
  };

  const genderGroupId = React.useId();

  return (
    <div className={styles.filter}>
      {/* Фильтр по полу */}
      <div className={styles.group}>
        <h3 className={styles.title}>Пол автора</h3>
        <div className={styles.items}>
          <label className={styles.item}>
            <input
              type="radio"
              name={`gender-${genderGroupId}`}
              value={GENDERS.UNSPECIFIED}
              checked={selectedGender === GENDERS.UNSPECIFIED}
              onChange={(e) => onGenderChange(e.target.value as TGender)}
              className={styles.input}
            />
            <span className={styles.radio}></span>
            <span className={styles.text}>Не имеет значения</span>
          </label>
          <label className={styles.item}>
            <input
              type="radio"
              name={`gender-${genderGroupId}`}
              value={GENDERS.MALE}
              checked={selectedGender === GENDERS.MALE}
              onChange={(e) => onGenderChange(e.target.value as TGender)}
              className={styles.input}
            />
            <span className={styles.radio}></span>
            <span className={styles.text}>Мужской</span>
          </label>
          <label className={styles.item}>
            <input
              type="radio"
              name={`gender-${genderGroupId}`}
              value={GENDERS.FEMALE}
              checked={selectedGender === GENDERS.FEMALE}
              onChange={(e) => onGenderChange(e.target.value as TGender)}
              className={styles.input}
            />
            <span className={styles.radio}></span>
            <span className={styles.text}>Женский</span>
          </label>
        </div>
      </div>

      {/* Фильтр по городу */}
      <div className={styles.group}>
        <h3 className={styles.title}>Город</h3>

        {/* Основные города */}
        <div className={styles.items}>
          {mainPlaces.map((place) => (
            <label key={place.id} className={styles.item}>
              <input
                type="checkbox"
                checked={selectedPlaces.includes(place.name)}
                onChange={() => handlePlaceToggle(place.name)}
                className={styles.input}
              />
              <span className={styles.checkbox}></span>
              <span className={styles.text}>{place.name}</span>
            </label>
          ))}

          {/* Переключатель с выпадающим списком */}
          <div
            className={styles.toggle}
            onClick={() => setShowAllPlaces(!showAllPlaces)}
          >
            <span className={styles.text}>Все города</span>
            <Icon
              name={showAllPlaces ? "chevronUp" : "chevronDown"}
              size="s"
              className={styles.icon}
            />
          </div>
        </div>

        {/* Выпадающий список со всеми остальными городами */}
        {showAllPlaces && otherPlaces.length > 0 && (
          <div className={styles.dropdown}>
            <div className={styles.items}>
              {otherPlaces.map((place) => (
                <label key={place.id} className={styles.item}>
                  <input
                    type="checkbox"
                    checked={selectedPlaces.includes(place.name)}
                    onChange={() => handlePlaceToggle(place.name)}
                    className={styles.input}
                  />
                  <span className={styles.checkbox}></span>
                  <span className={styles.text}>{place.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
