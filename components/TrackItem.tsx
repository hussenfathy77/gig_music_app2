import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MoreVertical, Heart } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/Typography';
import { usePlayer } from '../context/PlayerContext';
import { trackService } from '../services/trackService';
import { PlaylistSelectionModal } from './PlaylistSelectionModal';

interface TrackItemProps {
  track: any;
  isLiked?: boolean;
  onPress?: () => void;
  onLikeToggle?: () => void;
}

export const TrackItem = ({ track, isLiked: initialIsLiked, onPress, onLikeToggle }: TrackItemProps) => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [localIsLiked, setLocalIsLiked] = React.useState(initialIsLiked || false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      playTrack(track);
    }
  };

  const handleLike = async () => {
    // Optimistic UI update
    setLocalIsLiked(!localIsLiked);
    try {
      await trackService.likeTrack(track.id);
      if (onLikeToggle) onLikeToggle();
    } catch (e) {
      // Revert if failed
      setLocalIsLiked(localIsLiked);
      console.error('Failed to like track', e);
    }
  };

  const handleAddToPlaylist = () => {
    setIsModalVisible(true);
  };

  const isActive = currentTrack?.id === track.id;

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image 
        source={{ uri: track.cover_url || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.title, isActive && styles.activeTitle]} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>
      <TouchableOpacity style={styles.iconButton} onPress={handleLike}>
        <Heart size={20} color={localIsLiked ? Colors.primary : Colors.textSecondary} fill={localIsLiked ? Colors.primary : 'transparent'} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={handleAddToPlaylist}>
        <MoreVertical size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <PlaylistSelectionModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        trackId={track.id} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  activeTitle: {
    color: Colors.primary,
  },
  artist: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
});
