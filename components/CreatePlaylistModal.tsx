import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/Typography';
import { playlistService } from '../services/playlistService';

interface CreatePlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreatePlaylistModal = ({ visible, onClose, onSuccess }: CreatePlaylistModalProps) => {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a playlist name.');
      return;
    }

    setIsCreating(true);
    try {
      await playlistService.createPlaylist({ name: name.trim() });
      setName('');
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.warn('Failed to create playlist', error);
      Alert.alert('Error', 'Could not create playlist. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>New Playlist</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Playlist name..."
            placeholderTextColor={Colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <TouchableOpacity 
            style={[styles.createButton, !name.trim() && styles.createButtonDisabled]} 
            onPress={handleCreate}
            disabled={isCreating || !name.trim()}
          >
            {isCreating ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.createButtonText}>Create</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    width: '100%',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    color: Colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
