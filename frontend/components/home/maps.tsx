import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import ZoneModal from '../../features/map/ZoneModal';

type ZoneStatus = 'stable' | 'warning' | 'high-risk';

type Zone = {
  id: string;
  name: string;
  kecamatan: string;
  status: ZoneStatus;

  kepatuhan: number;
  wajibPajak: number;
  tunggakan: string;

  usia: string;

  pekerjaan: {
    [key: string]: number;
  };
};

const ZONE_COLOR: Record<ZoneStatus, string> = {
  stable: 'border-green bg-green/20',
  warning: 'border-yellow bg-yellow/20',
  'high-risk': 'border-red bg-red/20',
};

const ZONE_TEXT: Record<ZoneStatus, string> = {
  stable: 'text-green',
  warning: 'text-yellow',
  'high-risk': 'text-red',
};

function MapPlaceholder({
  zones,
  onZonePress,
}: {
  zones: Zone[];
  onZonePress: (zone: Zone) => void;
}) {
  return (
    <View className="min-h-[220px] overflow-hidden rounded-2xl border border-border bg-[#E8F0E0] px-3 pb-3">
      <Text className="absolute left-2 top-2 text-[10px] text-text-second">
        📍 Ganti dengan react-native-maps
      </Text>

      {/* Zona */}
      <View className="flex-row flex-wrap gap-2">
        {zones.map((z: Zone) => {
          const zoneColor =
            ZONE_COLOR[z.status] || 'border-gray bg-gray/20';

          const zoneText =
            ZONE_TEXT[z.status] || 'text-text-muted';

          return (
            <TouchableOpacity
              key={z.id}
              activeOpacity={0.75}
              onPress={() => onZonePress(z)}
              className={`items-center rounded-xl border-2 px-3 py-2 ${zoneColor}`}
            >
              <Text
                className={`font-mplus-bold text-[11px] ${zoneText}`}
              >
                {z.name}
              </Text>

              <Text
                className={`mt-1 font-mplus-extrabold text-[13px] ${zoneText}`}
              >
                {z.kepatuhan}%
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legenda */}
      <View className="absolute bottom-2 right-2 rounded-xl border border-border bg-white/95 p-2">
        <Text className="mb-1 font-mplus-bold text-[9px] text-text-primary">
          Tingkat Risiko
        </Text>

        <View className="mb-1 flex-row items-center">
          <View className="mr-1 h-2 w-2 rounded-full bg-green" />
          <Text className="text-[9px] text-text-second">
            Stabil
          </Text>
        </View>

        <View className="mb-1 flex-row items-center">
          <View className="mr-1 h-2 w-2 rounded-full bg-yellow" />
          <Text className="text-[9px] text-text-second">
            Perlu Perhatian
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="mr-1 h-2 w-2 rounded-full bg-red" />
          <Text className="text-[9px] text-text-second">
            Risiko Tinggi
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function InteractiveMap({
  zones,
}: {
  zones: Zone[];
}) {
  const [selectedZone, setSelectedZone] =
    useState<Zone | null>(null);

  const [modalVisible, setModalVisible] =
    useState(false);

  const handleZonePress = (zone: Zone) => {
    setSelectedZone(zone);
    setModalVisible(true);
  };

  return (
    <>
      <View className="mx-4 mt-4 rounded-2xl bg-card p-4 shadow">
        <Text className="font-mplus-bold text-[15px] text-text-primary">
          Peta Interaktif Wilayah
        </Text>

        <Text className="mb-3 mt-1 text-[12px] text-text-muted">
          Ketuk zona untuk melihat detail
        </Text>

        <MapPlaceholder
          zones={zones}
          onZonePress={handleZonePress}
        />
      </View>

      <ZoneModal
        zone={selectedZone}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}