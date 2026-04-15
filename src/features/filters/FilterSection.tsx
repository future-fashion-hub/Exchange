import React, { useState } from "react";
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

  const handlePlaceToggle = (placeName: string) => {
    const newPlaces = selectedPlaces.includes(placeName)
      ? selectedPlaces.filter((n) => n !== placeName)
      : [...selectedPlaces, placeName];
    onPlacesChange(newPlaces);
  };

  const genderGroupId = React.useId();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Фильтр по полу */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Пол автора</h3>
          <div className="space-y-3">
            {[
              { value: GENDERS.UNSPECIFIED, label: "Не имеет значения" },
              { value: GENDERS.MALE, label: "Мужской" },
              { value: GENDERS.FEMALE, label: "Женский" }
            ].map(gender => (
              <label key={gender.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name={`gender-${genderGroupId}`}
                  value={gender.value}
                  checked={selectedGender === gender.value}
                  onChange={(e) => onGenderChange(e.target.value as TGender)}
                  className="w-5 h-5 text-primary border-gray-300 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                  {gender.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Фильтр по городу */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Город</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mainPlaces.map((place) => (
              <label key={place.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedPlaces.includes(place.name)}
                  onChange={() => handlePlaceToggle(place.name)}
                  className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer transition-all"
                />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors text-sm">
                  {place.name}
                </span>
              </label>
            ))}
          </div>

          <button
            className="mt-4 flex items-center text-primary font-semibold hover:text-secondary transition-colors text-sm"
            onClick={() => setShowAllPlaces(!showAllPlaces)}
          >
            <span>{showAllPlaces ? "Скрыть города" : "Все города"}</span>
            <svg className={`w-4 h-4 ml-1 transform transition-transform ${showAllPlaces ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          {showAllPlaces && otherPlaces.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in-down">
              {otherPlaces.map((place) => (
                <label key={place.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedPlaces.includes(place.name)}
                    onChange={() => handlePlaceToggle(place.name)}
                    className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer transition-all"
                  />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors text-sm">
                    {place.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
