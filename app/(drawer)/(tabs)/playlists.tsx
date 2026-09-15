import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Menu } from 'lucide-react-native';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/Typography';
import { playlistService } from '../../../services/playlistService';
import { AlbumCard } from '../../../components/AlbumCard';
import { CreatePlaylistModal } from '../../../components/CreatePlaylistModal';
import { useNavigation, useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';

export default function PlaylistsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (user) void loadData();
      else setPlaylists([]);
    }, [user?.id])
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await playlistService.getPlaylists();
      setPlaylists(data.results || data); 
    } catch (error) {
      setPlaylists([]);
      console.error('Failed to load playlists', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => (navigation as any).openDrawer()} style={{ padding: 8, marginRight: 8 }}>
            <Menu color={Colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Your Playlists</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsCreateModalVisible(true)}>
          <Plus color={Colors.white} size={24} />
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : playlists.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>You haven't created any playlists yet.</Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item: any) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
             <AlbumCard item={item} onPress={() => router.push({ pathname: '/playlist/[id]', params: { id: item.id } })} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <CreatePlaylistModal 
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={loadData}
      />
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
    padding: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    ...Typography.header,
    color: Colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemContainer: {
    width: '48%',
  }
});
