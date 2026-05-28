import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
} from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { getAllWilayah } from '@/src/services/filter.service';

// Mapping manual provinsi → kota (karena parent_id tidak ada di DB)
const PROVINSI_KOTA_MAP: Record<string, string[]> = {
  'BALI': [
    'KOTA DENPASAR',
    'KABUPATEN BADUNG',
    'KABUPATEN GIANYAR',
    'KABUPATEN TABANAN',
    'KABUPATEN BANGLI',
    'KABUPATEN KLUNGKUNG',
    'KABUPATEN KARANGASEM',
    'KABUPATEN BULELENG',
    'KABUPATEN JEMBRANA',
  ],
};

interface WilayahItem {
  id: string;
  nama: string;
  tipe: string;
  parent_id: string | null;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

function FilterDropdown({
  label, value, options, onSelect, disabled = false,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <View className="flex-1 mx-1">
      <Text
        className="text-xs mb-1.5"
        style={{ color: Colors.textMuted }}
      >
        {label}
      </Text>

      <TouchableOpacity
        className="flex-row items-center justify-between px-3 py-2.5 rounded-xl border"
        style={{
          backgroundColor: disabled ? Colors.background : Colors.card,
          borderColor: Colors.border,
          opacity: disabled ? 0.5 : 1,
        }}
        onPress={() => {
          if (!disabled) setOpen(!open);
        }}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <Text
          className="text-sm font-medium flex-1"
          style={{
            color: value ? Colors.primary : Colors.textMuted,
          }}
          numberOfLines={1}
        >
          {value || `Pilih ${label}`}
        </Text>

        {open
          ? <ChevronUp size={16} color={Colors.textMuted} />
          : <ChevronDown size={16} color={Colors.textMuted} />}
      </TouchableOpacity>

      {open && (
        <View
          className="absolute top-16 left-0 right-0 z-20 rounded-xl border"
          style={{
            backgroundColor: Colors.card,
            borderColor: Colors.border,
            elevation: 5,
            maxHeight: 180,
          }}
        >
          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                className="px-3 py-3"
                onPress={() => {
                  onSelect(option);
                  setOpen(false);
                }}
              >
                <Text style={{ color: Colors.textPrimary }}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

interface FilterSectionProps {
  filters: {
    provinsi: string;
    kota: string;
    kecamatan: string;
    kelurahan: string;
  };
  onFilterChange: (filters: any) => void;
  onApplyFilter: () => void;
}

export default function FilterSection({
  filters, onFilterChange, onApplyFilter,
}: FilterSectionProps) {
  const [allWilayah, setAllWilayah] = useState<WilayahItem[]>([]);

  useEffect(() => {
    getAllWilayah()
      .then(setAllWilayah)
      .catch((e) => console.log('FILTER ERROR:', e));
  }, []);

  // ── Derived options ────────────────────────────────────────────

  const provinsiOptions = allWilayah
    .filter((w) => w.tipe === 'provinsi')
    .map((w) => w.nama);

  // Kota: filter by mapping manual provinsi→kota
  const kotaOptions = filters.provinsi
    ? allWilayah
        .filter((w) => w.tipe === 'kabupaten_kota')
        .filter((w) => {
          const kotaList = PROVINSI_KOTA_MAP[filters.provinsi] || [];
          return kotaList.some((k) => w.nama.includes(k) || k.includes(w.nama));
        })
        .map((w) => w.nama)
    : [];

  // Kecamatan: semua kecamatan yang namanya match dengan kota terpilih
  // (karena parent_id kecamatan null, pakai heuristic: load semua kecamatan
  //  yang ada di data geom / klaster sebagai fallback)
  const kecamatanAll = allWilayah.filter((w) => w.tipe === 'kecamatan');

  // Cari id kota yang dipilih
  const selectedKotaObj = allWilayah.find(
    (w) => w.tipe === 'kabupaten_kota' && w.nama === filters.kota,
  );

  // Kecamatan yang parent_id-nya = id kota, atau semua kalau tidak ada relasi
  const kecamatanOptions = filters.kota
    ? kecamatanAll
        .filter((w) => selectedKotaObj
          ? w.parent_id === selectedKotaObj.id
          : true) // fallback: tampil semua kecamatan
        .map((w) => w.nama)
    : [];

  // Kelurahan: filter by parent_id = id kecamatan (ini sudah ada di DB)
  const selectedKecamatanObj = allWilayah.find(
    (w) => w.tipe === 'kecamatan' && w.nama === filters.kecamatan,
  );

  const kelurahanOptions = filters.kecamatan && selectedKecamatanObj
    ? allWilayah
        .filter((w) => w.tipe === 'kelurahan' && w.parent_id === selectedKecamatanObj.id)
        .map((w) => w.nama)
    : [];

  // ── Reset downstream saat parent berubah ──────────────────────

  const handleProvinsiChange = (val: string) => {
    onFilterChange({ provinsi: val, kota: '', kecamatan: '', kelurahan: '' });
  };

  const handleKotaChange = (val: string) => {
    onFilterChange({ ...filters, kota: val, kecamatan: '', kelurahan: '' });
  };

  const handleKecamatanChange = (val: string) => {
    onFilterChange({ ...filters, kecamatan: val, kelurahan: '' });
  };

  const handleKelurahanChange = (val: string) => {
    onFilterChange({ ...filters, kelurahan: val });
  };

  return (
    <View
      className="rounded-b-2xl p-5 mx-7 mb-5 z-10"
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
        className="text-base font-semibold mb-4"
        style={{ color: Colors.primary }}
      >
        Wilayah
      </Text>

      {/* Baris 1: Provinsi + Kota */}
      <View className="flex-row mb-3">
        <FilterDropdown
          label="Provinsi"
          value={filters.provinsi}
          options={provinsiOptions}
          onSelect={handleProvinsiChange}
        />
        <FilterDropdown
          label="Kota"
          value={filters.kota}
          options={kotaOptions}
          onSelect={handleKotaChange}
          disabled={!filters.provinsi}
        />
      </View>

      {/* Baris 2: Kecamatan + Kelurahan */}
      <View className="flex-row mb-4">
        <FilterDropdown
          label="Kecamatan"
          value={filters.kecamatan}
          options={kecamatanOptions}
          onSelect={handleKecamatanChange}
          disabled={!filters.kota}
        />
        <FilterDropdown
          label="Kelurahan"
          value={filters.kelurahan}
          options={kelurahanOptions}
          onSelect={handleKelurahanChange}
          disabled={!filters.kecamatan}
        />
      </View>

      <TouchableOpacity
        className="py-3.5 rounded-xl items-center"
        style={{ backgroundColor: Colors.primary }}
        onPress={onApplyFilter}
      >
        <Text className="text-white font-semibold">Filter</Text>
      </TouchableOpacity>
    </View>
  );
}