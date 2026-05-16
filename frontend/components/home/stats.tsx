import React from 'react';
import { View, Text } from 'react-native';
import { Users, Wallet, Target } from 'lucide-react-native';
import StatCard from './statCard';
import { dummyStats } from '@/constants/dummyData';
import { Colors } from '@/constants/colors';

export default function StatsSection() {
  return (
    <View className="px-3 py-3 bg-white rounded-2xl mx-4">
      <Text 
        className="text-base font-semibold mb-3 mt-2"
        style={{ color: Colors.primary }}
      >
        Data Real-time
      </Text>

      <View className="flex-row">
        <StatCard
          title="Total Wajib Pajak"
          value={dummyStats.totalWajibPajak.toLocaleString('id-ID')}
          change={dummyStats.wajibPajakChange}
          icon={<Users size={20} color={Colors.primary} />}
          iconBg="#E0F2FE"
        />
        <StatCard
          title="Total Tunggakan"
          value={dummyStats.totalTunggakan}
          change={dummyStats.tunggakanChange}
          icon={<Wallet size={20} color={Colors.primary} />}
          iconBg="#E0F2FE"
        />
        <StatCard
          title="Persentase Kepatuhan"
          value={`${dummyStats.persentaseKepatuhan}%`}
          change={dummyStats.kepatuhanChange}
          icon={<Target size={20} color={Colors.accent} />}
          iconBg={Colors.yellowLight}
        />
      </View>
    </View>
  );
}
