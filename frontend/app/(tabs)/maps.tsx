import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';

import SearchBar from '@/components/maps/searchBar';
import MapLegend from '@/components/maps/mapLegend';
import FilterPanel from '@/components/maps/filterSearch';
import ZonePeek from '@/components/maps/zonePeek';
import ZoneDetail from '@/components/maps/zoneDetail';

import { Colors, RiskColors } from '@/constants/colors';
import { getMapGeometry } from '@/src/services/maps.service';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DETAIL_HEIGHT = SCREEN_HEIGHT * 0.85;

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function MapsScreen() {
  const mapRef = useRef<MapView>(null);
  const { zone } = useLocalSearchParams();

  const [polygons, setPolygons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    wilayah: 'Kecamatan',
    kelompok: [] as string[],
  });

  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [detailMode, setDetailMode] = useState(false);

  useEffect(() => {
    loadMap();
  }, []);

  const loadMap = async () => {
    try {
      const data = await getMapGeometry();
      setPolygons(data || []);
    } catch (error) {
      console.log('MAP ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (zone && polygons.length > 0) {
      const selected = polygons.find(
        item => String(item.id) === String(zone)
      );

      if (selected) {
        setSelectedZone(selected.id);

        // otomatis buka detail
        setDetailMode(true);

        // zoom ke wilayah
        try {
          const geometry =
            typeof selected.geom === 'string'
              ? JSON.parse(selected.geom)
              : selected.geom;

          let coords: any[] = [];

          if (geometry.type === 'Polygon') {
            coords = geometry.coordinates[0];
          }

          if (geometry.type === 'MultiPolygon') {
            coords = geometry.coordinates[0][0];
          }

          if (coords.length > 0 && mapRef.current) {
            const mappedCoords = coords.map(
              (coord: number[]) => ({
                latitude: coord[1],
                longitude: coord[0],
              })
            );

            mapRef.current.fitToCoordinates(
              mappedCoords,
              {
                edgePadding: {
                  top: 100,
                  right: 100,
                  bottom: 300,
                  left: 100,
                },
                animated: true,
              }
            );
          }

        } catch (error) {
          console.log('ZOOM ERROR:', error);
        }
      }
    }
  }, [zone, polygons]);

  const isFilterActive =
    filters.kelompok.length > 0 ||
    filters.wilayah !== 'Kecamatan' ||
    searchQuery !== '';

  const handlePolygonPress = useCallback((zoneId: number) => {
    setSelectedZone(zoneId);
    setDetailMode(false);
  }, []);

  const handleExpandDetail = useCallback(() => {
    setDetailMode(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    if (detailMode) setDetailMode(false);
    else setSelectedZone(null);
  }, [detailMode]);

  const handleClearFilter = useCallback(() => {
    setFilters({
      wilayah: 'Kecamatan',
      kelompok: [],
    });

    setSearchQuery('');
    setFilterOpen(false);
  }, []);

  const selectedZoneRaw = polygons.find(item => item.id === selectedZone);

  const selectedZoneData = selectedZoneRaw ? {
    id: selectedZoneRaw.id,
    name: selectedZoneRaw.nama,

    kelompok:
      selectedZoneRaw.klaster_wilayah?.[0]?.klaster_label || 'Hijau',

    wajibPajak: 1240,
    pendapatan: 'Rp 2.4 M',

    riskLevel:
      selectedZoneRaw.klaster_wilayah?.[0]?.klaster_label === 'Merah'
        ? 'risiko'
        : selectedZoneRaw.klaster_wilayah?.[0]?.klaster_label === 'Kuning'
        ? 'perhatian'
        : 'stabil',

    riskLabel:
      selectedZoneRaw.klaster_wilayah?.[0]?.klaster_label === 'Merah'
        ? 'Risiko Keterlambatan Bayar: Tinggi'
        : selectedZoneRaw.klaster_wilayah?.[0]?.klaster_label === 'Kuning'
        ? 'Risiko Keterlambatan Bayar: Sedang'
        : 'Risiko Keterlambatan Bayar: Rendah',

    kepatuhan: '82%',
    tunggakan: 'Rp 320 Jt',

    trenKepatuhan: [
      { year: '2020', value: 70 },
      { year: '2021', value: 74 },
      { year: '2022', value: 77 },
      { year: '2023', value: 80 },
      { year: '2024', value: 82 },
    ],

    profilPekerjaan: [
      { label: 'Wirausaha', value: 45, color: '#C20B0D' },
      { label: 'UMKM', value: 35, color: '#FDD216' },
      { label: 'Pegawai', value: 20, color: '#007BE5' },
    ],

    demografiUsia: [
      { range: '20-30', percent: 22, color: '#007BE5' },
      { range: '31-45', percent: 38, color: '#FDD216' },
      { range: '46-60', percent: 28, color: '#050F32' },
    ],

    rekomendasi: [
      { no: 1, text: 'Fokus edukasi kepatuhan pajak.' },
      { no: 2, text: 'Prioritaskan monitoring pembayaran.' },
    ],
  } : null;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <View className="flex-1">

        {/* MAP */}

        <MapView
          ref={mapRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          initialRegion={{
            latitude: -8.65,
            longitude: 115.2167,
            latitudeDelta: 0.4,
            longitudeDelta: 0.4,
          }}
        >

          {polygons.map((item, index) => {
            if (!item.geom) return null;

            try {
              const geometry =
                typeof item.geom === 'string'
                  ? JSON.parse(item.geom)
                  : item.geom;

              const klaster =
                item.klaster_wilayah?.[0]?.klaster_label || 'Hijau';

              let riskColor = RiskColors.stabil;

              if (klaster === 'Merah') riskColor = RiskColors.risiko;
              else if (klaster === 'Kuning') riskColor = RiskColors.perhatian;

              const isSelected = selectedZone === item.id;

              /**
               * POLYGON
               */

              if (geometry.type === 'Polygon') {
                const coordinates = geometry.coordinates[0]
                  .filter((coord: number[]) => coord.length >= 2)
                  .map((coord: number[]) => ({
                    latitude: coord[1],
                    longitude: coord[0],
                  }));

                return (
                  <Polygon
                    key={`polygon-${index}`}
                    coordinates={coordinates}
                    fillColor={hexToRgba(riskColor, isSelected ? 0.5 : 0.25)}
                    strokeColor={isSelected ? Colors.primaryDark : riskColor}
                    strokeWidth={isSelected ? 3 : 2}
                    tappable
                    onPress={() => handlePolygonPress(item.id)}
                  />
                );
              }

              /**
               * MULTIPOLYGON
               */

              if (geometry.type === 'MultiPolygon') {
                return geometry.coordinates.map((polygon: any, polyIndex: number) => {
                  const coordinates = polygon[0]
                    .filter((coord: number[]) => coord.length >= 2)
                    .map((coord: number[]) => ({
                      latitude: coord[1],
                      longitude: coord[0],
                    }));

                  return (
                    <Polygon
                      key={`${index}-${polyIndex}`}
                      coordinates={coordinates}
                      fillColor={hexToRgba(riskColor, isSelected ? 0.5 : 0.25)}
                      strokeColor={isSelected ? Colors.primaryDark : riskColor}
                      strokeWidth={isSelected ? 3 : 2}
                      tappable
                      onPress={() => handlePolygonPress(item.id)}
                    />
                  );
                });
              }

              return null;

            } catch (error) {
              console.log('POLYGON ERROR:', error);
              return null;
            }
          })}

          <Marker
            coordinate={{
              latitude: -8.65,
              longitude: 115.2167,
            }}
            title="Bali"
            pinColor={Colors.primary}
          />
        </MapView>

        {/* SEARCH */}

        <View className="absolute top-0 left-0 right-0 z-10">

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => setFilterOpen(!filterOpen)}
            isFilterActive={isFilterActive}
            onClearFilter={handleClearFilter}
          />

          <FilterPanel
            visible={filterOpen}
            onClose={() => setFilterOpen(false)}
            filters={filters}
            onFilterChange={setFilters}
          />
        </View>

        {/* LEGEND */}

        <MapLegend />

        {/* OVERLAY */}

        {selectedZoneData && !detailMode && (
          <TouchableOpacity
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            activeOpacity={1}
            onPress={() => setSelectedZone(null)}
          />
        )}

        {/* ZONE PEEK */}

        {selectedZoneData && !detailMode && (
          <View className="absolute bottom-4 mb-20 left-4 right-4">
            <ZonePeek
              data={selectedZoneData}
              onExpand={handleExpandDetail}
            />
          </View>
        )}

        {/* DETAIL */}

        {selectedZoneData && detailMode && (
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
    </SafeAreaView>
  );
}