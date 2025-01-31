import React from "react";
import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

interface BlockProps {
  size: number;
  color: string;
}

export const Block = ({ size, color }: BlockProps) => {
  const AnimatedView = Animated.createAnimatedComponent(View);

  return (
    <AnimatedView
      style={[
        styles.block,
        {
          width: size,
          height: size,
          backgroundColor: color,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  block: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    borderRadius: 2,
  },
});
