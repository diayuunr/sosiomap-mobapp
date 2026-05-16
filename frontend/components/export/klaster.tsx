import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';

interface KlasterSelectorProps {
  options: string[];
  selected: string[];
  onToggle: (klaster: string) => void;
}

export default function KlasterSelector({ options, selected, onToggle }: KlasterSelectorProps) {
  return (
    <View className="px-6 mb-5">
      <Text 
        className="text-md font-semibold mb-3 tracking-wider"
      >
        CAKUPAN KLASTER
      </Text>
      
      <View className="flex-row flex-wrap">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <TouchableOpacity
              key={option}
              className="px-5 py-2 rounded-full border mr-2 mb-2"
              style={{
                backgroundColor: isSelected ? `${Colors.primary}10` : Colors.card,
                borderColor: isSelected ? Colors.primary : Colors.border,
              }}
              onPress={() => onToggle(option)}
            >
              <Text 
                className="text-sm font-medium"
                style={{ 
                  color: isSelected ? Colors.primary : Colors.textPrimary 
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}