import React, { useState } from "react";
import Square from "./Square";
import Piece from "./Piece";
const Board = () => {
  const initialBoardState = [
    "rook-black",
    "knight-black",
    "bishop-black",
    "queen-black",
    "king-black",
    "bishop-black",
    "knight-black",
    "rook-black",
    "pawn-black",
    "pawn-black",
    "pawn-black",
    "pawn-black",
    "pawn-black",
    "pawn-black",
    "pawn-black",
    "pawn-black",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "pawn-white",
    "pawn-white",
    "pawn-white",
    "pawn-white",
    "pawn-white",
    "pawn-white",
    "pawn-white",
    "pawn-white",
    "rook-white",
    "knight-white",
    "bishop-white",
    "queen-white",
    "king-white",
    "bishop-white",
    "knight-white",
    "rook-white",
  ];

  const [boardState, setBoardState] = useState(initialBoardState);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(null);

  const selectPiece = (index) => {
    setSelectedPieceIndex(boardState[index] ? index : null);
  };

  const movePiece = (toIndex) => {
    if (selectedPieceIndex === null || selectedPieceIndex === toIndex) return;

    const newBoardState = [...boardState];
    newBoardState[toIndex] = newBoardState[selectedPieceIndex];
    newBoardState[selectedPieceIndex] = "";
    setBoardState(newBoardState);
    setSelectedPieceIndex(null);
  };

  return (
    <div className="grid grid-cols-8 gap-0 w-full max-w-md mx-auto">
      {boardState.map((piece, index) => (
        <Square
          key={index}
          position={index}
          onClick={() =>
            selectedPieceIndex !== null ? movePiece(index) : selectPiece(index)
          }
        >
          <Piece piece={piece} />
        </Square>
      ))}
    </div>
  );
};

export default Board;
