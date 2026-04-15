import { Icon } from "../../../shared/ui/icon/Icon";
import styles from './SkillMenuCategory.module.css'
import { TCategory, TSubcategory } from "../../../api/types";
import { useMemo } from "react";

type SkillMenuCategoryProps = {
  categories: TCategory[];
  subcategories: TSubcategory[];
};

export const SkillMenuCategories = ({ categories, subcategories }: SkillMenuCategoryProps) => {
  const groupedCategories = useMemo(() => {
    const groups: { category: TCategory; subcategories: TSubcategory[] }[] = [];
    
    categories.forEach(category => {
        const categorySubs = subcategories.filter(sub => sub.categoryId === category.id);
        if (categorySubs.length > 0) {
          groups.push({
            category,
            subcategories: categorySubs
          });
        }
      }
    );
      return groups;
    }, [categories, subcategories]);

  return(
    <menu className={styles.skillMenu}>
      {groupedCategories.map((group, index) => (
      <li key={index} className={styles.category}>

        <div 
          className={styles.iconContainer}
          style={{ backgroundColor: group.category.color }}
        >
          <Icon 
            name={group.category.icon}
            size={24}
          />
        </div>
        <div className={styles.div}>
          <span className={styles.category_title}>{group.category.name}</span>
          <ul className={styles.ul}>
            {group.subcategories.map((sub, subIndex) => (
              <li key={subIndex} className={styles.li}>{sub.name}</li>
            ))} 
          </ul>
        </div>
      </li>
      ))}
    </menu>
  );
};