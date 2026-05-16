import React, { useState, useRef, useCallback } from 'react';
import { View, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Polygon, Marker } from 'react-native-maps';
import SearchBar from '@/components/maps/searchBar';
import MapLegend from '@/components/maps/mapLegend';
import FilterSearch from '@/components/maps/filterSearch';
import ZonePeek from '@/components/maps/zonePeek';
import ZoneDetail from '@/components/maps/zoneDetail';
import { polygonsByKota, regionByKota, zonaDetailData } from '@/constants/dummyData';
import { Colors, RiskColors } from '@/constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PEEK_HEIGHT = 200;
const DETAIL_HEIGHT = SCREEN_HEIGHT * 0.85;

// Helper hex to rgba
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function MapsScreen() {
  const mapRef = useRef<MapView>(null);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    wilayah: 'Kecamatan',
    kelompok: [] as string[],
  });
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [detailMode, setDetailMode] = useState(false);

  const currentKota = 'Cimahi'; // Default, bisa dari context/props
  const polygons = polygonsByKota[currentKota] || [];
  const region = regionByKota[currentKota];

  // Handle polygon press
  const handlePolygonPress = useCallback((zoneId: number) => {
    setSelectedZone(zoneId);
    setDetailMode(false);
  }, []);

  // Handle expand to detail
  const handleExpandDetail = useCallback(() => {
    setDetailMode(true);
  }, []);

  // Handle close detail/peek
  const handleCloseDetail = useCallback(() => {
    if (detailMode) {
      setDetailMode(false);
    } else {
      setSelectedZone(null);
    }
  }, [detailMode]);

  // Get selected zone data
  const selectedZoneData = selectedZone ? zonaDetailData[selectedZone] : null;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View className="flex-1">
        {/* Map */}
        <MapView
          ref={mapRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          initialRegion={region}
        >
          {polygons.map((polygon) => {
            const riskColor = RiskColors[polygon.risk as keyof typeof RiskColors];
            const isSelected = selectedZone === polygon.id;
            
            return (
              <Polygon
                key={polygon.id}
                coordinates={polygon.coordinates}
                fillColor={hexToRgba(riskColor, isSelected ? 0.5 : 0.25)}
                strokeColor={isSelected ? Colors.primaryDark : riskColor}
                strokeWidth={isSelected ? 3 : 2.5}
                tappable
                onPress={() => handlePolygonPress(polygon.id)}
              />
            );
          })}

          <Marker
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            title={currentKota}
            pinColor={Colors.primary}
          />
        </MapView>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => setFilterVisible(true)}
        />

        {/* Legend */}
        <MapLegend />

        {/* Overlay when detail/peek is open */}
        {(selectedZone && !detailMode) && (
          <TouchableOpacity 
            className="absolute inset-0 bg-black/20"
            activeOpacity={1}
            onPress={() => setSelectedZone(null)}
          />
        )}

        {/* Zone Peek (Bottom Sheet) */}
        {selectedZone && selectedZoneData && !detailMode && (
          <View 
            className="absolute bottom-0 left-0 right-0"
            style={{ height: PEEK_HEIGHT }}
          >
            <ZonePeek 
              data={selectedZoneData} 
              onExpand={handleExpandDetail} 
            />
          </View>
        )}

        {/* Zone Detail (Full Bottom Sheet) */}
        {selectedZone && selectedZoneData && detailMode && (
          <View 
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
            style={{ 
              height: DETAIL_HEIGHT,
              backgroundColor: Colors.card,
            }}
          >
            <ZoneDetail 
              data={selectedZoneData} 
              onClose={handleCloseDetail} 
            />
          </View>
        )}
      </View>

      {/* Filter Modal */}
      <FilterSearch
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        onFilterChange={setFilters}
      />
    </SafeAreaView>
  );
}