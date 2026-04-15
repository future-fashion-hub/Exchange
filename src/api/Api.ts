import api from './AxiosClient';
import { TUser } from './types';

// Auth APIs
export const registerApi = async (data: any) => {
  const response = await api.post('/auth/register', data);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const loginApi = async (data: any) => {
  const response = await api.post('/auth/login', data);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logoutApi = () => {
  localStorage.removeItem('token');
  return Promise.resolve({ success: true });
};

// Skills APIs
export const getFilteredUsersApi = async (params: any) => {
  const response = await api.get('/skills', { params });
  // The backend currently returns skills, we map them to users for compatibility during migration
  // Let's assume the backend now properly returns users with skills if we create the correct endpoint.
  // For now, mapping the new skills logic
  return { users: response.data, hasMore: false }; 
};

export const getPopularUsersApi = async (page?: number) => {
  const response = await api.get('/skills');
  return { users: response.data, hasMore: false };
};

export const getCreatedAtUsersApi = async (page?: number) => {
  const response = await api.get('/skills');
  return { users: response.data, hasMore: false };
};

export const getUsersApi = async (page?: number) => {
  const response = await api.get('/skills');
  return { users: response.data, hasMore: false };
};

export const getUsersByRandomApi = async (page?: number) => {
  const response = await api.get('/skills');
  return { users: response.data, hasMore: false };
};

export const getUserByIdAPI = async (id: string | number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// ... other necessary mocks to keep app from crashing until fully refactored
export const getPlacesApi = async (): Promise<any> => ({ places: [] });
export const getSkillsCategoriesApi = async (): Promise<any> => ({ categories: [] });
export const getSkillsSubCategoriesApi = async (): Promise<any> => ({ subcategories: [] });
export const getOffersApi = async (): Promise<any> => ({ offers: [] });
export const getNotificationsApi = async (...args: any[]): Promise<any> => ({ events: [] });
export const getUserLikesApi = async (userId: number): Promise<any> => ([]);
