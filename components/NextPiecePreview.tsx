import React from "react";
import { View, StyleSheet } from "react-native";
import { Tetromino } from "@/app/utils/gameLogic";

interface Props {
  piece: Tetromino;
  blockSize: number;
}

export default function NextPiecePreview({ piece, blockSize }: Props) {
  return (
    <View style={styles.container}>
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
    </View>
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