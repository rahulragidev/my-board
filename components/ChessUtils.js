export const isMoveValid = (boardState, fromSquare, toSquare) => {
  const movingPiece = boardState[fromSquare];
  const targetPiece = boardState[toSquare];

  if (!movingPiece || fromSquare === toSquare) {
    return false;
  }

  if (targetPiece && movingPiece.props.color === targetPiece.props.color) {
    return false;
  }

  if (!isWithinBoardBounds(toSquare)) {
    return false;
  }

  return true;
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
