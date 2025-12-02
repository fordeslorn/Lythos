import axios from 'axios';

// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  }
});

// 你可以在这里添加请求拦截器或响应拦截器
// 例如，处理 token 失效等

export default apiClient;

export const imageApi = {
  getImages: (params: { limit?: number; offset?: number }) => apiClient.get('/images', { params }),
  getImageDetails: (id: string) => apiClient.get(`/images/${id}/details`),
  toggleLike: (id: string) => apiClient.post(`/images/${id}/like`),
  toggleCollection: (id: string) => apiClient.post(`/images/${id}/collect`),
  getUserCollections: (imageId?: string) => apiClient.get('/collections', { params: { imageId } }),
  createCollection: (name: string) => apiClient.post('/collections', { name }),
  updateCollectionCover: (id: number, cover: string) => apiClient.put(`/collections/${id}/cover`, { cover }),
  deleteCollection: (id: number) => apiClient.delete(`/collections/${id}`),
  addToCollection: (collectionId: number, imageId: string) => apiClient.post(`/collections/${collectionId}/items`, { imageId }),
  removeFromCollection: (collectionId: number, imageId: string) => apiClient.delete(`/collections/${collectionId}/items/${imageId}`),
  getCollectionItems: (collectionId: number) => apiClient.get(`/collections/${collectionId}`),
  getImageUrl: (id: string, mode: 'thumb' | 'detail' | 'origin' = 'origin') => {
    return `${import.meta.env.VITE_API_BASE_URL}/images/${id}?mode=${mode}`;
  }
};

export const adminApi = {
  getUsers: (query?: string) => apiClient.get('/admin/users', { params: { q: query } }),
  updateUploadVerification: (userId: string, verified: boolean) => apiClient.post('/admin/upload-verify', { userId, verified }),
  updateUploadSizeLimit: (userId: string, limit: number) => apiClient.post('/admin/upload-size-limit', { userId, limit }),
  updateUploadLimit: (userId: string, limit: number) => apiClient.post('/admin/upload-limit', { userId, limit }),
  updateDeleteLimit: (userId: string, limit: number) => apiClient.post('/admin/delete-limit', { userId, limit }),
  getUserImages: (userId: string) => apiClient.get(`/admin/users/${userId}/images`),
  deleteImage: (imageId: string) => apiClient.delete(`/admin/images/${imageId}`),
};
