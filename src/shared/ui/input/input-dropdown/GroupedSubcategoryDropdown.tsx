import { FC, useState, useRef, useEffect, useMemo } from "react";
import styles from "./GroupedSubcategoryDropdown.module.css";
import clsx from "clsx";
import { Icon } from "../../icon/Icon";
import { TCategory, TSubcategory } from "../../../../api/types";

interface GroupedSubcategoryDropdownProps {
  selectedSubcategoryIds: string[];
  onSubcategoryToggle: (subcategoryId: string) => void;
  categories: TCategory[];
  subcategories: TSubcategory[];
  selectedCategoryIds: string[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  status?: "error" | "default" | "success" | "hint";
}

export const GroupedSubcategoryDropdown: FC<GroupedSubcategoryDropdownProps> = ({
  selectedSubcategoryIds,
  onSubcategoryToggle,
  categories,
  subcategories,
  selectedCategoryIds,
  placeholder = "Выберите подкатегории",
  label,
  disabled = false,
  status = "default",
}) => {
  const isError = status === "error";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Группируем подкатегории по категориям
  const groupedSubcategories = useMemo(() => {
    const groups: { category: TCategory; subcategories: TSubcategory[] }[] = [];
    
    // Если не выбрано ни одной категории, показываем все подкатегории сгруппированные по категориям
    if (selectedCategoryIds.length === 0) {
      categories.forEach(category => {
        const categorySubs = subcategories.filter(sub => sub.categoryId === category.id);
        if (categorySubs.length > 0) {
          groups.push({
            category,
            subcategories: categorySubs
          });
        }
      });
      return groups;
    }

    // Группируем по выбранным категориям
    selectedCategoryIds.forEach(categoryId => {
      const category = categories.find(c => c.id.toString() === categoryId);
      if (category) {
        const categorySubs = subcategories.filter(sub => sub.categoryId.toString() === categoryId);
        if (categorySubs.length > 0) {
          groups.push({
            category,
            subcategories: categorySubs
          });
        }
      }
    });

    return groups;
  }, [categories, subcategories, selectedCategoryIds]);

  // Закрытие дропдауна при клике за пределами компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => !disabled && setIsOpen(!isOpen);

  const isSubcategorySelected = (subcategoryId: string) => {
    return selectedSubcategoryIds.includes(subcategoryId);
  };

  const getDisplayText = () => {
    if (selectedSubcategoryIds.length > 0) {
      return `Выбрано: ${selectedSubcategoryIds.length}`;
    }
    return placeholder;
  };

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        styles.dropdownGroup,
        disabled && styles.disabled,
        isError && styles.error
      )}
    >
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <button
          type="button"
          className={clsx(
            styles.dropdownButton,
            isOpen && styles.open,
            disabled && styles.disabled,
        isError && styles.error
          )}
          onClick={toggleDropdown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={clsx(
            styles.selectedText,
            selectedSubcategoryIds.length === 0 && styles.placeholder // Добавляем класс placeholder когда ничего не выбрано
          )}
          >{getDisplayText()}</span>
          <Icon
            name={isOpen ? "chevronUp" : "chevronDown"}
            size="s"
            className={styles.chevronIcon}
          />
        </button>

        {isOpen && (
          <div className={styles.dropdownMenu} role="listbox">
            {groupedSubcategories.map((group) => (
              <div key={group.category.id} className={styles.categoryGroup}>
                <div className={styles.categoryHeader}>
                  {group.category.name}
                </div>
                {group.subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className={clsx(
                      styles.option,
                      isSubcategorySelected(subcategory.id.toString()) && styles.selected
                    )}
                    onClick={() => onSubcategoryToggle(subcategory.id.toString())}
                    role="option"
                    aria-selected={isSubcategorySelected(subcategory.id.toString())}
                  >
                    <Icon
                      name={
                        isSubcategorySelected(subcategory.id.toString())
                          ? "checkboxDone"
                          : "checkboxEmpty"
                      }
                      size="s"
                      className={styles.checkboxIcon}
                      color={
                        isSubcategorySelected(subcategory.id.toString()) ? "#ABD27A" : "#69735D"
                      }
                    />
                    <span className={styles.optionLabel}>{subcategory.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};