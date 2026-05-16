import api from './axios';

export const importProducts = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return await api.post('/admin/products/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const addProduct = async (productData) => {
  return await api.post('/admin/products', productData);
};

export const updateProduct = async (productId, productData) => {
  return await api.put(`/admin/products/${productId}`, productData);
};

export const deleteProduct = async (productId) => {
  return await api.delete(`/admin/products/${productId}`);
};

export const addCategory = async (categoryData) => {
  return await api.post('/admin/categories', categoryData);
};

export const updateCategory = async (categoryId, categoryData) => {
  return await api.put(`/admin/categories/${categoryId}`, categoryData);
};

export const deleteCategory = async (categoryId) => {
  return await api.delete(`/admin/categories/${categoryId}`);
};

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  return await api.put(`/admin/orders/${orderId}/status`, null, { params: { status } });
};
