import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Text, View } from "react-native";
import Grid from "@/components/grid/Grid";
import {
  checkCollision,
  hardDrop,
  moveLeft,
  moveRight,
  TETROMINOES,
  COLS,
  ROWS,
  mergePieceToGrid,
  clearLines,
  moveDown,
  calculateScore,
  getRotatedShape,
  applySRS,
} from "@/app/utils/gameLogic";
import Controls from "@/components/Controls";
import {
  loadHighScore,
  saveHighScore,
  saveLastScore,
} from "@/app/utils/storage";
import NextPiecePreview from "@/components/NextPiecePreview";
import { useRouter, useFocusEffect } from "expo-router";
import LevelIndicator from "@/components/LevelIndicator";

export default function GameScreen() {
  const router = useRouter();
  const { width } = Dimensions.get("window");

  const [isGameActive, setIsGameActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const [currentPosition, setCurrentPosition] = useState({ x: 3, y: 0 });
  const [currentPiece, setCurrentPiece] = useState(TETROMINOES.I);
  const [currentRotation, setCurrentRotation] = useState(0);

  const [grid, setGrid] = useState(
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(0))
  );

  const [nextPiece, setNextPiece] = useState(TETROMINOES.J);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesClearedTotal, setLinesClearedTotal] = useState(0);

  const [gameSpeed, setGameSpeed] = useState(1000);

  function getVisibleGrid(
    baseGrid: (number | string)[][],
    shape: number[][],
    pos: { x: number; y: number },
    color: string
  ) {
    const displayGrid = baseGrid.map((row) => [...row]);

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const gridY = pos.y + y;
          const gridX = pos.x + x;

          if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
            displayGrid[gridY][gridX] = color;
          }
        }
      }
    }
    return displayGrid;
  }

  const displayGrid = getVisibleGrid(
    grid,
    currentPiece.shape,
    currentPosition,
    currentPiece.color
  );

  useFocusEffect(
    React.useCallback(() => {
      const resetGame = async () => {
        setCurrentPosition({ x: 3, y: 0 });
        setGrid(
          Array(ROWS)
            .fill(null)
            .map(() => Array(COLS).fill(0))
        );
        setScore(0);
        setLevel(1);
        setLinesClearedTotal(0);
        setIsGameActive(true);
        setIsPaused(false);

        const keys = Object.keys(TETROMINOES);
        setCurrentPiece(
          TETROMINOES[keys[Math.floor(Math.random() * keys.length)]]
        );
        setNextPiece(
          TETROMINOES[keys[Math.floor(Math.random() * keys.length)]]
        );
      };

      resetGame();
      return () => setIsGameActive(false);
    }, [])
  );

  useEffect(() => {
    const loadScores = async () => {
      const savedHighScore = await loadHighScore();
      setHighScore(savedHighScore);
    };
    loadScores();
  }, []);

  useEffect(() => {
    const newSpeed = Math.max(1000 - 80 * (level - 1), 50);
    setGameSpeed(newSpeed);
  }, [level]);

  useEffect(() => {
    if (!isGameActive || isPaused) return;

    const gameInterval = setInterval(() => {
      const newPosition = moveDown(currentPosition);

      if (!checkCollision(grid, currentPiece.shape, newPosition)) {
        setCurrentPosition(newPosition);
      } else {
        const mergedGrid = mergePieceToGrid(
          grid,
          currentPiece.shape,
          currentPosition,
          currentPiece.color
        );

        const { newGrid, linesCleared } = clearLines(mergedGrid);

        if (linesCleared > 0) {
          const newScore = score + calculateScore(linesCleared, level);
          setScore(newScore);

          const updatedLinesClearedTotal = linesClearedTotal + linesCleared;
          setLinesClearedTotal(updatedLinesClearedTotal);

          if (updatedLinesClearedTotal >= level * 10) {
            setLevel((prev) => prev + 1);
          }

          if (newScore > highScore) {
            setHighScore(newScore);
            saveHighScore(newScore);
          }
          saveLastScore(newScore);
        }

        setGrid(newGrid);

        const newPiece = nextPiece;
        const keys = Object.keys(TETROMINOES);
        const newNextPiece =
          TETROMINOES[keys[Math.floor(Math.random() * keys.length)]];
        setNextPiece(newNextPiece);

        if (checkCollision(newGrid, newPiece.shape, { x: 3, y: 0 })) {
          saveLastScore(score);
          setIsGameActive(false);
          router.push({
            pathname: "/(home)/over",
            params: { score: String(score) },
          });
          return;
        }

        setCurrentPiece(newPiece);
        setCurrentPosition({ x: 3, y: 0 });
        setCurrentRotation(0);
      }
    }, gameSpeed);

    return () => clearInterval(gameInterval);
  }, [
    currentPosition,
    grid,
    isGameActive,
    isPaused,
    currentPiece,
    level,
    linesClearedTotal,
    gameSpeed,
    score,
    nextPiece,
    highScore,
    router,
  ]);

  const handleMoveHorizontal = (direction: "left" | "right") => {
    const newPosition =
      direction === "left"
        ? moveLeft(currentPosition)
        : moveRight(currentPosition);

    if (!checkCollision(grid, currentPiece.shape, newPosition)) {
      setCurrentPosition(newPosition);
    }
  };

  const handleRotate = () => {
    const { newShape, newRotation } = getRotatedShape(
      currentPiece,
      currentRotation
    );

    const { finalPos, success } = applySRS(
      grid,
      currentPiece,
      currentRotation as 0 | 1 | 2 | 3,
      newRotation as 0 | 1 | 2 | 3,
      currentPosition,
      newShape
    );

    if (success) {
      setCurrentPiece({ ...currentPiece, shape: newShape });
      setCurrentRotation(newRotation);
      setCurrentPosition(finalPos);
    }
  };

  const handleHardDrop = () => {
    const newPos = hardDrop(grid, currentPiece.shape, currentPosition);
    setCurrentPosition(newPos);
  };

  const handleSoftDrop = (active: boolean) => {
    setGameSpeed(active ? 50 : Math.max(1000 - (level - 1) * 100, 100));
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Pontuação: {score}</Text>
        <Text style={styles.infoText}>Recorde: {highScore}</Text>
      </View>

      <LevelIndicator level={level} />

      <Grid grid={displayGrid} blockSize={width / COLS} />

      <NextPiecePreview piece={nextPiece} blockSize={20} />

      <Controls
        onMoveLeft={() => handleMoveHorizontal("left")}
        onMoveRight={() => handleMoveHorizontal("right")}
        onRotate={handleRotate}
        onHardDrop={handleHardDrop}
        onSoftDrop={handleSoftDrop}
      />

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
