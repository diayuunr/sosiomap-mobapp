import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';

import {
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import MapView, {
  Polygon,
  Marker,
} from 'react-native-maps';

import SearchBar from '@/components/maps/searchBar';
import MapLegend from '@/components/maps/mapLegend';
import FilterPanel from '@/components/maps/filterSearch';
import ZonePeek from '@/components/maps/zonePeek';
import ZoneDetail from '@/components/maps/zoneDetail';

import {
  Colors,
  RiskColors,
} from '@/constants/colors';

import {
  getMapGeometry,
} from '@/src/services/maps.service';

const {
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const PEEK_HEIGHT = 200;

const DETAIL_HEIGHT =
  SCREEN_HEIGHT * 0.85;

/**
 * HEX → RGBA
 */

function hexToRgba(
  hex: string,
  alpha: number
): string {
  const r = parseInt(
    hex.slice(1, 3),
    16
  );

  const g = parseInt(
    hex.slice(3, 5),
    16
  );

  const b = parseInt(
    hex.slice(5, 7),
    16
  );

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function MapsScreen() {
  const mapRef =
    useRef<MapView>(null);

  /**
   * STATES
   */

  const [polygons, setPolygons] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [filters, setFilters] =
    useState({
      wilayah: 'Kecamatan',
      kelompok: [] as string[],
    });

  const [selectedZone, setSelectedZone] =
    useState<number | null>(null);

  const [detailMode, setDetailMode] =
    useState(false);

  /**
   * LOAD MAP
   */

  useEffect(() => {
    loadMap();
  }, []);

  const loadMap = async () => {
    try {
      const data =
        await getMapGeometry();

      console.log(
        'MAP DATA:',
        JSON.stringify(data, null, 2)
      );

      setPolygons(data || []);
    } catch (error) {
      console.log(
        'MAP ERROR:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * FILTER ACTIVE
   */

  const isFilterActive =
    filters.kelompok.length > 0 ||
    filters.wilayah !==
      'Kecamatan' ||
    searchQuery !== '';

  /**
   * POLYGON PRESS
   */

  const handlePolygonPress =
    useCallback(
      (zoneId: number) => {
        setSelectedZone(zoneId);
        setDetailMode(false);
      },
      []
    );

  /**
   * CLEAR FILTER
   */

  const handleClearFilter =
    useCallback(() => {
      setFilters({
        wilayah: 'Kecamatan',
        kelompok: [],
      });

      setSearchQuery('');

      setFilterOpen(false);
    }, []);

  /**
   * DETAIL
   */

  const handleExpandDetail =
    useCallback(() => {
      setDetailMode(true);
    }, []);

  const handleCloseDetail =
    useCallback(() => {
      if (detailMode) {
        setDetailMode(false);
      } else {
        setSelectedZone(null);
      }
    }, [detailMode]);

  /**
   * SELECTED DATA
   */

  const selectedZoneData =
    polygons.find(
      (item) =>
        item.id === selectedZone
    ) || null;

  /**
   * LOADING
   */

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent:
            'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          size="large"
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={['left', 'right']}
    >
      <View className="flex-1">
        {/* MAP */}
        <MapView
          ref={mapRef}
          style={{
            position:
              'absolute',

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
          {polygons.map(
            (item, index) => {
              if (!item.geom)
                return null;

              try {
                const geometry =
                  typeof item.geom ===
                  'string'
                    ? JSON.parse(
                        item.geom
                      )
                    : item.geom;

                /**
                 * KLASTER
                 */

                const klaster =
                  item
                    .klaster_wilayah?.[0]
                    ?.klaster_label ||
                  'Hijau';

                /**
                 * COLOR
                 */

                let riskColor =
                  RiskColors.stabil;

                if (
                  klaster ===
                  'Merah'
                ) {
                  riskColor =
                    RiskColors.risiko;
                } else if (
                  klaster ===
                  'Kuning'
                ) {
                  riskColor =
                    RiskColors.perhatian;
                }

                const isSelected =
                  selectedZone ===
                  item.id;

                /**
                 * POLYGON
                 */

                if (
                  geometry.type ===
                  'Polygon'
                ) {
                  const coordinates =
                    geometry.coordinates[0]
                      .filter(
                        (
                          coord: number[]
                        ) =>
                          coord.length >=
                            2 &&
                          Math.abs(
                            coord[1]
                          ) <= 90 &&
                          Math.abs(
                            coord[0]
                          ) <= 180
                      )
                      .map(
                        (
                          coord: number[]
                        ) => ({
                          latitude:
                            coord[1],

                          longitude:
                            coord[0],
                        })
                      );

                  return (
                    <Polygon
                      key={`polygon-${index}`}
                      coordinates={
                        coordinates
                      }
                      fillColor={hexToRgba(
                        riskColor,
                        isSelected
                          ? 0.5
                          : 0.25
                      )}
                      strokeColor={
                        isSelected
                          ? Colors.primaryDark
                          : riskColor
                      }
                      strokeWidth={
                        isSelected
                          ? 3
                          : 2.5
                      }
                      tappable
                      onPress={() =>
                        handlePolygonPress(
                          item.id
                        )
                      }
                    />
                  );
                }

                /**
                 * MULTIPOLYGON
                 */

                if (
                  geometry.type ===
                  'MultiPolygon'
                ) {
                  return geometry.coordinates.map(
                    (
                      polygon: any,
                      polyIndex: number
                    ) => {
                      const coordinates =
                        polygon[0]
                          .filter(
                            (
                              coord: number[]
                            ) =>
                              coord.length >=
                                2 &&
                              Math.abs(
                                coord[1]
                              ) <= 90 &&
                              Math.abs(
                                coord[0]
                              ) <= 180
                          )
                          .map(
                            (
                              coord: number[]
                            ) => ({
                              latitude:
                                coord[1],

                              longitude:
                                coord[0],
                            })
                          );

                      return (
                        <Polygon
                          key={`${index}-${polyIndex}`}
                          coordinates={
                            coordinates
                          }
                          fillColor={hexToRgba(
                            riskColor,
                            isSelected
                              ? 0.5
                              : 0.25
                          )}
                          strokeColor={
                            isSelected
                              ? Colors.primaryDark
                              : riskColor
                          }
                          strokeWidth={
                            isSelected
                              ? 3
                              : 2.5
                          }
                          tappable
                          onPress={() =>
                            handlePolygonPress(
                              item.id
                            )
                          }
                        />
                      );
                    }
                  );
                }

                return null;
              } catch (error) {
                console.log(
                  'POLYGON ERROR:',
                  error
                );

                return null;
              }
            }
          )}

          {/* MARKER */}
          <Marker
            coordinate={{
              latitude: -8.65,
              longitude: 115.2167,
            }}
            title="Bali"
            pinColor={
              Colors.primary
            }
          />
        </MapView>

        {/* SEARCH + FILTER */}
        <View className="absolute top-0 left-0 right-0 z-10">
          <SearchBar
            value={searchQuery}
            onChangeText={
              setSearchQuery
            }
            onFilterPress={() =>
              setFilterOpen(
                !filterOpen
              )
            }
            isFilterActive={
              isFilterActive
            }
            onClearFilter={
              handleClearFilter
            }
          />

          <FilterPanel
            visible={filterOpen}
            onClose={() =>
              setFilterOpen(false)
            }
            filters={filters}
            onFilterChange={
              setFilters
            }
          />
        </View>

        {/* LEGEND */}
        <MapLegend />

        {/* OVERLAY */}
        {selectedZone &&
          !detailMode && (
            <TouchableOpacity
              className="absolute inset-0 bg-black/20"
              activeOpacity={1}
              onPress={() =>
                setSelectedZone(
                  null
                )
              }
            />
          )}

        {/* PEEK */}
        {selectedZoneData &&
          !detailMode && (
            <View
              className="absolute bottom-12 left-0 right-0 mb-10"
              style={{
                height:
                  PEEK_HEIGHT,
              }}
            >
              <ZonePeek
                data={
                  selectedZoneData
                }
                onExpand={
                  handleExpandDetail
                }
              />
            </View>
          )}

        {/* DETAIL */}
        {selectedZoneData &&
          detailMode && (
            <View
              className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
              style={{
                height:
                  DETAIL_HEIGHT,

                backgroundColor:
                  Colors.card,
              }}
            >
              <ZoneDetail
                data={
                  selectedZoneData
                }
                onClose={
                  handleCloseDetail
                }
              />
            </View>
          )}
      </View>
    </SafeAreaView>
  );
}