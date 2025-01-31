import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tetris</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/(home)/game")}
      >
        <Text style={styles.buttonText}>Iniciar Jogo</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/(home)/record")}
      >
        <Text style={styles.buttonText}>Ver Recordes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  title: {
    fontSize: 48,
    color: "#fff",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
