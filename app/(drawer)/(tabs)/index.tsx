import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Search } from 'lucide-react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/Typography';
import { TrackItem } from '../../../components/TrackItem';
import { AlbumCard } from '../../../components/AlbumCard';
import { trackService } from '../../../services/trackService';

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // For Figma design, fetch recommended (tracks) and playlists
      const [tracksData, playlistsData] = await Promise.all([
        trackService.getTracks({ limit: 4 }),
        fetch('https://musicapp-production-bcd8.up.railway.app/api/playlists/', {
          headers: { Authorization: `Bearer ${await require('expo-secure-store').getItemAsync('access_token')}` }
        }).then(res => res.json()).catch(() => ({ results: [] }))
      ]);
      
      setTracks(tracksData.results || tracksData); 
      setPlaylists(playlistsData.results || playlistsData);
    } catch (error) {
      console.warn('Failed to load home data', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => (navigation as any).openDrawer()} style={styles.iconButton}>
            <Menu color={Colors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)/search')} style={styles.iconButton}>
            <Search color={Colors.text} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <View style={styles.gridContainer}>
            {tracks.map((track: any) => (
              <View key={track.id} style={styles.gridItem}>
                <AlbumCard item={track} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Playlist</Text>
          <View style={styles.gridContainer}>
            {playlists.map((playlist: any) => (
              <View key={playlist.id} style={styles.gridItem}>
                <AlbumCard item={playlist} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
    padding: 24,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.title,
    color: Colors.text,
    paddingHorizontal: 24,
    marginBottom: 16,
    fontSize: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  }
});
