import { apiClient } from './apiClient';

export const trackService = {
  getTracks: async (params?: any) => {
    const response = await apiClient.get('/tracks/', { params });
    return response.data;
  },
  getTrackById: async (id: string) => {
    const response = await apiClient.get(`/tracks/${id}/`);
    return response.data;
  },
  searchTracks: async (query: string) => {
    const response = await apiClient.get(`/tracks/search/`, { params: { q: query.trim() } });
    return response.data;
  },
  playTrack: async (id: string) => {
    const response = await apiClient.post(`/tracks/${id}/play/`);
    return response.data;
  },
  likeTrack: async (id: string) => {
    const response = await apiClient.post(`/tracks/${id}/like/`);
    return response.data;
  },
  getLikedTracks: async () => {
    const response = await apiClient.get('/liked/');
    return response.data;
  },
  getHistory: async () => {
    const response = await apiClient.get('/history/');
    return response.data;
  },
  getRecommendations: async () => {
    const response = await apiClient.get('/recommendations/');
    return response.data;
  }
};
