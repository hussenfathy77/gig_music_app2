import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail, MessageSquare, Send, Phone, Globe } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/Typography';

export default function ContactScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setIsSending(true);
    setIsSending(false);
    Alert.alert('Message Sent! ✅', 'Thank you for reaching out. We\'ll get back to you within 24 hours.');
    setName(''); setEmail(''); setMessage('');
  };

  const InfoRow = ({ icon, label, value, onPress }: {
    icon: React.ReactNode; label: string; value: string; onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.infoRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.infoIcon}>{icon}</View>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, onPress && { color: Colors.primary }]}>{value}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Contact Us</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Contact Info */}
        <View style={styles.card}>
          <InfoRow
            icon={<Mail size={20} color={Colors.primary} />}
            label="Email"
            value="support@gigmusic.app"
            onPress={() => Linking.openURL('mailto:support@gigmusic.app')}
          />
          <View style={styles.divider} />
          <InfoRow
            icon={<Phone size={20} color={Colors.primary} />}
            label="Phone"
            value="+1 (800) GIG-MUSIC"
          />
          <View style={styles.divider} />
          <InfoRow
            icon={<Globe size={20} color={Colors.primary} />}
            label="Website"
            value="www.gigmusic.app"
            onPress={() => Linking.openURL('https://gigmusic.app')}
          />
        </View>

        {/* Message Form */}
        <Text style={styles.section}>Send a Message</Text>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={Colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={Colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="How can we help you?"
              placeholderTextColor={Colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, isSending && { opacity: 0.7 }]}
            onPress={handleSend}
            disabled={isSending}
          >
            {isSending ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Send size={18} color={Colors.white} />
                <Text style={styles.sendText}>Send Message</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
  card: {
    backgroundColor: Colors.surface, marginHorizontal: 16, marginTop: 20,
    borderRadius: 16, overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: 16,
  },
  infoIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
  },
  infoLabel: { ...Typography.small, color: Colors.textSecondary, marginBottom: 2 },
  infoValue: { ...Typography.body, color: Colors.text, fontWeight: '500' },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 70 },
  section: {
    ...Typography.small, color: Colors.textSecondary, textTransform: 'uppercase',
    letterSpacing: 1, marginTop: 28, marginBottom: 12, marginHorizontal: 20,
  },
  form: { marginHorizontal: 16 },
  inputGroup: { marginBottom: 16 },
  label: { ...Typography.small, color: Colors.textSecondary, marginBottom: 6, fontWeight: '500' },
  input: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    color: Colors.text, fontSize: 15, borderWidth: 1, borderColor: Colors.border,
  },
  textArea: { height: 120, paddingTop: 14 },
  sendBtn: {
    backgroundColor: Colors.primary, borderRadius: 24, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8,
  },
  sendText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});
