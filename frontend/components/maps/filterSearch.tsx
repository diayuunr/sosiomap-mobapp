import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';

interface FilterPanelProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    wilayah: string;
    kelompok: string[];
  };
  onFilterChange: (filters: any) => void;
}

const wilayahOptions = [
  { label: 'Kecamatan', value: 'kecamatan' },
  { label: 'Kelurahan', value: 'kelurahan' },
];

const kelompokOptions = ['Pensiunan', 'Pegawai Negeri', 'UMKM', 'Wirausaha'];

export default function FilterPanel({
  visible, onClose, filters, onFilterChange,
}: FilterPanelProps) {
  if (!visible) return null;

  const toggleKelompok = (kelompok: string) => {
    const current = filters.kelompok;
    onFilterChange({
      ...filters,
      kelompok: current.includes(kelompok)
        ? current.filter((k) => k !== kelompok)
        : [...current, kelompok],
    });
  };

  const isFilterDirty =
    filters.wilayah !== 'kecamatan' || filters.kelompok.length > 0;

  return (
    <View
      className="mx-6 mt-1 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: Colors.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Tampilkan Wilayah */}
        <View className="px-7 py-3 mt-2">
          <Text
            className="text-md font-medium mb-3"
            style={{ color: Colors.textPrimary }}
          >
            Tampilkan
          </Text>
          <View className="flex-row">
            {wilayahOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className="px-4 py-2 rounded-lg mr-2 border"
                style={{
                  backgroundColor:
                    filters.wilayah === option.value
                      ? Colors.primary
                      : Colors.card,
                  borderColor:
                    filters.wilayah === option.value
                      ? Colors.primary
                      : Colors.border,
                }}
                onPress={() =>
                  onFilterChange({ ...filters, wilayah: option.value })
                }
              >
                <Text
                  className="text-sm font-medium"
                  style={{
                    color:
                      filters.wilayah === option.value
                        ? 'white'
                        : Colors.textPrimary,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Kelompok Ekonomi */}
        <View className="px-7 py-3">
          <Text
            className="text-md font-medium mb-1"
            style={{ color: Colors.textPrimary }}
          >
            Kelompok Ekonomi
          </Text>
          <Text
            className="text-xs mb-3"
            style={{ color: Colors.textMuted }}
          >
            Tampilkan wilayah yang memiliki kelompok berikut
          </Text>
          <View className="flex-row flex-wrap">
            {kelompokOptions.map((option) => {
              const isSelected = filters.kelompok.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  className="px-4 py-2 rounded-lg mr-2 mb-2 border"
                  style={{
                    backgroundColor: isSelected ? Colors.primary : Colors.card,
                    borderColor: isSelected ? Colors.primary : Colors.border,
                  }}
                  onPress={() => toggleKelompok(option)}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{ color: isSelected ? 'white' : Colors.textPrimary }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-end px-7 py-3 pb-5 gap-3">
          {isFilterDirty && (
            <TouchableOpacity
              className="px-5 py-2 rounded-lg border"
              style={{ borderColor: Colors.border }}
              onPress={() =>
                onFilterChange({ wilayah: 'kecamatan', kelompok: [] })
              }
            >
              <Text
                className="text-sm font-medium"
                style={{ color: Colors.textPrimary }}
              >
                Reset
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="px-5 py-2.5 rounded-lg"
            style={{ backgroundColor: Colors.accent }}
            onPress={onClose}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: Colors.primaryDark }}
            >
              Terapkan
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}