import { useEffect, useState } from 'react';
import styles from './SkillMenu.module.css';
import { SkillMenuCategories } from './skillMenuCategory/skillMenuCategory';
import { getSkillsCategoriesApi, getSkillsSubCategoriesApi } from '../../api/Api';
import { TCategory, TSubcategory } from '../../api/types';

export const SkillMenu = () => {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [subcategories, setSubcategories] = useState<TSubcategory[]>([]);

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

  return (
    <div className={styles.container}>
      <SkillMenuCategories 
        categories={categories}
        subcategories={subcategories}
      />
    </div>
  );
};
