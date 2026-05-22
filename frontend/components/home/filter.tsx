import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

import {
  Colors,
} from '@/constants/colors';

import {
  getProvinsi,
  getKota,
  getKecamatan,
  getKelurahan,
} from '@/src/services/maps.service';

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (
    value: string
  ) => void;
}

function FilterDropdown({
  label,
  value,
  options,
  onSelect,
}: FilterDropdownProps) {

  const [open, setOpen] =
    useState(false);

  return (
    <View className="flex-1 mx-1">
      <Text
        className="text-xs mb-1.5"
        style={{
          color:
            Colors.textMuted,
        }}
      >
        {label}
      </Text>

      <TouchableOpacity
        className="flex-row items-center justify-between px-3 py-2.5 rounded-xl border"
        style={{
          backgroundColor:
            Colors.card,

          borderColor:
            Colors.border,
        }}
        onPress={() =>
          setOpen(!open)
        }
      >
        <Text
          className="text-sm font-medium flex-1"
          style={{
            color:
              value
                ? Colors.primary
                : Colors.textMuted,
          }}
          numberOfLines={1}
        >
          {value ||
            `Pilih ${label}`}
        </Text>

        {open ? (
          <ChevronUp
            size={16}
            color={
              Colors.textMuted
            }
          />
        ) : (
          <ChevronDown
            size={16}
            color={
              Colors.textMuted
            }
          />
        )}
      </TouchableOpacity>

      {open && (
        <View
          className="absolute top-16 left-0 right-0 z-20 rounded-xl border"
          style={{
            backgroundColor:
              Colors.card,

            borderColor:
              Colors.border,

            elevation: 5,

            maxHeight: 180,
          }}
        >
          <ScrollView>
            {options?.map(
              (option) => (
                <TouchableOpacity
                  key={option}
                  className="px-3 py-3 border-b"
                  style={{
                    borderBottomColor:
                      Colors.background,
                  }}
                  onPress={() => {

                    onSelect(
                      option
                    );

                    setOpen(
                      false
                    );
                  }}
                >
                  <Text
                    style={{
                      color:
                        Colors.textPrimary,
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
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

  onFilterChange: (
    filters: any
  ) => void;

  onApplyFilter: () => void;
}

export default function FilterSection({
  filters,
  onFilterChange,
  onApplyFilter,
}: FilterSectionProps) {

  const [provinsiOptions,
    setProvinsiOptions] =
    useState<string[]>([]);

  const [kotaOptions,
    setKotaOptions] =
    useState<string[]>([]);

  const [kecamatanOptions,
    setKecamatanOptions] =
    useState<string[]>([]);

  const [kelurahanOptions,
    setKelurahanOptions] =
    useState<string[]>([]);

  useEffect(() => {
    loadFilterData();
  }, []);

  const loadFilterData =
    async () => {

      try {

        const provinsi =
          await getProvinsi();

        const kota =
          await getKota();

        const kecamatan =
          await getKecamatan();

        const kelurahan =
          await getKelurahan();

        setProvinsiOptions(
          provinsi.map(
            (item: any) =>
              item.nama
          )
        );

        setKotaOptions(
          kota.map(
            (item: any) =>
              item.nama
          )
        );

        setKecamatanOptions(
          kecamatan.map(
            (item: any) =>
              item.nama
          )
        );

        setKelurahanOptions(
          kelurahan.map(
            (item: any) =>
              item.nama
          )
        );

      } catch (error) {

        console.log(
          'FILTER ERROR:',
          error
        );

      }
    };

  const updateFilter = (
    key: string,
    value: string
  ) => {

    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <View
      className="rounded-b-2xl p-5 mx-7 mb-5"
      style={{
        backgroundColor:
          'rgba(255,255,255,0.95)',

        shadowColor: '#000',

        shadowOffset: {
          width: 0,
          height: 2,
        },

        shadowOpacity: 0.1,

        shadowRadius: 4,

        elevation: 3,
      }}
    >

      <Text
        className="text-base font-semibold mb-4"
        style={{
          color:
            Colors.primary,
        }}
      >
        Wilayah
      </Text>

      <View className="flex-row mb-3">
        <FilterDropdown
          label="Kota"
          value={filters.kota}
          options={
            kotaOptions
          }
          onSelect={(v) =>
            updateFilter(
              'kota',
              v
            )
          }
        />

        <FilterDropdown
          label="Kecamatan"
          value={
            filters.kecamatan
          }
          options={
            kecamatanOptions
          }
          onSelect={(v) =>
            updateFilter(
              'kecamatan',
              v
            )
          }
        />
      </View>

      <View className="flex-row mb-4">
        <FilterDropdown
          label="Kelurahan"
          value={
            filters.kelurahan
          }
          options={
            kelurahanOptions
          }
          onSelect={(v) =>
            updateFilter(
              'kelurahan',
              v
            )
          }
        />

        <FilterDropdown
          label="Provinsi"
          value={
            filters.provinsi
          }
          options={
            provinsiOptions
          }
          onSelect={(v) =>
            updateFilter(
              'provinsi',
              v
            )
          }
        />
      </View>

      <TouchableOpacity
        className="py-3.5 rounded-xl items-center"
        style={{
          backgroundColor:
            Colors.primary,
        }}
        onPress={
          onApplyFilter
        }
      >
        <Text className="text-white font-semibold">
          Filter
        </Text>
      </TouchableOpacity>
    </View>
  );
}