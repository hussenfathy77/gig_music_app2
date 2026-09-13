import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/Typography';
import { TrackItem } from '../../../components/TrackItem';
import { trackService } from '../../../services/trackService';

export default function LikedScreen() {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const likedData = await trackService.getLikedTracks();
      setTracks(likedData.results || likedData); 
    } catch (error) {
      console.error('Failed to load liked tracks', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Liked Songs</Text>
      </View>
      
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : tracks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No liked songs yet.</Text>
        </View>
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => <TrackItem track={item} isLiked={true} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  }
});
