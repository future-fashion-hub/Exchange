import React, { useState, useEffect } from "react";
import styles from "./RegisterStep2.module.css";
import { Button } from "../../shared/ui/button/Button";
import { Input } from "../../shared/ui/input/Input";
import { DatePicker } from "../../shared/ui/date-picker/DatePicker";
import { Dropdown } from "../../shared/ui/input/input-dropdown/InputDropdown";
import { GroupedSubcategoryDropdown } from "../../shared/ui/input/input-dropdown/GroupedSubcategoryDropdown";
import { genderOptions } from "../../shared/ui/input/input-dropdown/dropdownData";
import {
  getSkillsCategoriesApi,
  getSkillsSubCategoriesApi,
  getPlacesApi,
} from "../../api/Api";
import { TCategory, TSubcategory, TPlace } from "../../api/types";
import { Icon } from "../../shared/ui/icon/Icon";

export interface RegisterStep2Data {
  name: string;
  birthdate: Date | null;
  gender: string;
  city: string;
  selectedCategories: string[];
  selectedSubcategories: string[];
  avatar?: string;
}

interface RegisterStep2Props {
  onBack: () => void;
  onContinue: (data: RegisterStep2Data) => void;
  initialData?: Partial<RegisterStep2Data>;
}

export const RegisterStep2: React.FC<RegisterStep2Props> = ({
  onBack,
  onContinue,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<RegisterStep2Data>({
    name: initialData.name || "",
    birthdate: initialData.birthdate || null,
    gender: initialData.gender || "",
    city: initialData.city || "",
    selectedCategories: initialData.selectedCategories || [],
    selectedSubcategories: initialData.selectedSubcategories || [],
    avatar: initialData.avatar || "",
  });

  const [categories, setCategories] = useState<TCategory[]>([]);
  const [subcategories, setSubcategories] = useState<TSubcategory[]>([]);
  const [cities, setCities] = useState<TPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameError, setNameError] = useState("Имя обязательно");
  const [cityError, setCityError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [subcategoryError, setSubcategoryError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, subcategoriesResponse, placesResponse] =
          await Promise.all([
            getSkillsCategoriesApi(),
            getSkillsSubCategoriesApi(),
            getPlacesApi(),
          ]);

        setCategories(categoriesResponse.categories || []);
        setSubcategories(subcategoriesResponse.subcategories || []);
        setCities(placesResponse.places || []);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateName = (name: string): string => {
    if (!name.trim()) {
      return "Имя обязательно";
    }

    // Проверка на только цифры
    if (/^\d+$/.test(name)) {
      return "Имя не может состоять только из цифр";
    }

    // Проверка на только специальные символы
    if (/^[^\wа-яА-Я]+$/i.test(name)) {
      return "Имя не может состоять только из специальных символов";
    }

    // Проверка на минимальную длину
    if (name.trim().length < 2) {
      return "Имя должно быть не менее 2 символов";
    }

    return "";
  };

  const handleInputChange = (
    field: keyof RegisterStep2Data,
    value: string | Date | null | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Валидация при изменении полей
    if (field === "name" && typeof value === "string") {
      const error = validateName(value);
      setNameError(error);
    }

    // Валидация города
    if (field === "city" && typeof value === "string") {
      setCityError(value ? "" : "Город обязателен");
    }

    // Валидация категории
    if (field === "selectedCategories") {
      setCategoryError(
        Array.isArray(value) && value.length > 0 ? "" : "Выберите категорию"
      );
    }

    // Валидация подкатегории
    if (field === "selectedSubcategories") {
      setSubcategoryError(
        Array.isArray(value) && value.length > 0 ? "" : "Выберите подкатегорию"
      );
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange("avatar", e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = (): boolean => {
    return (
      formData.name.trim() !== "" &&
      nameError === "" &&
      formData.birthdate !== null &&
      formData.city.trim() !== "" &&
      cityError === "" &&
      formData.selectedCategories.length > 0 &&
      categoryError === "" &&
      formData.selectedSubcategories.length > 0 &&
      subcategoryError === ""
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameValidationError = validateName(formData.name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    if (isFormValid()) {
      onContinue(formData);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  const cityOptions = cities.map((city) => ({
    value: city.id.toString(),
    label: city.name,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  return (
    <div className={styles.registerStep2}>
      <div className={styles.content}>
        {/* Аватар */}
        <div className={styles.avatarSection}>
          <label htmlFor="avatar-upload" className={styles.avatarUploadLabel}>
            <div className={styles.avatarContainer}>
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Аватар"
                  className={styles.avatar}
                />
              ) : (
                <Icon
                  name="userCircle"
                  size={54}
                  strokeWidth={0.5}
                  className={styles.avatarIcon}
                />
              )}
              <div className={styles.addButton}>
                <Icon name="add" size={16} className={styles.addIcon} />
              </div>
            </div>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {/* Форма */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Имя"
            value={formData.name}
            onChange={(value) => handleInputChange("name", value)}
            placeholder="Введите ваше имя"
            required={true}
            status={nameError ? "error" : "default"}
            errorMessage={nameError}
          />

          <div className={styles.row}>
            <div className={styles.rowItem}>
              <DatePicker
                label="Дата рождения"
                selected={formData.birthdate}
                onChange={(date) => handleInputChange("birthdate", date)}
                placeholder="дд.мм.гггг"
              />
            </div>

            <div className={styles.rowItem}>
              <Dropdown
                label="Пол"
                value={formData.gender}
                onChange={(value) => handleInputChange("gender", value)}
                options={genderOptions}
                placeholder="Не указан"
              />
            </div>
          </div>

          <Dropdown
            label="Город"
            value={formData.city}
            onChange={(value) => handleInputChange("city", value)}
            options={cityOptions}
            placeholder="Не указан"
            searchable={true}
            status={cityError ? "error" : "default"}
          />

          <Dropdown
            label="Категория навыка, которому хотите научиться"
            value={formData.selectedCategories}
            onChange={(value) => handleInputChange("selectedCategories", value)}
            options={categoryOptions}
            multiple={true}
            placeholder="Выберите категории"
            status={categoryError ? "error" : "default"}
          />

          <GroupedSubcategoryDropdown
            label="Подкатегория навыка, которому хотите научиться"
            selectedSubcategoryIds={formData.selectedSubcategories}
            onSubcategoryToggle={(subcategoryId) => {
              const newSubcategories = formData.selectedSubcategories.includes(
                subcategoryId
              )
                ? formData.selectedSubcategories.filter(
                    (id) => id !== subcategoryId
                  )
                : [...formData.selectedSubcategories, subcategoryId];
              handleInputChange("selectedSubcategories", newSubcategories);
            }}
            categories={categories}
            subcategories={subcategories}
            selectedCategoryIds={formData.selectedCategories}
            placeholder="Выберите подкатегории"
            status={subcategoryError ? "error" : "default"}
          />

          <div className={styles.buttons}>
            <Button
              type="button"
              size={208}
              onClick={onBack}
              className={styles.backButton}
            >
              Назад
            </Button>

            <Button
              type="submit"
              size={208}
              colored={true}
              disabled={!isFormValid()}
              className={styles.continueButton}
            >
              Продолжить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
