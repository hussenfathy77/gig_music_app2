import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/Typography';
import { playlistService } from '../services/playlistService';

interface PlaylistSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  trackId: string;
}

export const PlaylistSelectionModal = ({ visible, onClose, trackId }: PlaylistSelectionModalProps) => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (visible) {
      loadPlaylists();
    }
  }, [visible]);

  const loadPlaylists = async () => {
    setIsLoading(true);
    try {
      const data = await playlistService.getPlaylists();
      setPlaylists(data.results || data);
    } catch (error) {
      console.error('Failed to load playlists', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    setIsAdding(true);
    try {
      await playlistService.addTrackToPlaylist(playlistId, trackId);
      Alert.alert("Success", "Track added to playlist!");
      onClose();
    } catch (error) {
      console.error('Failed to add track', error);
      Alert.alert("Error", "Could not add track to playlist.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add to Playlist</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : playlists.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>You don't have any playlists yet.</Text>
            </View>
          ) : (
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.playlistItem}
                  onPress={() => handleAddToPlaylist(item.id)}
                  disabled={isAdding}
                >
                  <Text style={styles.playlistName}>{item.name}</Text>
                  {isAdding && <ActivityIndicator size="small" color={Colors.primary} />}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 300,
    maxHeight: '80%',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  centerContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  playlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  playlistName: {
    ...Typography.body,
    color: Colors.text,
    fontSize: 16,
  }
});
