import { Tetromino } from "@/app/utils/gameLogic";
import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface Props {
  piece: Tetromino;
  blockSize: number;
  currentRotation: number;
}

const NextPiecePreview = ({ piece, blockSize, currentRotation }: Props) => {
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
                  backgroundColor: cell ? String(piece.color) : "transparent", // 🔹 Convertendo para string
                },
              ]}
            />
          ))}
        </View>
      ))}
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    padding: 3,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
});

export default NextPiecePreview;
