import React, { useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onSoftDrop: (active: boolean) => void;
}

export default function Controls({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onHardDrop,
  onSoftDrop,
}: ControlsProps) {
  const moveLeftInterval = useRef<NodeJS.Timeout | null>(null);
  const moveRightInterval = useRef<NodeJS.Timeout | null>(null);

  const handleLeftPressIn = () => {
    onMoveLeft();
    moveLeftInterval.current = setInterval(() => {
      onMoveLeft();
    }, 150);
  };

  const handleLeftPressOut = () => {
    if (moveLeftInterval.current) {
      clearInterval(moveLeftInterval.current);
      moveLeftInterval.current = null;
    }
  };

  const handleRightPressIn = () => {
    onMoveRight(); // move imediatamente
    moveRightInterval.current = setInterval(() => {
      onMoveRight();
    }, 150);
  };

  const handleRightPressOut = () => {
    if (moveRightInterval.current) {
      clearInterval(moveRightInterval.current);
      moveRightInterval.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={handleLeftPressIn}
          onPressOut={handleLeftPressOut}
        >
          <Text style={styles.buttonText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPressIn={handleRightPressIn}
          onPressOut={handleRightPressOut}
        >
          <Text style={styles.buttonText}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => onSoftDrop(true)}
          onPressOut={() => onSoftDrop(false)}
        >
          <Text style={styles.buttonText}>↓</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onRotate}>
          <Text style={styles.buttonText}>↻</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={onHardDrop}>
          <Text style={styles.buttonText}>Hard Drop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 10,
    minWidth: 60,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    color: "white",
  },
});
