import React, { useState, useEffect } from "react";
import { Dropdown } from "../../shared/ui/input/input-dropdown/InputDropdown";
import { GroupedSubcategoryDropdown } from "../../shared/ui/input/input-dropdown/GroupedSubcategoryDropdown";
import { genderOptions } from "../../shared/ui/input/input-dropdown/dropdownData";
import { TCategory, TSubcategory } from "@api/types";
import { getSkillsCategoriesApi, getSkillsSubCategoriesApi } from "@api/Api";


export const DropdownGroupedDemo = () => {
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [subcategories, setSubcategories] = useState<TSubcategory[]>([]);

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await getSkillsCategoriesApi();
        const subcategoriesResponse = await getSkillsSubCategoriesApi();

        setCategories(categoriesResponse.categories);
        setSubcategories(subcategoriesResponse.subcategories);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchData();
  }, []);

  // Функция-обертка для одиночного выбора
  const handleGenderChange = (value: string | string[]) => {
    if (typeof value === "string") {
      setSelectedGender(value);
    }
  };

  // Функция-обертка для множественного выбора категорий
  const handleCategoriesChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setSelectedCategories(value);
    }
  };

  // Обработчик выбора подкатегории
  const handleSubcategoryToggle = (subcategoryId: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  // Преобразование категорий в формат для Dropdown
  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      {/* Одиночный выбор - пол */}
      <Dropdown
        value={selectedGender}
        onChange={handleGenderChange}
        options={genderOptions}
        label="Пол"
        placeholder="Выберите пол"
      />

      {/* Множественный выбор - категории навыков */}
      <Dropdown
        value={selectedCategories}
        onChange={handleCategoriesChange}
        options={categoryOptions}
        multiple={true}
        label="Категория навыка, которому хотите научиться"
        placeholder="Выберите категорию"
      />

      {/* Группированный выбор - подкатегории навыков */}
      <GroupedSubcategoryDropdown
        selectedSubcategoryIds={selectedSubcategories}
        onSubcategoryToggle={handleSubcategoryToggle}
        categories={categories}
        subcategories={subcategories}
        selectedCategoryIds={selectedCategories}
        label="Подкатегория навыка, которому хотите научиться"
        placeholder="Выберите подкатегорию"
      />
    </div>
  );
};