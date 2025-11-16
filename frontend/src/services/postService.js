import api from './api';

export const postService = {
  async getAll(params = {}) {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  async getBySlug(slug) {
    const response = await api.get(`/posts/${slug}`);
    return response.data;
  },

  async create(postData) {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  async update(id, postData) {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  async like(id) {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  }
};
