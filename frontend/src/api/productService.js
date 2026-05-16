import api from './axios';

export const getProducts = async (categoryId, search = '') => {
  const params = {};
  if (categoryId) params.categoryId = categoryId;
  if (search) params.search = search;
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};
