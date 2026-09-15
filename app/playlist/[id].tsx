import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/Typography';
import { playlistService } from '../../services/playlistService';
import { TrackItem } from '../../components/TrackItem';
import { MiniPlayer } from '../../components/MiniPlayer';

export default function PlaylistDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [playlist, setPlaylist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPlaylist();
    }
  }, [id]);

  const loadPlaylist = async () => {
    try {
      const data = await playlistService.getPlaylistById(id as string);
      setPlaylist(data);
    } catch (error) {
      console.error('Failed to load playlist', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (!playlist) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.emptyText}>Playlist not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: Colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // API might return tracks inside `tracks` or `songs`
  const tracks = playlist.tracks || playlist.songs || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={Colors.text} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{playlist.name || playlist.title}</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <View style={styles.playlistInfo}>
            <Image 
              source={{ uri: playlist.cover_url || playlist.image || 'https://via.placeholder.com/200' }} 
              style={styles.coverImage} 
            />
            <Text style={styles.playlistName}>{playlist.name || playlist.title}</Text>
            <Text style={styles.trackCount}>{tracks.length} tracks</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TrackItem track={item} />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>This playlist is empty.</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <MiniPlayer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...Typography.title,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  playlistInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    marginBottom: 24,
  },
  playlistName: {
    ...Typography.header,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  trackCount: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  }
});
