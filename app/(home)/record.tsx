import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { loadHighScore, loadLastScore } from "../utils/storage";

export default function RecordsScreen() {
  const [highScore, setHighScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);

  useEffect(() => {
    const loadScores = async () => {
      setHighScore(await loadHighScore());
      setLastScore(await loadLastScore());
    };
    loadScores();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recordes</Text>
      <Text style={styles.record}>Maior Pontuação: {highScore}</Text>
      <Text style={styles.record}>Última Pontuação: {lastScore}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1a1a1a",
  },
  title: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 20,
  },
  record: {
    fontSize: 24,
    color: "#fff",
    marginVertical: 10,
  },
});
