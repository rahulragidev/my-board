export const isMoveValid = (boardState, fromSquare, toSquare) => {
  const movingPiece = boardState[fromSquare];
  const targetPiece = boardState[toSquare];

  // Early checks before simulating the move
  if (!movingPiece || fromSquare === toSquare) {
    return false;
  }

  if (targetPiece && movingPiece.color === targetPiece.color) {
    return false;
  }

  if (!isWithinBoardBounds(toSquare)) {
    return false;
  }

  // Simulate the move
  const tempBoardState = {
    ...boardState,
    [toSquare]: movingPiece,
    [fromSquare]: null,
  };

  // Check if this move puts your own king in check
  const ownKingColor = movingPiece.color;
  if (isKingInCheck(tempBoardState, ownKingColor)) {
    return false; // Move is not valid as it leaves or puts your king in check
  }

  // Continue with the rest of your move validation logic
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
      return isKingMoveValid(fromSquare, toSquare);
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

// In your ChessUtils.js or a similar utility file

const findKingPosition = (boardState, kingColor) => {
  for (let square in boardState) {
    const piece = boardState[square];
    if (piece && piece.type === "King" && piece.color === kingColor) {
      return square;
    }
  }
  return null; // King not found (should never happen in a valid game)
};

const isUnderAttack = (boardState, position, enemyColor) => {
  for (let square in boardState) {
    const piece = boardState[square];
    if (piece && piece.color === enemyColor) {
      if (isMoveValid(boardState, square, position, true)) {
        return true;
      }
    }
  }
  return false;
};

export const isKingInCheck = (boardState, kingColor) => {
  const kingPosition = findKingPosition(boardState, kingColor);
  const enemyColor = kingColor === "white" ? "black" : "white";
  return isUnderAttack(boardState, kingPosition, enemyColor);
};

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

const isRookMoveValid = (boardState, fromSquare, toSquare) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);

  // Rook moves in a straight line along a row or column
  if (fromFile !== toFile && fromRank !== toRank) {
    return false; // Rook doesn't move diagonally
  }

  const fileStep = fromFile === toFile ? 0 : toFile > fromFile ? 1 : -1;
  const rankStep = fromRank === toRank ? 0 : toRank > fromRank ? 1 : -1;

  let currentFile = fromFile + fileStep;
  let currentRank = fromRank + rankStep;

  while (currentFile !== toFile || currentRank !== toRank) {
    const currentSquare = String.fromCharCode(currentFile) + currentRank;
    if (boardState[currentSquare]) {
      return false; // Found a blocking piece
    }
    currentFile += fileStep;
    currentRank += rankStep;
  }

  return true;
};

const isKnightMoveValid = (fromSquare, toSquare) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);

  const fileDiff = Math.abs(fromFile - toFile);
  const rankDiff = Math.abs(fromRank - toRank);

  // Knight moves in L-shape: 2 squares one way and 1 square the other way
  return (
    (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2)
  );
};

const isBishopMoveValid = (boardState, fromSquare, toSquare) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);

  // Calculate file and rank differences
  const fileDiff = Math.abs(fromFile - toFile);
  const rankDiff = Math.abs(fromRank - toRank);

  // Bishop moves diagonally, so file and rank differences must be equal
  if (fileDiff !== rankDiff) {
    return false; // Not a diagonal move
  }

  // Check for blocking pieces along the diagonal path
  const fileStep = Math.sign(toFile - fromFile);
  const rankStep = Math.sign(toRank - fromRank);
  let currentFile = fromFile + fileStep;
  let currentRank = fromRank + rankStep;

  while (currentFile !== toFile || currentRank !== toRank) {
    const currentSquare = String.fromCharCode(currentFile) + currentRank;
    if (boardState[currentSquare]) {
      return false; // Found a blocking piece
    }
    currentFile += fileStep;
    currentRank += rankStep;
  }

  return true;
};

const isQueenMoveValid = (boardState, fromSquare, toSquare) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);

  // Calculate file and rank differences
  const fileDiff = Math.abs(fromFile - toFile);
  const rankDiff = Math.abs(fromRank - toRank);

  // Check if the move is along a column, row, or diagonal
  const isDiagonalMove = fileDiff === rankDiff;
  const isStraightMove = fromFile === toFile || fromRank === toRank;

  if (!isDiagonalMove && !isStraightMove) {
    return false; // The queen doesn't move like this
  }

  // Check for any pieces in the path (straight or diagonal)
  const fileStep = Math.sign(toFile - fromFile);
  const rankStep = Math.sign(toRank - fromRank);
  let currentFile = fromFile + fileStep;
  let currentRank = fromRank + rankStep;

  while (currentFile !== toFile || currentRank !== toRank) {
    const currentSquare = String.fromCharCode(currentFile) + currentRank;
    if (boardState[currentSquare]) {
      return false; // Found a blocking piece
    }
    currentFile += fileStep;
    currentRank += rankStep;
  }

  return true;
};

const isKingMoveValid = (fromSquare, toSquare) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);

  // Calculate file and rank differences
  const fileDiff = Math.abs(fromFile - toFile);
  const rankDiff = Math.abs(fromRank - toRank);

  // King can move one square in any direction
  // fileDiff and rankDiff should be 0 (no move), 1 (one square move), or both 1 (diagonal move)
  return (
    (fileDiff === 1 || fileDiff === 0) &&
    (rankDiff === 1 || rankDiff === 0) &&
    (fileDiff !== 0 || rankDiff !== 0)
  );
};

const isPawnMoveValid = (boardState, fromSquare, toSquare, color) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);
  const targetPiece = boardState[toSquare];
  // pawn direction
  const direction = color === "white" ? 1 : -1;

  // starting pawn ranks
  const startRank = color === "white" ? 2 : 7;

  // Move forward
  if (fromFile === toFile && toRank === fromRank + direction) {
    return !targetPiece;
  }

  // First move, two squares forward
  if (
    fromFile === toFile &&
    fromRank === startRank &&
    toRank === fromRank + 2 * direction
  ) {
    // validation unoccupied squares
    const intermediateSquare =
      String.fromCharCode(fromFile) + (fromRank + direction);
    return !targetPiece && !boardState[intermediateSquare];
  }

  // capture diagonally
  if (Math.abs(fromFile - toFile) === 1 && toRank === fromRank + direction) {
    return targetPiece && targetPiece.color !== color;
  }

  return false;
};
