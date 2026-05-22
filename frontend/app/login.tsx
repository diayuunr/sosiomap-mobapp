import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Lock, Eye, EyeOff, BarChart3, Building2, ShieldCheck } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/src/lib/supabase';

type Role = 'Analis' | 'Bapenda' | 'Admin';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('Analis');
  const [loading, setLoading] = useState(false);

  const roles: { id: Role; icon: React.ReactNode; label: string }[] = [
    { 
      id: 'Analis', 
      icon: <BarChart3 size={24} color={selectedRole === 'Analis' ? Colors.primary : Colors.textMuted} />, 
      label: 'Analis' 
    },
    { 
      id: 'Bapenda',
      icon: <Building2 size={24} color={selectedRole === 'Bapenda' ? Colors.primary : Colors.textMuted} />, 
      label: 'Bapenda' 
    },
    { 
      id: 'Admin', 
      icon: <ShieldCheck size={24} color={selectedRole === 'Admin' ? Colors.primary : Colors.textMuted} />, 
      label: 'Admin' 
    },
  ];

const handleLogin = async () => {
  try {
    if (!username || !password) {
      Alert.alert(
        'Login gagal',
        'Username dan password wajib diisi'
      );
      return;
    }

    setLoading(true);

    /**
     * LOGIN CUSTOM TABLE
     * ==================================
     * Ganti "users" sesuai nama tabel asli
     */

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      Alert.alert(
        'Login gagal',
        'Username atau password salah'
      );
      return;
    }

    /**
     * OPTIONAL VALIDASI ROLE
     * kalau ada field role di DB
     */

    if (
      data.role &&
      data.role.toLowerCase() !==
        selectedRole.toLowerCase()
    ) {
      Alert.alert(
        'Role tidak sesuai',
        'Silakan pilih role yang benar'
      );
      return;
    }

    /**s
     * SIMPAN SESSION
     */

    await AsyncStorage.multiSet([
      ['userToken', 'logged-in'],
      ['userRole', selectedRole],
      ['username', data.username],
      ['userData', JSON.stringify(data)],
    ]);

    /**
     * REDIRECT
     */

    router.replace('/user');

  } catch (err) {
    console.log(err);

    Alert.alert(
      'Error',
      'Terjadi kesalahan saat login'
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: Colors.background }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-7">
          {/* Logo Header */}
          <View className="items-center mb-8">
            <Text 
              className="text-4xl font-mplus-extrabold text-primary"
            >
              SosioMap
            </Text>
            <Text 
              className="text-md mt-2"
              style={{ color: Colors.textMuted }}
            >
              Pemetaan Profil Ekonomi Wajib Pajak
            </Text>
          </View>

          {/* Login Card */}
          <View 
            className="rounded-2xl p-6"
            style={{ 
              backgroundColor: Colors.card,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {/* Username */}
            <View className="mb-4">
              <Text 
                className="text-md font-bold mb-2"
                style={{ color: Colors.primary }}
              >
                Username
              </Text>
              <View 
                className="flex-row items-center px-4 py-1 rounded-xl border"
                style={{ borderColor: Colors.border }}
              >
                <User size={20} color={Colors.textMuted} />
                <TextInput
                  className="flex-1 ml-3 text-md py-3"
                  style={{ color: Colors.textPrimary }}
                  placeholder="Masukkan username Anda"
                  placeholderTextColor={Colors.textMuted}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password */}
            <View className="mb-5">
              <Text 
                className="text-md font-bold mb-2"
                style={{ color: Colors.primary }}
              >
                Password
              </Text>
              <View 
                className="flex-row items-center px-4 py-1 rounded-xl border"
                style={{ borderColor: Colors.border }}
              >
                <Lock size={20} color={Colors.textMuted} />
                <TextInput
                  className="flex-1 ml-3 text-md py-3"
                  style={{ color: Colors.textPrimary }}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <Eye size={20} color={Colors.textMuted} />
                  ) : (
                    <EyeOff size={20} color={Colors.textMuted} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Role Selector */}
            <View className="mb-6">
              <Text 
                className="text-md font-bold mb-3"
                style={{ color: Colors.primary }}
              >
                Pilih Peran Anda
              </Text>
              <View className="flex-row justify-between">
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.id}
                    className="items-center px-5 py-3 rounded-xl border"
                    style={{
                      backgroundColor: selectedRole === role.id ? Colors.yellowLight : Colors.card,
                      borderColor: selectedRole === role.id ? Colors.accent : Colors.border,
                      borderWidth: selectedRole === role.id ? 2 : 1,
                    }}
                    onPress={() => setSelectedRole(role.id)}
                  >
                    {role.icon}
                    <Text 
                      className="text-xs font-bold mt-1.5"
                      style={{ 
                        color: selectedRole === role.id ? Colors.primaryDark : Colors.textMuted 
                      }}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="py-3 rounded-xl items-center"
              style={{
                backgroundColor: loading
                  ? Colors.textMuted
                  : Colors.primary,
              }}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Masuk
                </Text>
              )}
            </TouchableOpacity>

            {/* Lupa Password */}
            <TouchableOpacity className="items-center mt-3">
              <Text 
                className="text-sm"
                style={{ color: Colors.primary }}
              >
                Lupa password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center pb-6">
          <Text 
            className="text-md mb-2"
            style={{ color: Colors.textMuted }}
          >
            © 2026 SosioMap
          </Text>
          <View className="flex-row">
            <TouchableOpacity>
              <Text 
                className="text-md font-mplus-extrabold mr-4"
                style={{ color: Colors.primary }}
              >
                KEBIJAKAN PRIVASI
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text 
                className="text-md font-mplus-extrabold"
                style={{ color: Colors.primary }}
              >
                BANTUAN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}