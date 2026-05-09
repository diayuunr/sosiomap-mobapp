import { View, Text, StyleSheet } from 'react-native';

export default function ExportPage() {
  return (
    <View style={styles.container}>
      <Text>Export</Text>
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
