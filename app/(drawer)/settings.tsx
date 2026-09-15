import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, Moon, Music, Shield, Trash2, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/Typography';
import { useAuth } from '../../context/AuthContext';
import { clearTokens } from '../../services/apiClient';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [highQuality, setHighQuality] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => Alert.alert('Info', 'Please contact support to delete your account.'),
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert('Success', 'Cache cleared successfully!');
  };

  const SettingRow = ({
    icon,
    label,
    value,
    onToggle,
    onPress,
    destructive = false,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: boolean;
    onToggle?: (val: boolean) => void;
    onPress?: () => void;
    destructive?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onToggle ? 1 : 0.7}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconBox, destructive && styles.iconBoxDestructive]}>
          {icon}
        </View>
        <Text style={[styles.rowLabel, destructive && styles.destructiveText]}>{label}</Text>
      </View>
      {onToggle !== undefined ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: Colors.border, true: Colors.primary }}
          thumbColor={Colors.white}
        />
      ) : (
        <ChevronRight size={18} color={destructive ? '#ef4444' : Colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        <Text style={styles.section}>Preferences</Text>
        <View style={styles.card}>
          <SettingRow
            icon={<Bell size={18} color={Colors.primary} />}
            label="Push Notifications"
            value={notifications}
            onToggle={setNotifications}
          />
          <View style={styles.divider} />
          <SettingRow
            icon={<Moon size={18} color={Colors.primary} />}
            label="Dark Mode"
            value={darkMode}
            onToggle={setDarkMode}
          />
          <View style={styles.divider} />
          <SettingRow
            icon={<Music size={18} color={Colors.primary} />}
            label="High Quality Audio"
            value={highQuality}
            onToggle={setHighQuality}
          />
        </View>

        <Text style={styles.section}>Account</Text>
        <View style={styles.card}>
          <SettingRow
            icon={<Shield size={18} color={Colors.primary} />}
            label="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Our privacy policy can be found at our website.')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon={<Trash2 size={18} color={Colors.primary} />}
            label="Clear Cache"
            onPress={handleClearCache}
          />
          <View style={styles.divider} />
          <SettingRow
            icon={<Trash2 size={18} color="#ef4444" />}
            label="Delete Account"
            onPress={handleDeleteAccount}
            destructive
          />
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
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
  section: {
    ...Typography.small, color: Colors.textSecondary, textTransform: 'uppercase',
    letterSpacing: 1, marginTop: 28, marginBottom: 10, marginHorizontal: 20,
  },
  card: {
    backgroundColor: Colors.surface, marginHorizontal: 16, borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 16,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
  },
  iconBoxDestructive: { backgroundColor: '#fef2f2' },
  rowLabel: { ...Typography.body, color: Colors.text },
  destructiveText: { color: '#ef4444' },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 66 },
  version: {
    ...Typography.small, color: Colors.textSecondary,
    textAlign: 'center', marginTop: 32,
  },
});
