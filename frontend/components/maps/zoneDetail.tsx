import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Users, Wallet, Shield, TriangleAlert, Briefcase, UserCheck, TrendingUp, Lightbulb } from 'lucide-react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Colors, RiskBgColors, RiskColors } from '@/constants/colors';

interface ZoneDetailProps {
  data: any;
  onClose: () => void;
}

export default function ZoneDetail({ data, onClose }: ZoneDetailProps) {
const chartData =
  data?.trenKepatuhan?.length > 0
    ? data.trenKepatuhan
    : [
        {
          value: 0,
          label: '2024',
        },
      ];

console.log(
  'CHART DATA:',
  chartData
);
  const riskLevel = data.riskLevel as keyof typeof RiskColors;

  return (
    <View 
      className="flex-1 rounded-t-3xl overflow-hidden pb-20"
      style={{ backgroundColor: Colors.card }}
    >
      {/* Drag Handle */}
      <TouchableOpacity 
        className="items-center py-4"
        onPress={onClose}
      >
        <View 
          className="w-20 h-1.5 rounded-full"
          style={{ backgroundColor: Colors.peekBar }}
        />
      </TouchableOpacity>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View className="px-6 pb-3">
          {/* Kelompok Badge */}
          <View 
            className="self-start px-3 py-1 rounded-lg mb-2"
            style={{ backgroundColor: RiskBgColors[riskLevel] }}
          >
            <Text 
              className="text-sm font-medium"
              style={{ color: RiskColors[riskLevel] }}
            >
              {data.kelompok}
            </Text>
          </View>

          {/* Zone Name */}
          <Text 
            className="text-xl font-bold mb-4"
            style={{ color: Colors.primaryDark }}
          >
            {data.name}
          </Text>

          {/* Stats Grid */}
          <View className="flex-row flex-wrap mb-2">
            {/* Wajib Pajak */}
            <View 
              className="w-[48%] mr-[4%] mb-3 p-3 rounded-xl border items-center justify-center"
              style={{ 
                backgroundColor: `${RiskColors[riskLevel]}15`,
                borderColor: RiskColors[riskLevel],
              }}
            >
              <View className="flex-row items-center mb-1">
                <Users size={16}/>
                <Text className="text-sm ml-1.5">
                  Wajib Pajak
                </Text>
              </View>
              <Text className="text-lg font-bold" style={{ color: Colors.textPrimary }}>
                {data.wajibPajak.toLocaleString('id-ID')}
              </Text>
            </View>

            {/* Pendapatan */}
            <View 
              className="w-[48%] mb-3 p-3 rounded-xl border items-center justify-center"
              style={{ 
              backgroundColor: `${RiskColors[riskLevel]}15`,
              borderColor: RiskColors[riskLevel],
              }}
            >
              <View className="flex-row items-center mb-1">
                <Wallet size={16} />
                <Text className="text-sm ml-2">
                  Pendapatan
                </Text>
              </View>
              <Text className="text-lg font-bold" style={{ color: Colors.textPrimary }}>
                {data.pendapatan}
              </Text>
            </View>

            {/* Kepatuhan */}
            <View 
              className="w-[48%] mr-[4%] mb-3 p-3 rounded-xl border items-center justify-center"
              style={{ 
              backgroundColor: `${RiskColors[riskLevel]}15`,
              borderColor: RiskColors[riskLevel],
              }}
            >
              <View className="flex-row items-center mb-1">
                <Shield size={16} />
                <Text className="text-sm ml-2">
                  Kepatuhan
                </Text>
              </View>
              <Text className="text-lg font-bold" style={{ color: Colors.textPrimary }}>
                {data.kepatuhan}
              </Text>
            </View>

            {/* Tunggakan */}
            <View 
              className="w-[48%] mb-3 p-3 rounded-xl border items-center justify-center"
              style={{ 
              backgroundColor: `${RiskColors[riskLevel]}15`,
              borderColor: RiskColors[riskLevel],
              }}
            >
              <View className="flex-row items-center mb-1">
                <TriangleAlert size={16} />
                <Text className="text-sm ml-2">
                  Tunggakan
                </Text>
              </View>
              <Text className="text-lg font-bold" style={{ color: Colors.textPrimary }}>
                {data.tunggakan}
              </Text>
            </View>
          </View>

          {/* Risk Badge */}
          <View 
            className="flex-row items-center self-start px-3 py-2 rounded-xl mb-5"
            style={{ 
              backgroundColor: `${RiskColors[riskLevel]}15`,
            }}
          >
            <View 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: RiskColors[riskLevel] }}
            />
            <Text 
              className="text-xs font-medium"
              style={{ color: RiskColors[riskLevel] }}
            >
              {data.riskLabel}
            </Text>
          </View>

          {/* Divider */}
          <View className="h-px mb-5" style={{ backgroundColor: Colors.border }} />

          {/* Profil Pekerjaan */}
          <View className="mb-5">
            <View className="flex-row items-center mb-3">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mr-2"
              >
                <Briefcase size={20}/>
              </View>
              <Text 
                className="text-md font-semibold"
                style={{ color: Colors.textPrimary }}
              >
                PROFIL PEKERJAAN
              </Text>
            </View>

            <View className="flex-row items-center">
              {/* Donut Chart Simulation */}
              <View className="w-24 h-24 rounded-full border-4 mr-4 items-center justify-center"
                style={{ 
                  borderColor: Colors.accent,
                  borderTopColor: data.profilPekerjaan[0]?.color || Colors.accent,
                  borderRightColor: data.profilPekerjaan[1]?.color || Colors.accent,
                  borderBottomColor: data.profilPekerjaan[2]?.color || Colors.accent,
                  borderLeftColor: data.profilPekerjaan[3]?.color || Colors.accent,
                }}
              >
                <Text className="text-xs font-medium" style={{ color: Colors.textMuted }}>
                  Jenis
                </Text>
                <Text className="text-lg font-bold" style={{ color: Colors.textPrimary }}>
                  {data.profilPekerjaan.length}
                </Text>
              </View>

              {/* Legend */}
              <View className="flex-1">
                {data.profilPekerjaan.map((item: any, index: number) => (
                  <View key={index} className="flex-row items-center mb-1.5">
                    <View 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text className="text-xs flex-1" style={{ color: Colors.textMuted }}>
                      {item.label}
                    </Text>
                    <Text className="text-xs font-semibold" style={{ color: Colors.textPrimary }}>
                      {item.value}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px mb-5" style={{ backgroundColor: Colors.border }} />

          {/* Demografi Usia */}
          <View className="mb-5">
            <View className="flex-row items-center mb-3">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mr-2"
              >
                <UserCheck size={20} />
              </View>
              <Text 
                className="text-md font-semibold"
                style={{ color: Colors.textPrimary }}
              >
                DEMOGRAFI USIA
              </Text>
            </View>

            <View className="flex-row justify-between">
              {data.demografiUsia.map((item: any, index: number) => (
                <View 
                  key={index}
                  className="items-center p-3 px-5 rounded-xl border"
                  style={{ 
                    borderColor: item.color,
                    backgroundColor: `${item.color}10`,
                  }}
                >
                  <View 
                    className="w-8 h-8 rounded-full items-center justify-center mb-1"
                    style={{ backgroundColor: item.color }}
                  >
                    <Users size={14} color="white" />
                  </View>
                  <Text className="text-xs mb-0.5" style={{ color: Colors.textMuted }}>
                    {item.range}
                  </Text>
                  <Text className="text-base font-bold" style={{ color: item.color }}>
                    {item.percent}%
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View className="h-px mb-5" style={{ backgroundColor: Colors.border }} />

          {/* Tren Kepatuhan */}
          <View className="mb-5">
            <View className="flex-row items-center mb-3">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mr-2"
              >
               <TrendingUp size={20}/>
              </View>
              <Text 
                className="text-md font-semibold"
                style={{ color: Colors.textPrimary }}
              >
                TREN KEPATUHAN
              </Text>
            </View>

            <LineChart
              data={chartData}
              height={150}
              spacing={100}
              maxValue={100}
              noOfSections={4}
              initialSpacing={20}
              color={Colors.accent}
              thickness={2}
              dataPointsColor={Colors.accent}
              dataPointsRadius={4}
              hideRules
              yAxisColor="transparent"
              xAxisColor={Colors.border}
              xAxisLabelTextStyle={{ 
                color: Colors.gray, 
                fontSize: 11,
              }}
              yAxisTextStyle={{ color: Colors.gray, fontSize: 10 }}
              yAxisLabelSuffix="%"
              showValuesAsDataPointsText
              textColor={Colors.accent}
              textFontSize={12}
              textShiftY={-10}
            />
          </View>

          {/* Divider */}
          <View className="h-px mb-5" style={{ backgroundColor: Colors.border }} />

          {/* Rekomendasi Kebijakan */}
          <View className="mb-5">
            <View className="flex-row items-center mb-3">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mr-2"
              >
               <Lightbulb size={20}/>
              </View>
              <Text 
                className="text-md font-semibold"
                style={{ color: Colors.textPrimary }}
              >
                REKOMENDASI KEBIJAKAN
              </Text>
            </View>

            {data.rekomendasi.map((item: any, index: number) => (
              <View 
                key={index}
                className="flex-row items-center p-3 rounded-xl border mb-2"
                style={{ 
                  backgroundColor: Colors.yellowLight,
                  borderColor: Colors.accent,
                }}
              >
                <View 
                  className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                  style={{ backgroundColor: Colors.accent }}
                >
                  <Text className="text-md font-bold" style={{ color: Colors.primaryDark }}>
                    {item.no}
                  </Text>
                </View>
                <Text 
                  className="flex-1 text-sm"
                  style={{ color: Colors.textPrimary }}
                >
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}