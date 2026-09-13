import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/Typography';
import { TrackItem } from '../../../components/TrackItem';
import { InputField } from '../../../components/InputField';
import { trackService } from '../../../services/trackService';
import { Search as SearchIcon, Menu } from 'lucide-react-native';
import { useNavigation } from 'expo-router';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const data = await trackService.searchTracks(query);
      setResults(data.results || data);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (navigation as any).openDrawer()} style={{ padding: 8, marginRight: 8 }}>
          <Menu color={Colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Search</Text>
      </View>
      <View style={styles.searchContainer}>
          <View style={{ flex: 1 }}>
            <InputField
              placeholder="Search songs, artists..."
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <SearchIcon color={Colors.white} size={20} />
          </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : results.length === 0 && query ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No results found for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => <TrackItem track={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
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
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...Typography.header,
    color: Colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    marginLeft: 12,
    marginBottom: 16, // to match InputField margin
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
  }
});
