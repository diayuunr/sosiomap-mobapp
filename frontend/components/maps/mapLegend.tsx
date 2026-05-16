import React from 'react';
import { View, Text } from 'react-native';
import { RiskColors, RiskLabels, Colors } from '@/constants/colors';

export default function MapLegend() {
  return (
    <View 
      className="absolute bottom-20 mb-20 left-7 rounded-xl px-5 py-3"
      style={{ 
        backgroundColor: 'rgba(255,255,255,0.95)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Text 
        className="text-sm font-bold mb-2"
        style={{ color: Colors.primaryDark }}
      >
        Tingkat Risiko
      </Text>
      {Object.entries(RiskLabels).map(([key, label]) => (
        <View key={key} className="flex-row items-center mb-1">
          <View 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: RiskColors[key as keyof typeof RiskColors] }}
          />
          <Text 
            className="text-sm"
            style={{ color: Colors.primary }}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}