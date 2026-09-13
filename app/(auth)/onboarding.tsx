import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomButton } from '../../components/CustomButton';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Small top text like "let's start" in figma */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>let's start</Text>
      </View>

      <View style={styles.content}>
        <Image 
          source={require('../../assets/images/spongebob_music.jpg')} 
          style={styles.image}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Music Player App</Text>
        <Text style={styles.subtitle}>
          "A sleek, modern music app that brings your favorite songs, artists, and playlists together"
        </Text>
      </View>

      <View style={styles.footer}>
        <CustomButton
          title="Let's Start"
          onPress={() => router.push('/(auth)/login')}
          style={styles.startButton}
          textStyle={{ color: Colors.white }}
          rightIcon={<ArrowRight size={20} color={Colors.white} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light soft background
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  topBarText: {
    color: '#D1D1D1',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 40,
  },
  title: {
    ...Typography.header,
    color: '#1A1A1A',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: '#666666',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  startButton: {
    backgroundColor: '#D94C2B', // The orange color from the design
    borderRadius: 12,
    paddingVertical: 16,
  }
});
