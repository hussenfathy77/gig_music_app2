import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/Typography';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Heart, Shuffle, Repeat, MoreVertical, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatTime } from '../utils/format_time';

export default function PlayerScreen() {
  const router = useRouter();
  const { currentTrack, isPlaying, isLoading, error, position, duration, isLooping, pauseTrack, resumeTrack, seekBy, toggleLoop, closeTrack } = usePlayer();
  const closePlayer = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/(tabs)');
  };

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={closePlayer}>
            <ChevronDown color={Colors.text} size={32} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No track playing</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={closePlayer} style={styles.iconButton}>
          <ChevronDown color={Colors.text} size={32} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => { closeTrack(); closePlayer(); }} accessibilityLabel="Close song">
          <X color={Colors.text} size={26} />
        </TouchableOpacity>
      </View>

      <View style={styles.artworkContainer}>
        <Image 
          source={{ uri: currentTrack.cover_url || 'https://via.placeholder.com/300' }} 
          style={styles.artwork} 
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <View style={styles.titleInfo}>
            <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
          </View>
          <TouchableOpacity>
            <Heart color={Colors.textSecondary} size={28} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${duration > 0 ? Math.min(100, (position / duration) * 100) : 0}%` }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {(isLoading || error) && (
          <Text style={styles.playerMessage}>{isLoading ? 'Loading audio…' : error}</Text>
        )}

        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={() => {}} accessibilityLabel="Shuffle">
            <Shuffle color={Colors.textSecondary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => void seekBy(-10)}>
            <SkipBack color={Colors.text} size={36} fill={Colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.playButton}
            onPress={isPlaying ? pauseTrack : resumeTrack}
          >
            {isPlaying ? (
              <Pause color={Colors.white} size={32} fill={Colors.white} />
            ) : (
              <Play color={Colors.white} size={32} fill={Colors.white} style={{ marginLeft: 4 }} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => void seekBy(10)}>
            <SkipForward color={Colors.text} size={36} fill={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleLoop}>
            <Repeat color={isLooping ? Colors.primary : Colors.textSecondary} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    letterSpacing: 1,
  },
  artworkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  artwork: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  infoContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleInfo: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    ...Typography.header,
    color: Colors.text,
    fontSize: 26,
    marginBottom: 4,
  },
  artist: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 18,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.surface,
    borderRadius: 2,
    width: '100%',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  playerMessage: {
    ...Typography.small,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.title,
    color: Colors.textSecondary,
  }
});
