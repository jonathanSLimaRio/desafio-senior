import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

interface BlockProps {
  size: number;
  color: string;
}

export const Block = ({ size, color }: BlockProps) => {
  const styles = StyleSheet.create({
    block: {
      width: size,
      height: size,
      backgroundColor: color,
      borderWidth: 1,
      borderColor: '#333',
    },
  });

  return <View style={styles.block} />;
};