import api from './api';

export const categoryService = {
  async getAll() {
    const response = await api.get('/categories');
    return response.data;
  },

  async getBySlug(slug) {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },

  async create(categoryData) {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  async update(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};
