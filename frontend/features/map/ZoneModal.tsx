import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

// HAPUS dulu kalau file StatusBadge belum ada
// import StatusBadge from '../../components/StatusBadge';

const SCREEN_HEIGHT = Dimensions.get('window').height;

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

type Props = {
  zone: Zone | null;
  visible: boolean;
  onClose: () => void;
};

export default function ZoneModal({
  zone,
  visible,
  onClose,
}: Props) {
  if (!zone) return null;

  const jobs = Object.entries(zone.pekerjaan) as [
    string,
    number
  ][];

  const kepatuhanColor =
    zone.kepatuhan >= 75
      ? 'text-green'
      : zone.kepatuhan >= 50
      ? 'text-yellow'
      : 'text-red';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <View className="flex-1 justify-end bg-black/50">
        {/* Bottom Sheet */}
        <View
          className="rounded-t-[24px] bg-card px-5 pb-9 pt-5"
          style={{
            maxHeight: SCREEN_HEIGHT * 0.85,
          }}
        >
          {/* Handle */}
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-border" />

          {/* Header */}
          <View className="mb-4 flex-row items-start justify-between">
            <View>
              <Text className="font-mplus-extrabold text-[20px] text-text-primary">
                {zone.name}
              </Text>

              <Text className="mt-1 text-[12px] text-text-muted">
                {zone.kecamatan}
              </Text>
            </View>

            {/* TEMP BADGE */}
            <View
              className={`rounded-full px-3 py-1 ${
                zone.status === 'stable'
                  ? 'bg-green/20'
                  : zone.status === 'warning'
                  ? 'bg-yellow/20'
                  : 'bg-red/20'
              }`}
            >
              <Text
                className={`text-[11px] font-mplus-bold ${
                  zone.status === 'stable'
                    ? 'text-green'
                    : zone.status === 'warning'
                    ? 'text-yellow'
                    : 'text-red'
                }`}
              >
                {zone.status}
              </Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            {/* Stats */}
            <View className="mb-4 flex-row rounded-2xl bg-bg px-3 py-4">
              {/* WP */}
              <View className="flex-1 items-center">
                <Text className="mb-1 text-[11px] text-text-muted">
                  Wajib Pajak
                </Text>

                <Text className="font-mplus-extrabold text-[16px] text-text-primary">
                  {zone.wajibPajak.toLocaleString()}
                </Text>
              </View>

              {/* Kepatuhan */}
              <View className="flex-1 items-center border-x border-border">
                <Text className="mb-1 text-[11px] text-text-muted">
                  Kepatuhan
                </Text>

                <Text
                  className={`font-mplus-extrabold text-[16px] ${kepatuhanColor}`}
                >
                  {zone.kepatuhan}%
                </Text>
              </View>

              {/* Tunggakan */}
              <View className="flex-1 items-center">
                <Text className="mb-1 text-[11px] text-text-muted">
                  Tunggakan
                </Text>

                <Text className="font-mplus-extrabold text-[13px] text-red">
                  {zone.tunggakan}
                </Text>
              </View>
            </View>

            {/* Distribusi */}
            <View className="mb-4">
              <Text className="mb-3 font-mplus-bold text-[13px] text-text-primary">
                📊 Distribusi Pekerjaan
              </Text>

              {jobs.map(([job, pct]) => (
                <View
                  key={job}
                  className="mb-2 flex-row items-center"
                >
                  <Text className="w-[80px] text-[12px] text-text-second">
                    {job}
                  </Text>

                  <View className="mx-2 h-[7px] flex-1 overflow-hidden rounded-full bg-bg">
                    <View
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Number(pct)}%`,
                      }}
                    />
                  </View>

                  <Text className="w-[30px] text-right text-[11px] text-text-second">
                    {pct}%
                  </Text>
                </View>
              ))}
            </View>

            {/* Usia */}
            <View className="mb-4">
              <Text className="mb-2 font-mplus-bold text-[13px] text-text-primary">
                🎂 Rentang Usia
              </Text>

              <Text className="font-mplus-bold text-[14px] text-primary">
                {zone.usia}
              </Text>
            </View>
          </ScrollView>

          {/* Button */}
          <TouchableOpacity
            className="mt-3 items-center rounded-2xl bg-primary py-4"
            onPress={onClose}
          >
            <Text className="font-mplus-bold text-[15px] text-white">
              Tutup
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}