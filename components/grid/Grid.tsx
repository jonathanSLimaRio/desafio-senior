import React from "react";
import { View, StyleSheet } from "react-native";

interface GridProps {
  grid: (number | string)[][];
  blockSize: number;
}

const Grid = ({ grid, blockSize }: GridProps) => {
  return (
    <View style={styles.grid}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => {
            const backgroundColor = typeof cell === "string" ? cell : "#333";

            return (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  {
                    width: blockSize,
                    height: blockSize,
                    backgroundColor,
                  },
                ]}
              />
            );
          })}
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
