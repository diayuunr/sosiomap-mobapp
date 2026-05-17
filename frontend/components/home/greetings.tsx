import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';

export default function Greetings() {
  const router = useRouter();

  const handleUser = async () => {
    // Redirect ke home
    router.replace('/user');
  };
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
            <Text className="text-[15px] font-bold text-white">U</Text>
          </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="w-full pt-3">
        <Text className="text-2xl font-bold text-primary">
          Halo, User123!
        </Text>

        <View className="mt-2 mb-5 w-[50%] flex-row items-center justify-center rounded-xl border-2 border-accent px-3 py-2">
        <Feather name="user" size={18} color="#007BE5" />

        <Text className="ml-2 text-sm text-primary">
            Peran Aktif:{' '}
            <Text className="font-mplus-bold text-primary">
            Analis
            </Text>
        </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}