import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Platform } from 'react-native';
import { getStoredToken } from '../services/apiClient';
import { ApiConfig } from '../constants/api';

type Track = {
  id: string | number;
  title: string;
  artist: string;
  audio_file?: string;
  audioUrl?: string;
  stream_url?: string;
  audio_url?: string;
  url?: string;
  cover_url?: string;
  image?: string;
  duration?: number;
};

type PlayerContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  position: number;
  duration: number;
  isLooping: boolean;
  playTrack: (track: Track) => Promise<void>;
  pauseTrack: () => void;
  resumeTrack: () => void;
  seekBy: (seconds: number) => Promise<void>;
  toggleLoop: () => void;
  closeTrack: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const getAudioUrl = (track: Track) =>
  track.id
    ? `${ApiConfig.baseUrl.replace(/\/$/, '')}/tracks/${track.id}/stream/`
    : track.audio_file || track.audioUrl || track.stream_url || track.audio_url || track.url || null;

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const playerRef = useRef<AudioPlayer | null>(null);
  const listenerRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix',
      }).catch((e) => console.warn('[Player] Audio mode failed', e));
    }
    return () => {
      listenerRef.current?.remove();
      try { playerRef.current?.remove(); } catch { /* already released */ }
    };
  }, []);

  const playTrack = async (track: Track) => {
    const audioUrl = getAudioUrl(track);
    if (!audioUrl) {
      setError(`No playable audio URL for “${track.title}”.`);
      setIsPlaying(false);
      setCurrentTrack(track);
      return;
    }

    setError(null);
    setIsLoading(true);
    setIsPlaying(false);
    setCurrentTrack(track);
    listenerRef.current?.remove();
    try { playerRef.current?.remove(); } catch { /* ignore */ }
    playerRef.current = null;

    try {
      const token = await getStoredToken();
      const source = {
        uri: audioUrl,
        name: `${track.title} - ${track.artist}`,
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      };
      const player = createAudioPlayer(source, { updateInterval: 250 });
      playerRef.current = player;
      listenerRef.current = (player as any).addListener('playbackStatusUpdate', (status: any) => {
        setPosition(Number(status.currentTime ?? player.currentTime ?? 0));
        setDuration(Number(status.duration ?? player.duration ?? track.duration ?? 0));
        setIsPlaying(Boolean(status.playing ?? player.playing));
        if (status.isLoaded === false && status.error) setError(String(status.error));
      });

      if (playerRef.current !== player) return;
      player.loop = isLooping;
      // expo-audio queues play() while the remote source is buffering. This
      // avoids blocking the UI for several seconds waiting for isLoaded.
      player.play();
      setIsPlaying(true);
    } catch (e: any) {
      console.error('[Player] Playback failed', e);
      setIsPlaying(false);
      setError(e?.message || 'Could not play this song.');
    } finally {
      setIsLoading(false);
    }
  };

  const pauseTrack = () => {
    try { playerRef.current?.pause(); } catch { /* ignore */ }
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (!playerRef.current) {
      setError('Choose a song first.');
      return;
    }
    try {
      playerRef.current.play();
      setIsPlaying(true);
    } catch (e: any) {
      setError(e?.message || 'Could not resume playback.');
    }
  };

  const seekBy = async (seconds: number) => {
    const player = playerRef.current;
    if (!player) return;
    const max = player.duration || duration || Number.MAX_SAFE_INTEGER;
    const next = Math.max(0, Math.min(player.currentTime + seconds, max));
    await player.seekTo(next);
    setPosition(next);
  };

  const toggleLoop = () => {
    const next = !isLooping;
    setIsLooping(next);
    if (playerRef.current) playerRef.current.loop = next;
  };

  const closeTrack = () => {
    listenerRef.current?.remove();
    listenerRef.current = null;
    try { playerRef.current?.pause(); } catch { /* ignore */ }
    try { playerRef.current?.remove(); } catch { /* ignore */ }
    playerRef.current = null;
    setCurrentTrack(null);
    setIsPlaying(false);
    setIsLoading(false);
    setPosition(0);
    setDuration(0);
    setError(null);
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, isLoading, error, position, duration, isLooping, playTrack, pauseTrack, resumeTrack, seekBy, toggleLoop, closeTrack }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
};
