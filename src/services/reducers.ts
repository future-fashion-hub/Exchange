// src\services\reducers.ts

import { combineSlices } from '@reduxjs/toolkit';

import { categoriesSlice } from './categories/categories-slice';
import { createdAtUsersSlice } from './createdAtUsers/created-at-users-slice';
import { filteredUsersSlice } from './filteredUsers/filtered-users-slice';
import { filtersSlice } from './filters/filters-slice';
import { notificationSlice } from './notifications/notification-slice';
import { placesSlice } from './places/places-slice';
import { popularUsersSlice } from './popularUsers/popular-users-slice';
import { randomUsersSlice } from './randomUsers/random-users-slice';
import { userSlice } from './user/user-slice';
import { usersSlice } from './users/users-slice';
import { offersSlice } from './offers/offers-slice';

export const rootReducer = combineSlices(
  categoriesSlice,
  createdAtUsersSlice,
  filteredUsersSlice,
  filtersSlice,
  notificationSlice,
  placesSlice,
  popularUsersSlice,
  randomUsersSlice,
  userSlice,
  usersSlice,
  offersSlice
);