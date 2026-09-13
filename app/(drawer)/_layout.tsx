import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Colors } from '../../constants/colors';
import { MiniPlayer } from '../../components/MiniPlayer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, Heart, Library, Search, X, Moon } from 'lucide-react-native';
import { DrawerContentScrollView, DrawerItemList } from 'expo-router/drawer';

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Moon size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginTop: 40 }}>
        <DrawerItemList {...props} />
        
        {/* Extra Sidebar Items */}
        <TouchableOpacity style={styles.drawerItem}>
          <Text style={styles.drawerItemText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('(auth)')}>
          <Text style={styles.drawerItemText}>Log Out</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  drawerItemText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  }
});
