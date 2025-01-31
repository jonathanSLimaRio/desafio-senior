import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Tetromino } from "@/app/utils/gameLogic";

interface Props {
  piece: Tetromino;
  blockSize: number;
  currentRotation: number;
}

export default function NextPiecePreview({
  piece,
  blockSize,
  currentRotation,
}: Props) {
  const AnimatedView = Animated.createAnimatedComponent(View);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withSpring(`${currentRotation * 90}deg`) }],
  }));

  return (
    <AnimatedView style={[styles.container, animatedStyle]}>
      {piece.shape.map((row, y) => (
        <View key={y} style={styles.row}>
          {row.map((cell, x) => (
            <View
              key={x}
              style={[
                styles.cell,
                {
                  width: blockSize,
                  height: blockSize,
                  backgroundColor: cell ? piece.color : "transparent",
                },
              ]}
            />
          ))}
        </View>
      ))}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    padding: 3,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
});
