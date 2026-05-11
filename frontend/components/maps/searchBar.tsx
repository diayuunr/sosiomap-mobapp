import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Cari wilayah..."
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 50,
    elevation: 5,
  },
});