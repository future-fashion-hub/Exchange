import { useState, useEffect } from "react";
import { Input } from "../../shared/ui/input/Input";
import { Dropdown } from "../../shared/ui/input/input-dropdown/InputDropdown";
import { Textarea } from "../../shared/ui/textarea/Textarea";
import { Button } from "../../shared/ui/button/Button";
import { DragDrop } from "../../shared/ui/dragdrop/DragDrop";
import {
  getSkillsCategoriesApi,
  getSkillsSubCategoriesApi,
} from "../../api/Api";
import { TCategory, TSubcategory } from "../../api/types";
import styles from "./SkillForm.module.css";

type SkillFormProps = {
  onBack: () => void;
  onContinue: () => void;
};

export const SkillForm: React.FC<SkillFormProps> = ({ onBack, onContinue }) => {
  const [skillName, setSkillName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [subcategories, setSubcategories] = useState<TSubcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    TSubcategory[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Загрузка категорий и подкатегорий
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await getSkillsCategoriesApi();
        const subcategoriesResponse = await getSkillsSubCategoriesApi();
        setCategories(categoriesResponse.categories || []);
        setSubcategories(subcategoriesResponse.subcategories || []);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };
    fetchData();
  }, []);

  // Фильтрация подкатегорий при выборе категории
  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter(
        (subcat) => subcat.categoryId.toString() === selectedCategory
      );
      setFilteredSubcategories(filtered);
      setSelectedSubCategory("");
    } else {
      setFilteredSubcategories(subcategories);
    }
  }, [selectedCategory, subcategories]);

  // Проверка валидности полей
  const getFieldStatus = (
    field: string,
    value: string | File | null
  ): "error" | "default" => {
    switch (field) {
      case "skillName":
        return value &&
          typeof value === "string" &&
          (value.length < 3 || value.length > 50)
          ? "error"
          : "default";
      case "description":
        return value &&
          typeof value === "string" &&
          (value.length === 0 || value.length > 500)
          ? "error"
          : "default";
      case "selectedCategory":
        return !value ? "error" : "default";
      case "selectedSubCategory":
        return !value ? "error" : "default";
      case "image":
        if (value && value instanceof File) {
          return value.size > 2 * 1024 * 1024 ||
            !["image/jpeg", "image/png"].includes(value.type)
            ? "error"
            : "default";
        }
        return "default";
      default:
        return "default";
    }
  };
  // Проверка валидности формы для кнопки
  const isFormValid = (): boolean => {
    return (
      skillName.trim().length >= 3 &&
      skillName.trim().length <= 50 &&
      description.trim().length > 0 &&
      description.length <= 500 &&
      selectedCategory !== "" &&
      selectedSubCategory !== "" &&
      (!imageFile ||
        (imageFile.size <= 2 * 1024 * 1024 &&
          ["image/jpeg", "image/png"].includes(imageFile.type)))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onContinue();
    }
  };

  const handleImageChange = (files: File[]) => {
    setImageFile(files[0] || null);
  };

  // Опции для Dropdown
  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const subcategoryOptions = filteredSubcategories.map((subcategory) => ({
    value: subcategory.id.toString(),
    label: subcategory.name,
  }));

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.inputGroup}>
          <Input
            label="Название навыка"
            placeholder="Введите название вашего навыка"
            value={skillName}
            onChange={setSkillName}
            id="skillName"
            required={true}
            status={getFieldStatus("skillName", skillName)}
          />

          <Dropdown
            value={selectedCategory}
            onChange={(value) =>
              typeof value === "string" && setSelectedCategory(value)
            }
            options={categoryOptions}
            label="Категория навыка"
            placeholder="Выберите категорию"
            status={getFieldStatus("selectedCategory", selectedCategory)}
          />

          <Dropdown
            value={selectedSubCategory}
            onChange={(value) =>
              typeof value === "string" && setSelectedSubCategory(value)
            }
            options={subcategoryOptions}
            label="Подкатегория навыка"
            placeholder="Выберите подкатегорию"
            status={getFieldStatus("selectedSubCategory", selectedSubCategory)}
          />

          <Textarea
            label="Описание"
            value={description}
            onChange={setDescription}
            placeholder="Коротко опишите, чему можете научить"
            rows={4}
            showEditIcon={false}
            required={true}
            status={getFieldStatus("description", description)}
          />

          <DragDrop onChange={handleImageChange} />
        </fieldset>

        <div className={styles.buttonGroup}>
          <Button type="button" onClick={onBack} className={styles.backButton}>
            Назад
          </Button>
          <Button colored type="submit" disabled={!isFormValid()}>
            Продолжить
          </Button>
        </div>
      </form>
    </div>
  );
};
