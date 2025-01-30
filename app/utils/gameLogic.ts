// utils/gameLogic.ts

// Tipos e interfaces
export type TetrominoShape = number[][];
export type Position = { x: number; y: number };

export interface Tetromino {
  shape: TetrominoShape;
  color: string | number;
  rotations: TetrominoShape[];
}

// Constantes do jogo
export const COLS = 10;
export const ROWS = 20;
export const TETROMINO_COLORS: { [key: string]: string } = {
  I: "#00FFFF",
  O: "#FFFF00",
  T: "#800080",
  S: "#00FF00",
  Z: "#FF0000",
  J: "#0000FF",
  L: "#FFA500",
};

// Definições dos Tetrominos com todas as rotações
// Definições completas dos Tetrominos
export const TETROMINOES: { [key: string]: Tetromino } = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: TETROMINO_COLORS.I,
    rotations: [[[1], [1], [1], [1]], [[1, 1, 1, 1]]],
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: TETROMINO_COLORS.O,
    rotations: [
      [
        [1, 1],
        [1, 1],
      ],
    ],
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: TETROMINO_COLORS.T,
    rotations: [
      [
        [0, 1, 0],
        [1, 1, 1],
      ],
      [
        [0, 1],
        [1, 1],
        [0, 1],
      ],
      [
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 0],
      ],
    ],
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: TETROMINO_COLORS.S,
    rotations: [
      [
        [0, 1],
        [1, 1],
        [1, 0],
      ],
      [
        [1, 0, 1],
        [0, 1, 1],
      ],
      [
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 1],
        [0, 1],
        [1, 0],
      ],
    ],
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: TETROMINO_COLORS.Z,
    rotations: [
      [
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      [
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 1],
        [1, 1],
        [1, 0],
      ],
    ],
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: TETROMINO_COLORS.J,
    rotations: [
      [
        [1, 1],
        [1, 0],
        [1, 0],
      ],
      [
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1],
        [0, 1],
        [1, 1],
      ],
      [
        [1, 0, 0],
        [1, 1, 1],
      ],
    ],
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: TETROMINO_COLORS.L,
    rotations: [
      [
        [1, 1],
        [0, 1],
        [0, 1],
      ],
      [
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 0],
        [1, 0],
        [1, 1],
      ],
      [
        [0, 0, 1],
        [1, 1, 1],
      ],
    ],
  },
};

// Funções principais
export const createNewPiece = (type: string): Tetromino => {
  return TETROMINOES[type];
};

export const checkCollision = (
  grid: number[][],
  piece: TetrominoShape,
  position: Position
): boolean => {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;

        if (
          newX < 0 ||
          newX >= COLS ||
          newY >= ROWS ||
          (newY >= 0 && grid[newY][newX])
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const mergePieceToGrid = (
  grid: number[][],
  piece: TetrominoShape,
  position: Position,
  color: string // Mude para string
): number[][] => {
  const newGrid = grid.map((row) => [...row]);

  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        const gridY = position.y + y;
        if (gridY >= 0) {
          newGrid[gridY][position.x + x] = color as any;
        }
      }
    }
  }
  return newGrid;
};

export const rotatePiece = (
  currentPiece: Tetromino,
  currentRotation: number
): { shape: TetrominoShape; rotation: number } => {
  const newRotation = (currentRotation + 1) % currentPiece.rotations.length;
  return {
    shape: currentPiece.rotations[newRotation],
    rotation: newRotation,
  };
};

export const clearLines = (
  grid: number[][]
): { newGrid: number[][]; linesCleared: number } => {
  const newGrid = [];
  let linesCleared = 0;

  for (let y = 0; y < grid.length; y++) {
    if (grid[y].every((cell) => cell !== 0)) {
      linesCleared++;
    } else {
      newGrid.push(grid[y]);
    }
  }

  while (newGrid.length < ROWS) {
    newGrid.unshift(Array(COLS).fill(0));
  }

  return { newGrid: newGrid, linesCleared };
};

// Lógica de pontuação
export const calculateScore = (lines: number, level: number): number => {
  const scoreValues = [0, 40, 100, 300, 1200];
  return scoreValues[lines] * (level + 1);
};

// Funções de movimento
export const moveLeft = (position: Position): Position => ({
  x: position.x - 1,
  y: position.y,
});

export const moveRight = (position: Position): Position => ({
  x: position.x + 1,
  y: position.y,
});

export const moveDown = (position: Position): Position => ({
  x: position.x,
  y: position.y + 1,
});

export const hardDrop = (
  grid: number[][],
  piece: TetrominoShape,
  position: Position
): Position => {
  let newPosition = { ...position };
  while (!checkCollision(grid, piece, newPosition)) {
    newPosition.y++;
  }
  return { x: newPosition.x, y: newPosition.y - 1 };
};
