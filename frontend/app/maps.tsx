import MapView from '@/components/maps/mapView';
import SearchBar from '@/components/maps/searchBar';
import { View, StyleSheet } from 'react-native';

export default function MapsPage() {
  return (
    <View style={styles.container}>
      <MapView />
      <SearchBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
