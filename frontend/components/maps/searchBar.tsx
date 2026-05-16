import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
}

export default function SearchBar({ value, onChangeText, onFilterPress }: SearchBarProps) {
  return (
    <View 
      className="absolute top-1 left-2 right-2 flex-row items-center mx-4 mt-4 px-4 py-2 rounded-2xl"
      style={{ 
        backgroundColor: Colors.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <TextInput
        className="flex-1 ml-1 text-sm"
        style={{ color: Colors.textPrimary }}
        placeholder="Cari Wilayah..."
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onFilterPress}>
        <SlidersHorizontal size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}