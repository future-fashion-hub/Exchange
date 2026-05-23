import api from './AxiosClient';
import { GENDERS, TExchange, TMyExchangesResponse, TNotificationEvent, TResponseNotifications, TUser } from './types';

export type TServerMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  readAt: string | null;
};

type BackendUser = {
  id: string;
  email: string;
  role?: 'GUEST' | 'USER' | 'ADMIN';
  moderationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  fullName?: string;
  gender?: string;
  birthdate?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  cardImageUrl?: string | null;
  location?: string | null;
  createdAt?: string;
  offerTags?: string[];
  seekTags?: string[];
  skills?: Array<{
    id: string;
    title: string;
    description: string;
    type: 'TEACH' | 'LEARN';
    categoryName: string;
  }>;
  stats?: {
    activeExchanges?: number;
    totalSkills?: number;
    reputation?: number;
    notifications?: number;
  };
};

type UpdateMePayload = Partial<{
  fullName: string;
  email: string;
  gender: string;
  birthdate: string;
  bio: string;
  location: string;
  avatarUrl: string;
  cardImageUrl: string;
  offerTags: string[];
  seekTags: string[];
  isPrivate: boolean;
}>;

type CreateSkillPayload = {
  title: string;
  description: string;
  type?: 'TEACH' | 'LEARN';
  categoryId?: string;
  categoryName?: string;
  images?: string[];
};

type CategoryResponseItem = {
  id: string;
  name: string;
};

const mapBackendUserToClientUser = (user: BackendUser): TUser => {
  const normalizedGender = (user.gender || '').toLowerCase();
  const gender = normalizedGender === GENDERS.MALE || normalizedGender === GENDERS.FEMALE
    ? normalizedGender
    : GENDERS.UNSPECIFIED;

  return {
    id: user.id,
    name: user.fullName || user.email,
    role: user.role || 'USER',
    moderationStatus: user.moderationStatus || 'PENDING',
    gender,
    photo: user.avatarUrl || '',
    from: user.location || '',
    skill: '',
    need_subcat: [],
    cat_text: '',
    sub_text: '',
    categoryId: 0,
    subCategoryId: 0,
    description: '',
    images: [],
    birthdate: user.birthdate || '',
    email: user.email,
    created_at: user.createdAt || new Date().toISOString(),
    about: user.bio || '',
    likedByMe: false,
    random: 0,
    offerTags: Array.isArray(user.offerTags) ? user.offerTags : [],
    seekTags: Array.isArray(user.seekTags) ? user.seekTags : [],
    skills: Array.isArray(user.skills) ? user.skills : [],
    stats: {
      activeExchanges: user.stats?.activeExchanges ?? 0,
      totalSkills: user.stats?.totalSkills ?? 0,
      reputation: user.stats?.reputation ?? 0,
      notifications: user.stats?.notifications ?? 0,
    },
  };
};

// Auth APIs
export const registerApi = async (data: { fullName: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', data);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return {
    token: response.data.token as string,
    user: response.data.user ? mapBackendUserToClientUser(response.data.user as BackendUser) : null,
  };
};

export const loginApi = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/login', data);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return {
    token: response.data.token as string,
    user: response.data.user ? mapBackendUserToClientUser(response.data.user as BackendUser) : null,
  };
};

export const logoutApi = () => {
  localStorage.removeItem('token');
  return Promise.resolve({ success: true });
};

export const getMeApi = async () => {
  const response = await api.get('/users/me');
  return mapBackendUserToClientUser(response.data as BackendUser);
};

export const updateMeApi = async (data: UpdateMePayload) => {
  const response = await api.put('/users/me', data);
  return mapBackendUserToClientUser(response.data as BackendUser);
};

export const uploadAvatarApi = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data as { avatarUrl: string };
};

export const uploadSkillImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload/skill-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data as { imageUrl: string };
};

export const getConversationApi = async (peerId: string) => {
  const response = await api.get(`/messages/${peerId}`);
  return response.data as TServerMessage[];
};

export const sendMessageApi = async (receiverId: string, text: string) => {
  const response = await api.post('/messages', { receiverId, text });
  return response.data as TServerMessage;
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
  const response = await api.get('/users/catalog');
  return { users: response.data, hasMore: false };
};

export const getCreatedAtUsersApi = async (page?: number) => {
  const response = await api.get('/users/catalog');
  return { users: response.data, hasMore: false };
};

export const getUsersApi = async (page?: number) => {
  const response = await api.get('/users/catalog');
  return { users: response.data, hasMore: false };
};

export const getUsersByRandomApi = async (page?: number) => {
  const response = await api.get('/users/catalog');
  return { users: response.data, hasMore: false };
};

export const getUserByIdAPI = async (id: string | number) => {
  const response = await api.get(`/users/${id}`);
  return mapBackendUserToClientUser(response.data as BackendUser);
};

export const createSkillApi = async (payload: CreateSkillPayload) => {
  const response = await api.post('/skills', payload);
  return response.data;
};

// ... other necessary mocks to keep app from crashing until fully refactored
export const getPlacesApi = async (): Promise<any> => ({ places: [] });
export const getSkillsCategoriesApi = async (): Promise<any> => {
  const response = await api.get('/skills/categories');
  const categories = (Array.isArray(response.data) ? response.data : []) as CategoryResponseItem[];
  return { categories };
};

export const getSkillsSubCategoriesApi = async (): Promise<any> => ({ subcategories: [] });
export const getOffersApi = async (): Promise<TMyExchangesResponse> => {
  const response = await api.get('/offers/me');
  return response.data as TMyExchangesResponse;
};

export const createOfferApi = async (receiverId: string): Promise<TExchange> => {
  const response = await api.post('/offers', { receiverId });
  return response.data as TExchange;
};

export const decideOfferApi = async (offerId: string, action: 'approve' | 'reject'): Promise<TExchange> => {
  const response = await api.patch(`/offers/${offerId}/decision`, { action });
  return response.data as TExchange;
};
export const getNotificationsApi = async (): Promise<TResponseNotifications> => {
  const response = await api.get('/notifications/me');
  return response.data as TResponseNotifications;
};

export const markAllNotificationsReadApi = async () => {
  await api.patch('/notifications/me/read-all');
  return { success: true };
};

export type TAdminModerationUser = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  offerTags: string[];
  seekTags: string[];
  location: string | null;
  bio: string | null;
  avatarUrl: string | null;
  cardImageUrl: string | null;
};

export const getAdminModerationQueueApi = async () => {
  const response = await api.get('/admin/moderation');
  return response.data as TAdminModerationUser[];
};

export const decideAdminModerationApi = async (userId: string, action: 'approve' | 'reject') => {
  const response = await api.patch(`/admin/moderation/${userId}`, { action });
  return response.data as { id: string; fullName: string; email: string; moderationStatus: string };
};

export const getUserLikesApi = async (userId: string | number): Promise<any> => ([]);
