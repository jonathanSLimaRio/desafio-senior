import React from "react";
import { View, StyleSheet } from "react-native";

interface GridProps {
  grid: number[][]; // Matriz que representa o grid
  blockSize: number; // Tamanho de cada bloco
}

const colorMap: { [key: number]: string } = {
  1: "#00FFFF", // I
  2: "#FFFF00", // O
  3: "#800080", // T
  4: "#00FF00", // S
  5: "#FF0000", // Z
  6: "#0000FF", // J
  7: "#FFA500", // L
};

const Grid = ({ grid, blockSize }: GridProps) => {
  return (
    <View style={styles.grid}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <View
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.cell,
                {
                  width: blockSize,
                  height: blockSize,
                  backgroundColor: cell !== 0 ? colorMap[cell] : "#333",
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    borderWidth: 2,
    borderColor: "#444",
    backgroundColor: "#111",
    padding: 2,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
    borderColor: "#222",
  },
});

export default Grid;
