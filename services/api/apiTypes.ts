export interface ApiUser {
  id: number;
  username: string;
  email: string;
  avatar_url?: string | null;
}

export interface ApiTrack {
  id: number;
  title: string;
  artist: string;
  cover_url?: string | null;
  stream_url: string;
  duration: number;
  genre: string;
  is_preview_only: boolean;
}

export interface ApiPlaylist {
  id: number;
  name: string;
  description?: string | null;
  track_count: number;
  tracks?: ApiTrack[];
}

export interface TokenPair {
  access: string;
  refresh: string;
}
