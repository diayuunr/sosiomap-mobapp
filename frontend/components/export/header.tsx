import {
  View,
  Text,
  StatusBar,
} from 'react-native';

export default function HeaderExport() {
  return (
      <View className='px-6'>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="w-full flex-row items-center justify-between border-b border-gray/20 bg-white pb-4 mt-20">
        <View>
          <Text className="text-4xl font-mplus-bold text-primary">
            Laporan
          </Text>

          <Text className="text-md font-semibold text-accent-dark mt-1">
            Ekspor ringkasan untuk rapat & arsip
          </Text>
        </View>
      </View>
      </View>
  );
}