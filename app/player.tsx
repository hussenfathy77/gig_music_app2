import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/Typography';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Heart, Shuffle, Repeat } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlayerScreen() {
  const router = useRouter();
  const { currentTrack, isPlaying, pauseTrack, resumeTrack } = usePlayer();

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
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
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ChevronDown color={Colors.text} size={32} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MoreVertical color={Colors.text} size={24} />
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
        
        {/* Progress Bar Placeholder */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '30%' }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>1:24</Text>
            <Text style={styles.timeText}>3:45</Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity>
            <Shuffle color={Colors.textSecondary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
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
          
          <TouchableOpacity>
            <SkipForward color={Colors.text} size={36} fill={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Repeat color={Colors.textSecondary} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Need to import MoreVertical for the header
import { MoreVertical } from 'lucide-react-native';

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
