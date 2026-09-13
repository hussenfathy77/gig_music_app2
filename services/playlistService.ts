import { apiClient } from './apiClient';

export const playlistService = {
  getPlaylists: async () => {
    const response = await apiClient.get('/playlists/');
    return response.data;
  },
  createPlaylist: async (data: any) => {
    const response = await apiClient.post('/playlists/', data);
    return response.data;
  },
  getPlaylistById: async (id: string) => {
    const response = await apiClient.get(`/playlists/${id}/`);
    return response.data;
  },
  updatePlaylist: async (id: string, data: any) => {
    const response = await apiClient.put(`/playlists/${id}/`, data);
    return response.data;
  },
  deletePlaylist: async (id: string) => {
    const response = await apiClient.delete(`/playlists/${id}/`);
    return response.data;
  },
  addTrackToPlaylist: async (playlistId: string, trackId: string) => {
    const response = await apiClient.post(`/playlists/${playlistId}/add_track/`, { track_id: trackId });
    return response.data;
  },
  removeTrackFromPlaylist: async (playlistId: string, trackId: string) => {
    const response = await apiClient.delete(`/playlists/${playlistId}/remove_track/`, { data: { track_id: trackId } });
    return response.data;
  },
};
