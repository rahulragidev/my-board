import React, { useState, useEffect } from "react";
import Square from "./Square";
import Rook from "./Rook";
import Knight from "./Knight";
import Bishop from "./Bishop";
import Queen from "./Queen";
import King from "./King";
import Pawn from "./Pawn";
import EmptySquare from "./EmptySquare";
import ChessClock from "./ChessClock";
import { isMoveValid } from "./ChessUtils";

const pieceComponents = {
  Rook,
  Knight,
  Bishop,
  Queen,
  King,
  Pawn,
};

const createInitialBoard = () => {
  const ranks = "87654321";
  const files = "abcdefgh";
  const board = {};

  ranks.split("").forEach((rank) => {
    files.split("").forEach((file) => {
      let piece = null;
      const color = rank > "6" ? "black" : "white";
      const square = `${file}${rank}`;

      if (rank === "8" || rank === "1") {
        const order = [
          "Rook",
          "Knight",
          "Bishop",
          "Queen",
          "King",
          "Bishop",
          "Knight",
          "Rook",
        ];
        piece = { type: order[files.indexOf(file)], color };
      } else if (rank === "7" || rank === "2") {
        piece = { type: "Pawn", color };
      }

      board[square] = piece;
    });
  });

  return board;
};
const Board = () => {
  const [boardState, setBoardState] = useState(createInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [turn, setTurn] = useState("white");
  const [gameStarted, setGameStarted] = useState(false);
  const initialTime = 900;
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);

  const selectSquare = (square) => {
    if (!gameStarted) {
      setGameStarted(true);
      // Reset times only if the game is not started
      setWhiteTime(initialTime);
      setBlackTime(initialTime);
    }

    const piece = boardState[square];
    if (selectedSquare && selectedSquare !== square) {
      movePiece(square);
      return;
    }

    if (piece && piece.color === turn) {
      setSelectedSquare(square);
    }
  };

  const movePiece = (toSquare) => {
    if (selectedSquare && isMoveValid(boardState, selectedSquare, toSquare)) {
      const newBoardState = { ...boardState };
      newBoardState[toSquare] = newBoardState[selectedSquare];
      newBoardState[selectedSquare] = null;
      setBoardState(newBoardState);
      setSelectedSquare(null);
      setTurn(turn === "white" ? "black" : "white");
    }
  };

  const renderPiece = (piece, position) => {
    if (!piece) return <EmptySquare />;
    const PieceComponent = pieceComponents[piece.type];
    return (
      <PieceComponent
        color={piece.color}
        position={position}
        onSelect={selectSquare}
      />
    );
  };

  const renderBoard = () => {
    const ranks = "87654321";
    const files = "abcdefgh";
    const squares = [];

    ranks.split("").forEach((rank) => {
      files.split("").forEach((file) => {
        const square = `${file}${rank}`;
        squares.push(
          <Square
            key={square}
            position={square}
            onClick={() => selectSquare(square)}
          >
            {renderPiece(boardState[square], square)}
          </Square>
        );
      });
    });

    return (
      <div className="grid grid-cols-8 gap-0 w-full max-w-md">{squares}</div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <ChessClock
        isActive={turn === "black" && gameStarted}
        time={blackTime}
        setTime={setBlackTime}
      />
      {renderBoard()}
      <ChessClock
        isActive={turn === "white" && gameStarted}
        time={whiteTime}
        setTime={setWhiteTime}
      />
    </div>
  );
};

export default Board;
