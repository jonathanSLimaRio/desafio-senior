import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { loadHighScore } from "../utils/storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  GameOver: { score: number };
  Home: undefined;
  Game: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "GameOver">;

export default function GameOverScreen({ route }: Props) {
  const navigation = useNavigation();
  const { score } = route.params;
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const load = async () => {
      setHighScore(await loadHighScore());
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over!</Text>
      <Text style={styles.score}>Pontuação: {score}</Text>
      <Text style={styles.score}>Recorde Atual: {highScore}</Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Game" as never)}
      >
        <Text style={styles.buttonText}>Jogar Novamente</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Home" as never)}
      >
        <Text style={styles.buttonText}>Voltar ao Menu</Text>
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
