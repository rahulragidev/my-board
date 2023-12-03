import React, { useEffect, useState } from "react";
import Square from "./Square";
import Rook from "./Rook";
import Knight from "./Knight";
import Bishop from "./Bishop";
import Queen from "./Queen";
import King from "./King";
import Pawn from "./Pawn";
import EmptySquare from "./EmptySquare";
import ChessClock from "./ChessClock";

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

  const initialTime = 900; // 15 minutes in seconds
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);
  const [turn, setTurn] = useState("white"); // Start with white's turn
  const [gameStarted, setGameStarted] = useState(false);

  const [boardState, setBoardState] = useState(initialBoardState);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(null);

  const selectPiece = (index) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    const piece = boardState[index];
    // If a piece is already selected and the clicked square is different, try to move
    if (selectedPieceIndex !== null && selectedPieceIndex !== index) {
      movePiece(index); // Attempt to move the selected piece
      return;
    }

    // Check if the piece at the index belongs to the player whose turn it is
    if (piece && piece.props.color === turn) {
      setSelectedPieceIndex(index);
    }
  };

  const movePiece = (toIndex) => {
    // Ensure that a piece is selected and it's a different square to move to
    if (selectedPieceIndex !== null && selectedPieceIndex !== toIndex) {
      // Perform the move
      const newBoardState = [...boardState];
      newBoardState[toIndex] = newBoardState[selectedPieceIndex];
      newBoardState[selectedPieceIndex] = <EmptySquare />;
      setBoardState(newBoardState);

      // Reset the selected piece and switch turns
      setSelectedPieceIndex(null);
      setTurn(turn === "white" ? "black" : "white");
    }
  };

  useEffect(() => {
    if (!gameStarted) {
      setWhiteTime(initialTime);
      setBlackTime(initialTime);
    }
  }, [gameStarted]);

  return (
    <div className="flex flex-col items-center justify-center">
      <ChessClock
        isActive={turn === "black" && gameStarted}
        time={blackTime}
        setTime={setBlackTime}
      />
      <div className="grid grid-cols-8 gap-0 w-full max-w-md">
        {boardState.map((piece, index) => (
          <Square
            key={index}
            position={index}
            onClick={() => selectPiece(index)}
          >
            {piece}
          </Square>
        ))}
      </div>
      <ChessClock
        isActive={turn === "white" && gameStarted}
        time={whiteTime}
        setTime={setWhiteTime}
      />
    </div>
  );
};

export default Board;
