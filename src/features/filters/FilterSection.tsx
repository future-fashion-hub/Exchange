import React, { useState } from "react";
import { RootState, useSelector } from "@store";
import { Icon } from "../../shared/ui/icon/Icon";

interface FilterSectionProps {
  onPlacesChange?: (selectedPlaces: string[]) => void;
  selectedPlaces?: string[];
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  onPlacesChange,
  selectedPlaces,
}) => {
  const [activeCategory, setActiveCategory] = useState("Все навыки");
  const [locationStr, setLocationStr] = useState("");

  const categories = ["Все навыки", "Дизайн", "Тексты", "Маркетинг"];

  return (
    <div className="w-full">
      <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-6">Фильтры</h2>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 flex flex-col gap-8">
        
        {/* Категории */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Категории</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat 
                    ? "bg-primary text-white" 
                    : "bg-blue-50 text-blue-900 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Рейтинг */}
        <div>
           <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Рейтинг</h3>
           <div className="flex items-center gap-1 cursor-pointer group">
              {[1, 2, 3, 4].map(star => (
                 <svg key={star} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              ))}
              <svg className="w-6 h-6 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium">4.0+</span>
           </div>
        </div>

        {/* Локация */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Локация</h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <input
              type="text"
              value={locationStr}
              onChange={(e) => setLocationStr(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border-none rounded-xl leading-5 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm sm:text-sm"
              placeholder="Город или удаленно"
            />
          </div>
        </div>

        {/* Уровень владения */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Уровень владения</h3>
          <div className="space-y-3">
             <label className="flex items-center gap-3 cursor-pointer group">
               <input type="checkbox" className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary bg-white dark:bg-gray-900 dark:border-gray-600 cursor-pointer" />
               <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Эксперт-практик</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer group">
               <input type="checkbox" defaultChecked className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary bg-white dark:bg-gray-900 dark:border-gray-600 cursor-pointer" />
               <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Профессионал</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer group">
               <input type="checkbox" className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary bg-white dark:bg-gray-900 dark:border-gray-600 cursor-pointer" />
               <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Энтузиаст</span>
             </label>
          </div>
        </div>

      </div>
    </div>
  );
};
