import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";

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
  // Gesto de arrastar (Pan)
  const panGesture = Gesture.Pan().onUpdate(
    (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      // Se moveu horizontalmente além de um limiar, decidir mover a peça
      if (Math.abs(e.translationX) > 30) {
        e.translationX > 0 ? onMoveRight() : onMoveLeft();
      }
    }
  );

  // Gesto de Tap duplo para Hard Drop
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      onHardDrop();
    });

  return (
    <View style={styles.container}>
      {/*
        Área "invisível" para captura de gestos de arrastar e duplo clique
      */}
      <GestureDetector gesture={Gesture.Race(panGesture, doubleTapGesture)}>
        <View style={styles.gestureArea} />
      </GestureDetector>

      {/* Botões extras */}
      <View style={styles.buttonsContainer}>
        {/* Soft Drop */}
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => onSoftDrop(true)}
          onPressOut={() => onSoftDrop(false)}
        >
          <Text style={styles.buttonText}>↓</Text>
        </TouchableOpacity>

        {/* Rotação */}
        <TouchableOpacity style={styles.button} onPress={onRotate}>
          <Text style={styles.buttonText}>↻</Text>
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
  },
  gestureArea: {
    position: "absolute",
    top: -200,
    left: 0,
    right: 0,
    height: 200,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 20,
    borderRadius: 40,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    color: "white",
  },
});
