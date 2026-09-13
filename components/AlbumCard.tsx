import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/Typography';
import { usePlayer } from '../context/PlayerContext';
import { Heart, MoreVertical } from 'lucide-react-native';
import { trackService } from '../services/trackService';
import { PlaylistSelectionModal } from './PlaylistSelectionModal';

interface AlbumCardProps {
  item: any; // could be track, playlist, or album
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.4;

export const AlbumCard = ({ item, onPress }: AlbumCardProps) => {
  const { playTrack } = usePlayer();
  const [isLiked, setIsLiked] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      playTrack(item);
    }
  };

  const handleLike = async () => {
    setIsLiked(!isLiked);
    try {
      if (item.id) {
        await trackService.likeTrack(item.id);
      }
    } catch (e) {
      setIsLiked(isLiked);
      console.warn('Failed to like track', e);
    }
  };

  const isTrack = item.artist !== undefined;

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      <Image 
        source={{ uri: item.cover_url || item.image || 'https://via.placeholder.com/200' }} 
        style={styles.image} 
      />
      <View style={styles.infoContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title || item.name}
          </Text>
          {item.artist && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {item.artist}
            </Text>
          )}
        </View>
        {isTrack && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <Heart size={18} color={isLiked ? Colors.primary : Colors.textSecondary} fill={isLiked ? Colors.primary : 'transparent'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.actionButton}>
              <MoreVertical size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <PlaylistSelectionModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        trackId={item.id} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginRight: 16,
  },
  image: {
    width: cardWidth,
    height: cardWidth,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  infoContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 2,
  }
});
