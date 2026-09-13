// components/home/RecommendedSection.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Song } from "../../types";
import { getRecommendedSongs } from "@/services/music_service";


interface Props {
  onSongPress?: (song: Song) => void;
  refreshKey?: number;
}

export default function RecommendedSection({ onSongPress, refreshKey = 0 }: Props) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSongs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecommendedSongs();
        if (isMounted) setSongs(data);
      } catch (caughtError) {
        if (isMounted) setError(caughtError instanceof Error ? caughtError.message : "Could not load tracks.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void loadSongs();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (error) {
    return <View style={styles.messageBox}><Text style={styles.message}>{error}</Text></View>;
  }

  if (songs.length === 0) {
    return <View style={styles.messageBox}><Text style={styles.message}>No tracks available yet.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended for you</Text>
      <FlatList
        data={songs}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onSongPress?.(item)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.coverUrl }} style={styles.cover} />
            <Text style={styles.songTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {item.artist}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  list: { paddingHorizontal: 16, gap: 12 },
  card: { width: 120, marginRight: 12 },
  cover: { width: 120, height: 120, borderRadius: 12, marginBottom: 6 },
  songTitle: { fontSize: 13, fontWeight: "500" },
  artist: { fontSize: 11, color: "#888" },
  loadingBox: { paddingVertical: 24, alignItems: "center" },
  messageBox: { paddingHorizontal: 16, paddingVertical: 24 },
  message: { color: "#6B7085" },
});
