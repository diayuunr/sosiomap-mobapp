import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileText, CheckCircle2, Download } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface LaporanPreviewProps {
  title: string;
  subtitle: string;
  items: string[];
  onExport: () => void;
}

export default function LaporanPreview({ title, subtitle, items, onExport }: LaporanPreviewProps) {
  return (
    <View className="mx-6 mb-5 rounded-2xl border p-5"
      style={{ 
        backgroundColor: `${Colors.primary}10`,
        borderColor: Colors.primary,
      }}
    >
      {/* Header */}
      <View className="flex-row items-start mb-4">
        <View 
          className="w-10 h-10 rounded-lg items-center justify-center mr-3"
        >
          <FileText size={30} color={Colors.primary} />
        </View>
        <View className="flex-1">
          <Text 
            className="text-base font-bold"
            style={{ color: Colors.primaryDark }}
          >
            {title}
          </Text>
          <Text 
            className="text-sm"
            style={{ color: Colors.textMuted }}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Items */}
      <View className="mb-4">
        {items.map((item, index) => (
          <View key={index} className="flex-row items-start mb-2.5 gap-x-3">
            <CheckCircle2 
              size={20} 
              color={Colors.green} 
              className="mr-2 mt-0.5"
            />
            <Text 
              className="flex-1 text-sm leading-5"
              style={{ color: Colors.textPrimary }}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>

      {/* Export Button */}
      <TouchableOpacity
        className="flex-row items-center justify-center py-3 rounded-xl"
        style={{ backgroundColor: Colors.primary }}
        onPress={onExport}
        activeOpacity={0.8}
      >
        <Download size={20} color="white" className="mr-2" />
        <Text className="text-white font-semibold text-md ml-2">
          Ekspor PDF
        </Text>
      </TouchableOpacity>
    </View>
  );
}