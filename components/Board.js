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

  ranks.split("").forEach((row) => {
    files.split("").forEach((col) => {
      let pieceComponent = null;
      const color = row > "6" ? "black" : "white";
      const square = `${col}${row}`;

      if (row === "8" || row === "1") {
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
        pieceComponent = React.createElement(
          pieceComponents[order[files.indexOf(col)]],
          { color }
        );
      } else if (row === "7" || row === "2") {
        pieceComponent = <Pawn color={color} />;
      }

      board[square] = pieceComponent || <EmptySquare />;
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
    if (!gameStarted) setGameStarted(true);

    const piece = boardState[square];
    if (selectedSquare && selectedSquare !== square) {
      movePiece(square);
      return;
    }

    if (piece && piece.props.color === turn) {
      setSelectedSquare(square);
    }
  };

  const movePiece = (toSquare) => {
    if (selectedSquare && selectedSquare !== toSquare) {
      const newBoardState = { ...boardState };
      newBoardState[toSquare] = newBoardState[selectedSquare];
      newBoardState[selectedSquare] = <EmptySquare />;
      setBoardState(newBoardState);
      setSelectedSquare(null);
      setTurn(turn === "white" ? "black" : "white");
    }
  };

  useEffect(() => {
    if (!gameStarted) {
      setWhiteTime(initialTime);
      setBlackTime(initialTime);
    }
  }, [gameStarted]);

  const renderBoard = () => {
    const ranks = "87654321";
    const files = "abcdefgh";
    const squares = [];

    ranks.split("").forEach((row) => {
      files.split("").forEach((col) => {
        const square = `${col}${row}`;
        console.log("Name of the Square : " + square);
        squares.push(
          <Square
            key={square}
            position={square}
            onClick={() => selectSquare(square)}
          >
            {boardState[square]}
          </Square>
        );
      });
    });

    return (
      <div className="grid grid-cols-8 gap-0 w-full max-w-md">{squares}</div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
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
