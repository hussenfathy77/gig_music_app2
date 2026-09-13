import { Song, Playlist } from "@/types";
import { apiClient } from "./api/api_client";
import { ApiPlaylist, ApiTrack } from "./api/apiTypes";

const placeholderCover = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80";

const toSong = (track: ApiTrack): Song => ({
  id: String(track.id),
  title: track.title,
  artist: track.artist,
  coverUrl: track.cover_url || placeholderCover,
  audioUrl: track.stream_url,
  duration: track.duration,
});

export async function getRecommendedSongs(): Promise<Song[]> {
  const data = await apiClient.get<ApiTrack[] | { results: ApiTrack[] }>("/tracks/?limit=10");
  const tracks = Array.isArray(data) ? data : data.results;
  return Array.isArray(tracks) ? tracks.map(toSong) : [];
}

export async function getMyPlaylist(): Promise<Playlist | null> {
  const playlists = await getMyPlaylists();
  return playlists.length > 0 ? playlists[0] : null;
}

export async function getMyPlaylists(): Promise<Playlist[]> {
  const data = await apiClient.get<ApiPlaylist[] | { results: ApiPlaylist[] }>("/playlists/");
  const playlists = Array.isArray(data) ? data : data.results;
  return Array.isArray(playlists)
    ? playlists.map((playlist) => ({
        id: String(playlist.id),
        title: playlist.name,
        coverUrl: placeholderCover,
        songs: (playlist.tracks || []).map(toSong),
      }))
    : [];
}

export async function getRecentlyPlayed(): Promise<Song[]> {
  try {
    const data = await apiClient.get<ApiTrack[] | { results: ApiTrack[] }>("/history/")
      .catch(() => apiClient.get<ApiTrack[] | { results: ApiTrack[] }>("/tracks/"));
    const tracks = Array.isArray(data) ? data : data.results;

    if (!Array.isArray(tracks)) return [];

    return tracks.slice(0, 5).map(toSong);
  } catch (error) {
    console.error("Failed to fetch recently played:", error);
    return [];
  }
}
