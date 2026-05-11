import React from 'react';
import MapView, { Polygon } from 'react-native-maps';
import { StyleSheet } from 'react-native';

const cimahiPolygon = [
  { latitude: -6.88, longitude: 107.53 },
  { latitude: -6.89, longitude: 107.55 },
  { latitude: -6.91, longitude: 107.56 },
  { latitude: -6.92, longitude: 107.52 },
];

export default function CustomMapView() {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: -6.9,
        longitude: 107.55,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      <Polygon
        coordinates={cimahiPolygon}
        fillColor="rgba(255,0,0,0.4)"
        strokeColor="red"
        strokeWidth={2}
      />
    </MapView>
  );
}