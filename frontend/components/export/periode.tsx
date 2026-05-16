import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface PeriodeSelectorProps {
  options: { id: number; label: string; subtitle: string }[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function PeriodeSelector({ options, selectedId, onSelect }: PeriodeSelectorProps) {
  return (
    <View className="px-6 mb-3 mt-5">
      <Text 
        className="text-md font-semibold mb-3 tracking-wider"
      >
        PERIODE
      </Text>
      
      <View className="flex-row flex-wrap gap-x-3">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              className="flex-row items-center px-4 py-3 rounded-xl border mb-3 w-[48%]"
              style={{
                backgroundColor: isSelected ? Colors.yellowLight : Colors.card,
                borderColor: isSelected ? Colors.accent : Colors.border,
              }}
              onPress={() => onSelect(option.id)}
            >
              <View>
                <Calendar size={20} color={isSelected ? Colors.accentDark : Colors.textMuted} />
              </View>
              <View className="ml-3">
                <Text 
                  className="text-sm font-semibold"
                  style={{ color: isSelected ? Colors.primaryDark : Colors.textPrimary }}
                >
                  {option.label}
                </Text>
                <Text 
                  className="text-xs mt-0.5"
                  style={{ color: Colors.textMuted }}
                >
                  {option.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}