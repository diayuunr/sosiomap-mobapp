import {View, Text, TouchableOpacity, StatusBar, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Greetings() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedRole = await AsyncStorage.getItem('userRole');

        setUsername(storedUsername || '');
        setRole(storedRole || '');
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleUser = async () => {
    router.replace('/user');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6 mt-5">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="w-full flex-row items-center justify-between border-b border-gray/20 bg-white pb-4 mt-12">
        <View>
          <Text className="text-4xl font-mplus-extrabold text-primary">
            SosioMap
          </Text>

          <Text className="text-sm text-gray-500 mt-1">
            Pemetaan Profil Ekonomi Wajib Pajak
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full">
            <Text className="text-xl"><Feather name="bell" size={24} /></Text>
          </TouchableOpacity>
        <TouchableOpacity
          onPress={handleUser}
          activeOpacity={0.8}
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-500">
            <Text className="text-[15px] font-bold text-white">{username.charAt(0).toUpperCase()}</Text>
          </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="w-full pt-3">
        <Text className="text-2xl font-bold text-primary">
          Halo, {username}!
        </Text>

        <View className="mt-2 mb-5 w-[50%] flex-row items-center justify-center rounded-xl border-2 border-accent px-3 py-2">
        <Feather name="user" size={18} color="#007BE5" />

        <Text className="ml-2 text-sm text-primary">
            Peran Aktif:{' '}
            <Text className="font-mplus-bold text-primary">
              {role}
            </Text>
        </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}