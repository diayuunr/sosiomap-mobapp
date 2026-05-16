import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { ChevronDown, TrendingUp } from 'lucide-react-native';
import { LineChart } from 'react-native-gifted-charts';
import { trendData } from '@/constants/dummyData';
import { Colors } from '@/constants/colors';

export default function TrendChart() {
  const [selectedPeriod, setSelectedPeriod] = useState('Pilih');
  const [showDropdown, setShowDropdown] = useState(false);

  const periods = ['Minggu Ini', 'Bulan Ini', 'Tahun Ini'];

  // Transform data for gifted-charts
  const chartData = trendData.map(item => ({
    value: item.value,
    label: item.date,
  }));

  const screenWidth = Dimensions.get('window').width;

  return (
    <View 
      className="px-5 py-5 rounded-2xl mx-7 my-3"
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
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text 
            className="text-base font-semibold"
            style={{ color: Colors.primary }}
          >
            Tren Penerimaan Pajak
          </Text>
          <View className="flex-row items-center mt-1">
            <View 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: Colors.accent }}
            />
            <Text 
              className="text-xs"
              style={{ color: Colors.textMuted }}
            >
              Penerimaan (Rp)
            </Text>
          </View>
        </View>

        {/* Period Dropdown */}
        <View className="flex-col items-start">
        <Text className="text-sm font-semibold" style={{ color: Colors.primary }}>Periode</Text>
        <TouchableOpacity 
          className="flex-row items-center justify-between px-3 py-1.5 rounded-lg border w-[90px]"
          style={{ borderColor: Colors.border }}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text 
            className="text-xs mr-2"
            style={{ color: Colors.textMuted }}
          >
            {selectedPeriod}
          </Text>
          <ChevronDown size={14} color={Colors.textMuted} />
        </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu */}
      {showDropdown && (
        <View 
          className="absolute right-4 top-14 z-10 rounded-lg border shadow-lg"
          style={{ 
            backgroundColor: Colors.card, 
            borderColor: Colors.border,
            elevation: 5,
          }}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              className="px-4 py-2"
              onPress={() => {
                setSelectedPeriod(period);
                setShowDropdown(false);
              }}
            >
              <Text 
                className="text-sm"
                style={{ color: Colors.textPrimary }}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Current Value */}
      <View className="flex-row items-center mb-4">
        <Text 
          className="text-2xl font-bold"
          style={{ color: Colors.primary }}
        >
          Rp6,8 M
        </Text>
        <View className="flex-row items-center ml-2">
          <TrendingUp size={16} color={Colors.green} />
          <Text 
            className="text-sm font-medium ml-1"
            style={{ color: Colors.green }}
          >
            0,45%
          </Text>
        </View>
      </View>

      {/* Chart */}
      <LineChart
        data={chartData}
        height={180}
        width={screenWidth - 72}
        spacing={40}
        initialSpacing={40}
        endSpacing={20}
        color={Colors.accent}
        thickness={3}
        hideDataPoints
        hideRules
        hideYAxisText
        yAxisColor="transparent"
        yAxisLabelWidth={0}
        yAxisThickness={0}
        xAxisColor={Colors.border}
        xAxisLength={310}
        xAxisLabelTextStyle={{ 
          color: Colors.gray, 
          fontSize: 9,
          textAlign: 'center',
        }}
        curved
        areaChart
        startFillColor={Colors.accent}
        endFillColor={Colors.accent}
        startOpacity={0.2}
        endOpacity={0.02}
        pointerConfig={{
          showPointerStrip: true,
          pointerStripColor: Colors.border,
          pointerStripWidth: 1,
          radius: 4,
          shiftPointerLabelX: -25,
          pointerLabelComponent: (items: any) => {
            return (
              <View 
                className="rounded-lg items-center justify-center"
                style={{ backgroundColor: Colors.accent, minWidth: 60, }}
              >
                <Text className="px-2 py-1 text-white text-xs font-semibold" numberOfLines={1}>
                  Rp {items[0]?.value} M
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
}
