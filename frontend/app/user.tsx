// app/user.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserScreen() {
  const router = useRouter();

const handleLogout = async () => {
  // Hapus semua session data
  await AsyncStorage.multiRemove(['userToken', 'userRole', 'username']);
  
  // Redirect ke login
  // cast to any to satisfy expo-router's strict route type definitions
  router.replace('/login' as any);
};

const handleLogin = async () => {
  router.replace('/home' as any);
};

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
              U
            </Text>
          </View>

          {/* User Info */}
          <View>
            <Text 
              className="text-lg font-bold"
              style={{ color: Colors.primaryDark }}
            >
              User123
            </Text>
            <Text 
              className="text-sm mt-0.5"
              style={{ color: Colors.textMuted }}
            >
              Analis
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