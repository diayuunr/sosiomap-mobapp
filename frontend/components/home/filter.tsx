import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { filterOptions } from '@/constants/dummyData';
import { Colors } from '@/constants/colors';

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}

function FilterDropdown({ label, value, options, onSelect }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <View className="flex-1 mx-1 w-full">
      <Text 
        className="text-xs mb-1.5"
        style={{ color: Colors.textMuted }}
      >
        {label}
      </Text>
      <TouchableOpacity
        className="flex-row items-center justify-between px-3 py-2.5 rounded-xl border"
        style={{ 
          backgroundColor: Colors.card,
          borderColor: Colors.border,
        }}
        onPress={() => setOpen(!open)}
      >
        <Text 
          className="text-sm font-medium flex-1"
          style={{ color: Colors.primary }}
          numberOfLines={1}
        >
          {value}
        </Text>
        {open ? (
          <ChevronUp size={16} color={Colors.textMuted} />
        ) : (
          <ChevronDown size={16} color={Colors.textMuted} />
        )}
      </TouchableOpacity>

      {/* Dropdown */}
      {open && (
        <View 
          className="absolute top-16 left-0 right-0 z-20 rounded-xl border shadow-lg max-h-40"
          style={{ 
            backgroundColor: Colors.card,
            borderColor: Colors.border,
            elevation: 5,
          }}
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              className="px-3 py-2.5 border-b"
              style={{ borderBottomColor: Colors.background }}
              onPress={() => {
                onSelect(option);
                setOpen(false);
              }}
            >
              <Text 
                className="text-sm"
                style={{ color: Colors.textPrimary }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

interface FilterSectionProps {
  filters: {
    kota: string;
    kecamatan: string;
    kelurahan: string;
    provinsi: string;
  };
  onFilterChange: (filters: any) => void;
  onApplyFilter: () => void;
}

export default function FilterSection({ filters, onFilterChange, onApplyFilter }: FilterSectionProps) {
  const updateFilter = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <View 
      className="rounded-b-2xl p-5 mx-7 mb-5"
      style={{ 
        backgroundColor: 'rgba(255,255,255,0.95)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Text 
          className="text-base font-semibold"
          style={{ color: Colors.primary }}
        >
          Wilayah
        </Text>
      </View>

      {/* Filter Grid */}
      <View className="flex-row mb-3">
        <FilterDropdown
          label="Kota"
          value={filters.kota}
          options={filterOptions.kota}
          onSelect={(v) => updateFilter('kota', v)}
        />
        <FilterDropdown
          label="Kecamatan"
          value={filters.kecamatan}
          options={filterOptions.kecamatan}
          onSelect={(v) => updateFilter('kecamatan', v)}
        />
      </View>

      <View className="flex-row mb-4">
        <FilterDropdown
          label="Kelurahan"
          value={filters.kelurahan}
          options={filterOptions.kelurahan}
          onSelect={(v) => updateFilter('kelurahan', v)}
        />
        <FilterDropdown
          label="Provinsi"
          value={filters.provinsi}
          options={filterOptions.provinsi}
          onSelect={(v) => updateFilter('provinsi', v)}
        />
      </View>

      {/* Filter Button */}
      <TouchableOpacity
        className="py-3.5 rounded-xl items-center"
        style={{ backgroundColor: Colors.primary }}
        activeOpacity={0.8}
        onPress={onApplyFilter}
      >
        <Text className="text-white font-semibold text-base">
          Filter
        </Text>
      </TouchableOpacity>
    </View>
  );
}