import Greetings from '@/components/home/greetings';
import { View, StyleSheet } from 'react-native';
import InteractiveMap from '@/components/home/maps';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Greetings />
      <InteractiveMap zones={[]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
