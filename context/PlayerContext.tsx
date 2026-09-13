import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAudioPlayer } from 'expo-audio';

interface Track {
  id: string;
  title: string;
  artist: string;
  audio_file?: string;
  cover_url?: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  
  // Create a persistent audio player using the new expo-audio API
  const player = useAudioPlayer(null);

  const playTrack = async (track: Track) => {
    try {
      setCurrentTrack(track);
      if (track.audio_file) {
        player.replace(track.audio_file);
        player.play();
      }
    } catch (error) {
      console.error('Error playing track', error);
    }
  };

  const pauseTrack = async () => {
    player.pause();
  };

  const resumeTrack = async () => {
    player.play();
  };

  return (
    <PlayerContext.Provider value={{ 
      currentTrack, 
      isPlaying: player.playing, 
      playTrack, 
      pauseTrack, 
      resumeTrack 
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

