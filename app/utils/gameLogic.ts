export type TetrominoShape = number[][];
export type Position = { x: number; y: number };
type RotationState = 0 | 1 | 2 | 3;

/** Par [x, y] de deslocamento (kick) */
type KickOffsets = [number, number];

/** Tabela de offsets: chave "0->1", "1->2", etc. mapeando para array de pares */
type KickTable = {
  [key: string]: KickOffsets[];
};

export interface Tetromino {
  shape: TetrominoShape;
  color: string;
  rotations: TetrominoShape[];
}

export const COLS = 10;
export const ROWS = 20;

/** Offsets de rotação para J, L, S, T, Z (SRS Simplificado) */
const kicksJLSTZ: KickTable = {
  // Rotação 0 -> 1
  "0->1": [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2],
  ],
  // Rotação 1 -> 0
  "1->0": [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2],
  ],
  // Rotação 1 -> 2
  "1->2": [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2],
  ],
  // Rotação 2 -> 1
  "2->1": [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2],
  ],
  // Rotação 2 -> 3
  "2->3": [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, -2],
    [1, -2],
  ],
  // Rotação 3 -> 2
  "3->2": [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2],
  ],
  // Rotação 3 -> 0
  "3->0": [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2],
  ],
  // Rotação 0 -> 3
  "0->3": [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, -2],
    [1, -2],
  ],
};

/** Offsets de rotação específicos da peça I */
const kicksI: KickTable = {
  "0->1": [
    [0, 0],
    [-2, 0],
    [1, 0],
    [-2, -1],
    [1, 2],
  ],
  "1->0": [
    [0, 0],
    [2, 0],
    [-1, 0],
    [2, 1],
    [-1, -2],
  ],
  "1->2": [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, 2],
    [2, -1],
  ],
  "2->1": [
    [0, 0],
    [1, 0],
    [-2, 0],
    [1, -2],
    [-2, 1],
  ],
  "2->3": [
    [0, 0],
    [2, 0],
    [-1, 0],
    [2, 1],
    [-1, -2],
  ],
  "3->2": [
    [0, 0],
    [-2, 0],
    [1, 0],
    [-2, -1],
    [1, 2],
  ],
  "3->0": [
    [0, 0],
    [1, 0],
    [-2, 0],
    [1, -2],
    [-2, 1],
  ],
  "0->3": [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, 2],
    [2, -1],
  ],
};

/**
 * Rotaciona a shape para o próximo estado.
 * Retorna a nova shape e o índice da rotação
 */
export function getRotatedShape(
  currentPiece: Tetromino,
  currentRotation: number
) {
  const newRotation = (currentRotation + 1) % currentPiece.rotations.length;
  const newShape = currentPiece.rotations[newRotation];
  return { newShape, newRotation };
}

/**
 * Aplica SRS (wall kicks) para tentar encaixar a peça rotacionada
 */
export function applySRS(
  grid: (number | string)[][],
  piece: Tetromino,
  currentRotation: RotationState,
  newRotation: RotationState,
  position: Position,
  newShape: TetrominoShape
): { finalPos: Position; success: boolean } {
  // Determina se é a peça "I" ou as demais
  const isI = piece === TETROMINOES.I;
  // Monta a string da transição (ex: "0->1", "2->3")
  const transitionKey = `${currentRotation}->${newRotation}`;

  // Seleciona array de offsets com base no tipo de peça
  const offsets = isI ? kicksI[transitionKey] : kicksJLSTZ[transitionKey];

  // Se não existir no map (fallback)
  if (!offsets) {
    return {
      finalPos: position,
      success: !checkCollision(grid, newShape, position),
    };
  }

  // Testa cada deslocamento
  for (let i = 0; i < offsets.length; i++) {
    const [kickX, kickY] = offsets[i];
    const testPos = {
      x: position.x + kickX,
      y: position.y + kickY,
    };

    // Se não colide, sucesso
    if (!checkCollision(grid, newShape, testPos)) {
      return { finalPos: testPos, success: true };
    }
  }

  // Se todos colidem, rotação falhou
  return { finalPos: position, success: false };
}

/** Cores para cada tipo de Tetromino */
export const TETROMINO_COLORS: { [key: string]: string } = {
  I: "#00FFFF",
  O: "#FFFF00",
  T: "#800080",
  S: "#00FF00",
  Z: "#FF0000",
  J: "#0000FF",
  L: "#FFA500",
};

/** Definição de cada Tetromino (shape inicial, cor e rotações) */
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

/** Verifica se há colisão do tetromino com o grid */
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

        // Fora dos limites horizontais/verticais
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

/** Insere o tetromino fixo no grid (transforma em cor) */
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

/** Rotaciona a shape (sem wall kicks) */
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

/** Remove linhas completas do grid e conta quantas foram removidas */
export const clearLines = (
  grid: (number | string)[][]
): { newGrid: (number | string)[][]; linesCleared: number } => {
  const newGrid: (number | string)[][] = [];
  let linesCleared = 0;

  for (let y = 0; y < grid.length; y++) {
    // Se a linha não tiver nenhum 0, ela está cheia
    if (grid[y].every((cell) => cell !== 0)) {
      linesCleared++;
    } else {
      newGrid.push(grid[y]);
    }
  }

  // Insere linhas vazias no topo para manter o tamanho total
  while (newGrid.length < ROWS) {
    newGrid.unshift(Array(COLS).fill(0));
  }

  return { newGrid, linesCleared };
};

/** Calcula a pontuação de acordo com as linhas removidas e nível atual */
export const calculateScore = (lines: number, level: number): number => {
  // 1 linha = +40 * nivel, 2 linhas = +100 * nivel, 3 linhas = 300, 4 = 1200...
  const scoreValues = [0, 40, 100, 300, 1200];
  return scoreValues[lines] * level;
};

/** Move posição X para a esquerda */
export const moveLeft = (position: Position): Position => ({
  x: position.x - 1,
  y: position.y,
});

/** Move posição X para a direita */
export const moveRight = (position: Position): Position => ({
  x: position.x + 1,
  y: position.y,
});

/** Move posição Y para baixo */
export const moveDown = (position: Position): Position => ({
  x: position.x,
  y: position.y + 1,
});

/** Hard Drop: desce até colidir */
export const hardDrop = (
  grid: (number | string)[][],
  piece: TetrominoShape,
  position: Position
): Position => {
  let newPosition = { ...position };
  while (!checkCollision(grid, piece, newPosition)) {
    newPosition.y++;
  }
  // Quando colidir, volta uma posição
  return { x: newPosition.x, y: newPosition.y - 1 };
};
