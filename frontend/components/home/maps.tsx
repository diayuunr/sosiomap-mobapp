import React, { useRef, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { RiskColors, RiskLabels, Colors } from '@/constants/colors';
import { polygonsByKota, regionByKota } from '../../constants/dummyData';

// Helper to convert hex to rgba
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface MapPreviewProps {
  selectedKota: string;
}

export default function MapPreview({ selectedKota }: MapPreviewProps) {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  // Get polygons based on selected kota
  const polygons = polygonsByKota[selectedKota] || polygonsByKota['Cimahi'];
  const region = regionByKota[selectedKota] || regionByKota['Cimahi'];

  // Animate to new region when kota changes
  useEffect(() => {
    if (mapRef.current && region) {
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [selectedKota, region]);

  return (
    <View 
      className="mx-7 mt-3 rounded-t-2xl overflow-hidden"
      style={{ 
        backgroundColor: 'rgba(255,255,255,0.95)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }}
    >
      {/* Map */}
      <View className="h-64 w-full">
        <MapView
          ref={mapRef}
          style={{ width: '100%', height: '100%'}}
          initialRegion={region}
        >
          {polygons.map((polygon) => {
            const riskColor = RiskColors[polygon.risk as keyof typeof RiskColors];
            return (
              <Polygon
                key={polygon.id}
                coordinates={polygon.coordinates}
                fillColor={hexToRgba(riskColor, 0.25)}
                strokeColor={riskColor}
                strokeWidth={2.5}
                tappable
                onPress={() => router.push(`/maps?zone=${polygon.id}`)}
              />
            );
          })}
          
          <Marker
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            title={selectedKota}
            pinColor={Colors.primary}
          />
        </MapView>

        {/* Legend */}
        <View 
          className="absolute bottom-3 right-3 rounded-xl p-3"
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
            className="text-xs font-semibold mb-2"
            style={{ color: Colors.textPrimary }}
          >
            Tingkat Risiko
          </Text>
          {Object.entries(RiskLabels).map(([key, label]) => (
            <View key={key} className="flex-row items-center mb-1">
              <View 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: RiskColors[key as keyof typeof RiskColors] }}
              />
              <Text 
                className="text-xs"
                style={{ color: Colors.textMuted }}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}