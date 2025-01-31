import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { loadHighScore } from "@/app/utils/storage";

export default function OverScreen() {
  const router = useRouter();
  const { score } = useLocalSearchParams();

  const [highScore, setHighScore] = useState(0);
  const finalScore = score ? Number(score) : 0;

  useEffect(() => {
    const load = async () => {
      setHighScore(await loadHighScore());
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over!</Text>
      <Text style={styles.score}>Pontuação: {finalScore}</Text>
      <Text style={styles.score}>Recorde Atual: {highScore}</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/(home)/game")}
      >
        <Text style={styles.buttonText}>Jogar Novamente</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/(home)")}
      >
        <Text style={styles.buttonText}>Voltar ao Menu</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 48,
    color: "#ff4444",
    marginBottom: 20,
  },
  score: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: 250,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
