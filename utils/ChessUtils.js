// Chess Logic JavaScript File

// Function to create the initial board setup
export const createInitialBoard = () => {
  const ranks = "87654321";
  const files = "abcdefgh";
  const board = {};
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

  ranks.split("").forEach((rank) => {
    files.split("").forEach((file, index) => {
      const square = file + rank;
      let piece = null;

      if (rank === "8" || rank === "1") {
        const color = rank === "8" ? "black" : "white";
        piece = { type: pieceOrder[index], color, hasMoved: false };
      } else if (rank === "7" || rank === "2") {
        const color = rank === "7" ? "black" : "white";
        piece = { type: "Pawn", color, hasMoved: false };
      }

      board[square] = piece;
    });
  });

  return board;
};

// Function to check if a move is valid
export const isMoveValid = (
  boardState,
  fromSquare,
  toSquare,
  checkCheck = true
) => {
  const movingPiece = boardState[fromSquare];
  const targetPiece = boardState[toSquare];

  if (!movingPiece || fromSquare === toSquare) {
    return false;
  }

  if (targetPiece && movingPiece.color === targetPiece.color) {
    return false;
  }

  if (!isWithinBoardBounds(toSquare)) {
    return false;
  }

  const tempBoardState = {
    ...boardState,
    [toSquare]: movingPiece,
    [fromSquare]: null,
  };

  if (checkCheck && isKingInCheck(tempBoardState, movingPiece.color)) {
    return false;
  }

  switch (movingPiece.type) {
    case "Rook":
      return isRookMoveValid(boardState, fromSquare, toSquare);
    case "Knight":
      return isKnightMoveValid(fromSquare, toSquare);
    case "Bishop":
      return isBishopMoveValid(boardState, fromSquare, toSquare);
    case "Queen":
      return isQueenMoveValid(boardState, fromSquare, toSquare);
    case "King":
      return isKingMoveValid(boardState, fromSquare, toSquare, checkCheck);
    case "Pawn":
      return isPawnMoveValid(
        boardState,
        fromSquare,
        toSquare,
        movingPiece.color
      );
    default:
      return false;
  }
};

// Function to check for checkmate
export const isCheckmate = (boardState, kingColor) => {
  if (!isKingInCheck(boardState, kingColor)) {
    return false;
  }

  for (let fromSquare in boardState) {
    const piece = boardState[fromSquare];
    if (piece && piece.color === kingColor) {
      for (let toSquare in boardState) {
        if (isMoveValid(boardState, fromSquare, toSquare, false)) {
          const tempBoardState = {
            ...boardState,
            [toSquare]: { ...piece, hasMoved: true },
            [fromSquare]: null,
          };
          if (!isKingInCheck(tempBoardState, kingColor)) {
            return false;
          }
        }
      }
    }
  }

  return true;
};

// Function to find the king's position
export const findKingPosition = (boardState, kingColor) => {
  for (let square in boardState) {
    const piece = boardState[square];
    if (piece && piece.type === "King" && piece.color === kingColor) {
      return square;
    }
  }
  return null;
};

// Function to check if the king is in check
export const isKingInCheck = (boardState, kingColor) => {
  const kingPosition = findKingPosition(boardState, kingColor);
  const enemyColor = kingColor === "white" ? "black" : "white";
  return isUnderAttack(boardState, kingPosition, enemyColor);
};

// Function to check if a square is under attack
const isUnderAttack = (boardState, position, enemyColor) => {
  for (let square in boardState) {
    const piece = boardState[square];
    if (piece && piece.color === enemyColor) {
      if (isMoveValid(boardState, square, position, false)) {
        return true;
      }
    }
  }
  return false;
};

// Function to check if a square is within board bounds
const isWithinBoardBounds = (square) => {
  if (!square || square.length !== 2) {
    return false;
  }

  const file = square.charCodeAt(0);
  const rank = parseInt(square[1], 10);

  return (
    file >= "a".charCodeAt(0) &&
    file <= "h".charCodeAt(0) &&
    rank >= 1 &&
    rank <= 8
  );
};

// Function to validate a rook's move
const isRookMoveValid = (boardState, fromSquare, toSquare) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);

  if (fromFile !== toFile && fromRank !== toRank) {
    return false;
  }

  const fileStep = fromFile === toFile ? 0 : toFile > fromFile ? 1 : -1;
  const rankStep = fromRank === toRank ? 0 : toRank > fromRank ? 1 : -1;

  let currentFile = fromFile + fileStep;
  let currentRank = fromRank + rankStep;

  while (currentFile !== toFile || currentRank !== toRank) {
    const currentSquare = String.fromCharCode(currentFile) + currentRank;
    if (boardState[currentSquare]) {
      return false;
    }
    currentFile += fileStep;
    currentRank += rankStep;
  }

  return true;
};

// Function to validate a knight's move
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

// Function to validate a bishop's move
const isBishopMoveValid = (boardState, fromSquare, toSquare) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);

  const fileDiff = Math.abs(fromFile - toFile);
  const rankDiff = Math.abs(fromRank - toRank);

  if (fileDiff !== rankDiff) {
    return false;
  }

  const fileStep = Math.sign(toFile - fromFile);
  const rankStep = Math.sign(toRank - fromRank);

  let currentFile = fromFile + fileStep;
  let currentRank = fromRank + rankStep;

  while (currentFile !== toFile || currentRank !== toRank) {
    const currentSquare = String.fromCharCode(currentFile) + currentRank;
    if (boardState[currentSquare]) {
      return false;
    }
    currentFile += fileStep;
    currentRank += rankStep;
  }

  return true;
};

// Function to validate a queen's move
export const isQueenMoveValid = (boardState, fromSquare, toSquare) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);

  if (
    isStraightMove(fromFile, fromRank, toFile, toRank) ||
    isDiagonalMove(fromFile, fromRank, toFile, toRank)
  ) {
    return isPathClear(boardState, fromFile, fromRank, toFile, toRank);
  }
  return false;
};

// Function to validate a king's move including castling
const isKingMoveValid = (boardState, fromSquare, toSquare, checkCheck) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);

  const fileDiff = Math.abs(fromFile - toFile);
  const rankDiff = Math.abs(fromRank - toRank);

  if (fileDiff <= 1 && rankDiff <= 1) {
    return true;
  }

  if (checkCheck && canCastle(boardState, fromSquare, toSquare)) {
    return true;
  }

  return false;
};

// Function to check if castling is possible
const canCastle = (boardState, fromSquare, toSquare) => {
  const movingPiece = boardState[fromSquare];
  if (movingPiece.hasMoved) {
    return false;
  }

  const rank = fromSquare[1];
  if (toSquare === `g${rank}` || toSquare === `c${rank}`) {
    let fileRange = toSquare === `g${rank}` ? ["f", "g"] : ["b", "c", "d"];
    for (let file of fileRange) {
      if (boardState[`${file}${rank}`]) {
        return false;
      }
      if (
        isUnderAttack(
          boardState,
          `${file}${rank}`,
          movingPiece.color === "white" ? "black" : "white"
        )
      ) {
        return false;
      }
    }
    return true;
  }
  return false;
};

// Function to validate a pawn's move
const isPawnMoveValid = (boardState, fromSquare, toSquare, color) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);
  const targetPiece = boardState[toSquare];
  const direction = color === "white" ? 1 : -1;
  const startRank = color === "white" ? 2 : 7;

  if (fromFile === toFile && toRank === fromRank + direction) {
    return !targetPiece;
  }

  if (
    fromFile === toFile &&
    fromRank === startRank &&
    toRank === fromRank + 2 * direction
  ) {
    const intermediateSquare =
      String.fromCharCode(fromFile) + (fromRank + direction);
    return !targetPiece && !boardState[intermediateSquare];
  }

  if (Math.abs(fromFile - toFile) === 1 && toRank === fromRank + direction) {
    return targetPiece && targetPiece.color !== color;
  }

  return false;
};

// Helper functions to check the type of move
const isDiagonalMove = (fromFile, fromRank, toFile, toRank) => {
  return Math.abs(fromFile - toFile) === Math.abs(fromRank - toRank);
};

const isStraightMove = (fromFile, fromRank, toFile, toRank) => {
  return fromFile === toFile || fromRank === toRank;
};

// Helper function to check if the path between two squares is clear
const isPathClear = (boardState, fromFile, fromRank, toFile, toRank) => {
  const fileStep = Math.sign(toFile - fromFile);
  const rankStep = Math.sign(toRank - fromRank);
  let currentFile = fromFile + fileStep;
  let currentRank = fromRank + rankStep;

  while (currentFile !== toFile || currentRank !== toRank) {
    const currentSquare = String.fromCharCode(currentFile) + currentRank;
    if (boardState[currentSquare]) {
      return false;
    }
    currentFile += fileStep;
    currentRank += rankStep;
  }
  return true;
};

// End of file
