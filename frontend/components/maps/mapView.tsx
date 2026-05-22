import React, {
  useEffect,
  useState,
} from 'react';

import MapView, {
  Polygon,
} from 'react-native-maps';

import {
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';

import { getMapGeometry }
from '@/src/services/maps.service';

import {
  RiskColors,
} from '@/constants/colors';

export default function CustomMapView() {
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
   * HEX → RGBA
   */

  const hexToRgba = (
    hex: string,
    alpha: number
  ) => {
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
  };

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
    <MapView
      style={
        StyleSheet.absoluteFillObject
      }
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
             * AMBIL KLASTER
             */

            const klaster =
              item
                .klaster_wilayah?.[0]
                ?.klaster_label ||
              'Hijau';

            /**
             * WARNA
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
                    0.25
                  )}
                  strokeColor={
                    riskColor
                  }
                  strokeWidth={2}
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
                        0.25
                      )}
                      strokeColor={
                        riskColor
                      }
                      strokeWidth={2}
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
    </MapView>
  );
}