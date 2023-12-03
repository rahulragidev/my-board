import React from "react";

const Rook = ({ color, position, boardState, updateBoardState }) => {
  // Function to check if the move is valid
  const isMoveValid = (newPosition) => {
    // Check if the new position is in the same row or column
    const [currentRow, currentCol] = position;
    const [newRow, newCol] = newPosition;
    if (currentRow !== newRow && currentCol !== newCol) {
      return false; // Not a valid rook move
    }

    // Check for obstructions
    const rowMovement = currentRow === newRow;
    const range = rowMovement ? [currentCol, newCol] : [currentRow, newRow];
    const [start, end] = range.sort((a, b) => a - b);

    for (let i = start + 1; i < end; i++) {
      const checkPosition = rowMovement ? [newRow, i] : [i, newCol];
      if (boardState[checkPosition[0]][checkPosition[1]]) {
        return false; // Obstruction in path
      }
    }

    // Check if the target position has a piece of the same color
    if (
      boardState[newRow][newCol] &&
      boardState[newRow][newCol].color === color
    ) {
      return false; // Cannot capture own piece
    }

    return true; // The move is valid
  };

  // Function to handle moving the rook
  const moveRook = (newPosition) => {
    if (isMoveValid(newPosition)) {
      updateBoardState(position, newPosition); // Update the board state
    }
  };

  return (
    <img
      src={`/images/rook-${color}.svg`}
      alt={`${color} rook`}
      onClick={
        () =>
          moveRook(/* newPosition */) /* Define how new position is determined */
      }
    />
  );
};

export default Rook;
