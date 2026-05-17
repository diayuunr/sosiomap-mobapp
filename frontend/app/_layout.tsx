// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';
import "../global.css";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // Cek apakah di tab group (protected route)
    const inTabsGroup = ['home', 'maps'].includes(segments[0] ?? '');
   // const inLoginScreen = String(segments[0]) === 'login';
    
    if (!isLoggedIn && inTabsGroup) {
      // Belum login & di tab group → redirect ke login
      router.replace('/login' as any);
   // } else if (isLoggedIn && inLoginScreen) {
      // Sudah login tapi di login screen → redirect ke home
   //   router.replace('/(tabs)/home' as any);
    }
  }, [isReady, isLoggedIn, segments, router]);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.log('Auth check error:', error);
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <Slot />;
}