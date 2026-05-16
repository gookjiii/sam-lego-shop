import api from './axios';

export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const getStoreInfo = async () => {
  const response = await api.get('/users/store-info');
  return response.data;
};
