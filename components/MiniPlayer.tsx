import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/Typography';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause } from 'lucide-react-native';

export const MiniPlayer = () => {
  const { currentTrack, isPlaying, pauseTrack, resumeTrack } = usePlayer();
  const router = useRouter();

  if (!currentTrack) return null;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => router.push('/player')}
      activeOpacity={0.9}
    >
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: '40%' }]} /> 
      </View>
      <View style={styles.content}>
        <Image 
          source={{ uri: currentTrack.cover_url || 'https://via.placeholder.com/50' }} 
          style={styles.image} 
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={isPlaying ? pauseTrack : resumeTrack}
        >
          {isPlaying ? (
            <Pause color={Colors.white} size={24} fill={Colors.white} />
          ) : (
            <Play color={Colors.white} size={24} fill={Colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // Above tab bar
    left: 8,
    right: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressBg: {
    height: 2,
    backgroundColor: Colors.border,
    width: '100%',
  },
  progressFill: {
    height: 2,
    backgroundColor: Colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text,
  },
  artist: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  playButton: {
    padding: 12,
  },
});
