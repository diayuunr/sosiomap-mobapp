import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { getRekomendasi } from '@/src/services/rekomendasi.service';

import {
  RiskColors,
  RiskBgColors,
  Colors,
} from '@/constants/colors';

const getRiskData = (klaster: string) => {
  switch (klaster) {
    case 'Merah':
      return {
        riskLevel: 'risiko',
        riskLabel:
          'Risiko Keterlambatan Bayar: Tinggi',
      };

    case 'Kuning':
      return {
        riskLevel: 'perhatian',
        riskLabel:
          'Risiko Keterlambatan Bayar: Sedang',
      };

    default:
      return {
        riskLevel: 'stabil',
        riskLabel:
          'Risiko Keterlambatan Bayar: Rendah',
      };
  }
};

export default function RecommendationSection() {
  const router = useRouter();

  const [rekomendasi, setRekomendasi] =
    useState<any[]>([]);

  useEffect(() => {
    loadRekomendasi();
  }, []);

  const loadRekomendasi = async () => {
    try {
      const data = await getRekomendasi();

      console.log(
        'REKOMENDASI:',
        data
      );

      if (!data || data.length === 0) {
        setRekomendasi([]);
        return;
      }

      // ranking risiko
      const riskOrder: Record<
        string,
        number
      > = {
        merah: 3,
        kuning: 2,
        hijau: 1,
      };

      // remove duplicate wilayah
      const uniqueMap = new Map();

      data.forEach((item: any) => {
        const wilayahId =
          item.wilayah?.id;

        if (!wilayahId) return;

        const klaster =
          item.wilayah?.klaster_wilayah?.[0]
            ?.klaster_label || 'Hijau';

        const currentRisk =
          riskOrder[
            klaster.toLowerCase()
          ] || 0;

        const existing =
          uniqueMap.get(wilayahId);

        if (!existing) {
          uniqueMap.set(
            wilayahId,
            item
          );
          return;
        }

        const existingKlaster =
          existing.wilayah?.klaster_wilayah?.[0]
            ?.klaster_label || 'Hijau';

        const existingRisk =
          riskOrder[
            existingKlaster.toLowerCase()
          ] || 0;

        if (currentRisk > existingRisk) {
          uniqueMap.set(
            wilayahId,
            item
          );
        }
      });

      // convert to array
      const uniqueData = Array.from(
        uniqueMap.values()
      );

      // sort highest risk first
      uniqueData.sort(
        (a: any, b: any) => {

          const klasterA =
            a.wilayah?.klaster_wilayah?.[0]
              ?.klaster_label || 'Hijau';

          const klasterB =
            b.wilayah?.klaster_wilayah?.[0]
              ?.klaster_label || 'Hijau';

          return (
            (riskOrder[
              klasterB.toLowerCase()
            ] || 0) -
            (riskOrder[
              klasterA.toLowerCase()
            ] || 0)
          );
        }
      );

      // top 3
      const top3 =
        uniqueData.slice(0, 3);

      setRekomendasi(top3);

    } catch (error) {
      console.log(
        'ERROR REKOMENDASI:',
        error
      );
    }
  };

  return (
    <View
      className="px-5 py-3 bg-white rounded-2xl mx-7 mt-1"
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
        className="text-base font-semibold mb-3 mt-2"
        style={{
          color: Colors.primary,
        }}
      >
        Rekomendasi Wilayah Prioritas
      </Text>

      <View
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor:
            Colors.card,
        }}
      >
        {rekomendasi.map(
          (wilayah, index) => {

            const klaster =
              wilayah.wilayah?.klaster_wilayah?.[0]
                ?.klaster_label || 'Hijau';

            const {
              riskLevel,
              riskLabel,
            } = getRiskData(klaster);

            const riskKey =
              riskLevel as keyof typeof RiskColors;

            return (
              <TouchableOpacity
                key={
                  wilayah.wilayah?.id ||
                  index
                }
                className="flex-row items-center px-4 py-4"
                style={{
                  borderBottomWidth:
                    index <
                    rekomendasi.length - 1
                      ? 1
                      : 0,
                  borderBottomColor:
                    Colors.background,
                }}
                onPress={() =>
                  router.push({
                    pathname: '/maps',
                    params: {
                      zone:
                        wilayah.wilayah?.id,
                    },
                  })
                }
                activeOpacity={0.7}
              >
                {/* Icon */}
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{
                    backgroundColor:
                      RiskBgColors[
                        riskKey
                      ] ||
                      Colors.background,
                  }}
                >
                  <MapPin
                    size={18}
                    color={
                      RiskColors[
                        riskKey
                      ] ||
                      Colors.primary
                    }
                  />
                </View>

                {/* Content */}
                <View className="flex-1">
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color:
                        Colors.primary,
                    }}
                  >
                    {wilayah.wilayah
                      ?.nama ||
                      'Wilayah'}
                  </Text>

                  <Text
                    className="text-xs mt-1"
                    style={{
                      color:
                        Colors.textSecondary,
                    }}
                  >
                    {riskLabel}
                  </Text>
                </View>

                {/* Arrow */}
                <ChevronRight
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            );
          }
        )}

        {rekomendasi.length === 0 && (
          <View className="py-8 items-center">
            <Text
              style={{
                color:
                  Colors.textSecondary,
              }}
            >
              Tidak ada rekomendasi
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}