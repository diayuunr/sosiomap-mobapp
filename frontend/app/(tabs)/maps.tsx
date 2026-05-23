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
import { getWilayahStatistik } from '@/src/services/wajibPajak.service';
import { getRekomendasi } from '@/src/services/kebijakan.service';
import { getTrendPenerimaan } from '@/src/services/trenWilayah.service';
import { getZoneStats } from '@/src/services/zoneStats.service';

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
    wilayah: 'kecamatan',
    kelompok: [] as string[],
  });

  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [statistikWilayah, setStatistikWilayah] = useState<any>(null);
  const [zoneStats, setZoneStats] = useState<any>(null);
  const [rekomendasiWilayah, setRekomendasiWilayah] = useState<any[]>([]);
  const [trenKepatuhan, setTrenKepatuhan] = useState<any[]>([]);
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

  useEffect(() => {

    const loadStatistik =
      async () => {

        if (!selectedZone) return;

        try {

          const result =
            await getWilayahStatistik(
              selectedZone
            );

          setStatistikWilayah(
            result
          );

        } catch (error) {

          console.log(
            'STATISTIK ERROR:',
            error
          );
        }
      };

    loadStatistik();

  }, [selectedZone]);

  useEffect(() => {

    const loadZoneStats =
      async () => {

        if (!selectedZone) return;

        try {

          const result =
            await getZoneStats(
              selectedZone
            );

          setZoneStats(
            result
          );

        } catch (error) {

          console.log(
            'ZONE STATS ERROR:',
            error
          );
        }
      };

    loadZoneStats();

  }, [selectedZone]);

  useEffect(() => {

    const loadRekomendasi =
      async () => {

        if (!selectedZone) return;

        try {

          const result =
            await getRekomendasi(
              selectedZone
            );

          const mapped =
            (result || []).map(
              (
                item: any,
                index: number
              ) => ({
                no: index + 1,
                text:
                  item.rekomendasi_teks ||
                  '-',
              })
            );

          setRekomendasiWilayah(
            mapped
          );

        } catch (error) {

          console.log(
            'REKOMENDASI ERROR:',
            error
          );
        }
      };

    loadRekomendasi();

  }, [selectedZone]);

  useEffect(() => {
    const loadTrend =
      async () => {

        if (!selectedZone) return;

        try {

          const result =
            await getTrendPenerimaan(
              selectedZone
            );

          const mapped =
            (result || []).map(
              (item: any) => ({
                value: item.value,
                label: item.year,
              })
            );

          setTrenKepatuhan(
            mapped
          );

        } catch (error) {

          console.log(
            'TREND ERROR:',
            error
          );
        }
      };

    loadTrend();

  }, [selectedZone]);

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

  const klaster =
    selectedZoneRaw?.klaster_wilayah?.[0]?.klaster_label || 'Hijau';

  const riskLevel =
    klaster === 'Merah'
      ? 'risiko'
      : klaster === 'Kuning'
      ? 'perhatian'
      : 'stabil';

  const selectedZoneData = selectedZoneRaw ? {
    id: selectedZoneRaw.id,
    name: selectedZoneRaw.nama,

    kelompok: klaster,

    // =========================
    // DATA DARI SERVICE
    // =========================

    wajibPajak:
      zoneStats?.wajibPajak || 0,

    pendapatan:
      zoneStats?.pendapatan || 'Rp 0',

    kepatuhan:
      zoneStats?.kepatuhan || '0%',

    tunggakan:
      zoneStats?.tunggakan || 'Rp 0',

    // =========================
    // RISK
    // =========================

    riskLevel,

    riskLabel:
      klaster === 'Merah'
        ? 'Risiko Keterlambatan Bayar: Tinggi'
        : klaster === 'Kuning'
        ? 'Risiko Keterlambatan Bayar: Sedang'
        : 'Risiko Keterlambatan Bayar: Rendah',

    trenKepatuhan: trenKepatuhan,

    profilPekerjaan:
      statistikWilayah?.profilPekerjaan || [],

    demografiUsia:
      statistikWilayah?.demografiUsia || [],

    rekomendasi:
      rekomendasiWilayah,

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