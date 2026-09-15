import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Colors } from '../../constants/colors';
import { MiniPlayer } from '../../components/MiniPlayer';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Home, Heart, Library, Search, X, Moon, Mail, Settings, LogOut, Info } from 'lucide-react-native';
import { DrawerContentScrollView, DrawerItemList } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              props.navigation.closeDrawer();
              if (logout) await logout();
              router.replace('/(auth)/login');
            } catch (e) {
              router.replace('/(auth)/login');
            }
          },
        },
      ]
    );
  };

  const handleContactUs = () => {
    props.navigation.closeDrawer();
    router.push('/(drawer)/contact' as any);
  };

  const handleSettings = () => {
    props.navigation.closeDrawer();
    router.push('/(drawer)/settings' as any);
  };

  const handleAbout = () => {
    props.navigation.closeDrawer();
    router.push('/(drawer)/about' as any);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.appName}>🎵 GIG Music</Text>
        <TouchableOpacity>
          <Moon size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginTop: 20 }}>
        <DrawerItemList {...props} />

        <View style={styles.divider} />

        {/* Extra Sidebar Items */}
        <TouchableOpacity style={styles.drawerItem} onPress={handleContactUs}>
          <Mail size={20} color={Colors.textSecondary} style={styles.itemIcon} />
          <Text style={styles.drawerItemText}>Contact Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={handleSettings}>
          <Settings size={20} color={Colors.textSecondary} style={styles.itemIcon} />
          <Text style={styles.drawerItemText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={handleAbout}>
          <Info size={20} color={Colors.textSecondary} style={styles.itemIcon} />
          <Text style={styles.drawerItemText}>About</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={[styles.drawerItem, styles.logoutItem]} onPress={handleLogout}>
          <LogOut size={20} color="#E53E3E" style={styles.itemIcon} />
          <Text style={[styles.drawerItemText, styles.logoutText]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <View style={styles.container}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: Colors.background,
            width: 280,
          },
          drawerActiveTintColor: Colors.primary,
          drawerInactiveTintColor: Colors.textSecondary,
          drawerActiveBackgroundColor: 'transparent',
          drawerItemStyle: {
            marginVertical: 4,
          },
          drawerLabelStyle: {
            marginLeft: -16,
            fontSize: 16,
            fontWeight: '600',
          },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
            drawerIcon: ({ color }) => <Home size={22} color={color} />,
          }}
        />
        <Drawer.Screen
          name="contact"
          options={{ drawerItemStyle: { display: 'none' }, title: 'Contact Us' }}
        />
        <Drawer.Screen
          name="settings"
          options={{ drawerItemStyle: { display: 'none' }, title: 'Settings' }}
        />
        <Drawer.Screen
          name="about"
          options={{ drawerItemStyle: { display: 'none' }, title: 'About' }}
        />
      </Drawer>
      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border || '#333',
    marginVertical: 12,
    marginHorizontal: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 2,
  },
  itemIcon: {
    marginRight: 14,
  },
  drawerItemText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: 4,
  },
  logoutText: {
    color: '#E53E3E',
  },
});
