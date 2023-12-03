import React, { useState } from "react";
import Square from "./Square";
import Rook from "./Rook";
import Knight from "./Knight";
import Bishop from "./Bishop";
import Queen from "./Queen";
import King from "./King";
import Pawn from "./Pawn";
import EmptySquare from "./EmptySquare";

const Board = () => {
  const initialBoardState = [
    <Rook color="black" />,
    <Knight color="black" />,
    <Bishop color="black" />,
    <Queen color="black" />,
    <King color="black" />,
    <Bishop color="black" />,
    <Knight color="black" />,
    <Rook color="black" />,
    <Pawn color="black" />,
    <Pawn color="black" />,
    <Pawn color="black" />,
    <Pawn color="black" />,
    <Pawn color="black" />,
    <Pawn color="black" />,
    <Pawn color="black" />,
    <Pawn color="black" />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <EmptySquare />,
    <Pawn color="white" />,
    <Pawn color="white" />,
    <Pawn color="white" />,
    <Pawn color="white" />,
    <Pawn color="white" />,
    <Pawn color="white" />,
    <Pawn color="white" />,
    <Pawn color="white" />,
    <Rook color="white" />,
    <Knight color="white" />,
    <Bishop color="white" />,
    <Queen color="white" />,
    <King color="white" />,
    <Bishop color="white" />,
    <Knight color="white" />,
    <Rook color="white" />,
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
    newBoardState[selectedPieceIndex] = <EmptySquare />;
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
          {piece}
        </Square>
      ))}
    </div>
  );
};

export default Board;
