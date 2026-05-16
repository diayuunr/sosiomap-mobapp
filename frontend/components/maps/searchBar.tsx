import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  isFilterActive: boolean;
  onClearFilter: () => void;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  onFilterPress, 
  isFilterActive,
  onClearFilter 
}: SearchBarProps) {
  return (
    <View 
      className="mx-6 mt-14 px-4 py-1 rounded-xl"
      style={{ 
        backgroundColor: Colors.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center">
        {/* Text Input */}
        <TextInput
          className="flex-1 text-md"
          style={{ color: Colors.textPrimary }}
          placeholder="Cari Wilayah..."
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
        />

        {/* X button */}
        {isFilterActive && (
          <TouchableOpacity 
            className="mr-3"
            onPress={onClearFilter}
          >
            <X size={20} color={isFilterActive ? Colors.primary : Colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Filter icon */}
        <TouchableOpacity onPress={onFilterPress}>
          <SlidersHorizontal 
            size={20} 
            color={isFilterActive ? Colors.primary : Colors.textMuted} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}