export const isMoveValid = (boardState, fromSquare, toSquare) => {
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

const isWithinBoardBounds = (square) => {
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
  // Rook moves in a straight line along a row or column
  // Add logic to check if path is clear
  // ...

  return true; // Placeholder return
};

const isKnightMoveValid = (fromSquare, toSquare) => {
  // Knight moves in an L-shape
  // Add logic to check if the move is in L-shape
  // ...

  return true; // Placeholder return
};

const isBishopMoveValid = (boardState, fromSquare, toSquare) => {
  // Bishop moves diagonally
  // Add logic to check if path is clear
  // ...

  return true; // Placeholder return
};

const isQueenMoveValid = (boardState, fromSquare, toSquare) => {
  // Queen moves like both a Rook and a Bishop
  // Add logic to check if path is clear
  // ...

  return true; // Placeholder return
};

const isKingMoveValid = (fromSquare, toSquare) => {
  // King moves one square in any direction
  // Add logic to check if the move is only one square
  // ...

  return true; // Placeholder return
};

const isPawnMoveValid = (boardState, fromSquare, toSquare, color) => {
  const fromFile = fromSquare.charCodeAt(0);
  const fromRank = parseInt(fromSquare[1], 10);
  const toFile = toSquare.charCodeAt(0);
  const toRank = parseInt(toSquare[1], 10);
  const targetPiece = boardState[toSquare];

  // Determine direction based on color
  const direction = color === "white" ? 1 : -1;

  // Pawn's starting rank (2 for white, 7 for black)
  const startRank = color === "white" ? 2 : 7;

  // Forward move by one square
  if (fromFile === toFile && toRank === fromRank + direction) {
    return !targetPiece;
  }

  // First move: forward by two squares
  if (
    fromFile === toFile &&
    fromRank === startRank &&
    toRank === fromRank + 2 * direction
  ) {
    // Check if both squares in the path are unoccupied
    const intermediateSquare =
      String.fromCharCode(fromFile) + (fromRank + direction);
    return !targetPiece && !boardState[intermediateSquare];
  }

  // Diagonal capture
  if (Math.abs(fromFile - toFile) === 1 && toRank === fromRank + direction) {
    return targetPiece && targetPiece.color !== color;
  }

  // If none of the above, the move is invalid
  return false;
};
