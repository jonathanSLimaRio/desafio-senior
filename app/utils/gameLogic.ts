// utils/gameLogic.ts

export type TetrominoShape = number[][]; // Cada célula = 1 ou 0
export type Position = { x: number; y: number };

export interface Tetromino {
  shape: TetrominoShape;
  color: string;
  rotations: TetrominoShape[];
}

export const COLS = 10;
export const ROWS = 20;

// Mapeamento de cores (se quiser mudar)
export const TETROMINO_COLORS: { [key: string]: string } = {
  I: "#00FFFF",
  O: "#FFFF00",
  T: "#800080",
  S: "#00FF00",
  Z: "#FF0000",
  J: "#0000FF",
  L: "#FFA500",
};

// Definições de Tetrominos + rotações
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

/**
 * Verifica colisão da peça com a borda ou com células já ocupadas.
 */
export const checkCollision = (
  grid: (number | string)[][],
  piece: TetrominoShape,
  position: Position
): boolean => {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;

        // Fora dos limites
        if (newX < 0 || newX >= COLS || newY >= ROWS) {
          return true;
        }

        // Se está dentro do grid mas já ocupado
        if (newY >= 0 && grid[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
};

/**
 * Mescla a peça atual ao grid.
 */
export const mergePieceToGrid = (
  grid: (number | string)[][],
  piece: TetrominoShape,
  position: Position,
  color: string
): (number | string)[][] => {
  const newGrid = grid.map((row) => [...row]);

  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        const gridY = position.y + y;
        if (gridY >= 0) {
          newGrid[gridY][position.x + x] = color;
        }
      }
    }
  }
  return newGrid;
};

/**
 * Gira a peça para a próxima rotação.
 */
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

/**
 * Limpa as linhas completas e retorna o novo grid e quantas linhas foram removidas.
 */
export const clearLines = (
  grid: (number | string)[][]
): { newGrid: (number | string)[][]; linesCleared: number } => {
  const newGrid: (number | string)[][] = [];
  let linesCleared = 0;

  for (let y = 0; y < grid.length; y++) {
    // Se a linha não contém zeros, está completa
    if (grid[y].every((cell) => cell !== 0)) {
      linesCleared++;
    } else {
      newGrid.push(grid[y]);
    }
  }

  // Adiciona linhas vazias no topo depois de remover
  while (newGrid.length < ROWS) {
    newGrid.unshift(Array(COLS).fill(0));
  }

  return { newGrid, linesCleared };
};

/**
 * Calcula pontuação baseada em número de linhas e nível.
 * (Aqui deixamos fixo level=1 para simplificar.)
 */
export const calculateScore = (lines: number, level: number): number => {
  const scoreValues = [0, 40, 100, 300, 1200];
  return scoreValues[lines] * level;
};

/**
 * Movimentos de translação
 */
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

/**
 * Hard drop: desce até colidir.
 */
export const hardDrop = (
  grid: (number | string)[][],
  piece: TetrominoShape,
  position: Position
): Position => {
  let newPosition = { ...position };
  while (!checkCollision(grid, piece, newPosition)) {
    newPosition.y++;
  }
  // Volta uma linha para cima (pois colidiu)
  return { x: newPosition.x, y: newPosition.y - 1 };
};
