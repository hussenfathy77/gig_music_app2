import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Music2, Star, Users, Zap, Heart } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/Typography';

const FEATURES = [
  { icon: <Music2 size={20} color={Colors.primary} />, title: 'Millions of Tracks', desc: 'Stream any song, anytime, anywhere.' },
  { icon: <Star size={20} color={Colors.primary} />, title: 'Curated Playlists', desc: 'Handpicked collections for every mood.' },
  { icon: <Zap size={20} color={Colors.primary} />, title: 'High Quality Audio', desc: 'Crystal clear sound up to 320kbps.' },
  { icon: <Heart size={20} color={Colors.primary} />, title: 'Liked Songs', desc: 'Save your favorites in one place.' },
  { icon: <Users size={20} color={Colors.primary} />, title: 'Growing Community', desc: 'Join thousands of music lovers.' },
];

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>About</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Music2 size={52} color={Colors.white} />
          </View>
          <Text style={styles.appName}>GIG Music</Text>
          <Text style={styles.tagline}>Your world, your music 🎵</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>

        {/* About Text */}
        <View style={styles.card}>
          <Text style={styles.bodyText}>
            GIG Music is a modern streaming platform built for music lovers.
            Discover new artists, create playlists, and enjoy your favorite tracks
            in stunning audio quality — all in one app.
          </Text>
        </View>

        {/* Features */}
        <Text style={styles.section}>What We Offer</Text>
        <View style={styles.featuresCard}>
          {FEATURES.map((f, i) => (
            <React.Fragment key={f.title}>
              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>{f.icon}</View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
              {i < FEATURES.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Links */}
        <Text style={styles.section}>Legal</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL('https://gigmusic.app/terms')}>
            <Text style={styles.linkText}>Terms of Service</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL('https://gigmusic.app/privacy')}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>© 2025 GIG Music. Made with ❤️</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { padding: 4 },
  title: { ...Typography.title, color: Colors.text, fontSize: 20 },
  hero: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 24 },
  logoContainer: {
    width: 100, height: 100, borderRadius: 28,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  appName: { fontSize: 32, fontWeight: 'bold', color: Colors.text, marginBottom: 6 },
  tagline: { ...Typography.body, color: Colors.textSecondary, marginBottom: 14 },
  versionBadge: {
    backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.border,
  },
  versionText: { ...Typography.small, color: Colors.textSecondary },
  card: {
    backgroundColor: Colors.surface, marginHorizontal: 16, borderRadius: 16,
    padding: 16, marginTop: 4,
  },
  bodyText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 24 },
  section: {
    ...Typography.small, color: Colors.textSecondary, textTransform: 'uppercase',
    letterSpacing: 1, marginTop: 28, marginBottom: 10, marginHorizontal: 20,
  },
  featuresCard: {
    backgroundColor: Colors.surface, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden',
  },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: 16,
  },
  featureIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { ...Typography.body, color: Colors.text, fontWeight: '600', marginBottom: 2 },
  featureDesc: { ...Typography.small, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 70 },
  linkRow: { paddingVertical: 14 },
  linkText: { ...Typography.body, color: Colors.primary, fontWeight: '500' },
  copyright: {
    ...Typography.small, color: Colors.textSecondary, textAlign: 'center', marginTop: 32,
  },
});
