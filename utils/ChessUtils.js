// Chess Logic JavaScript File

// Constants
const ranks = "87654321";
const files = "abcdefgh";
const pieceOrder = [
  "Rook",
  "Knight",
  "Bishop",
  "Queen",
  "King",
  "Bishop",
  "Knight",
  "Rook",
];

// Utility Functions
const isWithinBoardBounds = (square) =>
  square.length === 2 &&
  square[0] >= "a" &&
  square[0] <= "h" &&
  square[1] >= "1" &&
  square[1] <= "8";
const getSquare = (file, rank) => String.fromCharCode(file) + rank;
const isStraightMove = (fromFile, fromRank, toFile, toRank) =>
  fromFile === toFile || fromRank === toRank;
const isDiagonalMove = (fromFile, fromRank, toFile, toRank) =>
  Math.abs(fromFile - toFile) === Math.abs(fromRank - toRank);

// Board Initialization
export const createInitialBoard = () => {
  const board = {};
  ranks.split("").forEach((rank) => {
    files.split("").forEach((file, index) => {
      const square = file + rank;
      let piece = null;
      if (rank === "8" || rank === "1") {
        piece = {
          type: pieceOrder[index],
          color: rank === "8" ? "black" : "white",
          hasMoved: false,
        };
      } else if (rank === "7" || rank === "2") {
        piece = {
          type: "Pawn",
          color: rank === "7" ? "black" : "white",
          hasMoved: false,
        };
      }
      board[square] = piece;
    });
  });
  return board;
};

// Move Validation
export const isMoveValid = (
  boardState,
  fromSquare,
  toSquare,
  checkCheck = true
) => {
  const movingPiece = boardState[fromSquare];
  if (
    !movingPiece ||
    fromSquare === toSquare ||
    !isWithinBoardBounds(toSquare)
  ) {
    return false;
  }

  const targetPiece = boardState[toSquare];
  if (targetPiece && movingPiece.color === targetPiece.color) {
    return false;
  }

  let isValid = false;
  switch (movingPiece.type) {
    case "Pawn":
      isValid = isPawnMoveValid(
        boardState,
        fromSquare,
        toSquare,
        movingPiece.color
      );
      break;
    case "Rook":
      isValid = isRookMoveValid(boardState, fromSquare, toSquare);
      break;
    case "Knight":
      isValid = isKnightMoveValid(fromSquare, toSquare);
      break;
    case "Bishop":
      isValid = isBishopMoveValid(boardState, fromSquare, toSquare);
      break;
    case "Queen":
      isValid = isQueenMoveValid(boardState, fromSquare, toSquare);
      break;
    case "King":
      isValid = isKingMoveValid(boardState, fromSquare, toSquare, checkCheck);
      break;
  }

  if (isValid && checkCheck) {
    const tempBoardState = {
      ...boardState,
      [toSquare]: movingPiece,
      [fromSquare]: null,
    };
    return !isKingInCheck(tempBoardState, movingPiece.color);
  }

  return isValid;
};

// Piece-specific Move Validations
const isRookMoveValid = (boardState, fromSquare, toSquare) =>
  isStraightMove(
    fromSquare.charCodeAt(0),
    parseInt(fromSquare[1], 10),
    toSquare.charCodeAt(0),
    parseInt(toSquare[1], 10)
  ) && isPathClear(boardState, fromSquare, toSquare);

const isKnightMoveValid = (fromSquare, toSquare) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);

  const fileDiff = Math.abs(fromFile - toFile);
  const rankDiff = Math.abs(fromRank - toRank);

  return (
    (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2)
  );
};

const isBishopMoveValid = (boardState, fromSquare, toSquare) =>
  isDiagonalMove(
    fromSquare.charCodeAt(0),
    parseInt(fromSquare[1], 10),
    toSquare.charCodeAt(0),
    parseInt(toSquare[1], 10)
  ) && isPathClear(boardState, fromSquare, toSquare);

const isQueenMoveValid = (boardState, fromSquare, toSquare) => {
  return (
    (isStraightMove(
      fromSquare.charCodeAt(0),
      parseInt(fromSquare[1], 10),
      toSquare.charCodeAt(0),
      parseInt(toSquare[1], 10)
    ) ||
      isDiagonalMove(
        fromSquare.charCodeAt(0),
        parseInt(fromSquare[1], 10),
        toSquare.charCodeAt(0),
        parseInt(toSquare[1], 10)
      )) &&
    isPathClear(boardState, fromSquare, toSquare)
  );
};

const isKingMoveValid = (boardState, fromSquare, toSquare, checkCheck) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);

  const fileDiff = Math.abs(fromFile - toFile);
  const rankDiff = Math.abs(fromRank - toRank);

  // Normal king move validation
  if (fileDiff <= 1 && rankDiff <= 1) {
    return true;
  }

  // Castling validation (only when file difference is 2)
  if (fromRank === toRank && fileDiff === 2) {
    const movingKing = boardState[fromSquare];
    if (!movingKing.hasMoved && !isKingInCheck(boardState, movingKing.color)) {
      const direction = toFile > fromFile ? 1 : -1;
      const rookFile = direction === 1 ? "h".charCodeAt(0) : "a".charCodeAt(0);
      const rookSquare = String.fromCharCode(rookFile) + fromRank;
      const rook = boardState[rookSquare];

      if (rook && rook.type === "Rook" && !rook.hasMoved) {
        if (
          isPathClear(boardState, fromSquare, rookSquare) &&
          !isKingPassThroughCheck(
            boardState,
            fromSquare,
            toSquare,
            movingKing.color
          )
        ) {
          return true; // Castling is valid
        }
      }
    }
  }

  return false; // Invalid king move
};

const isKingPassThroughCheck = (
  boardState,
  fromSquare,
  toSquare,
  kingColor
) => {
  const fromFile = fromSquare.charCodeAt(0);
  const toFile = toSquare.charCodeAt(0);
  const direction = toFile > fromFile ? 1 : -1;

  let file = fromFile;
  while (file !== toFile + direction) {
    const currentSquare = getSquare(file, fromSquare[1]);
    if (
      isUnderAttack(
        boardState,
        currentSquare,
        kingColor === "white" ? "black" : "white"
      )
    ) {
      return true;
    }
    file += direction;
  }
  return false;
};

const isPawnMoveValid = (boardState, fromSquare, toSquare, color) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);
  const direction = color === "white" ? 1 : -1;
  const startRank = color === "white" ? 2 : 7;

  // Normal move
  if (
    fromFile === toFile &&
    !boardState[toSquare] &&
    toRank === fromRank + direction
  ) {
    return true;
  }

  // First move: two squares
  if (
    fromFile === toFile &&
    fromRank === startRank &&
    toRank === fromRank + 2 * direction &&
    !boardState[toSquare] &&
    !boardState[getSquare(fromFile, fromRank + direction)]
  ) {
    return true;
  }

  // Capture
  if (
    Math.abs(fromFile - toFile) === 1 &&
    toRank === fromRank + direction &&
    boardState[toSquare] &&
    boardState[toSquare].color !== color
  ) {
    return true;
  }

  // En passant capture logic
  const enemyRank =
    color === "white"
      ? parseInt(toSquare[1], 10) - 1
      : parseInt(toSquare[1], 10) + 1;
  const enemySquare = `${toSquare[0]}${enemyRank}`;
  const enemyPiece = boardState[enemySquare];

  // Check if the moving pawn is on its fifth rank
  const isPawnOnFifthRank =
    (color === "white" && fromRank === 5) ||
    (color === "black" && fromRank === 4);

  if (
    isPawnOnFifthRank &&
    enemyPiece &&
    enemyPiece.type === "Pawn" &&
    enemyPiece.justDoubleMoved &&
    Math.abs(fromSquare.charCodeAt(0) - toSquare.charCodeAt(0)) === 1 &&
    toSquare[1] === (color === "white" ? "6" : "3")
  ) {
    return true;
  }

  return false;
};

export const isCheckmate = (boardState, kingColor) => {
  if (!isKingInCheck(boardState, kingColor)) {
    return false; // Not checkmate if the king is not in check
  }

  for (let fromSquare in boardState) {
    const piece = boardState[fromSquare];
    if (piece && piece.color === kingColor) {
      for (let toSquare in boardState) {
        if (isMoveValid(boardState, fromSquare, toSquare, true)) {
          const tempBoardState = {
            ...boardState,
            [toSquare]: piece,
            [fromSquare]: null,
          };
          if (!isKingInCheck(tempBoardState, kingColor)) {
            return false; // Not checkmate if there's a valid move that removes the check
          }
        }
      }
    }
  }

  return true; // Checkmate if no valid moves remove the check
};

export const findKingPosition = (boardState, kingColor) => {
  for (let square in boardState) {
    const piece = boardState[square];
    if (piece && piece.type === "King" && piece.color === kingColor) {
      return square;
    }
  }
  return null; // King not found (shouldn't happen in a valid game state)
};

export const isKingInCheck = (boardState, kingColor) => {
  const kingPosition = findKingPosition(boardState, kingColor);
  return isUnderAttack(
    boardState,
    kingPosition,
    kingColor === "white" ? "black" : "white"
  );
};

const isUnderAttack = (boardState, position, enemyColor) => {
  for (let square in boardState) {
    const piece = boardState[square];
    if (
      piece &&
      piece.color === enemyColor &&
      isMoveValid(boardState, square, position, false)
    ) {
      return true;
    }
  }
  return false;
};

const isPathClear = (boardState, fromSquare, toSquare) => {
  const fromFile = fromSquare.charCodeAt(0),
    fromRank = parseInt(fromSquare[1], 10),
    toFile = toSquare.charCodeAt(0),
    toRank = parseInt(toSquare[1], 10);
  const fileStep = Math.sign(toFile - fromFile),
    rankStep = Math.sign(toRank - fromRank);
  let currentFile = fromFile + fileStep,
    currentRank = fromRank + rankStep;

  while (currentFile !== toFile || currentRank !== toRank) {
    const currentSquare = getSquare(currentFile, currentRank);
    if (boardState[currentSquare]) return false;
    currentFile += fileStep;
    currentRank += rankStep;
  }
  return true;
};

export const calculatePossibleMoves = (boardState, fromSquare) => {
  let moves = [];
  const movingPiece = boardState[fromSquare];
  if (!movingPiece) return moves;

  for (let rank = 1; rank <= 8; rank++) {
    for (let file = 0; file < 8; file++) {
      let toSquare = `${String.fromCharCode("a".charCodeAt(0) + file)}${rank}`;
      if (isMoveValid(boardState, fromSquare, toSquare)) {
        moves.push(toSquare);
      }
    }
  }
  return moves;
};

// End of File
