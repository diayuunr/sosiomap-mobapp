// app/user.tsx
import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUsername =
          await AsyncStorage.getItem('username');

        const storedRole =
          await AsyncStorage.getItem('userRole');

        /**
         * kalau belum login
         */

        if (!storedUsername) {
          router.replace('/login' as any);
          return;
        }

        setUsername(storedUsername);
        setRole(storedRole || '');

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleLogin = async () => {
    router.replace('/home' as any);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'userToken',
        'userRole',
        'username',
        'userData',
      ]);

      router.replace('/login' as any);

    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{
          backgroundColor: Colors.background,
        }}
      >
        <Text
          style={{
            color: Colors.primary,
          }}
        >
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: Colors.background }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <View className="flex-1 px-6 pt-5">
        {/* Header */}
        <View className="items-start mb-10">
          <Text 
            className="text-4xl font-mplus-extrabold"
            style={{ color: Colors.primary }}
          >
            SosioMap
          </Text>
          <Text 
            className="text-md mt-1"
            style={{ color: Colors.textMuted }}
          >
            Pemetaan Profil Ekonomi Wajib Pajak
          </Text>
        </View>

        {/* User Card */}
        <TouchableOpacity
          onPress={handleLogin}
          activeOpacity={0.8}
        >
        <View 
          className="flex-row items-center p-5 rounded-2xl mb-10"
          style={{ 
            backgroundColor: Colors.card,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* Avatar */}
          <View 
            className="w-14 h-14 rounded-full items-center justify-center mr-4"
            style={{ backgroundColor: Colors.accent }}
          >
            <Text 
              className="text-xl font-bold"
              style={{ color: Colors.primaryDark }}
            >
              {username.charAt(0).toUpperCase()}
            </Text>
          </View>

          {/* User Info */}
          <View>
            <Text 
              className="text-lg font-bold"
              style={{ color: Colors.primaryDark }}
            >
              {username}
            </Text>
            <Text 
              className="text-sm mt-0.5"
              style={{ color: Colors.textMuted }}
            >
              {role}
            </Text>
          </View>
        </View>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          className="py-4 rounded-xl items-center mb-6"
          style={{ backgroundColor: Colors.primary }}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            Logout
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View className="items-center pb-4">
          <Text 
            className="text-xs mb-2"
            style={{ color: Colors.textMuted }}
          >
            © 2026 SosioMap
          </Text>
          <View className="flex-row">
            <TouchableOpacity>
              <Text 
                className="text-xs font-semibold mr-4"
                style={{ color: Colors.primary }}
              >
                KEBIJAKAN PRIVASI
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text 
                className="text-xs font-semibold"
                style={{ color: Colors.primary }}
              >
                BANTUAN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}