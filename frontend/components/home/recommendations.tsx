import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getRekomendasi } from '@/src/services/rekomendasi.service';
import { RiskColors, RiskBgColors, Colors } from '@/constants/colors';

export default function RecommendationSection() {
  const router = useRouter();
  const [rekomendasi, setRekomendasi] =
  useState<any[]>([]);

  useEffect(() => {
  loadRekomendasi();
}, []);

const loadRekomendasi =
  async () => {

  try {

    const data =
      await getRekomendasi();

    console.log(
      'REKOMENDASI:',
      data
    );

    setRekomendasi(data || []);

  } catch (error) {
    console.log(error);
  }
};

  return (
    <View className="px-5 py-3 bg-white rounded-2xl mx-7 mt-1"
      style={{ 
        backgroundColor: 'rgba(255,255,255,0.95)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }}>
      <Text 
        className="text-base font-semibold mb-3 mt-2"
        style={{ color: Colors.primary }}
      >
        Rekomendasi Wilayah Prioritas
      </Text>

      <View 
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: Colors.card }}
      >
        {rekomendasi.map((wilayah, index) => {
          const riskKey = wilayah.risk as keyof typeof RiskColors;
          return (
            <TouchableOpacity
              key={wilayah.id}
              className="flex-row items-center px-4 py-4"
              style={{
                borderBottomWidth: index < rekomendasi.length - 1 ? 1 : 0,
                borderBottomColor: Colors.background,
              }}
              onPress={() => router.push(`/maps?zone=${wilayah.id}`)}
              activeOpacity={0.7}
            >
              {/* Icon */}
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: RiskBgColors[riskKey] }}
              >
                <MapPin 
                  size={18} 
                  color={RiskColors[riskKey]} 
                />
              </View>

              {/* Name */}
              <Text 
                className="flex-1 text-sm font-medium"
                style={{ color: Colors.primary }}
              >
                {wilayah.wilayah?.nama}
              </Text>

              {/* Arrow */}
              <ChevronRight size={20} color={Colors.primary} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
