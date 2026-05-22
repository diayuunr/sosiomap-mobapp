import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import { useRouter } from 'expo-router';

import MapView, {
  Marker,
  Polygon,
} from 'react-native-maps';

import {
  RiskColors,
  RiskLabels,
  Colors,
} from '@/constants/colors';

import {
  getMapGeometry,
} from '@/src/services/maps.service';

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

interface MapPreviewProps {
  selectedKota: string;

  filters: {
    kota: string;
    kecamatan: string;
    kelurahan: string;
    provinsi: string;
  };
}

export default function MapPreview({
  selectedKota,
  filters,
}: MapPreviewProps) {

  const router = useRouter();

  const mapRef =
    useRef<MapView>(null);

  const [polygons, setPolygons] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadMap();
  }, []);

  const loadMap = async () => {

    try {

      const data =
        await getMapGeometry();

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
   * FILTER
   */

  const activeFilter =
    filters.kelurahan ||
    filters.kecamatan ||
    filters.kota ||
    filters.provinsi;

  const filteredPolygons =
    activeFilter
      ? polygons.filter(
          (item) =>
            item.nama ===
            activeFilter
        )
      : polygons;

  if (loading) {
    return (
      <View
        className="mx-7 mt-3 rounded-2xl bg-white h-64 items-center justify-center"
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      className="mx-7 mt-3 rounded-t-2xl overflow-hidden"
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
      <View className="h-64 w-full">

        <MapView
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
          }}
          initialRegion={{
            latitude: -8.65,
            longitude: 115.2167,
            latitudeDelta: 0.4,
            longitudeDelta: 0.4,
          }}
        >

          {filteredPolygons.map(
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

                const klaster =
                  item
                    .klaster_wilayah?.[0]
                    ?.klaster_label ||
                  'Hijau';

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

                if (
                  geometry.type ===
                  'Polygon'
                ) {

                  const coordinates =
                    geometry.coordinates[0]
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
                        0.25
                      )}
                      strokeColor={
                        riskColor
                      }
                      strokeWidth={2.5}
                      tappable
                      onPress={() =>
                        router.push(
                          `/maps?zone=${item.id}`
                        )
                      }
                    />
                  );
                }

                if (
                  geometry.type ===
                  'MultiPolygon'
                ) {

                  return geometry.coordinates.map(
                    (
                      polygonCoords: any,
                      polyIndex: number
                    ) => {

                      const ring =
                        polygonCoords[0];

                      const coordinates =
                        ring.map(
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
                          key={`multi-${index}-${polyIndex}`}
                          coordinates={
                            coordinates
                          }
                          fillColor={hexToRgba(
                            riskColor,
                            0.25
                          )}
                          strokeColor={
                            riskColor
                          }
                          strokeWidth={
                            2.5
                          }
                          tappable
                          onPress={() =>
                            router.push(
                              `/maps?zone=${item.id}`
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

          <Marker
            coordinate={{
              latitude: -8.65,
              longitude: 115.2167,
            }}
            title={selectedKota}
            pinColor={
              Colors.primary
            }
          />
        </MapView>

        <View
          className="absolute bottom-3 right-3 rounded-xl p-3"
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
            className="text-xs font-semibold mb-2"
            style={{
              color:
                Colors.textPrimary,
            }}
          >
            Tingkat Risiko
          </Text>

          {Object.entries(
            RiskLabels
          ).map(
            ([key, label]) => (
              <View
                key={key}
                className="flex-row items-center mb-1"
              >
                <View
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor:
                      RiskColors[
                        key as keyof typeof RiskColors
                      ],
                  }}
                />

                <Text
                  className="text-xs"
                  style={{
                    color:
                      Colors.textMuted,
                  }}
                >
                  {label}
                </Text>
              </View>
            )
          )}
        </View>
      </View>
    </View>
  );
}