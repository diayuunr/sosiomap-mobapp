import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBg: string;
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeLabel = 'dari bulan lalu',
  icon, 
  iconBg 
}: StatCardProps) {
  const isPositive = change && change > 0;
  const changeColor = isPositive ? Colors.green : Colors.red;

  return (
    <View 
      className="flex-1 rounded-2xl p-3.5 mx-1 items-center justify-center shadow-lg"
      style={{ backgroundColor: Colors.card }}
    >
      {/* Icon */}
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </View>

      {/* Title */}
      <Text 
        className="text-xs text-center font-medium mb-1"
        style={{ color: Colors.primary }}
      >
        {title}
      </Text>

      {/* Value */}
      <Text 
        className="text-lg font-bold"
        style={{ color: Colors.primary }}
      >
        {value}
      </Text>

    {/* Change Indicator */}
    {change !== undefined && (
    <View className="items-center">
        
        {/* Row: icon + percentage */}
        <View className="flex-row items-center">
        {isPositive ? (
            <TrendingUp size={12} color={changeColor} />
        ) : (
            <TrendingDown size={12} color={changeColor} />
        )}

        <Text
            className="text-xs font-medium ml-1"
            style={{ color: changeColor }}
        >
            {isPositive ? '+' : ''}
            {change}%
        </Text>
        </View>

        {/* Label */}
        <Text
        className="text-[10px] mt-0.5 text-center"
        style={{ color: Colors.gray }}
        >
        {changeLabel}
        </Text>
    </View>
    )}
    </View>
  );
}
