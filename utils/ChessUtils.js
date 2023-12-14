export const isMoveValid = (
  boardState,
  fromSquare,
  toSquare,
  checkCheck = true
) => {
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

  const tempBoardState = {
    ...boardState,
    [toSquare]: movingPiece,
    [fromSquare]: null,
  };

  // Check if this move puts your own king in check
  if (checkCheck && isKingInCheck(tempBoardState, movingPiece.color)) {
    return false;
  }

  // Individual piece move validation
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
        // Place major pieces on the first and last ranks
        const color = rank === "8" ? "black" : "white";
        piece = { type: pieceOrder[index], color };
      } else if (rank === "7" || rank === "2") {
        // Place pawns on the second and second-to-last ranks
        const color = rank === "7" ? "black" : "white";
        piece = { type: "Pawn", color };
      }

      board[square] = piece;
    });
  });

  return board;
};

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
            [toSquare]: piece,
            [fromSquare]: null,
          };
          if (!isKingInCheck(tempBoardState, kingColor)) {
            return false; // There's a move that can take the king out of check
          }
        }
      }
    }
  }

  return true; // No moves can take the king out of check
};

// In your ChessUtils.js or a similar utility file

export const findKingPosition = (boardState, kingColor) => {
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

const isKingMoveValid = (boardState, fromSquare, toSquare, checkCheck) => {
  // Ensure both squares are defined and valid
  if (
    !fromSquare ||
    !toSquare ||
    fromSquare.length !== 2 ||
    toSquare.length !== 2
  ) {
    return true;
  }

  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);

  // Standard king move validation
  const fileDiff = Math.abs(fromFile - toFile);
  const rankDiff = Math.abs(fromRank - toRank);
  if (fileDiff <= 1 && rankDiff <= 1) {
    return true;
  }

  // Castling move validation
  if (checkCheck && canCastle(boardState, fromSquare, toSquare)) {
    return true;
  }

  return false;
};

const canCastle = (boardState, fromSquare, toSquare) => {
  const movingPiece = boardState[fromSquare];
  if (movingPiece.hasMoved) {
    return false;
  }

  // Check if it's a valid castling move
  const rank = fromSquare[1];
  if (toSquare === `g${rank}` || toSquare === `c${rank}`) {
    let fileRange = toSquare === `g${rank}` ? ["f", "g"] : ["b", "c", "d"];
    for (let file of fileRange) {
      if (boardState[`${file}${rank}`]) {
        return false; // There are pieces in the way
      }
      // Check if the king passes through or lands on a square under attack
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
