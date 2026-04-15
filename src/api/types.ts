// src\api\types.ts

import { TSkillType } from "../shared/types/filters";
import { IconName } from "../shared/ui/icon/icons";

export const GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
  UNSPECIFIED: 'unspecified',
} as const;

export type TGender = (typeof GENDERS)[keyof typeof GENDERS];

export type TUser = {
  id: number;
  name: string;
  gender: TGender;
  photo: string; //Фото профиля
  from: string; //Город пользователя
  skill: string; // это текст пользователя
  need_subcat: number[]; //Массив подкатегорий, которым пользователь хочет научиться
  cat_text: string; //Текстовое название категории (из skills_categories.json)
  sub_text: string; //Текстовое название подкатегории (из skills_subcategories.json)
  categoryId: number; //ID категории навыка
  subCategoryId: number; //ID подкатегории навыка
  description: string; //Описание навыка
  images: string[]; //Список изображений, связанных с описанием навыком
  birthdate: string; // др в формате YYYY-MM-DD
  email: string;
  created_at: string; //Дата создания аккаунта
  about: string; //Описание пользователя (вводится при регистрации)
  likedByMe: boolean;
  random: number;
};

export type TGetFilteredUsersArgs = {
  page: number;
  gender?: TGender;
  places: string[];
  skillType?: TSkillType;
  subcategories?: number[]; 
  q?: string;
};

export type TPlace = {
  id: number;
  name: string;
}

export type TCategory = {
  id: number;
  name: string;
  color: string;
  icon: IconName; // имя иконки
};

export type TSubcategory = {
  id: number;
  categoryId: number;
  name: string;
  color: string;
};

// Для ответа API пользователей
export type TResponseUsers = {
  users: TUser[];
  hasMore: boolean;
}

// Для ответа API мест
export type TResponsePlaces = {
  places: TPlace[];
}

// Для ответа API категорий
export type TResponseCategories = {
  categories: TCategory[];
};

// Для ответа API подкатегорий
export type TResponseSubcategories = {
  subcategories: TSubcategory[];
}

export const NotificationTypes = {
  MY_NEW_OFFER: 'my_new_offer',
  OFFER_TO_ME: 'offer_to_me',
  ACCEPT_MY_OFFER: 'accept_my_offer',
} as const;

export type TNotificationType = typeof NotificationTypes[keyof typeof NotificationTypes];

export type TNotificationEvent = {
  type: TNotificationType;
  seen: 0 | 1;
  anotherUserId: number;
  anotherUserName: string;
  date: string; // ISO-строка с датой
};

export type TResponseNotifications = {
  userId: number;
  events: TNotificationEvent[];
};  

export type TLikeType = {
  id: number;
  liker_id: number;
  liked_id: number;
  timestamp: string; // ISO-строка с датой
};

export type TOffer = {
  "offerUserId": number;
  "skillOwnerId": number;
  "daysSinceOffer": number;
  "daysSinceAccept": number;
  "accept": 0 | 1;
  "sawOffer": 0 | 1,
  "sawAccept": 0 | 1,
};

export type TResponseOffers = {
  offers: TOffer[];
}