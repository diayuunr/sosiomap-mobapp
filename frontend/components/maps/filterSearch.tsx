// components/maps/FilterSheet.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { X, SlidersHorizontal } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    wilayah: string;
    kelompok: string[];
  };
  onFilterChange: (filters: any) => void;
}

const wilayahOptions = ['Kecamatan', 'Kota'];
const kelompokOptions = ['Pensiunan', 'Pegawai Negeri', 'UMKM', 'Wirausaha'];

export default function FilterSearch({ visible, onClose, filters, onFilterChange }: FilterSheetProps) {
  const toggleKelompok = (kelompok: string) => {
    const current = filters.kelompok;
    if (current.includes(kelompok)) {
      onFilterChange({
        ...filters,
        kelompok: current.filter((k: string) => k !== kelompok),
      });
    } else {
      onFilterChange({
        ...filters,
        kelompok: [...current, kelompok],
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40">
        <TouchableOpacity className="flex-1" onPress={onClose} />
        
        <View 
          className="rounded-t-3xl p-5"
          style={{ backgroundColor: Colors.card }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <Text 
              className="text-lg font-semibold"
              style={{ color: Colors.textPrimary }}
            >
              Cibeber
            </Text>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity onPress={onClose}>
                <X size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
              <SlidersHorizontal size={20} color={Colors.primary} />
            </View>
          </View>

          {/* Wilayah */}
          <Text 
            className="text-sm font-medium mb-3"
            style={{ color: Colors.textPrimary }}
          >
            Wilayah
          </Text>
          <View className="flex-row mb-5">
            {wilayahOptions.map((option) => (
              <TouchableOpacity
                key={option}
                className="px-4 py-2 rounded-lg mr-2 border"
                style={{
                  backgroundColor: filters.wilayah === option ? Colors.primary : Colors.card,
                  borderColor: filters.wilayah === option ? Colors.primary : Colors.border,
                }}
                onPress={() => onFilterChange({ ...filters, wilayah: option })}
              >
                <Text
                  className="text-sm font-medium"
                  style={{
                    color: filters.wilayah === option ? 'white' : Colors.textPrimary,
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Kelompok Ekonomi */}
          <Text 
            className="text-sm font-medium mb-3"
            style={{ color: Colors.textPrimary }}
          >
            Kelompok Ekonomi
          </Text>
          <View className="flex-row flex-wrap mb-5">
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
                    style={{
                      color: isSelected ? 'white' : Colors.textPrimary,
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Buttons */}
          <View className="flex-row justify-end gap-3">
            <TouchableOpacity
              className="px-6 py-3 rounded-lg border"
              style={{ borderColor: Colors.border }}
              onPress={() => onFilterChange({ wilayah: 'Kecamatan', kelompok: [] })}
            >
              <Text 
                className="text-sm font-medium"
                style={{ color: Colors.textPrimary }}
              >
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-6 py-3 rounded-lg"
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
        </View>
      </View>
    </Modal>
  );
}