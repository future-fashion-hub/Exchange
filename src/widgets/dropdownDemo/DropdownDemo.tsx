import { useState, useEffect } from "react";
import { Dropdown } from "../../shared/ui/input/input-dropdown/InputDropdown";
import { genderOptions } from "../../shared/ui/input/input-dropdown/dropdownData";
import {
  getSkillsCategoriesApi,
  getSkillsSubCategoriesApi,
} from "../../api/Api";
import { TCategory, TSubcategory } from "../../api/types";

export const DropdownDemo = () => {
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [subcategories, setSubcategories] = useState<TSubcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    TSubcategory[]
  >([]);

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

  // Фильтрация подкатегорий по выбранным категориям
  useEffect(() => {
    if (selectedCategories.length > 0) {
      const filtered = subcategories.filter((subcat) =>
        selectedCategories.includes(subcat.categoryId.toString())
      );
      setFilteredSubcategories(filtered);
    } else {
      // Если категории не выбраны, показываем все подкатегории
      setFilteredSubcategories(subcategories);
    }
  }, [selectedCategories, subcategories]);

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
    // Сбрасываем подкатегории только если переходим от отсутствия категорий к выбору категорий
    // или наоборот, но не сбрасываем при переходе между разными наборами категорий
    if ((value.length > 0 && selectedCategories.length === 0) || 
        (value.length === 0 && selectedCategories.length > 0)) {
      setSelectedSubcategories([]);
    }
  }
};

  // Функция-обертка для множественного выбора подкатегорий
  const handleSubcategoriesChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setSelectedSubcategories(value);
    }
  };

  // Преобразование категорий в формат для Dropdown
  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  // Преобразование подкатегорий в формат для Dropdown
  const subcategoryOptions = filteredSubcategories.map((subcategory) => ({
    value: subcategory.id.toString(),
    label: subcategory.name,
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

      {/* Множественный выбор - подкатегории навыков */}
      <Dropdown
        value={selectedSubcategories}
        onChange={handleSubcategoriesChange}
        options={subcategoryOptions}
        multiple={true}
        label="Подкатегория навыка, которому хотите научиться"
        placeholder="Выберите подкатегорию"
      />
    </div>
  );
};
