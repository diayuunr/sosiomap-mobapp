import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Users, Wallet } from 'lucide-react-native';
import { Colors, RiskBgColors, RiskColors } from '@/constants/colors';

interface ZonePeekProps {
  data: {
    id: number;
    name: string;
    kelompok: string;
    wajibPajak: number;
    pendapatan: string;
    riskLevel: string;
  };
  onExpand: () => void;
}

export default function ZonePeek({ data, onExpand }: ZonePeekProps) {
  const riskLevel = data.riskLevel as keyof typeof RiskColors;

  return (
    <TouchableOpacity
      className="mb-4 rounded-t-2xl overflow-hidden"
      style={{ backgroundColor: Colors.card }}
      onPress={onExpand}
      activeOpacity={0.9}
    >
      {/* Drag Handle */}
      <View className="items-center py-4">
        <View 
          className="w-20 h-1.5 rounded-full"
          style={{ backgroundColor: Colors.peekBar }}
        />
      </View>

      {/* Kelompok Badge */}
      <View className="px-6 pb-3">
        <View 
          className="self-start px-3 py-1 rounded-lg mb-2"
          style={{ backgroundColor: RiskBgColors[data.riskLevel as keyof typeof RiskBgColors] }}
        >
          <Text 
            className="text-sm font-medium"
            style={{ color: RiskColors[data.riskLevel as keyof typeof RiskColors] }}
          >
            {data.kelompok}
          </Text>
        </View>

        {/* Zone Name */}
        <Text 
          className="text-lg font-bold mb-3"
          style={{ color: Colors.primaryDark }}
        >
          {data.name}
        </Text>

        {/* Stats Row */}
        <View className="flex-row">
          {/* Wajib Pajak */}
          <View 
            className="flex-1 mr-2 p-3 rounded-xl border items-center justify-center"
            style={{ 
                backgroundColor: `${RiskColors[riskLevel]}15`,
                borderColor: RiskColors[riskLevel],
            }}
          >
            <View className="flex-row items-center mb-1">
              <Users size={16} />
              <Text 
                className="text-sm ml-2"
              >
                Wajib Pajak
              </Text>
            </View>
            <Text 
              className="text-lg font-bold"
              style={{ color: Colors.textPrimary }}
            >
              {data.wajibPajak.toLocaleString('id-ID')}
            </Text>
          </View>

          {/* Pendapatan */}
          <View 
            className="flex-1 ml-2 p-3 rounded-xl border items-center justify-center"
            style={{ 
              backgroundColor: `${RiskColors[riskLevel]}15`,
              borderColor: RiskColors[riskLevel],
            }}
          >
            <View className="flex-row items-center mb-1">
              <Wallet size={16} />
              <Text 
                className="text-sm ml-2"
              >
                Pendapatan
              </Text>
            </View>
            <Text 
              className="text-lg font-bold"
              style={{ color: Colors.textPrimary }}
            >
              {data.pendapatan}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}