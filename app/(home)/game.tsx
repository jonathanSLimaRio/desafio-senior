import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Text, View } from "react-native";
import Grid from "@/components/grid/Grid";
import {
  checkCollision,
  hardDrop,
  moveLeft,
  moveRight,
  rotatePiece,
  TETROMINOES,
  COLS,
  ROWS,
  mergePieceToGrid,
  clearLines,
  moveDown,
  calculateScore,
} from "@/app/utils/gameLogic";
import Controls from "@/components/Controls";
import {
  loadHighScore,
  saveHighScore,
  saveLastScore,
} from "@/app/utils/storage";
import NextPiecePreview from "@/components/NextPiecePreview";
import { useRouter } from "expo-router";

export default function GameScreen() {
  const router = useRouter();
  const { width } = Dimensions.get("window");

  const [isGameActive, setIsGameActive] = useState(true);
  const [currentPosition, setCurrentPosition] = useState({ x: 3, y: 0 });
  const [currentPiece, setCurrentPiece] = useState(() => {
    const keys = Object.keys(TETROMINOES);
    return TETROMINOES[keys[Math.floor(Math.random() * keys.length)]];
  });
  const [currentRotation, setCurrentRotation] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [nextPiece, setNextPiece] = useState(() => {
    const keys = Object.keys(TETROMINOES);
    return TETROMINOES[keys[Math.floor(Math.random() * keys.length)]];
  });
  const [grid, setGrid] = useState(
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(0))
  );
  const [gameSpeed, setGameSpeed] = useState(1000);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const loadScores = async () => {
      const savedHighScore = await loadHighScore();
      setHighScore(savedHighScore);
    };
    loadScores();
  }, []);

  useEffect(() => {
    if (!isGameActive || isPaused) return;

    const gameInterval = setInterval(() => {
      const newPosition = moveDown(currentPosition);

      // Tenta mover para baixo
      if (!checkCollision(grid, currentPiece.shape, newPosition)) {
        setCurrentPosition(newPosition);
      } else {
        // Merge da peça no grid
        const mergedGrid = mergePieceToGrid(
          grid,
          currentPiece.shape,
          currentPosition,
          currentPiece.color as string
        );

        // Limpeza de linhas
        const { newGrid, linesCleared } = clearLines(mergedGrid);

        if (linesCleared > 0) {
          const newScore = score + calculateScore(linesCleared, 1);
          setScore(newScore);

          if (newScore > highScore) {
            setHighScore(newScore);
            saveHighScore(newScore);
          }
          saveLastScore(newScore);
        }

        setGrid(newGrid);

        // Nova peça
        const keys = Object.keys(TETROMINOES);
        const newPiece =
          TETROMINOES[keys[Math.floor(Math.random() * keys.length)]];

        // Verifica se a nova peça colide imediatamente (game over)
        if (checkCollision(newGrid, newPiece.shape, { x: 3, y: 0 })) {
          saveLastScore(score);
          setIsGameActive(false);

          // Redireciona para tela de fim de jogo passando a pontuação atual
          router.push({
            pathname: "/(home)/over",
            params: { score: String(score) },
          });

          return;
        }

        // Caso o jogo continue, atualiza a peça atual e posição
        setCurrentPiece(newPiece);
        setCurrentPosition({ x: 3, y: 0 });
      }
    }, gameSpeed);

    return () => clearInterval(gameInterval);
  }, [
    currentPosition,
    grid,
    isGameActive,
    isPaused,
    gameSpeed,
    currentPiece,
    score,
    highScore,
    router,
  ]);

  // Movimentos laterais
  const handleMoveHorizontal = (direction: "left" | "right") => {
    const newPosition =
      direction === "left"
        ? moveLeft(currentPosition)
        : moveRight(currentPosition);

    if (!checkCollision(grid, currentPiece.shape, newPosition)) {
      setCurrentPosition(newPosition);
    }
  };

  // Rotação
  const handleRotate = () => {
    const { shape: newShape, rotation: newRotation } = rotatePiece(
      currentPiece,
      currentRotation
    );

    if (!checkCollision(grid, newShape, currentPosition)) {
      setCurrentPiece({ ...currentPiece, shape: newShape });
      setCurrentRotation(newRotation);
    }
  };

  // Hard Drop
  const handleHardDrop = () => {
    const newPos = hardDrop(grid, currentPiece.shape, currentPosition);
    setCurrentPosition(newPos);
  };

  // Soft Drop
  const handleSoftDrop = (active: boolean) => {
    setGameSpeed(active ? 50 : 1000);
  };

  return (
    <View style={styles.container}>
      {/* Info Superior */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Pontuação: {score}</Text>
        <Text style={styles.infoText}>Recorde: {highScore}</Text>
      </View>

      {/* Grid Principal */}
      <Grid grid={grid} blockSize={width / COLS} />

      {/* Preview da Próxima Peça */}
      <NextPiecePreview piece={nextPiece} blockSize={20} currentRotation={0} />

      {/* Controles */}
      <Controls
        onMoveLeft={() => handleMoveHorizontal("left")}
        onMoveRight={() => handleMoveHorizontal("right")}
        onRotate={handleRotate}
        onHardDrop={handleHardDrop}
        onSoftDrop={handleSoftDrop}
      />

      {/* Botão de Pausa */}
      <TouchableOpacity
        style={styles.pauseButton}
        onPress={() => setIsPaused(!isPaused)}
      >
        <Text style={styles.pauseText}>{isPaused ? "▶" : "⏸"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    color: "white",
    fontSize: 16,
  },
  pauseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  pauseText: {
    fontSize: 28,
    color: "white",
  },
});
