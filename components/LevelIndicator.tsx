import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LevelIndicator({ level }: { level: number }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nível: {level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
