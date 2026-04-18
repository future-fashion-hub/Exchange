// src\shared\lib\helpers.ts

import { USERS_PHOTO_PATH, TEAM_PHOTO_PATH } from "@const/paths";
import { TCategory, TSubcategory } from "@api/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const toAbsoluteServerUrl = (pathOrUrl: string): string => {
  if (!pathOrUrl) {
    return '';
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  if (pathOrUrl.startsWith('/')) {
    return `${API_ORIGIN}${pathOrUrl}`;
  }

  return `${API_ORIGIN}/${pathOrUrl}`;
};

export const birthdayToFormatedAge = (birthdate: string): string => {
  return formatAge(calculateAge(birthdate));
}

const formatAge = (age: string): string => {
  const ageNum = parseInt(age);
  const lastDigit = ageNum % 10;
  const lastTwoDigits = ageNum % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${age} лет`;
  }
  
  if (lastDigit === 1) {
    return `${age} год`;
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${age} года`;
  }
  
  return `${age} лет`;
};

const calculateAge = (birthdate: string): string => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age.toString();
};

export const getImageUrl = (photoPath: string, type: 'user' | 'team' = 'user'): string => {
  if (!photoPath) {
    return '';
  }

  if (photoPath.startsWith('/uploads') || photoPath.startsWith('/db') || /^https?:\/\//i.test(photoPath)) {
    return toAbsoluteServerUrl(photoPath);
  }

  if (type === 'team') {
    return toAbsoluteServerUrl(`${TEAM_PHOTO_PATH}${photoPath}`);
  }
  return toAbsoluteServerUrl(`${USERS_PHOTO_PATH}${photoPath}`);
};

/*
export const getImageUrl = (photoPath: string): string => {
  return `${USERS_PHOTO_PATH}${photoPath}`;
};*/

const norm = (s: string) => s
  .toLowerCase()
  .replace(/[^\p{L}\p{N}\s,.-]+/gu, '') // оставляем буквы/цифры/пробелы
  .replace(/\s+/g, ' ')
  .trim();

export function subcategoryIdsByQuery(
  query: string,
  categories: TCategory[],
  subcategories: TSubcategory[],
): number[] {
  const q = norm(query);
  if (!q) return [];
  const terms = q.split(/[,\s]+/).filter(Boolean);

  const matchSubIds = new Set<number>();

  // 1) матчим подкатегории по имени
  for (const sc of subcategories) {
    const name = norm(sc.name);
    if (terms.some(t => name.includes(t))) matchSubIds.add(sc.id);
  }

  // 2) матчим категории по имени → добавляем все их подкатегории
  for (const cat of categories) {
    const name = norm(cat.name);
    if (terms.some(t => name.includes(t))) {
      for (const sc of subcategories) {
        if (sc.categoryId === cat.id) matchSubIds.add(sc.id);
      }
    }
  }

  return [...matchSubIds];
}